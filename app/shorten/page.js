import { Suspense } from 'react'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import URLShortenerForm from "@/components/URLShortenerForm";
import { getSEOTags } from "@/libs/seo";

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

export default function ShortenPage() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className="min-h-screen flex items-center justify-center px-8 py-20">
        <div className="max-w-3xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-bold text-5xl lg:text-6xl tracking-tight mb-4">
              URL Shortener
            </h1>
            <p className="text-lg text-base-content/70 max-w-xl mx-auto">
              Transform long URLs into short, memorable links.
            </p>
          </div>

          {/* Tool */}
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <URLShortenerForm showCustomSlug={false} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
