const KRI_UNREPORTED_EMAIL_TEMPLATE = {
    KRI_UNREPORTED_EMAIL: {
        Subject: "Unreported KRIs for - [[Period]]",
        Body: `<!DOCTYPE html>
                <html>
                <body>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <div>
                        <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                        <p style="margin-top:0;margin-bottom:0;"> 
                            Dear Team,
                        </p>
                        <br>        
                        <p style="margin-top:0;margin-bottom:0;">
                            We observed the following KRIs from your unit remain unreported for the period ending [[Period]]:
                        </p> 
                        <br>
                        <ul style="margin-top:0;margin-bottom:0;">
							<li>[[UnitName]] - [[KRICode]]</li>
						</ul>
                        <br> 
                        <p style="margin-top:0;margin-bottom:0;">
                            You can review the details through this link <a href=[[RISKTRAC_WEB_URL]]>RISKTRAC_WEB_URL</a>
                        </p>
                        <br>
                        <p style="margin-top:0;margin-bottom:0;">Please ensure that all KRIs are submitted within the designated timelines in future reporting cycles.</p>
						<br>
						<p style="margin-top:0;margin-bottom:0;">Regards,</p>
						<p style="margin-top:0;margin-bottom:0;">RiskTrac team</p>
                        </div>
                    </div>
                </body>
            </html>`
    }
};

module.exports = {
    KRI_UNREPORTED_EMAIL_TEMPLATE: KRI_UNREPORTED_EMAIL_TEMPLATE,
};
