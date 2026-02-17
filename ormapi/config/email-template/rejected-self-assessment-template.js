const REJECTED_SELF_ASSESSMENT = {
  
    REJECTED_SELF_ASSESSMENT_EMAIL_TEMPLATE: {
      Subject: "Rejected self assessment",    
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
                            Hello [[CreatedUserName]],
                        </p>
                        <br>        
                        <p style="margin-top:0;margin-bottom:0;">The risk [[ScheduleAssessmentCode]] with the SL# [[SLNO]] is rejected in the RCSA# {RCSACode}. Please login to the application for more information.</p>
                        <br>    
                        <p style="margin-top:0;margin-bottom:0;">
                            -- This is an auto-generated email
                        </p>
                        <br> 
                        <p style="margin-top:0;margin-bottom:0;border-bottom:1px solid #000000">From,<br>RiskTrac Application.</p>
                        </div>
                    </div>
                </body>
            </html>`
    }
  };
  
  module.exports = {
    REJECTED_SELF_ASSESSMENT: REJECTED_SELF_ASSESSMENT,
  };