
// const REVIEW_OBJ = require('../config/email-template/review-rejection-template.js');
// const SCHEDULE_ASSESSMENT_OBJ = require('../config/email-template/schedule-assessment-template.js');
// const SCROING_OBJ = require('../config/email-template/self-scroing-template.js');
// const UPDATE_ASSESSMENT_OBJ = require('../config/email-template/update-assessment-template.js');
// const SUBMIT_TO_REVIEWER_OBJ = require('../config/email-template/submit-to-reviewer-template.js');
// const REJECT_BY_REVIEWER_OBJ = require('../config/email-template/rejected-by-reviewer-template.js');
// const SUBMIT_TO_APPROVER_OBJ = require('../config/email-template/submit-to-approver-template.js');
// const REJECT_BY_APPROVER_OBJ = require('../config/email-template/rejected-by-approver-template.js');
// const GENERIC_A_OBJ = require('../config/email-template/generic-a-template.js');
// const GENERIC_B_OBJ = require('../config/email-template/generic-b-template.js');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');


module.exports = class EmailTemplates {
  constructor() {
  }

  prepareTemplates(userIdFromToken, userNameFromToken, emailTemplateObj, templateMasterData) {
    try {
      logger.log('info', 'User Id : ' + userIdFromToken + ' : EmailTemplates : prepareTemplates : Execution started.');

      logger.log('info', 'User Id : ' + userIdFromToken + ' : EmailTemplates : prepareTemplates : emailTemplateObj: ' + JSON.stringify(emailTemplateObj || null));

      logger.log('info', 'User Id : ' + userIdFromToken + ' : EmailTemplates : prepareTemplates : templateMasterData: ' + JSON.stringify(templateMasterData || null));

      // let tempEmailTemplate;
      // let emailSubject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      // let emailTemplate = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

      // if (templateKey == 'REVIEW_REJECTION_EMAIL_TEMPLATE') {
      //   emailSubject = REVIEW_OBJ.REVIEW_REJECTION[templateKey].Subject;
      //   emailTemplate = REVIEW_OBJ.REVIEW_REJECTION[templateKey].Body;
      // }

      // if (templateKey == 'SELF_SCORING_EMAIL_TEMPLATE') {
      //   emailSubject = SCROING_OBJ.SELF_SCROING[templateKey].Subject;
      //   emailTemplate = SCROING_OBJ.SELF_SCROING[templateKey].Body;
      // }

      // if (templateKey == 'SCHEDULE_ASSESSMENT_EMAIL_TEMPLATE') {
      //   emailSubject = SCHEDULE_ASSESSMENT_OBJ.ASSESSMENT_TEMPLATES[templateKey].Subject;
      //   emailTemplate = SCHEDULE_ASSESSMENT_OBJ.ASSESSMENT_TEMPLATES[templateKey].Body;
      // }
      // if (templateKey == 'UPDATE_ASSESSMENT_EMAIL_TEMPLATE') {
      //   emailSubject = UPDATE_ASSESSMENT_OBJ.ASSESSMENT_TEMPLATES[templateKey].Subject;
      //   emailTemplate = UPDATE_ASSESSMENT_OBJ.ASSESSMENT_TEMPLATES[templateKey].Body;
      // }
      // if (templateKey == 'SUBMIT_TO_REVIEWER_EMAIL_TEMPLATE') {
      //   emailSubject = SUBMIT_TO_REVIEWER_OBJ.SUBMIT_TO_REVIEWER[templateKey].Subject;
      //   emailTemplate = SUBMIT_TO_REVIEWER_OBJ.SUBMIT_TO_REVIEWER[templateKey].Body;
      // }
      // if (templateKey == 'REVIEWER_REJECT_EMAIL_TEMPLATE') {
      //   emailSubject = REJECT_BY_REVIEWER_OBJ.REVIEWER_REJECTION[templateKey].Subject;
      //   emailTemplate = REJECT_BY_REVIEWER_OBJ.REVIEWER_REJECTION[templateKey].Body;
      // }
      // if (templateKey == 'SUBMIT_TO_APPROVER_EMAIL_TEMPLATE') {
      //   emailSubject = SUBMIT_TO_APPROVER_OBJ.SUBMIT_TO_APPROVER[templateKey].Subject;
      //   emailTemplate = SUBMIT_TO_APPROVER_OBJ.SUBMIT_TO_APPROVER[templateKey].Body;
      // }
      // if (templateKey == 'APPROVER_REJECT_EMAIL_TEMPLATE') {
      //   emailSubject = REJECT_BY_APPROVER_OBJ.APPROVER_REJECTION[templateKey].Subject;
      //   emailTemplate = REJECT_BY_APPROVER_OBJ.APPROVER_REJECTION[templateKey].Body;
      // }
      // if (templateKey == 'GENERIC_A_TEMPLATE') {
      //   emailSubject = GENERIC_A_OBJ.GENERIC_A[templateKey].Subject;
      //   emailTemplate = GENERIC_A_OBJ.GENERIC_A[templateKey].Body;
      // }
      // if (templateKey == 'GENERIC_B_TEMPLATE') {
      //   emailSubject = GENERIC_B_OBJ.GENERIC_B[templateKey].Subject;
      //   emailTemplate = GENERIC_B_OBJ.GENERIC_B[templateKey].Body;
      // }
      // tempEmailTemplate = emailTemplate;

      let tempEmailTemplate = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      let emailSubject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      
      tempEmailTemplate = emailTemplateObj.Body;
      emailSubject = emailTemplateObj.Subject;

      for (const [key, value] of Object.entries(templateMasterData)) {
        tempEmailTemplate = tempEmailTemplate.replace(`[[${key}]]`, value);
        emailSubject = emailSubject.replace(`[[${key}]]`, value);
      }
      return { Body: tempEmailTemplate, Subject: emailSubject };
    } catch (error) {
      logger.log('error', 'User Id : ' + userIdFromToken + ' : EmailTemplates : prepareTemplates : Execution end. : Got unhandled error. : Error Detail : ' + error);
    }
  }
}
