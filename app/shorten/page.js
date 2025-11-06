import { Suspense } from 'react'
import Link from 'next/link'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import URLShortenerForm from "@/components/URLShortenerForm";
import { getSEOTags } from "@/libs/seo";
import { createClient } from "@/libs/supabase/server";
import { checkSubscription } from "@/libs/subscription";

export const metadata = getSEOTags({
  title: "Free URL Shortener - Create Short Links Instantly | Cuer.io",
  description: "Free URL shortener tool to create short, memorable links instantly. Shorten long URLs, track clicks, and share easily. No signup required. Fast and secure link shortening.",
  keywords: ["url shortener", "shorten url", "short link", "link shortener", "free url shortener", "tiny url", "custom short link", "link tracking", "shorten link"],
  canonicalUrlRelative: "/shorten",
  openGraph: {
    title: "Free URL Shortener - Create Short Links | Cuer.io",
    description: "Transform long URLs into short, memorable links. Free, fast, and no signup required.",
    url: "https://cuer.io/shorten",
  },
});

export default async function ShortenPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasAccess = false;
  if (user) {
    const { hasAccess: userHasAccess } = await checkSubscription(user.id);
    hasAccess = userHasAccess;
  }

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FREE URL Shortener",
    "applicationCategory": "BusinessApplication",
    "description": "Free URL shortener to create short, memorable links instantly. Shorten long URLs with click tracking and analytics.",
    "url": "https://cuer.io/shorten",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Free URL shortening",
      "Instant short link generation",
      "Click tracking and analytics",
      "No signup required",
      "Unlimited URL shortening",
      "Permanent short links"
    ]
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://cuer.io"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "FREE URL Shortener",
        "item": "https://cuer.io/shorten"
      }
    ]
  };

  const howToData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Shorten a URL",
    "description": "Learn how to shorten a URL for free in 3 simple steps",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Paste your long URL",
        "text": "Copy and paste the long URL you want to shorten into the input field"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Click shorten",
        "text": "Hit the shorten button and your short link is generated instantly"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Copy and share",
        "text": "Copy your new short URL and share it anywhere - social media, emails, texts, or print"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToData) }}
      />
      <div className="min-h-screen flex flex-col">
        <Suspense>
          <Header />
        </Suspense>
        <main className="flex-1 flex items-center justify-center px-8 py-20">
        <div className="max-w-3xl mx-auto w-full">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="font-bold text-5xl lg:text-6xl tracking-tight mb-4">
              FREE URL Shortener
            </h1>
            <p className="text-lg text-base-content/70 max-w-xl mx-auto">
              Transform long URLs into short, memorable links instantly. Free URL shortener with click tracking and analytics. Shorten links for social media, marketing campaigns, and more.
            </p>
          </header>

          {/* Tool */}
          <section className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <URLShortenerForm showCustomSlug={false} />
            </div>
          </section>

          {/* Marketing Copy Section */}
          <article className="mt-16 prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-center">Why Choose Our FREE URL Shortener?</h2>
              <div className="grid md:grid-cols-2 gap-8 not-prose">
                <div className="bg-base-200/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                    Completely Free
                  </h3>
                  <p className="text-base-content/70">
                    Create unlimited short links absolutely free. No subscription required, no credit card needed. Shorten as many URLs as you want without any limitations or hidden costs.
                  </p>
                </div>

                <div className="bg-base-200/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                    Lightning Fast
                  </h3>
                  <p className="text-base-content/70">
                    Generate short URLs in milliseconds. Simply paste your long URL and get your shortened link instantly. Fast, reliable, and works perfectly on all devices and browsers.
                  </p>
                </div>

                <div className="bg-base-200/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                    Track Clicks
                  </h3>
                  <p className="text-base-content/70">
                    Monitor your short link performance with built-in click tracking. See how many people are clicking your links and measure the success of your campaigns.
                  </p>
                </div>

                <div className="bg-base-200/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    Secure & Reliable
                  </h3>
                  <p className="text-base-content/70">
                    Your links are safe with us. We use secure technology to ensure your shortened URLs work reliably and redirect quickly. No spam, no malicious redirects.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-center">Perfect Uses for Shortened URLs</h2>
              <div className="space-y-4 not-prose">
                <div className="bg-base-200/30 rounded-lg p-5">
                  <h3 className="text-lg font-semibold mb-2 text-primary">Social Media Marketing</h3>
                  <p className="text-base-content/70">
                    Share clean, short links on Twitter, Facebook, Instagram, LinkedIn, and TikTok. Short URLs look professional, save character space, and increase click-through rates on social platforms.
                  </p>
                </div>

                <div className="bg-base-200/30 rounded-lg p-5">
                  <h3 className="text-lg font-semibold mb-2 text-primary">Email Campaigns</h3>
                  <p className="text-base-content/70">
                    Make your email marketing more effective with shortened links that are easier to read and track. Perfect for newsletters, promotional emails, and email signatures.
                  </p>
                </div>

                <div className="bg-base-200/30 rounded-lg p-5">
                  <h3 className="text-lg font-semibold mb-2 text-primary">Print Materials</h3>
                  <p className="text-base-content/70">
                    Use short URLs on business cards, flyers, brochures, posters, and product packaging. Memorable short links are easier for people to type and remember.
                  </p>
                </div>

                <div className="bg-base-200/30 rounded-lg p-5">
                  <h3 className="text-lg font-semibold mb-2 text-primary">SMS & Text Marketing</h3>
                  <p className="text-base-content/70">
                    Save precious characters in text messages with compact short links. Perfect for SMS campaigns, appointment reminders, and mobile marketing.
                  </p>
                </div>

                <div className="bg-base-200/30 rounded-lg p-5">
                  <h3 className="text-lg font-semibold mb-2 text-primary">Affiliate Marketing</h3>
                  <p className="text-base-content/70">
                    Hide long, complex affiliate URLs behind clean short links. Track performance and make your affiliate links more shareable and professional-looking.
                  </p>
                </div>

                <div className="bg-base-200/30 rounded-lg p-5">
                  <h3 className="text-lg font-semibold mb-2 text-primary">Link Sharing & Collaboration</h3>
                  <p className="text-base-content/70">
                    Share resources, documents, and websites with teammates and clients using clean short URLs. Perfect for project management, presentations, and team communication.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12 bg-base-200/30 rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-4 text-center">How to Shorten a URL</h2>
              <ol className="space-y-3 text-base-content/80 not-prose list-decimal list-inside">
                <li className="text-lg"><strong>Paste your long URL</strong> - Copy and paste the long URL you want to shorten into the input field</li>
                <li className="text-lg"><strong>Click shorten</strong> - Hit the shorten button and your short link is generated instantly</li>
                <li className="text-lg"><strong>Copy & share</strong> - Copy your new short URL and share it anywhere - social media, emails, texts, or print</li>
              </ol>
              <p className="mt-6 text-center text-base-content/70">
                Shorten any URL in seconds! No registration or technical skills needed.
              </p>
            </section>

            <section className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-8 not-prose">
              <h2 className="text-2xl font-bold mb-4 text-center">The Best Free URL Shortener Tool</h2>
              <p className="text-base-content/80 mb-4">
                Cuer.io offers a powerful free URL shortener that helps marketers, businesses, content creators, and individuals create clean, memorable short links. Whether you're sharing links on social media, running email campaigns, or promoting your business, our URL shortener makes your links more manageable and trackable.
              </p>
              <p className="text-base-content/80 mb-4">
                Unlike other URL shorteners that require signup or charge fees, our service is completely free with no registration required. Simply paste your long URL, click shorten, and get your short link instantly. All shortened URLs are permanent and will never expire.
              </p>
              <p className="text-base-content/80">
                Join thousands of users who trust our free URL shortener for their link management needs. Perfect for Twitter posts, Instagram bios, email marketing, QR codes, and any situation where you need a shorter, cleaner URL.
              </p>
            </section>
          </article>

          {/* Membership CTA - Only show if user doesn't have paid subscription */}
          {!hasAccess && (
            <div className="mt-12 card bg-gradient-to-br from-primary/5 via-base-200/80 to-accent/5 backdrop-blur-sm border border-primary/20">
              <div className="card-body p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 text-primary">
                    Want to Track Your Links?
                  </h2>
                  <p className="text-base-content/70">
                    Subscribe to unlock your dashboard and get powerful analytics for all your shortened URLs
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3 p-4 bg-base-200/50 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Click Analytics</h3>
                      <p className="text-sm text-base-content/60">
                        Track clicks, views, and engagement metrics for every link
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-base-200/50 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">URL Management</h3>
                      <p className="text-sm text-base-content/60">
                        View, organize, and manage all your shortened URLs in one place
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/pricing" className="btn btn-primary gap-2">
                    View Pricing
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <Link href="/signin" className="btn btn-outline gap-2">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
    </>
  );
}
