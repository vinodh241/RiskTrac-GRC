const SEND_EMAIL_MANUALLY_RCSA = {
  
    SEND_EMAIL_MANUALLY_RCSA_EMAIL_TEMPLATE: {
      Subject: " RCSA #[[ScheduleAssessmentCode]] Pending for Submission",    
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
                            Dear Users,
                        </p>
                        <br>        
                        <p style="margin-top:0;margin-bottom:0;">
                        The RCSA #[[ScheduleAssessmentCode]] is assigned to you has been pending for submission/closure  beyond the defined target date. Requesting you to Submit the same..
                        
                        </p>
                        <br>    
                        <p style="margin-top:0;margin-bottom:0;">
                            From the Unit - [[RCSAPendingUnitName]]<br>
                            Assessment Quarter - [[SchedulePeriod]] StartDate: [[ProposedStartDate]] EndDate: [[ProposedCompletionDate]]<br><br>
                            You can review the details through this link <a href=[[RISKTRAC_WEB_URL]]>RISKTRAC_WEB_URL</a>
                        </p>
                        <br> 
                        <p style="margin-top:0;margin-bottom:0;">Kindly discuss with relevant parties in case any clarifications.</p><br>
                        -- This is an auto-generated email
                        From,
                    RiskTrac Application.
                        </div>
                    </div>
                </body>
            </html>`
    }
  };
  
  module.exports = {
    SEND_EMAIL_MANUALLY_RCSA: SEND_EMAIL_MANUALLY_RCSA,
  };
  