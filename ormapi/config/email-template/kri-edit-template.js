const EDIT_KRI_TEMPLATE = {
    EDIT_KRI_EMAIL_TEMPLATE: {
      Subject: "KRI [[KRICode]] modified for your unit",
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
                        <p style="margin-top:0;margin-bottom:0;">A KRI [[KRICode]] has been modified for your unit. Request you to review and Submit the details.</p>
                        <br>    
                        <p style="margin-top:0;margin-bottom:0;">
                            Title: [[KRIType]]<br>
                            From the Unit: [[UnitName]]<br><br>
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
    EDIT_KRI_TEMPLATE: EDIT_KRI_TEMPLATE,
  };