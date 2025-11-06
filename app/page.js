import { Suspense } from 'react'
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { getSEOTags } from "@/libs/seo";
import { createClient } from "@/libs/supabase/server";
import { checkSubscription } from "@/libs/subscription";

export const metadata = getSEOTags({
  title: "Free QR Code Generator & FREE URL Shortener - Cuer.io",
  description: "Generate free QR codes and shorten URLs instantly. The best free QR code generator and URL shortener - no signup required. Create short links, QR codes, and convert markdown to HTML. 100% free forever.",
  keywords: ["free qr code generator", "free url shortener", "qr code generator", "url shortener", "shorten url", "create qr code", "qr generator free", "link shortener", "free qr code", "short link generator", "qr code maker", "shorten link free"],
  canonicalUrlRelative: "/",
  openGraph: {
    title: "Free QR Code Generator & FREE URL Shortener - Cuer.io",
    description: "Generate free QR codes and shorten URLs instantly. Professional tools, no signup required, completely free forever.",
    url: "https://cuer.io/",
  },
});

export default async function Home() {
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
    "name": "Cuer.io - Free QR Code Generator & URL Shortener",
    "applicationCategory": "BusinessApplication",
    "description": "Free online tools to generate QR codes, shorten URLs, and convert markdown to HTML. No signup required.",
    "url": "https://cuer.io",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Free QR Code Generator",
      "Free URL Shortener",
      "Click Tracking and Analytics",
      "High-Quality QR Code Downloads (PNG, SVG)",
      "Instant URL Shortening",
      "No Registration Required"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "328"
    }
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
      <div className="min-h-screen flex flex-col">
        <Suspense>
          <Header />
        </Suspense>
        <main className="flex-1">
          <Hero hasAccess={hasAccess} />
        </main>
        <Footer />
      </div>
    </>
  );
}