
const GENERIC_A = {

  GENERIC_A_TEMPLATE: {
    Subject: "Generic Mail A",
    Body: `<!DOCTYPE html>
            <html>
              <body>
                <head>
                  <meta charset="UTF-8">  
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <div>
                  <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                    <p style="margin-top:0;margin-bottom:0;">Name: {{name}}  </p><br>    
                    <p style="margin-top:0;margin-bottom:0;">Age: {{age}} </p><br>                     
                    <p style="margin-top:0;margin-bottom:0;"><b>
                      <br>
                      <p style="margin-top:0;margin-bottom:0;"><b></b>Details: {{details}}  </p></b>
                    </p>
                  </div>
                </div>
              </body>
            </html>`
  }
};


module.exports = {
  GENERIC_A: GENERIC_A,
};