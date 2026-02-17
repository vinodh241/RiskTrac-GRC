const RECOMMENDATION_ACTION_PLAN_SUBMIT = {
 
    RECOMMENDATION_ACTION_PLAN_SUBMIT_EMAIL_TEMPLATE: {
      Subject: "Incident Action Plan Submitted: [[IncidentCode]] with Recommendation ( [[RecomendationCode_1]] )",    
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
                    Action plans have been submitted for your review.<br>   
                    <p style="margin-top:0;margin-bottom:0;"></p><br>                  
                    Title: [[IncidentTitle]]<br> 
                    From the Recommendation Unit : [[RUnitName]] <br>
                    Raised by [[ReporterName]] on [[NewIncidentDate]]<br><br>
                      <p style="margin-top:0;margin-bottom:0;">You can review the required details through this link : <a href="[[RISKTRAC_WEB_URL]]">RISKTRAC_WEB_URL</a><br><br>
                      Kindly discuss with the relevant parties in case of any clarifications.</p></b>
                    </p>
                  </div>
                </div>
              </body>
            </html>`
    }
    
  };
  
  module.exports = {
    RECOMMENDATION_ACTION_PLAN_SUBMIT: RECOMMENDATION_ACTION_PLAN_SUBMIT,
  };