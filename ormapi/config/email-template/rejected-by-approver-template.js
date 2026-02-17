const APPROVER_REJECTION = {
 
  APPROVER_REJECT_EMAIL_TEMPLATE: {
    Subject: "Incident Rejected by Approver: [[IncidentCode]]",    
    Body: `<!DOCTYPE html>
          <html>
            <body>
              <head>
                <meta charset="UTF-8">  
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <div>
                <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                  <p style="margin-top:0;margin-bottom:0;">Dear Reviewer,<br><br>
                  The incident [[IncidentCode_1]] submitted by you/Team has been rejected by the Approver. Please review and re-submit the incident<br><br>
                  Title: [[IncidentTitle]]<br>
                  From the Unit: [[UnitName]]<br>
                  Raised By [[ReporterName]] on [[NewIncidentDate]]</p><br><br>
                  <p style="margin-top:0;margin-bottom:0;"><i>You can review the details through this link <a href=[[RISKTRAC_WEB_URL]]>RISKTRAC_WEB_URL</a></p><br><br>            
                  <p style="margin-top:0;margin-bottom:0;">
                    <p style="margin-top:0;margin-bottom:0;"></b>Kindly discuss with the relevant parties in case of any clarifications.</p>
                  </p>
                </div>
              </div>
            </body>
          </html>`
  }
};

module.exports = {
  APPROVER_REJECTION: APPROVER_REJECTION,
};
