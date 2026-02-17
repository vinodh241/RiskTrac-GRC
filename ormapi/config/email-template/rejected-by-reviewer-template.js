const REVIEWER_REJECTION = {
 
  REVIEWER_REJECT_EMAIL_TEMPLATE: {
    Subject: "Incident Rejected by the Reviewer : [[IncidentCode]]",    
    Body: `<!DOCTYPE html>
          <html>
            <body>
              <head>
                <meta charset="UTF-8">  
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <div>
                <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                  <p style="margin-top:0;margin-bottom:0;">Dear Reportee,<br><br>
                  The incident([[IncidentCode_1]]) reported by you is rejected by the reviewer. Please find the review comment in the incident form.<br><br>
                  Kindly discuss with the Admin/Reviewer in case of any clarifications or issues.<br><br>
                  Incident Details: <br><br>
                  Incident ID: [[IncidentCode_2]]<br>
                  Title: [[IncidentTitle]]<br>
                  From the Unit: [[UnitName]]<br>
                  Raised by [[ReporterName]] on [[NewIncidentDate]]<br></p><br>    
                  <p style="margin-top:0;margin-bottom:0;"></p><br>                     
                  <p style="margin-top:0;margin-bottom:0;">
                    <p style="margin-top:0;margin-bottom:0;">You can review the details through the link <a href=[[RISKTRAC_WEB_URL]]>RISKTRAC_WEB_URL</a></p>
                  </p>
                </div>
              </div>
            </body>
          </html>`
  }
};

module.exports = {
  REVIEWER_REJECTION: REVIEWER_REJECTION,
};
