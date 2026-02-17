const SCHEDULE_ASSESSMENT_INPROGRESS = {
  
    SCHEDULE_ASSESSMENT_INPROGRESS_EMAIL_TEMPLATE: {
      Subject: "RCSA Assessment initiated: [[ScheduleAssessmentCode]]",    
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
                        <p style="margin-top:0;margin-bottom:0;">The RCSA# [[ScheduleAssessmentCode_1]] is initiated for your Department. Please login to the application for further information.<br><br>
                        RCSA Description: [[ScheduleAssessmentDescription]]</p>
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
    SCHEDULE_ASSESSMENT_INPROGRESS: SCHEDULE_ASSESSMENT_INPROGRESS,
  };
  