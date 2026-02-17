const INCIDENT_FINANCIAL_APPROVAL = {
 
    INCIDENT_APPROVAL_TEMPLATE: {
      Subject: "Incident created with Financial Loss: [[IncidentCode]]",    
      Body: `<!DOCTYPE html>
      <html>
        <body>
          <head>
            <meta charset="UTF-8">  
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <div>
            <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
              <p style="margin-top:0;margin-bottom:0;">Dear,<br><br>
              An Incident : [[IncidentCode]] has been confirmed with a loss of : [[LossAmount]] SAR.
               <br>
                <p>Incident Details:<br><br>
                Incident ID - [[IncidentCode_1]] <br>
                                
              Title: [[IncidentTitle]]<br> 
              From the Unit : [[UnitName]] <br>
               Raised by: [[ReporterName]] and raised on [[NewIncidentDate]]<br> </p> 
                <p style="margin-top:0;margin-bottom:0;"><b></b>You can review the required details through this link : <a href="[[RISKTRAC_WEB_URL]]">RISKTRAC_WEB_URL</a><br><br>
                Kindly discuss with the relevant parties in case of any clarifications.</p></b>
              </p>
            </div>
          </div>
        </body>
      </html>`
    }
  };
  
  module.exports = {
    INCIDENT_FINANCIAL_APPROVAL: INCIDENT_FINANCIAL_APPROVAL,
  };
  