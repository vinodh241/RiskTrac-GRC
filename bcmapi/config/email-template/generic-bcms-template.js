const NOTIFY_BCMS = {
    NOTIFY_BCMS_TEMPLATE: {
          Subject: "[[subject_text]]",
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
                          Dear [[recipients]],<br><br>
                          Please find the required details below :-<br><br>
                          Test Assessment Details: <br>
                          <table border="1" cellpadding="5" cellspacing="0">
                              <tr>
                                  <th>BCMS Test Name</th>
                                  <th style="width: 20%;">Actual Start Date</th>
                                  <th style="width: 15%;">Actual End Date</th>
                              </tr>
                              <tr>
                                  <td>[[TestName]]</td>
                                  <td style="text-align: center;">[[ActualStartDate]]</td>
                                  <td style="text-align: center;">[[ActualEndDate]]</td>
                              </tr>
                              </table><br><br>
                           <p>Note: [[note_text]]</p><br><br>  
                          <p style="margin-top:0;margin-bottom:0;"><i>You can view the details through this link <a href="[[RISKTRAC_WEB_URL]]">RISKTRAC_WEB_URL</a></i></p><br>
                      </p>
                  </div>
              </div>
          </body>
          </html>`
      }
  };
  
  module.exports = {
    NOTIFY_BCMS: NOTIFY_BCMS,
  };
  