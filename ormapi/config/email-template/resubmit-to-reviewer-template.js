const RESUBMIT_TO_REVIEWER = {
 
  RESUBMIT_TO_REVIEWER_EMAIL_TEMPLATE: {
    Subject: "Incident Re-Submitted for Review : [[IncidentCode]]",    
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
                  An incident has been Resubmitted with Incident ID: [[IncidentCode]]<br><br>
                  Title: [[IncidentTitle]]<br>
                  From the Unit: [[UnitName]]<br>
                  Raised by [[ReporterName]] on [[NewIncidentDate]]<br></p><br>    
                  <p style="margin-top:0;margin-bottom:0;">You can review the details through the link <a href=[[RISKTRAC_WEB_URL]]>RISKTRAC_WEB_URL</a></p><br>                     
                  <p style="margin-top:0;margin-bottom:0;">
                    <p style="margin-top:0;margin-bottom:0;">Kindly discuss with the relevant parties in case of any clarifications.</p>
                  </p>
                </div>
              </div>
            </body>
          </html>`
  }
};

module.exports = {
  RESUBMIT_TO_REVIEWER: RESUBMIT_TO_REVIEWER,
};