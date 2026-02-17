const ASSESSMENT_TEMPLATES = {
  SCHEDULE_ASSESSMENT_EMAIL_TEMPLATE: {
    Subject: "Risk Assessment ([[FrameworkName]]) Pending for Submission",
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
                        <p style="margin-top:0;margin-bottom:0;">A Risk Assessment under framework ([[FrameworkName_1]]) has been pending for submission/closure  beyond the defined target date. Requesting you to Submit the same.</p>
                        <br>    
                        <p style="margin-top:0;margin-bottom:0;">
                            Title: [[FrameworkName_2]]<br>
                            From the Unit: [[UnitName]]<br>
                            Assessment Quarter: Q[[Quater]]-[[Year]]<br>, Assessment StartDate: [[StartDate]]<br>, Assessment EndDate: [[EndDate]]<br><br>
                            You can review the details through this link <a href=[[RISKTRAC_WEB_URL]]>RISKTRAC_WEB_URL</a>
                        </p>
                        <br><br>
                        <p style="margin-top:0;margin-bottom:0;">Kindly discuss with relevant parties in case of any clarifications.</p>
                        </div>
                    </div>
                </body>
            </html>`
        }
};

module.exports = {
  ASSESSMENT_TEMPLATES: ASSESSMENT_TEMPLATES,
};
