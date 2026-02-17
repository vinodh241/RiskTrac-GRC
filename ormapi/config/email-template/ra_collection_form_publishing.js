const RA_COLLECTION_FORM_PUBLISHING = {
  
    RA_COLLECTION_FORM_PUBLISHING_TEMPLATE: {
      Subject: "Risk Assessment [[Name]] has been initiated",    
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
                        <p style="margin-top:0;margin-bottom:0;">A Risk Assessment under framework [[Name]] has been initiated for your unit. Request you to complete it as per the schedule.</p>
                        <br>    
                        <p style="margin-top:0;margin-bottom:0;">
                            Title: [[Name]]<br>
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
    RA_COLLECTION_FORM_PUBLISHING: RA_COLLECTION_FORM_PUBLISHING,
  };