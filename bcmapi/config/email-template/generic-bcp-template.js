const GENERIC_BCP = {
    GENERIC_BCP_TEMPLATE: {
          Subject: "[[body_text]]",
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
                          BCP details: <br>
  
                          <table border="1" cellpadding="5" cellspacing="0">
                              <tr>
                                  <th style="width: 35%;">Business Function</th>
                                  <th style="width: 35%;">Business Group</th>
                                  <th>Business Owner</th>
                              </tr>
                              <tr>
                                  <td style="text-align: center;">[[Name]]</td>
                                  <td style="text-align: center;">[[Group]] </td>
                                  <td style="text-align: center;">[[BusinessOwner]]</td>
                              </tr>
                              </table><br>
  
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
    GENERIC_BCP: GENERIC_BCP,
  };
  