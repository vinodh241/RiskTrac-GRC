const CONSTANT_FILE_OBJ = require('./constants/constant.js');
const OrmEmailTemplateDb = require('../data-access/orm-email-template-db.js');

/**
 * ORM Email Template Resolver: resolves email template by workflow step + reviewer type from DB,
 * applies placeholders from templateData, and returns { Subject, Body }.
 * Returns null when no template is found. Email templates must always be fetched from DB; file-based fallback is deprecated.
 */

/**
 * Replaces placeholders [[Key]] in template string with values from templateData.
 * @param {string} template - Subject or Body string with [[Placeholder]] tokens
 * @param {Object} templateData - Key-value map for placeholders (e.g. ScheduleAssessmentCode_1, UnitName, RISKTRAC_WEB_URL)
 * @returns {string}
 */
function replacePlaceholders(template, templateData) {
    if (!template || typeof template !== 'string') return template || '';
    if (!templateData || typeof templateData !== 'object') return template;
    return Object.keys(templateData).reduce((result, key) => {
        const placeholder = `[[${key}]]`;
        const value = templateData[key] != null ? String(templateData[key]) : '';
        return result.split(placeholder).join(value);
    }, template);
}

/**
 * Resolves ORM email template from DB by workflow step and reviewer type, then applies placeholders.
 * @param {string} workflowStepCode - e.g. 'RCSA_SELF_ASSESSMENT_SUBMIT', 'RCSA_SELF_ASSESSMENT_APPROVED', 'RCSA_SELF_ASSESSMENT_REJECTED', 'INCIDENT_SUBMIT_TO_REVIEWER'
 * @param {string} reviewerTypeCode - 'INTERNAL' or 'EXTERNAL'
 * @param {Object} templateData - Data for placeholders (e.g. ScheduleAssessmentCode_1, UnitName, RISKTRAC_WEB_URL, IncidentCode, etc.)
 * @param {string} [userId] - Optional user id for logging
 * @returns {Promise<{ Subject: string, Body: string } | null>} Resolved template or null if not found
 */
async function resolveOrmEmailTemplate(workflowStepCode, reviewerTypeCode, templateData, userId) {
    if (!workflowStepCode || !reviewerTypeCode) {
        if (typeof logger !== 'undefined') {
            logger.log('warn', 'OrmEmailTemplateResolver : resolveOrmEmailTemplate : Missing workflowStepCode or reviewerTypeCode, skipping DB resolution.');
        }
        return null;
    }

    const db = new OrmEmailTemplateDb();
    const binds = {
        workflowStepCode: String(workflowStepCode).trim(),
        reviewerTypeCode: String(reviewerTypeCode).trim(),
        userId: userId || 'system'
    };
    const result = await db.getEmailTemplateByWorkflowStepAndReviewerType(binds);

    if (result.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE || !result.recordset || result.recordset.length === 0) {
        if (typeof logger !== 'undefined') {
            logger.log('info', 'User Id : ' + (userId || 'system') + ' : OrmEmailTemplateResolver : resolveOrmEmailTemplate : No DB template for step=' + workflowStepCode + ', reviewerType=' + reviewerTypeCode + ', using fallback.');
        }
        return null;
    }

    const row = result.recordset[0];
    const subject = replacePlaceholders(row.Subject || '', templateData);
    const body = replacePlaceholders(row.Body || '', templateData);

    if (typeof logger !== 'undefined') {
        logger.log('info', 'User Id : ' + (userId || 'system') + ' : OrmEmailTemplateResolver : resolveOrmEmailTemplate : Resolved template from DB for step=' + workflowStepCode + ', reviewerType=' + reviewerTypeCode + ', templateCode=' + (row.TemplateCode || ''));
    }
    return { Subject: subject, Body: body };
}

/**
 * Resolves ORM email template from DB by template code, then applies placeholders.
 * Email templates must always be fetched from DB. Hardcoded/API-based templates are deprecated.
 * @param {string} templateCode - Template code in ORM_EmailTemplate (e.g. SCHEDULE_ASSESSMENT_INPROGRESS_EMAIL_TEMPLATE)
 * @param {Object} templateData - Data for placeholders (e.g. ScheduleAssessmentCode_1, UnitName, RISKTRAC_WEB_URL)
 * @param {string} [userId] - Optional user id for logging
 * @returns {Promise<{ Subject: string, Body: string } | null>} Resolved template or null if not found
 */
async function resolveOrmEmailTemplateByCode(templateCode, templateData, userId) {
    if (!templateCode) {
        if (typeof logger !== 'undefined') {
            logger.log('warn', 'OrmEmailTemplateResolver : resolveOrmEmailTemplateByCode : Missing templateCode, skipping DB resolution.');
        }
        return null;
    }

    const db = new OrmEmailTemplateDb();
    const binds = {
        templateCode: String(templateCode).trim(),
        userId: userId || 'system'
    };
    const result = await db.getEmailTemplateByTemplateCode(binds);

    if (result.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE || !result.recordset || result.recordset.length === 0) {
        if (typeof logger !== 'undefined') {
            logger.log('info', 'User Id : ' + (userId || 'system') + ' : OrmEmailTemplateResolver : resolveOrmEmailTemplateByCode : No DB template for templateCode=' + templateCode + '.');
        }
        return null;
    }

    const row = result.recordset[0];
    const subject = replacePlaceholders(row.Subject || '', templateData);
    const body = replacePlaceholders(row.Body || '', templateData);

    if (typeof logger !== 'undefined') {
        logger.log('info', 'User Id : ' + (userId || 'system') + ' : OrmEmailTemplateResolver : resolveOrmEmailTemplateByCode : Resolved template from DB for templateCode=' + templateCode);
    }
    return { Subject: subject, Body: body };
}

module.exports = {
    resolveOrmEmailTemplate,
    resolveOrmEmailTemplateByCode,
    replacePlaceholders
};
