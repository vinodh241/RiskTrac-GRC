const GENERIC_SRA = {
  GENERIC_SRA_TEMPLATE: {
        Subject: "[[subject_text]] : [[AssessmentCode]]",
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
                        Dear user,<br>
                        [[body_text]]<br><br>
                        Assessment details: <br>

                        <table border="1" cellpadding="5" cellspacing="0">
                            <tr>
                                <th>Assessment Name</th>
                                <th style="width: 20%;">Assessment Code</th>
                                <th style="width: 15%;">Start Date</th>
                                <th style="width: 15%;">End Date</th>
                            </tr>
                            <tr>
                                <td>[[AssessmentName]]</td>
                                <td style="text-align: center;">[[AssessmentCode]]</td>
                                <td style="text-align: center;">[[StartDate]]</td>
                                <td style="text-align: center;">[[EndDate]]</td>
                            </tr>
                            </table><br><br>

                            <p>[[Note]]</p>
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
  GENERIC_SRA: GENERIC_SRA,
};
