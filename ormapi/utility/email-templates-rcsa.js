// Email templates must always be fetched from DB. Hardcoded/API-based templates are deprecated.
// RCSA code uses resolveOrmEmailTemplateByCode / resolveOrmEmailTemplate from orm-email-template-resolver.js instead.
const emailConfig = require('../config/email-config.js');
// Deprecated: File-based template sources. Use ORM_EmailTemplate (DB) via orm-email-template-resolver.js for RCSA.
const REVIEW_OBJ = require('../config/email-template/review-rejection-template.js');
const ASSESSMENT_OBJ = require('../config/email-template/schedule-assessment-template.js');
const SCORING_OBJ = require('../config/email-template/self-scroing-template.js');
const SCHEDULE_ASSESSMENT_NEW_OBJ = require('../config/email-template/schedule-assessment-new-template.js');
const SCHEDULE_ASSESSMENT_UPDATE_OBJ = require('../config/email-template/schedule-assessment-update-template.js');
const SCHEDULE_ASSESSMENT_OLD_REVIEWER_UPDATE_OBJ = require('../config/email-template/schedule-assessment-old-reviewer-template.js');
const SCHEDULE_ASSESSMENT_REVIEWER_UPDATE_OBJ = require('../config/email-template/schedule-assessment-reviewer-update-template.js');
const SELF_ASSESSMENT_SUBMIT_OBJ = require('../config/email-template/self-assessment-submit-template.js');
const SELF_ASSESSMENT_RESUBMIT_OBJ = require('../config/email-template/self-assessment-resubmit-template.js');
const SELF_ASSESSMENT_APPROVED_OBJ = require('../config/email-template/self-assessment-approved-template.js');
const SELF_ASSESSMENT_REJECTED_OBJ = require('../config/email-template/self-assessment-rejected-template.js');
const SELF_ASSESSMENT_COMPLETED_OBJ = require('../config/email-template/self-assessment-completed-template.js');
const SELF_ASSESSMENT_INTERNAL_REVIEWER_APPROVED_OBJ = require('../config/email-template/self-assessment-internal-reviewer-approved.js');
const SELF_ASSESSMENT_INTERNAL_REVIEWER_REJECT_OBJ = require('../config/email-template/self-assessment-internal-reviewer-reject.js');
const SELF_ASSESSMENT_INTERNAL_REVIEWER_SUBMIT_OBJ = require('../config/email-template/self-assessment-internal-reviewer-submit-template.js');
const SEND_EMAIL_MANUALLY_OBJ = require('../config/email-template/send-email-manually-rcsa.js');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const SCHEDULE_ASSESSMENT_INPROGRESS_OBJ = require('../config/email-template/schedule-assessment-in-progress-template.js');
const { logger } = require('../utility/log-manager/log-manager.js');


