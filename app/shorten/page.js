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
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense>
        <Header />
      </Suspense>
      <main className="flex-1 flex items-center justify-center px-8 py-20">
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
  );
}
