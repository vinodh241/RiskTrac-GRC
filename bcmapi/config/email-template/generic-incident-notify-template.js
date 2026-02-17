const NOTIFY_INCIDENT = {
    NOTIFY_INC_TEMPLATE: {
          Subject: "[[subject_text]] : [[IncidentCode]]",
          Body: `<!DOCTYPE html>
          <html>
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body>
              <div>
                  <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                      <p style="margin-top:0;margin-bottom:0;">
                          Dear user,<br><br>
                          [[body_text]].Please find the required details below :-<br><br>
                          Incident details: <br>
                          <table border="1" cellpadding="5" cellspacing="0">
                              <tr>
                                  <th>Incident Name</th>
                                  <th style="width: 20%;">Incident Code</th>
                                  <th style="width: 15%;">Start Date</th>
                                  <th style="width: 15%;">End Date</th>
                              </tr>
                              <tr>
                                  <td>[[IncidentName]]</td>
                                  <td style="text-align: center;">[[IncidentCode]]</td>
                                  <td style="text-align: center;">[[StartDate]]</td>
                                  <td style="text-align: center;">[[EndDate]]</td>
                              </tr>
                              </table><br><br>
                          <p style="margin-top:0;margin-bottom:0;"><i>You can review the details through this link <a href="[[RISKTRAC_WEB_URL]]">RISKTRAC_WEB_URL</a></i></p><br>
                      </p>
                  </div>
              </div>
          </body>
          </html>`
      }
  };
  
  module.exports = {
    NOTIFY_INCIDENT: NOTIFY_INCIDENT,
  };
  