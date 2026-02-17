const RECOMMENDATION_ACTION_PLAN_APPROVED_REVIEWER = {
 
    RECOMMENDATION_ACTION_PLAN_APPROVED_REVIEWER_EMAIL_TEMPLATE: {
      Subject: "Incident submitted for Approval/Rejection of action plan: [[IncidentCode]] with Recommendation ([[RecomendationCode_1]])",    
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
                    Action items for the [[IncidentCode_1]] were reviewed and approved.<br><br>
                    Incident Details: <br><br>   
                    Incident ID: [[IncidentCode_2]]<br>                  
                    Title: [[IncidentTitle]]<br> 
                    From the Recommendation Unit : [[RUnitName]] <br>
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
    RECOMMENDATION_ACTION_PLAN_APPROVED_REVIEWER: RECOMMENDATION_ACTION_PLAN_APPROVED_REVIEWER,
  };