const SELF_SCROING = {
  
  SELF_SCORING_EMAIL_TEMPLATE: {
    Subject: "Self Scoring Submit",    
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
                      Risk Assessment self assessment has been submitted by unit.</p><br>        
                  <p style="margin-top:0;margin-bottom:0;"><b>NOTE:</b> You can view the submitted assessments by navigating to the Risk Appetite Menu and then View Submitted Risk Assessments</p><br>    
                </div>
              </div>
            </body>
          </html>`
  }
};

module.exports = {
  SELF_SCROING: SELF_SCROING,
};
