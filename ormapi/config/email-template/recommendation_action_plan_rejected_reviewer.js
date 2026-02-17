const RECOMMENDATION_ACTION_PLAN_REJECTED_REVIEWER = {
 
    RECOMMENDATION_ACTION_PLAN_REJECTED_REVIEWER_EMAIL_TEMPLATE: {
      Subject: "Recommendation Action Plan Rejected by Reviewer :- [[IncidentCode_1]]  with Recommendation ([[RecomendationCode_1]])",    
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
                    The Recommendation Action Plan ([[RecomendationCode_2]]) submitted by your unit has been rejected by the Reviewer. Please review and re-submit the Action Plan.<br><br>                   
                    Title: [[IncidentTitle]]<br> 
                    From the Recommendation Unit : [[RUnitName]] <br>
                    Raised by [[ReporterName]] Reported on [[NewIncidentDate]]<br><br>
                      <p style="margin-top:0;margin-bottom:0;">You can review the required details through this link : <a href="[[RISKTRAC_WEB_URL]]">RISKTRAC_WEB_URL</a><br><br>
                      Kindly discuss with the Admin/Reviewer in case of any clarifications or issues.</p></b>
                    </p>
                  </div>
                </div>
              </body>
            </html>`
    }
  };
  
  module.exports = {
    RECOMMENDATION_ACTION_PLAN_REJECTED_REVIEWER: RECOMMENDATION_ACTION_PLAN_REJECTED_REVIEWER,
  };