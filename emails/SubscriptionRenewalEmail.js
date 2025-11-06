import config from "@/config";

export const SubscriptionRenewalEmail = ({ userName, email, amount, nextBillingDate }) => {
  const baseUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `https://${config.domainName}`;

  return {
    subject: `Your ${config.appName} subscription has been renewed`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Renewed</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #3ECF8E 0%, #2ab378 100%); padding: 40px 40px 60px 40px; text-align: center;">
              <div style="width: 80px; height: 80px; background-color: rgba(255, 255, 255, 0.2); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <span style="font-size: 48px; font-weight: bold; color: #ffffff;">Q</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Subscription Renewed</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">Thank you! 💚</h2>

              <p style="margin: 0 0 20px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Your ${config.appName} subscription has been successfully renewed. You continue to have full access to all premium features.
              </p>

              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin: 30px 0;">
                <h3 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 18px; font-weight: 600;">Payment Summary</h3>
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: #6b7280; font-size: 15px;">Amount Paid:</td>
                    <td style="color: #1a1a1a; font-size: 15px; font-weight: 600; text-align: right;">$${amount || '7.00'}</td>
                  </tr>
                  ${nextBillingDate ? `
                  <tr>
                    <td style="color: #6b7280; font-size: 15px;">Next Billing Date:</td>
                    <td style="color: #1a1a1a; font-size: 15px; font-weight: 600; text-align: right;">${nextBillingDate}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <div style="text-align: center; margin: 40px 0 20px 0;">
                <a href="${baseUrl}/dashboard" style="display: inline-block; background-color: #3ECF8E; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; margin-right: 10px;">
                  Go to Dashboard
                </a>
                <a href="${baseUrl}/dashboard/billing" style="display: inline-block; background-color: #ffffff; color: #3ECF8E; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; border: 2px solid #3ECF8E;">
                  Manage Billing
                </a>
              </div>

              <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                If you have any questions about your subscription or billing, feel free to reply to this email.
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
                You received this email because you have an active subscription with ${config.appName}.
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
    text: `Subscription Renewed

Your ${config.appName} subscription has been successfully renewed. You continue to have full access to all premium features.

Payment Summary:
Amount Paid: $${amount || '7.00'}
${nextBillingDate ? `Next Billing Date: ${nextBillingDate}` : ''}

Go to your dashboard: ${baseUrl}/dashboard
Manage billing: ${baseUrl}/dashboard/billing

If you have any questions about your subscription or billing, feel free to reply to this email.

${config.appName}
`
  };
};
