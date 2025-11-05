import { Suspense } from 'react'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import URLShortenerForm from "@/components/URLShortenerForm";

export const metadata = {
  title: "URL Shortener - Create Short Links",
  description: "Free URL shortener tool. Create short, memorable links instantly. No signup required.",
};

export default function ShortenPage() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className="min-h-screen bg-base-100">
        <section className="max-w-4xl mx-auto px-8 py-16 lg:py-24">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight mb-4">
              URL Shortener
            </h1>
            <p className="text-lg lg:text-xl opacity-80 max-w-2xl mx-auto">
              Transform long URLs into short, shareable links. Perfect for social media,
              marketing campaigns, and anywhere you need clean, memorable links.
            </p>
          </div>

          {/* Tool */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <URLShortenerForm showCustomSlug={false} />
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold">No Account Required</h3>
                  <p className="text-sm opacity-70">Start shortening URLs immediately, no signup needed</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold">QR Code Included</h3>
                  <p className="text-sm opacity-70">Every short link comes with a free QR code</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold">Click Tracking</h3>
                  <p className="text-sm opacity-70">Monitor how many times your links are clicked</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold">Lightning Fast</h3>
                  <p className="text-sm opacity-70">Generate short URLs in milliseconds</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
