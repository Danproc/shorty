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
