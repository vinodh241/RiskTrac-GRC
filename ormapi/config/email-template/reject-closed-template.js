const REJECT_CLOSED_CHECKER = {
    REJECT_CLOSED_CHECKER_EMAIL_TEMPLATE: {
      Subject: "Incident Rejected and Closed by the Incident Unit Head : [[CheckerUser]]",
      Body: `<!DOCTYPE html>
      <html>
        <body>
          <head>
            <meta charset="UTF-8">  
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <div>
            <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
              <p style="margin-top:0;margin-bottom:0;">Dear Reportee,<br>
              <p style="margin-top:0;margin-bottom:0;"></p><br>    
              The incident  [[IncidentCode_1]] reported by you is Rejected and Closed by the Incident Unit Head  [[CheckerUser_1]] . Please find the review comment in  the incident form.  <br><br>
              <p style="margin-top:0;margin-bottom:0;"> Kindly discuss with the Admin/Reviewer in case of any clarifications or issues.</p>
              <p style="margin-top:0;margin-bottom:0;"></p><br>    
              Incident Details: <br>
              Incident ID - [[IncidentCode_2]]<br>
              Title: [[IncidentTitle]]<br>
              From the Unit - [[UnitName]]<br>
              Raised by - [[ReporterName_1]] and Reported on [[NewIncidentDate]]<br></p>                     
                <p style="margin-top:0;margin-bottom:0;"><i>You can View the details through this link <a href=[[RISKTRAC_WEB_URL]]>[[RISKTRAC_WEB_URL]]</a></i></p><br>
              </p>
            </div>
          </div>
        </body>
      </html>`
    }
  };

  module.exports = {
    REJECT_CLOSED_CHECKER: REJECT_CLOSED_CHECKER,
  };
  
