import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR PRIVACY POLICY — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple privacy policy for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Purpose of Data Collection: Order processing
// - Data sharing: we do not share the data with any other parties
// - Children's Privacy: we do not collect any data from children
// - Updates to the Privacy Policy: users will be updated by email
// - Contact information: marc@shipfa.st

// Please write a simple privacy policy for my site. Add the current date.  Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>{" "}
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Privacy Policy for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: November 6, 2025

Thank you for using Cuer.io ("we," "us," or "our"). This Privacy Policy explains how we collect, use, and protect your information when you use our URL shortening and QR code generation service at https://cuer.io (the "Service").

By using the Service, you agree to the terms of this Privacy Policy. If you do not agree with these practices, please do not use our Service.

1. Information We Collect

1.1 Personal Information

We collect the following personal information:

- Name: Used to personalize your dashboard and communications
- Email Address: Used for account authentication, service notifications, and account management
- Payment Information: Collected securely through Stripe to process premium subscriptions. We do not store your payment details on our servers.

1.2 Service Data

When you use Cuer.io, we collect:

- URLs you shorten and their associated metadata (titles, click counts)
- QR codes you generate and their target URLs
- Click and scan analytics data
- Usage statistics and performance metrics

1.3 Non-Personal Data

We automatically collect:

- IP addresses
- Browser type and version
- Device information
- Referral sources
- Cookies and similar tracking technologies

This data helps us improve the Service, analyze trends, and enhance your experience.

2. How We Use Your Information

We use your information to:

- Provide and maintain the URL shortening and QR code generation services
- Track analytics for your shortened URLs and QR codes
- Process premium subscription payments
- Send service-related notifications and updates
- Improve and optimize our Service
- Prevent fraud and ensure security
- Comply with legal obligations

3. Data Sharing and Disclosure

We do not sell, rent, or trade your personal information.

We may share your information only in these circumstances:

- With Stripe for payment processing
- With service providers who assist in operating our Service
- When required by law or to protect our rights
- In connection with a business transfer or acquisition

4. Data Security

We implement industry-standard security measures to protect your information, including:

- Encrypted data transmission (HTTPS)
- Secure database storage with Supabase
- Regular security audits
- Access controls and authentication

However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.

5. Your Rights

You have the right to:

- Access your personal data
- Correct inaccurate information
- Delete your account and associated data
- Export your data
- Opt-out of marketing communications

To exercise these rights, contact us at the email below.

6. Data Retention

We retain your information for as long as your account is active or as needed to provide the Service. You may delete your account at any time, and we will remove your data within 30 days, except where required for legal compliance.

7. Cookies

We use cookies to:

- Maintain your session
- Remember your preferences
- Analyze Service usage
- Improve functionality

You can control cookies through your browser settings, but this may affect Service functionality.

8. Children's Privacy

Cuer.io is not intended for users under 13 years of age. We do not knowingly collect information from children. If you believe a child has provided us with personal information, please contact us immediately.

9. Changes to This Policy

We may update this Privacy Policy periodically. We will notify you of significant changes via email or through the Service. Continued use of the Service after changes constitutes acceptance of the updated policy.

10. Contact Us

For questions, concerns, or requests regarding this Privacy Policy:

Email: noreply@cuer.io
Website: https://cuer.io

By using Cuer.io, you consent to this Privacy Policy.`}
        </pre>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
