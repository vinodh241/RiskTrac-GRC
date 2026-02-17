const SELF_ASSESSMENT_APPROVED = {
  
    SELF_ASSESSMENT_APPROVED_EMAIL_TEMPLATE: {
      Subject: "RCSA Assessment has been Approved for your Department: [[ScheduleAssessmentCode]]",    
      Body: `<!DOCTYPE html>
                <html>
                <body>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <div>
                        <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                        <p style="margin-top:0;margin-bottom:0;"> 
                            Dear,
                        </p>
                        <br>        
                        <p style="margin-top:0;margin-bottom:0;">The Submitted details under RCSA# [[ScheduleAssessmentCode_1]] by your department has been Approved by the reviewer user. Kindly login to the application for more information.</p>
                        <br>    
                        <p style="margin-top:0;margin-bottom:0;">
                            RCSA Description: [[ScheduleAssessmentDescription]]<br><br>
                            Unit Name: [[UnitName]]<br><br>
                            You can review the details through this link <a href=[[RISKTRAC_WEB_URL]]>RISKTRAC_WEB_URL</a>
                        </p>
                        <br> 
                        <p style="margin-top:0;margin-bottom:0;">Kindly discuss with relevant parties in case of any clarifications.</p>
                        </div>
                    </div>
                </body>
            </html>`
    }
  };
  
  module.exports = {
    SELF_ASSESSMENT_APPROVED: SELF_ASSESSMENT_APPROVED,
  };