import config from "@/config";

export const SubscriptionCancelledEmail = ({ userName, email, endDate }) => {
  const baseUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `https://${config.domainName}`;

  return {
    subject: `Your ${config.appName} subscription has been cancelled`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Cancelled</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); padding: 40px 40px 60px 40px; text-align: center;">
              <div style="width: 80px; height: 80px; background-color: rgba(255, 255, 255, 0.2); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <span style="font-size: 48px; font-weight: bold; color: #ffffff;">Q</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Subscription Cancelled</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">We're sorry to see you go</h2>

              <p style="margin: 0 0 20px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Your ${config.appName} subscription has been cancelled. Your access will remain active until the end of your current billing period.
              </p>

              ${endDate ? `
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.6;">
                  <strong>Access Until:</strong> ${endDate}
                </p>
              </div>
              ` : ''}

              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin: 30px 0;">
                <h3 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 18px; font-weight: 600;">What happens next?</h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #4a4a4a; font-size: 15px; line-height: 1.8;">
                  <li>Your dashboard access will remain active until ${endDate || 'the end of your billing period'}</li>
                  <li>All your data will be preserved</li>
                  <li>You can reactivate anytime with one click</li>
                  <li>No further charges will be made</li>
                </ul>
              </div>

              <p style="margin: 0 0 20px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Changed your mind? You can reactivate your subscription anytime from your billing page.
              </p>

              <div style="text-align: center; margin: 40px 0 20px 0;">
                <a href="${baseUrl}/pricing" style="display: inline-block; background-color: #3ECF8E; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                  Reactivate Subscription
                </a>
              </div>

              <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                We'd love to hear your feedback! Reply to this email and let us know how we can improve.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                <strong>${config.appName}</strong>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                You received this email because your subscription status changed.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `Subscription Cancelled

Your ${config.appName} subscription has been cancelled. Your access will remain active until the end of your current billing period.

${endDate ? `Access Until: ${endDate}` : ''}

What happens next?
- Your dashboard access will remain active until ${endDate || 'the end of your billing period'}
- All your data will be preserved
- You can reactivate anytime with one click
- No further charges will be made

Changed your mind? You can reactivate your subscription anytime: ${baseUrl}/pricing

We'd love to hear your feedback! Reply to this email and let us know how we can improve.

${config.appName}
`
  };
};
