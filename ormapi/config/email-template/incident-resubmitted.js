const INCIDENT_RESUBMITTED_CREATER = {
 
    INCIDENT_RESUBMITTED_CREATER_EMAIL_TEMPLATE: {
      Subject: "Incident Re-submitted for review : [[IncidentCode]]",    
      Body: `<!DOCTYPE html>
            <html>
              <body>
                <head>
                  <meta charset="UTF-8">  
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <div>
                  <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                    <p style="margin-top:0;margin-bottom:0;">Dear Reviwer,<br><br>
                    An Incident has been Resubmitted with Incident ID  [[IncidentCode_1]].<br><br>   
                    <p style="margin-top:0;margin-bottom:0;">Incident Details:</p><br>
                    Incident ID: [[IncidentCode_2]]<br>                  
                    Title: [[IncidentTitle]]<br> 
                    From the Unit : [[UnitName]] <br>
                    Raised by [[ReporterName]] on [[NewIncidentDate]]<br><br>
                      <p style="margin-top:0;margin-bottom:0;">You can review the required details through this link : <a href="[[RISKTRAC_WEB_URL]]">RISKTRAC_WEB_URL</a><br><br></p></b>
                    </p>
                  </div>
                </div>
              </body>
            </html>`
    }
  };
  module.exports = {
    INCIDENT_RESUBMITTED_CREATER: INCIDENT_RESUBMITTED_CREATER,
  };