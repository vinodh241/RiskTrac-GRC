const REVIEW_REJECTION = {
 
  REVIEW_REJECTION_EMAIL_TEMPLATE: {
    Subject: "Risk Metrics Rejection",    
    Body: `<!DOCTYPE html>
          <html>
            <body>
              <head>
                <meta charset="UTF-8">  
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <div>
                <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                  <p style="margin-top:0;margin-bottom:0;">The Risk Appetite assessment submitted by your unit has been rejected by the Reviewer. Please review and re-submit the assessment</p><br>    
                  <p style="margin-top:0;margin-bottom:0;"></p><br>                     
                  <p style="margin-top:0;margin-bottom:0;"><b>
                    <u>NOTE:</u><br>
                    <p style="margin-top:0;margin-bottom:0;"><b></b>Kindly discuss with the Admin/Reviewer in case of any clarifications or issues.</p></b>
                  </p>
                </div>
              </div>
            </body>
          </html>`
  }
};

module.exports = {
  REVIEW_REJECTION: REVIEW_REJECTION,
};
