const GENERIC_RMT = {
    GENERIC_RMT_TEMPLATE: {
          Subject: "[[subject_text]] for module - [[BCMModuleName]] ([[ActionItemSource]])",
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
                          [[body_text]].<br><br>
                          Action Item details: <br>
  
                          <table border="1" cellpadding="5" cellspacing="0">
                              <tr>
                                  <th>Action Item Name</th>
                                  <th style="width: 20%;">Module Name</th>
                                  <th>Source</th>
                                  <th style="width: 15%;">Start Date</th>
                                  <th style="width: 15%;">Target Date</th>
                              </tr>
                              <tr>
                                  <td>[[IdentifiedActionItem]]</td>
                                  <td style="text-align: center;">[[BCMModuleName]]</td>
                                  <td style="text-align: center;">[[ActionItemSource]] </td>
                                  <td style="text-align: center;">[[StartDate]]</td>
                                  <td style="text-align: center;">[[EndDate]]</td>
                              </tr>
                              </table><br>
                            [[Note]]
                          <p style="margin-top:0;margin-bottom:0;"><i>You can review the details through this link <a href="[[RISKTRAC_WEB_URL]]">RISKTRAC_WEB_URL</a></i></p><br>
                          <p style="margin-top:0;margin-bottom:0;"> Kindly discuss with the relevant parties in case of any clarifications.</p><br>
                      </p>
                  </div>
              </div>
          </body>
          </html>`
      }
  };
  
  module.exports = {
    GENERIC_RMT: GENERIC_RMT,
  };
  