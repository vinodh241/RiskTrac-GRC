const USER_ASSIGNED_AS_REVIEWER = {
  
    USER_ASSIGNED_AS_REVIEWER_EMAIL_TEMPLATE: {
      Subject: "User assigned as Reviewer",    
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
                            Hello [[PrimaryReviewerName]] & [[SecondaryReviewerName]],
                        </p>
                        <br>        
                        <p style="margin-top:0;margin-bottom:0;">The new RCSA# [[ScheduleAssessmentCode]] is assigned for you to review. The proposed start date is [[ProposedStartDate]]. Please login to the application for more information.</p>
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
    USER_ASSIGNED_AS_REVIEWER: USER_ASSIGNED_AS_REVIEWER,
  };
  