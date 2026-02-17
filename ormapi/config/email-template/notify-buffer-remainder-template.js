const NOTIFY_BUFFER_REMAINDER_TEMPLATE = {
    NOTIFY_BUFFER_REMAINDER_TEMPLATE: {
        Subject: "Buffer Remainder Notification Email",
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
                            This is a gentle reminder to please submit the Key Risk Indicators (KRIs) for the current reporting cycle as we are approaching the deadline.
                            
                        <br> 
						<br>						
                        <p style="margin-top:0;margin-bottom:0;">
                            If you have already submitted the KRIs, kindly disregard this message.
                        </p>
                        <br> 
                        <p style="margin-top:0;margin-bottom:0;">Thank you for your attention and cooperation.</p>
						<p style="margin-top:0;margin-bottom:0;">Regards,</p>
						<p style="margin-top:0;margin-bottom:0;">RiskTrac team</p>
                        </div>
                    </div>
                </body>
            </html>`
    }
};

module.exports = {
    NOTIFY_BUFFER_REMAINDER_TEMPLATE: NOTIFY_BUFFER_REMAINDER_TEMPLATE,
};
