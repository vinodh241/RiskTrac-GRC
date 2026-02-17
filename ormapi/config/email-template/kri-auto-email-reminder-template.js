const KRI_AUTO_REMINDER_TEMPLATE = {
    KRI_AUTO_EMAIL_REMINDER_TEMPLATE: {
      Subject: "KRIs for Unit - [[UnitName]] has been Reset in current Quarter - [[Period]]",
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
                        <p style="margin-top:0;margin-bottom:0;">
                            KRIs ([[KRI_CODE]]) for your unit - [[UnitName]]  are pending to be reported for the reporting frequency [[MeasurementFrequency]] 
                            for [[Period]].  <br>  Kindly take the measurements and report the same.
                            
                        <br>    
                        <p style="margin-top:0;margin-bottom:0;">
                            From the Unit: [[UnitName_1]]<br><br>
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
    KRI_AUTO_REMINDER_TEMPLATE: KRI_AUTO_REMINDER_TEMPLATE,
  };
  