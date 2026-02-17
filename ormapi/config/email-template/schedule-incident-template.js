const INCIDENT_TEMPLATES = {
    SCHEDULE_INCIDENT_EMAIL_TEMPLATE: {
      Subject: "Incident - [[IncidentCode]] Recommendation ([[RecommendationCode]]) Pending for submission",
      Body: `<!DOCTYPE html>
      <html>
        <body>
          <head>
            <meta charset="UTF-8">  
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <div>
            <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
              <p style="margin-top:0;margin-bottom:0;">Dear,<br>
              An Incident- [[IncidentCode_1]] Recommendation ([[RecommendationCode_1]]) has been assigned by the approver for taking proper action for closure has been pending beyond the Defined target date.<br><br>
              Incident Details: <br>
              Incident ID - [[IncidentCode_2]]<br>
              Title: [[IncidentTitle]]<br>
              For the Recommendation Unit - [[UnitName]]<br>
              Raised by user - [[ReporterName]] Reported on [[ReportingDate]]<br></p>    
              <p style="margin-top:0;margin-bottom:0;"></p><br>                     
              <p style="margin-top:0;margin-bottom:0;">
                <p style="margin-top:0;margin-bottom:0;"><i>You can review the details through this link <a href=[[RISKTRAC_WEB_URL]]>[[RISKTRAC_WEB_URL]]</a></i></p><br>
                <p style="margin-top:0;margin-bottom:0;">Kindly discuss with the relevant parties in case of any clarifications.</p>
              </p>
            </div>
          </div>
        </body>
      </html>`
    }
  };
  
  module.exports = {
    INCIDENT_TEMPLATES: INCIDENT_TEMPLATES,
  };
  
