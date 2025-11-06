import config from "@/config";

export const WelcomeEmail = ({ userName, email }) => {
  const baseUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `https://${config.domainName}`;

  return {
    subject: `Welcome to ${config.appName}! 🎉`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${config.appName}</title>
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
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Welcome to ${config.appName}!</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">You're all set! 🚀</h2>

              <p style="margin: 0 0 20px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Thank you for subscribing to ${config.appName}! You now have full access to your personal dashboard and all premium features.
              </p>

              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin: 30px 0;">
                <h3 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 18px; font-weight: 600;">What you can do now:</h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #4a4a4a; font-size: 15px; line-height: 1.8;">
                  <li>Access your personal dashboard</li>
                  <li>Create and track unlimited short URLs</li>
                  <li>Generate custom QR codes</li>
                  <li>Convert markdown to HTML</li>
                  <li>View detailed analytics</li>
                </ul>
              </div>

              <div style="text-align: center; margin: 40px 0 20px 0;">
                <a href="${baseUrl}/dashboard" style="display: inline-block; background-color: #3ECF8E; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; transition: background-color 0.2s;">
                  Go to Dashboard
                </a>
              </div>

              <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                If you have any questions or need help getting started, just reply to this email. We're here to help!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                <strong>${config.appName}</strong>
              </p>
              <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 13px;">
                ${config.appDescription}
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                You received this email because you subscribed to ${config.appName}.
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
    text: `Welcome to ${config.appName}!

Thank you for subscribing! You now have full access to your personal dashboard and all premium features.

What you can do now:
- Access your personal dashboard
- Create and track unlimited short URLs
- Generate custom QR codes
- Convert markdown to HTML
- View detailed analytics

Go to your dashboard: ${baseUrl}/dashboard

If you have any questions or need help getting started, just reply to this email.

${config.appName}
${config.appDescription}
`
  };
};
