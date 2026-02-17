const MSSQL = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');

/**
 * ORM Email Template DB: fetches email template by workflow step and reviewer type.
 * Used for data-driven template resolution (Internal vs External, per workflow step).
 */
module.exports = class OrmEmailTemplateDb {
    constructor() {}

    /**
     * Fetches email template from DB by workflow step code and reviewer type code.
     * @param {Object} binds - { workflowStepCode, reviewerTypeCode, userId (for logging) }
     * @returns {Promise<{ status, procedureSuccess, recordset, errorMsg }>}
     *   - recordset: array with one row { EmailTemplateID, TemplateCode, TemplateName, Subject, Body } when found
     */
    async getEmailTemplateByWorkflowStepAndReviewerType(binds) {
        if (typeof logger !== 'undefined') {
            logger.log('info', 'User Id : ' + (binds.userId || 'system') + ' : OrmEmailTemplateDb : getEmailTemplateByWorkflowStepAndReviewerType : Execution started.');
        }
        const dbResponseObj = {
            status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            const request = new MSSQL.Request(poolConnectionObject);
            request.input('WorkflowStepCode', MSSQL.NVarChar, binds.workflowStepCode || '');
            request.input('ReviewerTypeCode', MSSQL.NVarChar, binds.reviewerTypeCode || '');
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar(512));

            const result = await request.execute('[ORM].[ORM_GetEmailTemplateByWorkflowStepAndReviewerType]');
            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess = result.output.Success;
            dbResponseObj.procedureMessage = result.output.OutMessage;
            dbResponseObj.recordset = result.recordset && result.recordset.length ? result.recordset : null;

            if (typeof logger !== 'undefined') {
                logger.log('info', 'User Id : ' + (binds.userId || 'system') + ' : OrmEmailTemplateDb : getEmailTemplateByWorkflowStepAndReviewerType : Success=' + result.output.Success + ', OutMessage=' + (result.output.OutMessage || ''));
            }
            return dbResponseObj;
        } catch (error) {
            dbResponseObj.errorMsg = error && error.message ? error.message : String(error);
            if (typeof logger !== 'undefined') {
                logger.log('error', 'User Id : ' + (binds.userId || 'system') + ' : OrmEmailTemplateDb : getEmailTemplateByWorkflowStepAndReviewerType : Error : ' + dbResponseObj.errorMsg);
            }
            return dbResponseObj;
        }
    }

    /**
     * Fetches email template from DB by template code.
     * @param {Object} binds - { templateCode, userId (for logging) }
     * @returns {Promise<{ status, procedureSuccess, recordset, errorMsg }>}
     *   - recordset: array with one row { EmailTemplateID, TemplateCode, TemplateName, Subject, Body } when found
     */
    async getEmailTemplateByTemplateCode(binds) {
        if (typeof logger !== 'undefined') {
            logger.log('info', 'User Id : ' + (binds.userId || 'system') + ' : OrmEmailTemplateDb : getEmailTemplateByTemplateCode : Execution started.');
        }
        const dbResponseObj = {
            status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            const request = new MSSQL.Request(poolConnectionObject);
            request.input('TemplateCode', MSSQL.NVarChar, binds.templateCode || '');
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar(512));

            const result = await request.execute('[ORM].[ORM_GetEmailTemplateByTemplateCode]');
            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess = result.output.Success;
            dbResponseObj.procedureMessage = result.output.OutMessage;
            dbResponseObj.recordset = result.recordset && result.recordset.length ? result.recordset : null;

            if (typeof logger !== 'undefined') {
                logger.log('info', 'User Id : ' + (binds.userId || 'system') + ' : OrmEmailTemplateDb : getEmailTemplateByTemplateCode : Success=' + result.output.Success + ', OutMessage=' + (result.output.OutMessage || ''));
            }
            return dbResponseObj;
        } catch (error) {
            dbResponseObj.errorMsg = error && error.message ? error.message : String(error);
            if (typeof logger !== 'undefined') {
                logger.log('error', 'User Id : ' + (binds.userId || 'system') + ' : OrmEmailTemplateDb : getEmailTemplateByTemplateCode : Error : ' + dbResponseObj.errorMsg);
            }
            return dbResponseObj;
        }
    }
};
