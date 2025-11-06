import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Contact information: marc@shipfa.st
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - Ownership: when buying a package, users can download code to create apps. They own the code but they do not have the right to resell it. They can ask for a full refund within 7 day after the purchase.
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://shipfa.st/privacy-policy
// - Governing Law: France
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
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
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Terms and Conditions for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: November 6, 2025

Welcome to Cuer.io!

These Terms of Service ("Terms") govern your use of Cuer.io at https://cuer.io ("Service") and all related services. By accessing or using our Service, you agree to be bound by these Terms.

1. Service Description

Cuer.io is a URL shortening and QR code generation service. We provide:

- Free URL shortening with public access
- Free QR code generation with public access
- Premium dashboard access with analytics and asset management
- Click and scan tracking
- Custom titles and metadata for your links

2. Account and Registration

2.1 Account Creation

To access premium features, you must create an account. You agree to:

- Provide accurate and complete information
- Maintain the security of your account credentials
- Notify us immediately of any unauthorized access
- Be responsible for all activities under your account

2.2 Age Requirement

You must be at least 13 years old to use this Service.

3. Acceptable Use Policy

You agree NOT to use Cuer.io to:

- Share malicious, illegal, or harmful content
- Distribute spam, phishing links, or malware
- Violate intellectual property rights
- Harass, threaten, or harm others
- Circumvent our security measures
- Create misleading or deceptive shortened URLs
- Violate any applicable laws or regulations

We reserve the right to suspend or terminate accounts that violate these policies.

4. Premium Subscription

4.1 Premium Features

Premium subscribers gain access to:

- Personal dashboard with full analytics
- Management of all shortened URLs
- Management of all generated QR codes
- Detailed click and scan tracking
- Unlimited asset management

4.2 Payment and Billing

- Premium subscriptions are billed through Stripe
- Subscription fees are non-refundable except as required by law
- You may cancel your subscription at any time
- Upon cancellation, access to premium features ends at the end of the billing period

4.3 Price Changes

We reserve the right to modify subscription prices with 30 days notice to existing subscribers.

5. Intellectual Property

5.1 Service Content

Cuer.io and its original content, features, and functionality are owned by Cuer.io and are protected by international copyright, trademark, and other intellectual property laws.

5.2 Your Content

You retain ownership of URLs and QR codes you create. By using our Service, you grant us a license to:

- Store and display your shortened URLs and QR codes
- Track analytics related to your links
- Display aggregated, anonymized usage statistics

6. Service Availability

We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. We reserve the right to:

- Modify or discontinue features with notice
- Perform maintenance and updates
- Suspend service for security or legal reasons

7. Termination

We may suspend or terminate your account if you:

- Violate these Terms
- Engage in fraudulent activity
- Create risk or legal exposure for Cuer.io
- Request account deletion

Upon termination, your right to use the Service ceases immediately.

8. Disclaimer of Warranties

The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind. We do not warrant that:

- The Service will be error-free or uninterrupted
- Defects will be corrected
- The Service is free of viruses or harmful components

9. Limitation of Liability

To the maximum extent permitted by law, Cuer.io shall not be liable for:

- Indirect, incidental, or consequential damages
- Loss of profits, data, or goodwill
- Service interruptions or data loss
- Third-party actions or content

Our total liability shall not exceed the amount you paid for premium services in the past 12 months.

10. Indemnification

You agree to indemnify and hold Cuer.io harmless from any claims, damages, or expenses arising from:

- Your use of the Service
- Your violation of these Terms
- Your violation of any third-party rights
- Content you share through shortened URLs

11. Privacy

Your use of Cuer.io is also governed by our Privacy Policy, available at https://cuer.io/privacy-policy. Please review it to understand our data practices.

12. Governing Law

These Terms are governed by the laws of the United States. Any disputes shall be resolved in the courts of the jurisdiction where Cuer.io operates.

13. Changes to Terms

We may modify these Terms at any time. We will notify users of significant changes via:

- Email to registered users
- Notice on the Service
- Updated "Last Updated" date

Continued use after changes constitutes acceptance of modified Terms.

14. Contact Information

For questions or concerns about these Terms:

Email: noreply@cuer.io
Website: https://cuer.io

15. Severability

If any provision of these Terms is found unenforceable, the remaining provisions will continue in full effect.

16. Entire Agreement

These Terms, along with our Privacy Policy, constitute the entire agreement between you and Cuer.io regarding use of the Service.

Thank you for using Cuer.io!`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;
