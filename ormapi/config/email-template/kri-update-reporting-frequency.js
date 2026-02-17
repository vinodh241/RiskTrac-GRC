const KRI_UPDATE_REPORTING = { 
    KRI_UPDATE_REPORTING_EMAIL_TEMPLATE: {
      Subject: "KRI reporting frequency has been changed.",    
      Body: `<!DOCTYPE html>
      <html>
          <body>
          <head>
              <meta charset="UTF-8">  
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <div>
                <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                <p style="margin-top:0;margin-bottom:0;">Dear,<br> 
                KRI reporting frequency has been changed from current frequency <strong>[[CurrentReportingFrequency]]</strong> to new frequency <strong>[[NewReportingFrequency]]</strong>.<br>
                Requesting you to provide the KRI Measurement and report the KRI(s) for the new frequency  <strong>[[NewReportingFrequency_1]]</strong>.<br><br>
                For the Unit(s): [[KRIUnits]]<br><br>
                <p style="margin-top:0;margin-bottom:0;"><i>You can review the details through this link <a href="[[RISKTRAC_WEB_URL]]">RISKTRAC_WEB_URL</a></i></p><br>                  
                <p style="margin-top:0;margin-bottom:0;">
                <p style="margin-top:0;margin-bottom:0;">Kindly discuss with the relevant parties in case of any clarifications.</p><br>
                </p>
                </div>
          </div>
          </body>
      </html>`
    }
  };
  
  module.exports = {
    KRI_UPDATE_REPORTING: KRI_UPDATE_REPORTING,
  };
  