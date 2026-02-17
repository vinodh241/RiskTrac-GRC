const KRI_BUTTON_REPORTING = {

  KRI_BUTTON_EMAIL_TEMPLATE: {
    Subject: "Report-KRI  has been enabled to Report for Current Quarter [[QuarterID]]",
    Body: `<!DOCTYPE html>
            <html>
              <body>
                <head>
                  <meta charset="UTF-8">  
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <div>
                  <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                    <p style="margin-top:0;margin-bottom:0;">Dear,<br><br>
                    "Report-KRI" has been enabled to Report for Current Quarter [[QuarterID]]. <br><br> 
                    Kindly take the Measurements and Report the same.</p><br>    
                    <p style="margin-top:0;margin-bottom:0;"></p>                     
                    <p style="margin-top:0;margin-bottom:0;">
                      For the Unit(s) - [[UnitName]]<br><br>
                      <p style="margin-top:0;margin-bottom:0;">
                        You can view the details through this link - <a href="[[RISKTRAC_WEB_URL]]">[[RISKTRAC_WEB_URL]]</a><br><br>
                        Kindly discuss with the relevant parties in case of any clarifications.
                      </p>
                    </p>
                  </div>
                </div>
              </body>
            </html>`
  }
};

module.exports = {
  KRI_BUTTON_REPORTING: KRI_BUTTON_REPORTING,
};