module.exports = class EmailTemplates {
  constructor() {
  }

  // Email templates must always be fetched from DB. Hardcoded/API-based templates are deprecated.
  // RCSA flows use resolveOrmEmailTemplateByCode / resolveOrmEmailTemplate (orm-email-template-resolver.js) instead.
  // The switch below is retained for non-RCSA callers or fallback reference only; do not add new RCSA template types here.
  prepareTemplates(templateData, templateType) {
    logger.log('info', 'Inside Email Templates Preparation Method');

    let emailSubject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let emailBody = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    // Use switch statement for better readability (file-based; deprecated for RCSA)
    switch (templateType) {
      case 'REVIEW_REJECTION_EMAIL_TEMPLATE':
        emailSubject = REVIEW_OBJ.REVIEW_REJECTION[templateType]?.Subject || '';
        emailBody = REVIEW_OBJ.REVIEW_REJECTION[templateType]?.Body || '';
        break;

      case 'SELF_SCORING_EMAIL_TEMPLATE':
        emailSubject = SCORING_OBJ.SELF_SCORING[templateType]?.Subject || '';
        emailBody = SCORING_OBJ.SELF_SCORING[templateType]?.Body || '';
        break;

      case 'SCHEDULE_ASSESSMENT_EMAIL_TEMPLATE':
        emailSubject = ASSESSMENT_OBJ.ASSESSMENT_TEMPLATES[templateType]?.Subject || '';
        emailBody = ASSESSMENT_OBJ.ASSESSMENT_TEMPLATES[templateType]?.Body || '';
        break;

      case 'SCHEDULE_ASSESSMENT_NEW_EMAIL_TEMPLATE':
        emailSubject = SCHEDULE_ASSESSMENT_NEW_OBJ.SCHEDULE_ASSESSMENT_NEW[templateType]?.Subject || '';
        emailBody = SCHEDULE_ASSESSMENT_NEW_OBJ.SCHEDULE_ASSESSMENT_NEW[templateType]?.Body || '';
        break;

      case 'SCHEDULE_ASSESSMENT_INPROGRESS_EMAIL_TEMPLATE':
        emailSubject = SCHEDULE_ASSESSMENT_INPROGRESS_OBJ.SCHEDULE_ASSESSMENT_INPROGRESS[templateType]?.Subject || '';
        emailBody = SCHEDULE_ASSESSMENT_INPROGRESS_OBJ.SCHEDULE_ASSESSMENT_INPROGRESS[templateType]?.Body || '';
        break;

      case 'SCHEDULE_ASSESSMENT_UPDATE_EMAIL_TEMPLATE':
        emailSubject = SCHEDULE_ASSESSMENT_UPDATE_OBJ.SCHEDULE_ASSESSMENT_UPDATE[templateType]?.Subject || '';
        emailBody = SCHEDULE_ASSESSMENT_UPDATE_OBJ.SCHEDULE_ASSESSMENT_UPDATE[templateType]?.Body || '';
        break;

      case 'SCHEDULE_ASSESSMENT_REVIEWER_UPDATE_EMAIL_TEMPLATE':
        emailSubject = SCHEDULE_ASSESSMENT_REVIEWER_UPDATE_OBJ.SCHEDULE_ASSESSMENT_REVIEWER_UPDATE[templateType]?.Subject || '';
        emailBody = SCHEDULE_ASSESSMENT_REVIEWER_UPDATE_OBJ.SCHEDULE_ASSESSMENT_REVIEWER_UPDATE[templateType]?.Body || '';
        break;

      case 'SCHEDULE_ASSESSMENT_OLD_REVIEWER_UPDATE_EMAIL_TEMPLATE':
        emailSubject = SCHEDULE_ASSESSMENT_OLD_REVIEWER_UPDATE_OBJ.SCHEDULE_ASSESSMENT_OLD_REVIEWER_UPDATE[templateType]?.Subject || '';
        emailBody = SCHEDULE_ASSESSMENT_OLD_REVIEWER_UPDATE_OBJ.SCHEDULE_ASSESSMENT_OLD_REVIEWER_UPDATE[templateType]?.Body || '';
        break;

      case 'SELF_ASSESSMENT_SUBMIT_EMAIL_TEMPLATE':
        emailSubject = SELF_ASSESSMENT_SUBMIT_OBJ.SELF_ASSESSMENT_SUBMIT[templateType]?.Subject || '';
        emailBody = SELF_ASSESSMENT_SUBMIT_OBJ.SELF_ASSESSMENT_SUBMIT[templateType]?.Body || '';
        break;

      case 'SELF_ASSESSMENT_INTERNAL_REVIEWER_REJECT_EMAIL_TEMPLATE':
        emailSubject = SELF_ASSESSMENT_INTERNAL_REVIEWER_REJECT_OBJ.SELF_ASSESSMENT_INTERNAL_REVIEWER_REJECTED[templateType]?.Subject || '';
        emailBody = SELF_ASSESSMENT_INTERNAL_REVIEWER_REJECT_OBJ.SELF_ASSESSMENT_INTERNAL_REVIEWER_REJECTED[templateType]?.Body || '';
        break;

      case 'SELF_ASSESSMENT_INTERNAL_REVIEWER_SUBMIT_EMAIL_TEMPLATE':
        emailSubject = SELF_ASSESSMENT_INTERNAL_REVIEWER_SUBMIT_OBJ.SELF_ASSESSMENT_INTERNAL_REVIEWER_SUBMIT[templateType]?.Subject || '';
        emailBody = SELF_ASSESSMENT_INTERNAL_REVIEWER_SUBMIT_OBJ.SELF_ASSESSMENT_INTERNAL_REVIEWER_SUBMIT[templateType]?.Body || '';
        break;

      case 'SELF_ASSESSMENT_RESUBMIT_EMAIL_TEMPLATE':
        emailSubject = SELF_ASSESSMENT_RESUBMIT_OBJ.SELF_ASSESSMENT_RESUBMIT[templateType]?.Subject || '';
        emailBody = SELF_ASSESSMENT_RESUBMIT_OBJ.SELF_ASSESSMENT_RESUBMIT[templateType]?.Body || '';
        break;

      case 'SELF_ASSESSMENT_INTERNAL_REVIEWER_APPROVED_EMAIL_TEMPLATE':
        emailSubject = SELF_ASSESSMENT_INTERNAL_REVIEWER_APPROVED_OBJ.SELF_ASSESSMENT_INTERNAL_REVIEWER_APPROVED[templateType]?.Subject || '';
        emailBody = SELF_ASSESSMENT_INTERNAL_REVIEWER_APPROVED_OBJ.SELF_ASSESSMENT_INTERNAL_REVIEWER_APPROVED[templateType]?.Body || '';
        break;

      case 'SELF_ASSESSMENT_APPROVED_EMAIL_TEMPLATE':
        emailSubject = SELF_ASSESSMENT_APPROVED_OBJ.SELF_ASSESSMENT_APPROVED[templateType]?.Subject || '';
        emailBody = SELF_ASSESSMENT_APPROVED_OBJ.SELF_ASSESSMENT_APPROVED[templateType]?.Body || '';
        break;

      case 'SELF_ASSESSMENT_REJECTED_EMAIL_TEMPLATE':
        emailSubject = SELF_ASSESSMENT_REJECTED_OBJ.SELF_ASSESSMENT_REJECTED[templateType]?.Subject || '';
        emailBody = SELF_ASSESSMENT_REJECTED_OBJ.SELF_ASSESSMENT_REJECTED[templateType]?.Body || '';
        break;

      case 'SELF_ASSESSMENT_COMPLETED_EMAIL_TEMPLATE':
        emailSubject = SELF_ASSESSMENT_COMPLETED_OBJ.SELF_ASSESSMENT_COMPLETED[templateType]?.Subject || '';
        emailBody = SELF_ASSESSMENT_COMPLETED_OBJ.SELF_ASSESSMENT_COMPLETED[templateType]?.Body || '';
        break;

      case 'SEND_EMAIL_MANUALLY_RCSA_EMAIL_TEMPLATE':
        emailSubject = SEND_EMAIL_MANUALLY_OBJ.SEND_EMAIL_MANUALLY_RCSA[templateType]?.Subject || '';
        emailBody = SEND_EMAIL_MANUALLY_OBJ.SEND_EMAIL_MANUALLY_RCSA[templateType]?.Body || '';
        break;

      default:
        logger.log('warn', `Unknown template type: ${templateType}`);
        // Consider throwing an error or returning a default template here
        return {
          Body: 'Template not found',
          Subject: 'Template not found'
        };
    }

    // Add null checks before processing
    if (!emailBody || !emailSubject) {
      logger.log('warn', `Empty template body or subject for template type: ${templateType}`);
      return {
        Body: emailBody || '',
        Subject: emailSubject || ''
      };
    }

    const replacePlaceholders = (template) => {
      // Early return for empty templates
      if (!template) return '';

      return Object.keys(templateData).reduce((result, key) => {
        const placeholder = `[[${key}]]`;
        const value = templateData[key] ?? ''; // Use nullish coalescing

        // Use split/join for global replacement
        return result.split(placeholder).join(value);
      }, template);
    };

    const processedBody = replacePlaceholders(emailBody);
    const processedSubject = replacePlaceholders(emailSubject);

    // Log if there are any unreplaced placeholders (optional)
    const unreplacedPlaceholders = processedBody.match(/\[\[.*?\]\]/g) || processedSubject.match(/\[\[.*?\]\]/g);
    if (unreplacedPlaceholders) {
      logger.log('warn', `Unreplaced placeholders found in template ${templateType}: ${unreplacedPlaceholders.join(', ')}`);
    }

    return {
      Body: processedBody,
      Subject: processedSubject
    };
  }
}
