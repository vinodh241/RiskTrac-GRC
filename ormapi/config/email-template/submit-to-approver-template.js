const SUBMIT_TO_APPROVER = {
 
  SUBMIT_TO_APPROVER_EMAIL_TEMPLATE: {
    Subject: "Incident submitted for Approval/Rejection: [[IncidentCode]]",  
    Body: `<!DOCTYPE html>
    <html>
      <body>
        <head>
          <meta charset="UTF-8">  
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <div>
          <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
            <p style="margin-top:0;margin-bottom:0;">Dear Approver,<br><br>
            An incident was reviewed and Resubmitted for your approval or rejection.<br><br>
            Incident Details: <br><br>
            Incident ID   - [[IncidentCode_1]]<br>
            Title         - [[IncidentTitle]]<br>
            From the Unit - [[UnitName]]<br>
            Raised by     - [[ReporterName]] Reported on - [[NewIncidentDate]]<br></p>   
            <p style="margin-top:0;margin-bottom:0;"></p><br>                     
            <p style="margin-top:0;margin-bottom:0;">
              <p style="margin-top:0;margin-bottom:0;"><i>You can review and submit the required details/actions through this link<a href=[[RISKTRAC_WEB_URL]]>RISKTRAC_WEB_URL</a></i></p><br>
              <p style="margin-top:0;margin-bottom:0;">Kindly discuss with the relevant parties in case of any clarifications.</p>
            </p>
          </div>
        </div>
      </body>
    </html>`
  }
};

module.exports = {
  SUBMIT_TO_APPROVER: SUBMIT_TO_APPROVER,
};
