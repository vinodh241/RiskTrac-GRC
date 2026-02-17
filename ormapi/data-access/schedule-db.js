const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class ScheduleDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch Schedule period details from database
     * @param { CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getSchedulePeriod(binds) {
        
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : getSchedulePeriod : Execution started.');
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

            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSchedulePeriod : Input parameters value of ORM.GetScheduleAssessmentPeriod procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSchedulePeriod : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSchedulePeriod : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSchedulePeriod :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetScheduleAssessmentPeriod').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSchedulePeriod : Output parameters value of ORM.GetScheduleAssessmentPeriod procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSchedulePeriod : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSchedulePeriod : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSchedulePeriod : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSchedulePeriod : Input parameters value of ORM.GetScheduleAssessmentPeriod procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSchedulePeriod : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSchedulePeriod : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getSchedulePeriod : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSchedulePeriod : Input parameters value of ORM.GetScheduleAssessmentPeriod procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSchedulePeriod : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSchedulePeriod : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getSchedulePeriod : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch schedule assessment screen details from database
     * @param { ScheduleYear, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async getDataForScheduleAssessmentScreen(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : getDataForScheduleAssessmentScreen : Execution started.');
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

            request.input('ScheduleYear',    MSSQL.Int, binds.scheduleYear);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy );
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForScheduleAssessmentScreen : Input parameters value of ORM.getDataForScheduleAssessmentScreen procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForScheduleAssessmentScreen : ScheduleYear    = ' + binds.scheduleYear);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForScheduleAssessmentScreen : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForScheduleAssessmentScreen : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForScheduleAssessmentScreen :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].getDataForScheduleAssessmentScreen').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForScheduleAssessmentScreen : Output parameters value of ORM.getDataForScheduleAssessmentScreen procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForScheduleAssessmentScreen : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForScheduleAssessmentScreen : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForScheduleAssessmentScreen : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForScheduleAssessmentScreen : Input parameters value of ORM.getDataForScheduleAssessmentScreen procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForScheduleAssessmentScreen : ScheduleYear    = ' + binds.scheduleYear);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForScheduleAssessmentScreen : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForScheduleAssessmentScreen : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForScheduleAssessmentScreen : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForScheduleAssessmentScreen : Input parameters value of ORM.getDataForScheduleAssessmentScreen procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForScheduleAssessmentScreen : ScheduleYear    = ' + binds.scheduleYear);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForScheduleAssessmentScreen : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForScheduleAssessmentScreen : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForScheduleAssessmentScreen : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch mangage schedule assessment screen details from database
     * @param { ScheduleYear, ScheduleAssessmentID, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async getDataForManageScheduleAssessmentScreen(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : getDataForManageScheduleAssessmentScreen : Execution started.');
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

            request.input('ScheduleYear',    MSSQL.Int, binds.scheduleYear);
            request.input('ScheduleAssessmentID',    MSSQL.Int, binds.scheduleAssessmentID);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : Input parameters value of ORM.getDataForManageScheduleAssessmentScreen procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : ScheduleYear    = ' + binds.scheduleYear);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : ScheduleAssessmentID    = ' + binds.scheduleAssessmentID);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].getDataForManageScheduleAssessmentScreen').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : Output parameters value of ORM.getDataForManageScheduleAssessmentScreen procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : Input parameters value of ORM.getDataForManageScheduleAssessmentScreen procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : ScheduleYear    = ' + binds.scheduleYear);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : ScheduleAssessmentID    = ' + binds.scheduleAssessmentID);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : Input parameters value of ORM.getDataForManageScheduleAssessmentScreen procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : ScheduleYear    = ' + binds.scheduleYear);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : ScheduleAssessmentID    = ' + binds.scheduleAssessmentID);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getDataForManageScheduleAssessmentScreen : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch all active reviewer details from database
     * @param {ReviewerID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async getAllActiveReviewer(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : getAllActiveReviewer : Execution started.');
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
            request.input('ReviewerID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : Input parameters value of ORM.GetReviewer procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : ReviewerID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetReviewer').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : Output parameters value of ORM.GetReviewer procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : Input parameters value of ORM.GetReviewer procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : ReviewerID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : Input parameters value of ORM.GetReviewer procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : ReviewerID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveReviewer : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch reviewer details by ID from database
     * @param {ReviewerID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async getReviewerByID(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : getReviewerByID : Execution started.');
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
            request.input('ReviewerID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : Input parameters value of ORM.GetReviewer procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : ReviewerID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetReviewer').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : Output parameters value of ORM.GetReviewer procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : Input parameters value of ORM.GetReviewer procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : ReviewerID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : Input parameters value of ORM.GetReviewer procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : ReviewerID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getReviewerByID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will add schedule assessment to database
     * @param {SchedulePeriod, ScheduleAssessmentDescription, ProposedStartDate, ProposedCompletionDate, PrimaryReviewerID, SecondaryReviewerID, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async addScheduleAssessment(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : addScheduleAssessment : Execution started.');
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
            request.input('SchedulePeriod',                     MSSQL.NVarChar, binds.schedulePeriod);
            request.input('ScheduleAssessmentDescription',      MSSQL.NVarChar, binds.scheduleAssessmentDescription);
            request.input('ProposedStartDate',                  MSSQL.Date,     binds.proposedStartDate);
            request.input('ProposedCompletionDate',             MSSQL.Date,     binds.proposedCompletionDate);
            request.input('PrimaryReviewerID',                  MSSQL.Int,      binds.primaryReviewerID);
            request.input('SecondaryReviewerID',                MSSQL.Int,      binds.secondaryReviewerID);
            request.input('IsInternalReviewRequired',           MSSQL.BIT,      binds.isInternalReviewRequired);
            // Fields for ALL vs Individual mode (multi-unit support)
            request.input('SelectionMode',                      MSSQL.NVarChar, binds.selectionMode || 'ALL');
            request.input('UnitIDsJSON',                        MSSQL.NVarChar(MSSQL.MAX), binds.unitIDsJSON || null);
            request.input('CreatedBy',                          MSSQL.NVarChar, binds.createdBy);
            request.input('ReminderDate',                       MSSQL.Date, binds.reminderDate); // '2023-10-26T00:00:00.000Z'
            request.input('AccountGUID',                        MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',                           MSSQL.Bit);
            request.output('OutMessage',                        MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : Input parameters value of ORM.AddScheduleAssessment procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : SchedulePeriod    = ' + binds.schedulePeriod);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : ScheduleAssessmentDescription    = ' + binds.scheduleAssessmentDescription);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : ProposedStartDate    = ' + binds.proposedStartDate);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : ProposedCompletionDate    = ' + binds.proposedCompletionDate);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : PrimaryReviewerID    = ' + binds.primaryReviewerID);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : SecondaryReviewerID    = ' + binds.secondaryReviewerID);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : IsInternalReviewRequired    = ' + binds.isInternalReviewRequired);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : reminderDate    = ' + binds.reminderDate);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].AddScheduleAssessment').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : Output parameters value of ORM.AddScheduleAssessment procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;
                
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : Execution end.  dbResponseObj : '+ JSON.stringify(dbResponseObj || null));

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : Input parameters value of ORM.AddScheduleAssessment procedure.');
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : SchedulePeriod    = ' + binds.schedulePeriod);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : ScheduleAssessmentDescription    = ' + binds.scheduleAssessmentDescription);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : ProposedStartDate    = ' + binds.proposedStartDate);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : ProposedCompletionDate    = ' + binds.proposedCompletionDate);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : PrimaryReviewerID    = ' + binds.primaryReviewerID);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : SecondaryReviewerID    = ' + binds.secondaryReviewerID);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : IsInternalReviewRequired    = ' + binds.isInternalReviewRequired);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : reminderDate    = ' + binds.reminderDate);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : Input parameters value of ORM.AddScheduleAssessment procedure.');
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : SchedulePeriod    = ' + binds.schedulePeriod);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : ScheduleAssessmentDescription    = ' + binds.scheduleAssessmentDescription);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : ProposedStartDate    = ' + binds.proposedStartDate);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : ProposedCompletionDate    = ' + binds.proposedCompletionDate);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : PrimaryReviewerID    = ' + binds.primaryReviewerID);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : SecondaryReviewerID    = ' + binds.secondaryReviewerID);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : IsInternalReviewRequired    = ' + binds.isInternalReviewRequired);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addScheduleAssessment : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will update schedule assessment to database
     * @param {ScheduleAssessmentID, SchedulePeriod, ScheduleAssessmentDescription, ProposedStartDate, ProposedCompletionDate, PrimaryReviewerID, SecondaryReviewerID, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async updateScheduleAssessment(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : updateScheduleAssessment : Execution started.');
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
            request.input('ScheduleAssessmentID',    MSSQL.Int, binds.id);
            request.input('SchedulePeriod',    MSSQL.NVarChar, binds.schedulePeriod);
            request.input('ScheduleAssessmentDescription',    MSSQL.NVarChar, binds.scheduleAssessmentDescription);
            request.input('ProposedStartDate',    MSSQL.Date, binds.proposedStartDate);
            request.input('ProposedCompletionDate',    MSSQL.Date, binds.proposedCompletionDate);
            request.input('PrimaryReviewerID',    MSSQL.Int, binds.primaryReviewerID);
            request.input('SecondaryReviewerID',    MSSQL.Int, binds.secondaryReviewerID);
            request.input('IsInternalReviewRequired',    MSSQL.BIT, binds.isInternalReviewRequired);
            request.input('SelectionMode',    MSSQL.NVarChar, binds.selectionMode || null);
            request.input('UnitIDsJSON',    MSSQL.NVarChar(MSSQL.MAX), binds.unitIDsJSON || null);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('ReminderDate',    MSSQL.Date, binds.reminderDate);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : Input parameters value of ORM.UpdateScheduleAssessment procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : SchedulePeriod    = ' + binds.schedulePeriod);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : ScheduleAssessmentDescription    = ' + binds.scheduleAssessmentDescription);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : ProposedStartDate    = ' + binds.proposedStartDate);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : ProposedCompletionDate    = ' + binds.proposedCompletionDate);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : PrimaryReviewerID    = ' + binds.primaryReviewerID);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : SecondaryReviewerID    = ' + binds.secondaryReviewerID);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : isInternalReviewRequired    = ' + binds.isInternalReviewRequired);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : reminderDate    = ' + binds.reminderDate);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : AccountGUID    = ' + binds.accountGUIDFromToken);
            
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateScheduleAssessment').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : Output parameters value of ORM.UpdateScheduleAssessment procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : Input parameters value of ORM.UpdateScheduleAssessment procedure.');
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : ScheduleAssessmentID    = ' + binds.id);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : SchedulePeriod    = ' + binds.schedulePeriod);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : ScheduleAssessmentDescription    = ' + binds.scheduleAssessmentDescription);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : ProposedStartDate    = ' + binds.proposedStartDate);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : ProposedCompletionDate    = ' + binds.proposedCompletionDate);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : PrimaryReviewerID    = ' + binds.primaryReviewerID);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : SecondaryReviewerID    = ' + binds.secondaryReviewerID);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : isInternalReviewRequired    = ' + binds.isInternalReviewRequired);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : reminderDate    = ' + binds.reminderDate);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : Input parameters value of ORM.UpdateScheduleAssessment procedure.');
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : ScheduleAssessmentID    = ' + binds.id);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : SchedulePeriod    = ' + binds.schedulePeriod);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : ScheduleAssessmentDescription    = ' + binds.scheduleAssessmentDescription);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : ProposedStartDate    = ' + binds.proposedStartDate);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : ProposedCompletionDate    = ' + binds.proposedCompletionDate);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : PrimaryReviewerID    = ' + binds.primaryReviewerID);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : SecondaryReviewerID    = ' + binds.secondaryReviewerID);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : isInternalReviewRequired    = ' + binds.isInternalReviewRequired);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessment : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will update schedule assessment status to database
     * @param {ScheduleAssessmentID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async updateScheduleAssessmentStatus(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : updateScheduleAssessmentStatus : Execution started.');
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

            var isActive=binds.isActive==true?1:0;

            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);
            request.input('ScheduleAssessmentID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, isActive);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : Input parameters value of ORM.UpdateScheduleAssessmentStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateScheduleAssessmentStatus').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : Output parameters value of ORM.UpdateScheduleAssessmentStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : Input parameters value of ORM.UpdateScheduleAssessmentStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : ScheduleAssessmentID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : IsActive    = ' + isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : AccountGUID    = ' + binds.accountGUIDFromToken);

                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : Input parameters value of ORM.UpdateScheduleAssessmentStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : updateScheduleAssessmentStatus : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch all active schedule from database
     * @param {ScheduleYear, ScheduleAssessmentID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async getAllActiveSchedule(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : getAllActiveSchedule : Execution started.');
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
            request.input('ScheduleYear',    MSSQL.Int, binds.scheduleYear);
            request.input('ScheduleAssessmentID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : Input parameters value of ORM.GetScheduleAssessment procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : ScheduleYear    = ' + binds.scheduleYear);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetScheduleAssessment').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : Output parameters value of ORM.GetScheduleAssessment procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : Input parameters value of ORM.GetScheduleAssessment procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : ScheduleYear    = ' + binds.scheduleYear);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : ScheduleAssessmentID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : Input parameters value of ORM.GetScheduleAssessment procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : ScheduleYear    = ' + binds.scheduleYear);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveSchedule : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch all schedule from database
     * @param {ScheduleYear, ScheduleAssessmentID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async getAllSchedule(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : getAllSchedule : Execution started.');
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
            request.input('ScheduleYear',            MSSQL.Int,      binds.scheduleYear);
            request.input('ScheduleAssessmentID',    MSSQL.Int,      binds.id);
            request.input('IsActive',                MSSQL.Bit,      binds.isActive);
            request.input('CreatedBy',               MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',             MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',                MSSQL.Bit);
            request.output('OutMessage',             MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : Input parameters value of ORM.GetScheduleAssessment procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : ScheduleYear    = ' + binds.scheduleYear);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : IsActive    = '+binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetScheduleAssessment').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : Output parameters value of ORM.GetScheduleAssessment procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : Input parameters value of ORM.GetScheduleAssessment procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : ScheduleYear    = ' + binds.scheduleYear);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : ScheduleAssessmentID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : IsActive    = '+binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : AccountGUID    = ' + binds.accountGUIDFromToken);

                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : Input parameters value of ORM.GetScheduleAssessment procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : ScheduleYear    = ' + binds.scheduleYear);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : IsActive    = '+binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllSchedule : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch all schedule from database
     * @param {ScheduleYear, ScheduleAssessmentID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async getScheduleByID(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : getScheduleByID : Execution started.');
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
            request.input('ScheduleYear',    MSSQL.Int, binds.scheduleYear);
            request.input('ScheduleAssessmentID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : Input parameters value of ORM.GetScheduleAssessment procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : ScheduleYear    = ' + binds.scheduleYear);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : IsActive    = '+binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetScheduleAssessment').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : Output parameters value of ORM.GetScheduleAssessment procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : Input parameters value of ORM.GetScheduleAssessment procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : ScheduleYear    = ' + binds.scheduleYear);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : ScheduleAssessmentID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : IsActive    = '+binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : AccountGUID    = ' + binds.accountGUIDFromToken);

                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : Input parameters value of ORM.GetScheduleAssessment procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : ScheduleYear    = ' + binds.scheduleYear);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : IsActive    = '+binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleByID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

     /**
     * This function will fetch schedule assessment years from database
     * @param { CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getScheduleAssessmentYears(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : getScheduleAssessmentYears : Execution started.');
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
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentYears : Input parameters value of ORM.GetScheduleAssessmentYears procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentYears : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentYears : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentYears :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetScheduleAssessmentYears').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentYears : Output parameters value of ORM.GetScheduleAssessmentYears procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentYears : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentYears : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentYears : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentYears : Input parameters value of ORM.GetScheduleAssessmentYears procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentYears : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentYears : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentYears : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentYears : Input parameters value of ORM.GetScheduleAssessmentYears procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentYears : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentYears : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentYears : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch snapshot for inprogress schedule assessment from database
     * @param { CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async getSnapshotForInProgressScheduleAssessment(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : getSnapshotForInProgressScheduleAssessment : Execution started.');
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
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessment : Input parameters value of ORM.GetSnapshotForInprogressScheduleAssessment procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessment : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessment : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessment :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetSnapshotForInprogressScheduleAssessment').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessment : Output parameters value of ORM.GetSnapshotForInprogressScheduleAssessment procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessment : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessment : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessment : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessment : Input parameters value of ORM.GetSnapshotForInprogressScheduleAssessment procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessment : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessment : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessment : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessment : Input parameters value of ORM.GetSnapshotForInprogressScheduleAssessment procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessment : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessment : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessment : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch snapshot for inprogress schedule assessment details from database
     * @param { ScheduleAssessmentID, GroupID, Info, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async getSnapshotForInProgressScheduleAssessmentDetails(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : Execution started.');
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
            request.input('ScheduleAssessmentID',    MSSQL.Int, binds.id);
            request.input('GroupID',    MSSQL.Int, binds.groupID);
            request.input('Info',    MSSQL.Int, binds.info);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : Input parameters value of ORM.GetSnapshotForInProgressScheduleAssessmentDetails procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : GroupID    = ' + binds.groupID);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : Info    = ' + binds.info);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetSnapshotForInProgressScheduleAssessmentDetails').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : Output parameters value of ORM.GetSnapshotForInProgressScheduleAssessmentDetails procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : Input parameters value of ORM.GetSnapshotForInProgressScheduleAssessmentDetails procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : ScheduleAssessmentID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : GroupID    = ' + binds.groupID);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : Info    = ' + binds.info);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : Input parameters value of ORM.GetSnapshotForInProgressScheduleAssessmentDetails procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : GroupID    = ' + binds.groupID);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : Info    = ' + binds.info);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getSnapshotForInProgressScheduleAssessmentDetails : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch in progress schedule assessment for dashboardfrom database server
     * @param { ScheduleAssessmentID, GroupID, Info, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async getInProgressScheduleAssessmentForDashboard(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : Execution started.');
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
            request.input('ScheduleAssessmentID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : Input parameters value of ORM.GetInProgressScheduleAssessmentForDashboard procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetInProgressScheduleAssessmentForDashboard').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : Output parameters value of ORM.GetInProgressScheduleAssessmentForDashboard procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : Input parameters value of ORM.GetInProgressScheduleAssessmentForDashboard procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : ScheduleAssessmentID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : Input parameters value of ORM.GetInProgressScheduleAssessmentForDashboard procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getInProgressScheduleAssessmentForDashboard : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

     /**
     * This function will fetch scheduled action plan snapshot from database
     * @param { ScheduleAssessmentID, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getScheduledActionPlanSnapshot(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : getScheduledActionPlanSnapshot : Execution started.');
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
            request.input('ScheduleAssessmentID',    MSSQL.Int, binds.id);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshot : Input parameters value of ORM.GetSnapshotForCompletedScheduleAssessment procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshot : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshot : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshot : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshot :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetSnapshotForCompletedScheduleAssessment').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshot : Output parameters value of ORM.GetSnapshotForCompletedScheduleAssessment procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshot : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshot : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshot : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshot : Input parameters value of ORM.GetSnapshotForCompletedScheduleAssessment procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshot : ScheduleAssessmentID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshot : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshot : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshot : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshot : Input parameters value of ORM.GetSnapshotForCompletedScheduleAssessment procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshot : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshot : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshot : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshot : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch scheduled action plan snapshot details from database
     * @param { ScheduleAssessmentID, GroupID, Info, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async getScheduledActionPlanSnapshotDetails(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : getScheduledActionPlanSnapshotDetails : Execution started.');
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
            request.input('ScheduleAssessmentID',    MSSQL.Int, binds.id);
            request.input('GroupID',    MSSQL.Int, binds.groupID);
            request.input('Info',    MSSQL.Int, binds.info);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : Input parameters value of ORM.GetSnapshotForCompletedScheduleAssessmentDetails procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : GroupID    = ' + binds.groupID);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : Info    = ' + binds.info);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetSnapshotForCompletedScheduleAssessmentDetails').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : Output parameters value of ORM.GetSnapshotForCompletedScheduleAssessmentDetails procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : Input parameters value of ORM.GetSnapshotForCompletedScheduleAssessmentDetails procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : ScheduleAssessmentID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : GroupID    = ' + binds.groupID);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : Info    = ' + binds.info);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : Input parameters value of ORM.GetSnapshotForCompletedScheduleAssessmentDetails procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : GroupID    = ' + binds.groupID);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : Info    = ' + binds.info);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduledActionPlanSnapshotDetails : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch complete schedule assessment for dashboard from database server
     * @param { ScheduleAssessmentID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async getCompletedScheduleAssessmentForDashboard(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : Execution started.');
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
            request.input('ScheduleAssessmentID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : Input parameters value of ORM.GetCompletedScheduleAssessmentForDashboard procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetCompletedScheduleAssessmentForDashboard').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : Output parameters value of ORM.GetCompletedScheduleAssessmentForDashboard procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : Input parameters value of ORM.GetCompletedScheduleAssessmentForDashboard procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : ScheduleAssessmentID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : Input parameters value of ORM.GetCompletedScheduleAssessmentForDashboard procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getCompletedScheduleAssessmentForDashboard : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch Computed Avg Ratings For complete schedule assessment for dashboard from database server
     * @param { JSONData, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async getComputedAvgRatingsForCompletedScheduleAssessment(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : getComputedAvgRatingsForCompletedScheduleAssessment : Execution started.');
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
            request.input('JSONData',    MSSQL.NVarChar, binds.jsonData);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getComputedAvgRatingsForCompletedScheduleAssessment : Input parameters value of ORM.GetComputedAvgRatingsForCompletedScheduleAssessment procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getComputedAvgRatingsForCompletedScheduleAssessment : JSONData    = ' + binds.jsonData);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getComputedAvgRatingsForCompletedScheduleAssessment : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getComputedAvgRatingsForCompletedScheduleAssessment : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getComputedAvgRatingsForCompletedScheduleAssessment :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetComputedAvgRatingsForCompletedScheduleAssessment').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getComputedAvgRatingsForCompletedScheduleAssessment : Output parameters value of ORM.GetComputedAvgRatingsForCompletedScheduleAssessment procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getComputedAvgRatingsForCompletedScheduleAssessment : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getComputedAvgRatingsForCompletedScheduleAssessment : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getComputedAvgRatingsForCompletedScheduleAssessment : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getComputedAvgRatingsForCompletedScheduleAssessment : Input parameters value of ORM.GetComputedAvgRatingsForCompletedScheduleAssessment procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getComputedAvgRatingsForCompletedScheduleAssessment : JSONData    = ' + binds.jsonData);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getComputedAvgRatingsForCompletedScheduleAssessment : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getComputedAvgRatingsForCompletedScheduleAssessment : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getComputedAvgRatingsForCompletedScheduleAssessment : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getComputedAvgRatingsForCompletedScheduleAssessment : Input parameters value of ORM.GetComputedAvgRatingsForCompletedScheduleAssessment procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getComputedAvgRatingsForCompletedScheduleAssessment : JSONData    = ' + binds.jsonData);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getComputedAvgRatingsForCompletedScheduleAssessment : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getComputedAvgRatingsForCompletedScheduleAssessment : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getComputedAvgRatingsForCompletedScheduleAssessment : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch all active action plan status from database
     * @param { ActionPlanStatusID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async getAllActiveActionPlanStatus(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : getAllActiveActionPlanStatus : Execution started.');
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
            request.input('ActionPlanStatusID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : Input parameters value of ORM.GetActionPlanStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : ActionPlanStatusID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetActionPlanStatus').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : Output parameters value of ORM.GetActionPlanStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : Input parameters value of ORM.GetActionPlanStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : ActionPlanStatusID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : Input parameters value of ORM.GetActionPlanStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : ActionPlanStatusID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveActionPlanStatus : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch all active control testing result from database
     * @param { ControlTestingResultID, IsActive, CreatedBy, accountGUIDFromToken} binds
     * @returns 
     */
    async getAllActiveControlTestingResult(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : getAllActiveControlTestingResult : Execution started.');
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
            request.input('ControlTestingResultID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : Input parameters value of ORM.GetControlTestingResult procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : ControlTestingResultID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetControlTestingResult').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : Output parameters value of ORM.GetControlTestingResult procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : Input parameters value of ORM.GetControlTestingResult procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : ControlTestingResultID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : Input parameters value of ORM.GetControlTestingResult procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : ControlTestingResultID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlTestingResult : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch all active control verification closure from database
     * @param { ControlVerificationClosureID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async getAllActiveControlVerificationClosure(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : getAllActiveControlVerficationClosure : Execution started.');
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
            request.input('ControlVerificationClosureID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : Input parameters value of ORM.GetControlVerificationClosure procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : ControlVerificationClosureID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : AccountGUID    = ' + binds.accountGUIDFromToken);
            
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetControlVerificationClosure').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : Output parameters value of ORM.GetControlVerificationClosure procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : OutMessage    = ' + result.output.OutMessage);
                
            
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : Input parameters value of ORM.GetControlVerificationClosure procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : ControlVerificationClosureID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : Input parameters value of ORM.GetControlVerificationClosure procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : ControlVerificationClosureID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getAllActiveControlVerficationClosure : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }


    /**
     * This function will get the email data from database server
     * @param { ID, TemplateName, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async getEmailTemplate(binds) {
        
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : getEmailTemplate : Execution started.');
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

            request.input('ID',    MSSQL.Int, binds.id);
            request.input('TemplateName',    MSSQL.NVarChar, binds.templateName);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : Input parameters value of ORM.GetRCSAEmailData procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : ID    = '+binds.id);            
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : TemplateName    = '+binds.templateName);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].[GetRCSAEmailData]').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : Output parameters value of ORM.GetRCSAEmailData procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : Input parameters value of ORM.GetRCSAEmailData procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : ID    = '+binds.id);            
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : TemplateName    = '+binds.templateName);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : AccountGUID    = ' + binds.accountGUIDFromToken);

                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : Input parameters value of ORM.GetRCSAEmailData procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : ID    = '+binds.id);            
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : TemplateName    = '+binds.templateName);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getEmailTemplate : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    

    /**
     * This function will add the email data to database server
     * @param { ToIDS, FromID, CCIDs, EmailSubject, EmailContent, accountGUIDFromToken } binds
     * @returns 
     */
    async addEmailAlerts(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleDb : addEmailAlerts : Execution started.');
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

            request.input('ToIDs',         MSSQL.NVarChar,  removeDuplicateEmails(binds.toIDs));
            request.input('FromID',        MSSQL.NVarChar,  "");
            request.input('CCIDs',         MSSQL.NVarChar,  removeDuplicateEmails(binds.toCCs));
            request.input('EmailSubject',  MSSQL.NVarChar,  binds.emailSubject);
            request.input('EmailContent',  MSSQL.VarChar,   binds.emailContent);
            request.input('RetryCount',    MSSQL.Int,       CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO);
            request.input('RetryStatus',   MSSQL.NVarChar,  CONSTANT_FILE_OBJ.APP_CONSTANT.OPEN);
            request.output('Success',      MSSQL.Bit);
            request.output('OutMessage',   MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : Input parameters value of ORM.AddEmailAlerts procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : ToIDs    = '+ removeDuplicateEmails(binds.toIDs));
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : FromID    = ');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : CCIDs    = ' + removeDuplicateEmails(binds.toCCs));
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : EmailSubject    = '+binds.emailSubject);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : EmailContent    = '+binds.emailContent);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : CreatedBy    = ' + binds.createdBy);


            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].[AddEmailAlerts]').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : Output parameters value of ORM.AddEmailAlerts procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : Input parameters value of ORM.AddEmailAlerts procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : ToIDs    = '+binds.toIDs);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : FromID    = ');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : CCIDs    = '+ binds.toCCs);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : EmailSubject    = '+binds.emailSubject);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : EmailContent    = '+binds.emailContent);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : CreatedBy    = ' + binds.createdBy);
    

                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : Input parameters value of ORM.AddEmailAlerts procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : ToIDs    = '+binds.toIDs);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : FromID    = ');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : CCIDs    = ');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : EmailSubject    = '+binds.emailSubject);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : EmailContent    = '+binds.emailContent);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : CreatedBy    = ' + binds.createdBy);


            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : addEmailAlerts : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch incident master data from database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @returns
     */
    async getRCSAMasterData(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getRCSAMasterData : Execution started.");
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

        request.input("UserName",    MSSQL.NVarChar, userNameFromToken);
        request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
        request.output("Success",    MSSQL.Bit);
        request.output("OutMessage", MSSQL.VarChar);

        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getRCSAMasterData : Input parameters value for ORM.RCSA_GetRCSAMasterData procedure.");
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getRCSAMasterData : UserName       = " + userNameFromToken);
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getRCSAMasterData : AccountGUID       = " + accountGUIDFromToken);

        return request.execute("ORM.RCSA_GetRCSAMasterData").then(function (result) {
            logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getRCSAMasterData : Output parameters value of ORM.RCSA_GetRCSAMasterData procedure.");
            logger.log( "info", "User Id : " + userIdFromToken + " : ScheduleDb : getRCSAMasterData : Success       = " + result.output.Success );
            logger.log( "info", "User Id : " + userIdFromToken + " : ScheduleDb : getRCSAMasterData : OutMessage    = " + result.output.OutMessage );

            dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess  = result.output.Success;
            dbResponseObj.procedureMessage  = result.output.OutMessage;
            dbResponseObj.recordset         = result.recordsets;

            logger.log( "info", "User Id : " + userIdFromToken + " : ScheduleDb : getRCSAMasterData : Execution end." );

            return dbResponseObj;
            })
            .catch(function (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getRCSAMasterData : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getRCSAMasterData : UserName       = " + userNameFromToken );
            logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getRCSAMasterData : AccountGUID       = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getRCSAMasterData : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
            return dbResponseObj;
            });
        } catch (error) {
        logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getRCSAMasterData : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
        logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getRCSAMasterData : UserName       = " + userNameFromToken );
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getRCSAMasterData : AccountGUID       = " + accountGUIDFromToken);
        logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getRCSAMasterData : Execution end. : Error details : " + error );

        dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
        dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

        return dbResponseObj;
        }
    }


     /**
     * This function will fetch incident master data from database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @returns
     */
    async addRCSAMasterData(userIdFromToken, userNameFromToken,data, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : addRCSAMasterData : Execution started.");
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

        request.input("ActionResponsiblePerson",        MSSQL.NVarChar, JSON.stringify(data.actionResponsiblePerson));
        request.input("ActionPlanStatus",               MSSQL.NVarChar, JSON.stringify(data.actionPlanStatus));
        request.input("ResidualRiskResponsiblePerson",  MSSQL.NVarChar, JSON.stringify(data.residualRiskResponsiblePerson));
        request.input("ControlVerificationClosure",     MSSQL.NVarChar, JSON.stringify(data.controlVerificationClosure));
        request.input("ResidualRiskResponse",           MSSQL.NVarChar, JSON.stringify(data.residualRiskResponse));
        request.input("ControlTestingResults",          MSSQL.NVarChar, JSON.stringify(data.controltestingresult)); 
        request.input("Reviewers",                      MSSQL.NVarChar, JSON.stringify(data.reviewers)); 
        request.input("InternalReviewers",              MSSQL.NVarChar, JSON.stringify(data.InternalReviewers));
        request.input("UserName",                       MSSQL.NVarChar, userNameFromToken);
        request.input("AccountGUID",                    MSSQL.UniqueIdentifier, accountGUIDFromToken);
        request.output("Success",                       MSSQL.Bit);
        request.output("OutMessage",                    MSSQL.VarChar);

        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : addRCSAMasterData : Input parameters value for ORM.RCSA_AddRCSAMasterData procedure.");
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : addRCSAMasterData : data       = " + JSON.stringify(data || null));
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : addRCSAMasterData : AccountGUID       = " + accountGUIDFromToken);

        return request.execute("ORM.RCSA_AddRCSAMasterData").then(function (result) {
            logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : addRCSAMasterData : Output parameters value of ORM.RCSA_AddRCSAMasterData procedure.");
            logger.log( "info", "User Id : " + userIdFromToken + " : ScheduleDb : addRCSAMasterData : Success       = " + result.output.Success );
            logger.log( "info", "User Id : " + userIdFromToken + " : ScheduleDb : addRCSAMasterData : OutMessage    = " + result.output.OutMessage );

            dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess  = result.output.Success;
            dbResponseObj.procedureMessage  = result.output.OutMessage;
            dbResponseObj.recordset         = result.recordsets;

            logger.log( "info", "User Id : " + userIdFromToken + " : ScheduleDb : addRCSAMasterData : Execution end. dbResponseObj : " + JSON.stringify(dbResponseObj || null) );

            return dbResponseObj;
            })
            .catch(function (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : addRCSAMasterData : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : addRCSAMasterData : UserName       = " + userNameFromToken );
            logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : addRCSAMasterData : AccountGUID       = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : addRCSAMasterData : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
            return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : addRCSAMasterData : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : addRCSAMasterData : UserName       = " + userNameFromToken );
            logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : addRCSAMasterData : AccountGUID       = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : addRCSAMasterData : Execution end. : Error details : " + error );

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

        return dbResponseObj;
        }
    }

    /**
     * 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getReminderEmailData(userIdFromToken, userNameFromToken,data, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getReminderEmailData : Execution started.");
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
        request.input("ScheduleAssessmentID",    MSSQL.NVarChar, data.ScheduleAssessmentID);
        request.input("CreatedBy",               MSSQL.NVarChar, data.CreatedBy);
        request.input("AccountGUID",            MSSQL.UniqueIdentifier, accountGUIDFromToken);
        request.output("Success",                MSSQL.Bit);
        request.output("OutMessage",             MSSQL.VarChar);

        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getReminderEmailData : Input parameters value for ORM.RCSA_GetReminderEmailData procedure.");
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getReminderEmailData : CreatedBy               = " + data.CreatedBy);
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getReminderEmailData : ScheduleAssessmentID    = " + data.ScheduleAssessmentID);
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getReminderEmailData : AccountGUID               = " + accountGUIDFromToken);

        return request.execute("ORM.RCSA_GetReminderEmailData").then(function (result) {
            logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getReminderEmailData : Output parameters value of ORM.RCSA_getReminderEmailData procedure.");
            logger.log( "info", "User Id : " + userIdFromToken + " : ScheduleDb : getReminderEmailData : Success       = " + result.output.Success );
            logger.log( "info", "User Id : " + userIdFromToken + " : ScheduleDb : getReminderEmailData : OutMessage    = " + result.output.OutMessage );

            dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess  = result.output.Success;
            dbResponseObj.procedureMessage  = result.output.OutMessage;
            dbResponseObj.recordset         = result.recordsets;

            logger.log( "info", "User Id : " + userIdFromToken + " : ScheduleDb : getReminderEmailData : Execution end. dbResponseObj : " + JSON.stringify(dbResponseObj || null) );

            return dbResponseObj;
            })
            .catch(function (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getReminderEmailData : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getReminderEmailData : UserName       = " + userNameFromToken );
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getReminderEmailData : AccountGUID               = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getReminderEmailData : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
            return dbResponseObj;
            });
        } catch (error) {
        logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getReminderEmailData : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
        logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getReminderEmailData : UserName       = " + userNameFromToken );
        logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getReminderEmailData : AccountGUID               = " + accountGUIDFromToken);
        logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getReminderEmailData : Execution end. : Error details : " + error );

        dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
        dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

        return dbResponseObj;
        }
    }

    /**
     * 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async addBulkInherentRisk(userIdFromToken, userNameFromToken, data) {
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : addBulkInherentRisk : Execution started.");
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
        request.input("InherentRiskData",   MSSQL.NVarChar, JSON.stringify(data.bulkInherentRiskData)); 
        request.input("CreatedBy",          MSSQL.NVarChar, data.CreatedBy);
        request.input("AccountGUID", MSSQL.UniqueIdentifier, data.accountGUIDFromToken);
        request.input("FileName",           MSSQL.NVarChar, data.fileName);
        request.output("Success",           MSSQL.Bit);
        request.output("OutMessage",        MSSQL.VarChar);

        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : addBulkInherentRisk : Input parameters value for ORM.RCSA_addBulkInherentRisk procedure.");
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : addBulkInherentRisk : data       = " + JSON.stringify(data || null));
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : addBulkInherentRisk : CreatedBy  = " + data.CreatedBy);
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : addBulkInherentRisk : fileName  = " + data.fileName);
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : addBulkInherentRisk : AccountGUID  = " + data.accountGUIDFromToken);

        return request.execute("[ORM].AddBulkInherentRisk").then(function (result) {
            logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : addBulkInherentRisk : Output parameters value of ORM.RCSA_addBulkInherentRisk procedure.");
            logger.log( "info", "User Id : " + userIdFromToken + " : ScheduleDb : addBulkInherentRisk : Success       = " + result.output.Success );
            logger.log( "info", "User Id : " + userIdFromToken + " : ScheduleDb : addBulkInherentRisk : OutMessage    = " + result.output.OutMessage );

            dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess  = result.output.Success;
            dbResponseObj.procedureMessage  = result.output.OutMessage;
            dbResponseObj.recordset         = result.recordsets;

            logger.log( "info", "User Id : " + userIdFromToken + " : ScheduleDb : addBulkInherentRisk : Execution end. dbResponseObj : " + JSON.stringify(dbResponseObj || null) );

            return dbResponseObj;
            })
            .catch(function (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : addBulkInherentRisk : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : addBulkInherentRisk : UserName       = " + userNameFromToken );
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : addBulkInherentRisk : AccountGUID  = " + data.accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : addBulkInherentRisk : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
            return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : addBulkInherentRisk : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : addBulkInherentRisk : UserName       = " + userNameFromToken );
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : addBulkInherentRisk : AccountGUID  = " + data.accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : addBulkInherentRisk : Execution end. : Error details : " + error );

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

        return dbResponseObj;
        }
    }

    /**
     * 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getInfoBulkInherentRisk(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getInfoBulkInherentRisk : Execution started.");
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

        request.input("CreatedBy",    MSSQL.NVarChar, userNameFromToken);
        request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
        request.output("Success",    MSSQL.Bit);
        request.output("OutMessage", MSSQL.VarChar);

        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getInfoBulkInherentRisk : Input parameters value for ORM.RCSA_getInfoBulkInherentRisk procedure.");
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getInfoBulkInherentRisk : UserName       = " + userNameFromToken);
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getInfoBulkInherentRisk : AccountGUID       = " + accountGUIDFromToken);

        return request.execute("[ORM].RCSA_GetInfoBulkInherentRisk").then(function (result) {
            logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getInfoBulkInherentRisk : Output parameters value of [ORM].RCSA_GetInfoBulkInherentRisk procedure.");
            logger.log( "info", "User Id : " + userIdFromToken + " : ScheduleDb : getInfoBulkInherentRisk : Success       = " + result.output.Success );
            logger.log( "info", "User Id : " + userIdFromToken + " : ScheduleDb : getInfoBulkInherentRisk : OutMessage    = " + result.output.OutMessage );

            dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess  = result.output.Success;
            dbResponseObj.procedureMessage  = result.output.OutMessage;
            dbResponseObj.recordset         = result.recordsets;

            logger.log( "info", "User Id : " + userIdFromToken + " : ScheduleDb : getInfoBulkInherentRisk : Execution end." );

            return dbResponseObj;
            })
            .catch(function (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getInfoBulkInherentRisk : Input parameters value for [ORM].RCSA_GetInfoBulkInherentRisk procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getInfoBulkInherentRisk : UserName       = " + userNameFromToken );
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getInfoBulkInherentRisk : AccountGUID       = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getInfoBulkInherentRisk : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
            return dbResponseObj;
            });
        } catch (error) {
        logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getInfoBulkInherentRisk : Input parameters value for [ORM].RCSA_GetInfoBulkInherentRisk procedure." );
        logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getInfoBulkInherentRisk : UserName       = " + userNameFromToken );
        logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getInfoBulkInherentRisk : AccountGUID       = " + accountGUIDFromToken);
        logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getInfoBulkInherentRisk : Execution end. : Error details : " + error );

        dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
        dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

        return dbResponseObj;
        }
    }


    /**
     * 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getRiskRegisterData(userIdFromToken, userNameFromToken,accountGUIDFromToken,  data) {
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getRiskRegisterData : Execution started.");
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
        var request     = new MSSQL.Request(poolConnectionObject);
        request.input("ScheduleAssessmentID",    MSSQL.BigInt,              data.scheduleAssessmentID); 
        request.input("Year",                    MSSQL.NVarChar,            data.year); 
        request.input("ActionPlanStatusIDs",     MSSQL.NVarChar,            data.actionPlanStatusIDs); 
        request.input("AccountGUID",             MSSQL.UniqueIdentifier,    accountGUIDFromToken); 
        request.input("CreatedBy",               MSSQL.UniqueIdentifier,    userIdFromToken);         
        request.output("Success",                MSSQL.Bit);
        request.output("OutMessage",             MSSQL.VarChar);

        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getRiskRegisterData : Input parameters value for ORM.RCSA_GetRiskRegisterReportData procedure.");
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getRiskRegisterData : UserName       = " + userNameFromToken);
        logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getRiskRegisterData : data           = " + JSON.stringify(data));

        return request.execute("ORM.RCSA_GetRiskRegisterReportData").then(function (result) {
            logger.log("info", "User Id : " + userIdFromToken + " : ScheduleDb : getRiskRegisterData : Output parameters value of [ORM].RCSA_GetRiskRegisterReportData procedure.");
            logger.log( "info", "User Id : " + userIdFromToken + " : ScheduleDb : getRiskRegisterData : Success       = " + result.output.Success );
            logger.log( "info", "User Id : " + userIdFromToken + " : ScheduleDb : getRiskRegisterData : OutMessage    = " + result.output.OutMessage );

            dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess  = result.output.Success;
            dbResponseObj.procedureMessage  = result.output.OutMessage;
            dbResponseObj.recordset         = result.recordsets;

            logger.log( "info", "User Id : " + userIdFromToken + " : ScheduleDb : getRiskRegisterData : Execution end." );

            return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getRiskRegisterData : Input parameters value for [ORM].RCSA_GetRiskRegisterReportData procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getRiskRegisterData : UserName       = " + userNameFromToken );
                logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getRiskRegisterData : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getRiskRegisterData : Input parameters value for [ORM].RCSA_GetRiskRegisterReportData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getRiskRegisterData : UserName       = " + userNameFromToken );
            logger.log( "error", "User Id : " + userIdFromToken + " : ScheduleDb : getRiskRegisterData : Execution end. : Error details : " + error );

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    async upsertCorporateObjective(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : upsertCorporateObjective : Execution started.');
        const dbResponseObj = {
            status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };
        try {
            const request = new MSSQL.Request(poolConnectionObject);

            // Inputs
            request.input('CorporateObjectiveData', MSSQL.NVarChar(MSSQL.MAX), binds.corporateObjectiveDataJson);
            request.input('UserName', MSSQL.NVarChar, binds.userNameForProc || binds.userId || '');
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);

            // Outputs
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar(512));

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : upsertCorporateObjective : Params ready.');
            return request.execute('[ORM].[RCSA_AddRCSAMasterData]').then(result => {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : upsertCorporateObjective : Output -> Success=' + result.output.Success + ', OutMessage=' + result.output.OutMessage);
                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : upsertCorporateObjective : Execution end.');
                return dbResponseObj;
            }).catch(error => {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : upsertCorporateObjective : Exec error : ' + error);
                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : upsertCorporateObjective : Unhandled : ' + error);
            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }


    /**
     * Fetch departments (groups) and units for RCSA Schedule - Individual mode
     * @param {accountGUIDFromToken} binds
     * @returns departments and units recordsets
     */
    async getDepartmentsAndUnitsForSchedule(binds) {
        logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDepartmentsAndUnitsForSchedule : Execution started.');

        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            var request = new MSSQL.Request(poolConnectionObject);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDepartmentsAndUnitsForSchedule : AccountGUID = ' + binds.accountGUIDFromToken);

            return request.execute('[ORM].RCSA_GetDepartmentsAndUnitsForSchedule').then(function (result) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getDepartmentsAndUnitsForSchedule : Success = ' + result.output.Success);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getDepartmentsAndUnitsForSchedule : Error : ' + error);
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getDepartmentsAndUnitsForSchedule : Error : ' + error);
            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }


    /**
     * Fetch existing scheduled RCSA cycles for a given period
     * @param {schedulePeriod, accountGUIDFromToken} binds
     * @returns existing cycles recordset
     */
    async getExistingScheduledCycles(binds) {
        logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getExistingScheduledCycles : Execution started.');

        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            var request = new MSSQL.Request(poolConnectionObject);
            request.input('SchedulePeriod', MSSQL.NVarChar, binds.schedulePeriod);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getExistingScheduledCycles : SchedulePeriod = ' + binds.schedulePeriod);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getExistingScheduledCycles : AccountGUID = ' + binds.accountGUIDFromToken);

            return request.execute('[ORM].RCSA_GetExistingScheduledCycles').then(function (result) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getExistingScheduledCycles : Success = ' + result.output.Success);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getExistingScheduledCycles : Error : ' + error);
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getExistingScheduledCycles : Error : ' + error);
            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }


    /**
     * Get unit mappings for a schedule assessment (for edit pre-selection)
     * @param {scheduleAssessmentID, accountGUIDFromToken} binds
     * @returns unit mappings recordset
     */
    async getScheduleAssessmentUnits(binds) {
        logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentUnits : Execution started.');

        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            var request = new MSSQL.Request(poolConnectionObject);
            request.input('ScheduleAssessmentID', MSSQL.Int, binds.scheduleAssessmentID);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentUnits : ScheduleAssessmentID = ' + binds.scheduleAssessmentID);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentUnits : AccountGUID = ' + binds.accountGUIDFromToken);

            return request.execute('[ORM].RCSA_GetScheduleAssessmentUnits').then(function (result) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentUnits : Success = ' + result.output.Success);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentUnits : Error : ' + error);
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleDb : getScheduleAssessmentUnits : Error : ' + error);
            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }


    stop() {
    }
}

function removeDuplicateEmails(emailString) {
  if (!emailString) return "";

  // Split by commas or semicolons, clean up spaces
  const emailList = emailString
    .split(/[;,]+/)
    .map(e => e.trim())
    .filter(e => e.length > 0);

  // Remove duplicates (case-insensitive)
  const uniqueEmails = [];
  emailList.forEach(email => {
    const lowerEmail = email.toLowerCase();
    if (!uniqueEmails.some(e => e.toLowerCase() === lowerEmail)) {
      uniqueEmails.push(email);
    }
  });

  // Return as a comma-separated string
  return uniqueEmails.join(", ");
}