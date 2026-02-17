const ASSESSMENT_TEMPLATES = {
  UPDATE_ASSESSMENT_EMAIL_TEMPLATE: {
    Subject: "Update Assessment",
    Body: `<!DOCTYPE html>
          <html>
            <head>
              <style>
                .text-color{color:#33FF33}
              </style>
            </head>
            <body>
              <p> Please note that there has been update to the Assessment.</p>
            </body>
          </html>`
  }
};

module.exports = {
  ASSESSMENT_TEMPLATES: ASSESSMENT_TEMPLATES,
};

