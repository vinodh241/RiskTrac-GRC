const RA_COLLECTION_FORM_REJECTION = {
  
    RA_COLLECTION_FORM_REJECTION_EMAIL_TEMPLATE: {
      Subject: "Assessment ([[FrameworkName]]) has been rejected",    
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
                        <p style="margin-top:0;margin-bottom:0;">A Risk Assessment under framework ([[FrameworkName_1]]) submitted by your unit has been rejected. Kindly review the same and resubmit the details.</p>
                        <br>    
                        <p style="margin-top:0;margin-bottom:0;">
                            Title: [[FrameworkName_2]]<br>
                            Unit Name: [[UnitName]]
                            Assessment Quarter - StartDate: [[StartDate]] EndDate: [[EndDate]]<br><br>
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
    RA_COLLECTION_FORM_REJECTION: RA_COLLECTION_FORM_REJECTION,
  };