const SUBMIT_RECOMMENDATION = {
 
  SUBMIT_RECOMMENDATION_EMAIL_TEMPLATE: {
    Subject: "Incident Action Plan Submitted [[IncidentCode]]",    
    Body: `<!DOCTYPE html>
          <html>
            <body>
              <head>
                <meta charset="UTF-8">  
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <div>
                <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                  <p style="margin-top:0;margin-bottom:0;">Dear Reviewer,<br> 
                  Action plan has been submitted for your review.<br><br>
                  Title: [[IncidentTitle]]<br>
                  From the Unit - [[UnitName]]<br>
                  Raised by [[ReporterName]] on [[NewIncidentDate]]</p><br>
                  <p style="margin-top:0;margin-bottom:0;"><i>You can review the details through this link <a href="[[RISKTRAC_WEB_URL]]">RISKTRAC_WEB_URL</a></i></p><br>                  
                  <p style="margin-top:0;margin-bottom:0;">
                    <p style="margin-top:0;margin-bottom:0;">Kindly discuss with the relevant parties in case of any clarifications.</p><br>
                  </p>
                </div>
              </div>
            </body>
          </html>`
  }
};

module.exports = {
  SUBMIT_RECOMMENDATION: SUBMIT_RECOMMENDATION,
};