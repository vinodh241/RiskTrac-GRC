const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');


module.exports = class EmailTemplates {
  constructor() {
  }

  prepareTemplates(userIdFromToken,  emailTemplateObj, templateMasterData) {
    try {
      logger.log('info', 'User Id : ' + userIdFromToken + ' : EmailTemplates : prepareTemplates : Execution started.');

      logger.log('info', 'User Id : ' + userIdFromToken + ' : EmailTemplates : prepareTemplates : emailTemplateObj: ' + JSON.stringify(emailTemplateObj || null));

      logger.log('info', 'User Id : ' + userIdFromToken + ' : EmailTemplates : prepareTemplates : templateMasterData: ' + JSON.stringify(templateMasterData || null));

      let tempEmailTemplate = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      let emailSubject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      
      tempEmailTemplate = emailTemplateObj.Body;
      emailSubject = emailTemplateObj.Subject;

      for (const [key, value] of Object.entries(templateMasterData)) {
         // Use regular expression with global flag to replace all occurrences
         const regex = new RegExp(`\\[\\[${key}\\]\\]`, 'g');
         tempEmailTemplate = tempEmailTemplate.replace(regex, value);
         emailSubject = emailSubject.replace(regex, value);
        // tempEmailTemplate = tempEmailTemplate.replace(`[[${key}]]`, value);
        // emailSubject = emailSubject.replace(`[[${key}]]`, value);
      }
      return { Body: tempEmailTemplate, Subject: emailSubject };
    } catch (error) {
      logger.log('error', 'User Id : ' + userIdFromToken + ' : EmailTemplates : prepareTemplates : Execution end. : Got unhandled error. : Error Detail : ' + error);
    }
  }
}
