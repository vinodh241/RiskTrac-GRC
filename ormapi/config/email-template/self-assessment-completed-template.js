const SELF_ASSESSMENT_COMPLETED = {
  
    SELF_ASSESSMENT_COMPLETED_EMAIL_TEMPLATE: {
      Subject: "RCSA Assessment has been completed: [[ScheduleAssessmentCode]]",    
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
                        <p style="margin-top:0;margin-bottom:0;">The RCSA# [[ScheduleAssessmentCode_1]] has been completed.<br><br>
                         RCSA Description: [[ScheduleAssessmentDescription]].</p>
                        <br>    
                        <p style="margin-top:0;margin-bottom:0;">
                            You can review the details through this link <a href=[[RISKTRAC_WEB_URL]]>RISKTRAC_WEB_URL</a>
                        </p>
                        <br> 
                        <p style="margin-top:0;margin-bottom:0;">Kindly discuss with the relevant parties in case of any clarifications.</p>
                        </div>
                    </div>
                </body>
            </html>`
    }
  };
  
  module.exports = {
    SELF_ASSESSMENT_COMPLETED: SELF_ASSESSMENT_COMPLETED,
  };