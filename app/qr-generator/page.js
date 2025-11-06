import { Suspense } from 'react'
import Link from 'next/link'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QRCodeGeneratorForm from "@/components/QRCodeGeneratorForm";
import { getSEOTags } from "@/libs/seo";
import { createClient } from "@/libs/supabase/server";
import { checkSubscription } from "@/libs/subscription";

export const metadata = getSEOTags({
  title: "Free QR Code Generator - Create QR Codes Online | Cuer.io",
  description: "Free QR code generator to create scannable QR codes instantly. Generate QR codes for URLs, text, phone numbers, emails, WiFi, and more. Download as PNG or SVG. No signup required.",
  keywords: ["qr code generator", "qr generator", "free qr code", "create qr code", "qr code maker", "generate qr code", "qr code online", "custom qr code", "qr code download"],
  canonicalUrlRelative: "/qr-generator",
  openGraph: {
    title: "Free QR Code Generator - Create QR Codes Online | Cuer.io",
    description: "Create scannable QR codes for any text, URLs, phone numbers, emails, and more. Download as PNG or SVG.",
    url: "https://cuer.io/qr-generator",
  },
});

export default async function QRGeneratorPage() {
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
    "name": "Free QR Code Generator",
    "applicationCategory": "DesignApplication",
    "description": "Generate free QR codes instantly for URLs, text, phone numbers, emails, WiFi, and more. Download in PNG or SVG format.",
    "url": "https://cuer.io/qr-generator",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Generate QR codes for URLs",
      "Create QR codes for text, phone, email",
      "Download as PNG or SVG",
      "High-quality QR codes",
      "No signup required",
      "Unlimited QR code generation"
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
        "name": "Free QR Code Generator",
        "item": "https://cuer.io/qr-generator"
      }
    ]
  };

  const howToData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Create a Free QR Code",
    "description": "Learn how to generate a QR code for free in 3 simple steps",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Enter your content",
        "text": "Type or paste the URL, text, phone number, email, or other data you want to encode"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Generate QR code",
        "text": "Click the generate button and your QR code appears instantly"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Download and use",
        "text": "Download your QR code in PNG or SVG format and use it anywhere you need"
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
              Free QR Code Generator
            </h1>
            <p className="text-lg text-base-content/70 max-w-xl mx-auto">
              Generate free QR codes instantly for URLs, text, phone numbers, emails, WiFi, and more. Download in high quality PNG or SVG format. No signup or registration required.
            </p>
          </header>

          {/* Tool */}
          <section className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <QRCodeGeneratorForm />
            </div>
          </section>

          {/* Marketing Copy Section */}
          <article className="mt-16 prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-center">Why Use Our Free QR Code Generator?</h2>
              <div className="grid md:grid-cols-2 gap-8 not-prose">
                <div className="bg-base-200/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                    100% Free Forever
                  </h3>
                  <p className="text-base-content/70">
                    Create unlimited QR codes completely free. No hidden fees, no credit card required, no account registration needed. Generate as many QR codes as you want, whenever you need them.
                  </p>
                </div>

                <div className="bg-base-200/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    High-Quality Downloads
                  </h3>
                  <p className="text-base-content/70">
                    Download your QR codes in multiple formats - high-resolution PNG for printing or scalable SVG for professional designs. Perfect quality for any size, from business cards to billboards.
                  </p>
                </div>

                <div className="bg-base-200/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                    Instant Generation
                  </h3>
                  <p className="text-base-content/70">
                    Generate QR codes in seconds. Simply enter your content and get your scannable QR code instantly. Fast, reliable, and works on all devices - desktop, tablet, and mobile.
                  </p>
                </div>

                <div className="bg-base-200/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    Safe & Secure
                  </h3>
                  <p className="text-base-content/70">
                    Your data stays private. We don't store your QR code content or track what you generate. Create QR codes with confidence knowing your information is secure and private.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-center">Popular Uses for Free QR Codes</h2>
              <div className="space-y-4 not-prose">
                <div className="bg-base-200/30 rounded-lg p-5">
                  <h3 className="text-lg font-semibold mb-2 text-primary">Business & Marketing</h3>
                  <p className="text-base-content/70">
                    Add QR codes to business cards, flyers, posters, product packaging, and advertisements. Drive traffic to your website, social media profiles, or promotional landing pages with scannable codes.
                  </p>
                </div>

                <div className="bg-base-200/30 rounded-lg p-5">
                  <h3 className="text-lg font-semibold mb-2 text-primary">Restaurant Menus</h3>
                  <p className="text-base-content/70">
                    Create contactless digital menus for restaurants, cafes, and bars. Let customers scan QR codes to view menus on their phones - safe, convenient, and eco-friendly.
                  </p>
                </div>

                <div className="bg-base-200/30 rounded-lg p-5">
                  <h3 className="text-lg font-semibold mb-2 text-primary">Event Management</h3>
                  <p className="text-base-content/70">
                    Generate QR codes for event tickets, registration, RSVPs, and check-ins. Perfect for conferences, weddings, parties, and virtual events.
                  </p>
                </div>

                <div className="bg-base-200/30 rounded-lg p-5">
                  <h3 className="text-lg font-semibold mb-2 text-primary">WiFi Sharing</h3>
                  <p className="text-base-content/70">
                    Create QR codes that automatically connect devices to your WiFi network. Great for offices, hotels, cafes, and home guests - no need to type long passwords.
                  </p>
                </div>

                <div className="bg-base-200/30 rounded-lg p-5">
                  <h3 className="text-lg font-semibold mb-2 text-primary">Contact Information</h3>
                  <p className="text-base-content/70">
                    Share your contact details instantly with vCard QR codes. Include phone numbers, emails, addresses, and social media - perfect for networking and lead generation.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12 bg-base-200/30 rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-4 text-center">How to Create a Free QR Code</h2>
              <ol className="space-y-3 text-base-content/80 not-prose list-decimal list-inside">
                <li className="text-lg"><strong>Enter your content</strong> - Type or paste the URL, text, phone number, email, or other data you want to encode</li>
                <li className="text-lg"><strong>Generate QR code</strong> - Click the generate button and your QR code appears instantly</li>
                <li className="text-lg"><strong>Download & use</strong> - Download your QR code in PNG or SVG format and use it anywhere you need</li>
              </ol>
              <p className="mt-6 text-center text-base-content/70">
                It's that simple! No technical knowledge required. Start creating free QR codes now.
              </p>
            </section>

            <section className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-8 not-prose">
              <h2 className="text-2xl font-bold mb-4 text-center">Best Free QR Code Generator Online</h2>
              <p className="text-base-content/80 mb-4">
                Our free QR code generator is the perfect tool for businesses, marketers, event organizers, and individuals who need professional QR codes without paying expensive fees. Generate unlimited QR codes for websites, contact information, WiFi passwords, social media profiles, product information, and more.
              </p>
              <p className="text-base-content/80 mb-4">
                Whether you need a QR code for a business card, restaurant menu, event poster, or marketing campaign, our generator creates high-quality, scannable codes that work with all smartphone cameras and QR code readers. The codes are generated locally in your browser for maximum privacy and security.
              </p>
              <p className="text-base-content/80">
                Start using the best free QR code generator today and join thousands of users who trust Cuer.io for their QR code needs. No signup, no limits, completely free.
              </p>
            </section>
          </article>

          {/* Membership CTA - Only show if user doesn't have paid subscription */}
          {!hasAccess && (
            <div className="mt-12 card bg-gradient-to-br from-primary/5 via-base-200/80 to-accent/5 backdrop-blur-sm border border-primary/20">
              <div className="card-body p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 text-primary">
                    Manage All Your QR Codes in One Place
                  </h2>
                  <p className="text-base-content/70">
                    Subscribe to unlock your dashboard and track analytics for all your QR codes
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
                      <h3 className="font-semibold mb-1">Scan Analytics</h3>
                      <p className="text-sm text-base-content/60">
                        Track scans, views, and engagement metrics for every QR code
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-base-200/50 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">QR Code Organization</h3>
                      <p className="text-sm text-base-content/60">
                        View, organize, and manage all your QR codes in one place
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
