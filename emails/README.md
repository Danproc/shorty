# Email Templates for Cuer.io

This directory contains all the email templates used by Cuer.io.

## Email Types

### 1. Membership/Subscription Emails (via Resend)

These are sent automatically via the Stripe webhook when subscription events occur:

- **WelcomeEmail.js** - Sent when a user completes checkout and subscribes
- **SubscriptionRenewalEmail.js** - Sent when a subscription is renewed
- **SubscriptionCancelledEmail.js** - Sent when a subscription is cancelled

These are automatically sent by the Stripe webhook handler in `/app/api/webhook/stripe/route.js`.

### 2. Auth Emails (via Supabase)

These need to be configured in your Supabase dashboard:

- **magic-link.html** - Email with magic link for sign-in
- **confirm-signup.html** - Email confirmation for new account signups

## Setup Instructions

### Resend Setup (Already Complete)

The Resend integration is already configured in `/libs/resend.js`. The membership emails are sent automatically via the Stripe webhook.

### Supabase Auth Email Setup

To use the branded auth email templates:

1. **Go to your Supabase Dashboard**
   - Navigate to: Authentication → Email Templates

2. **Update the Magic Link Template**
   - Click on "Magic Link" template
   - Copy the contents of `supabase-templates/magic-link.html`
   - Paste it into the template editor
   - Save changes

3. **Update the Confirm Signup Template**
   - Click on "Confirm Signup" template
   - Copy the contents of `supabase-templates/confirm-signup.html`
   - Paste it into the template editor
   - Save changes

4. **Important Supabase Variables**

   Supabase provides these template variables that are already used in the templates:
   - `{{ .ConfirmationURL }}` - The confirmation/magic link URL
   - `{{ .Token }}` - The confirmation token (if needed)
   - `{{ .TokenHash }}` - The hashed token (if needed)
   - `{{ .SiteURL }}` - Your site URL

5. **Configure Email Settings**

   In Supabase Dashboard → Authentication → Email Auth:
   - Set "Site URL" to your production domain (e.g., https://cuer.io)
   - Set "Redirect URLs" to include your auth callback URL (e.g., https://cuer.io/api/auth/callback)

6. **Test Your Emails**

   After setting up:
   - Try signing in with magic link from your app
   - Check that the email arrives with proper branding
   - Verify that the link works correctly

## Customization

### Changing Colors

The primary brand color is `#3ECF8E` (green). To change it:

1. Search and replace `#3ECF8E` with your desired color
2. Update the gradient colors in the header sections
3. Ensure sufficient contrast for accessibility

### Changing Logo

The current logo is a simple "Q" letter. To use an image instead:

1. Upload your logo to a CDN or public URL
2. Replace the logo div with an `<img>` tag:
   ```html
   <img src="YOUR_LOGO_URL" alt="Cuer.io" style="width: 80px; height: auto;">
   ```

### Changing Text

All text content can be customized directly in the template files. For JavaScript templates (WelcomeEmail.js, etc.), the `config.appName` and `config.appDescription` are automatically pulled from `/config.js`.

## Testing Emails Locally

To test emails during development:

1. Use a service like [Mailtrap](https://mailtrap.io/) or [MailHog](https://github.com/mailhog/MailHog)
2. Update your `.env` with test SMTP credentials
3. Trigger the email event (e.g., complete a test checkout)

## Email Deliverability Tips

1. **Configure SPF/DKIM** - Set up proper email authentication in Resend
2. **Use Custom Domain** - Send from your own domain (noreply@cuer.io)
3. **Avoid Spam Triggers** - Don't use excessive caps, exclamation marks, or spammy words
4. **Include Unsubscribe** - Add unsubscribe links for marketing emails (not required for transactional)
5. **Test Before Sending** - Always test emails before deploying to production

## Support

If you have questions about the email setup, check:
- [Resend Documentation](https://resend.com/docs)
- [Supabase Email Templates Docs](https://supabase.com/docs/guides/auth/auth-email-templates)
