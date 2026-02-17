const SUBMIT_CHECKER = {
    SUBMIT_CHECKER_EMAIL_TEMPLATE: {
      Subject: "Incident submitted for Approval/Rejection : [[IncidentCode]]",
      Body: `<!DOCTYPE html>
      <html>
        <body>
          <head>
            <meta charset="UTF-8">  
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <div>
            <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
              <p style="margin-top:0;margin-bottom:0;">Dear Reviewer,<br>
              An Incident was submitted for your approval or rejection. <br><br>
              <p style="margin-top:0;margin-bottom:0;"> Kindly discuss with the Admin/Reviewer in case of any clarifications or issues.</p>
              Incident Details: <br>
              Incident ID - [[IncidentCode_2]]<br>
              Title: [[IncidentTitle]]<br>
              From the Unit - [[UnitName]]<br>
              Raised by - [[ReporterName]] and Reported on [[NewIncidentDate]]<br></p>    
              <p style="margin-top:0;margin-bottom:0;"></p><br>                     
              <p style="margin-top:0;margin-bottom:0;">
                <p style="margin-top:0;margin-bottom:0;"><i>You can View the details through this link <a href=[[RISKTRAC_WEB_URL]]>[[RISKTRAC_WEB_URL]]</a></i></p><br>
              </p>
            </div>
          </div>
        </body>
      </html>`
    }
  };
  module.exports = {
    SUBMIT_CHECKER: SUBMIT_CHECKER,
  };
  
