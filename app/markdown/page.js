import { Suspense } from 'react'
import Link from 'next/link'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarkdownConverter from '@/components/MarkdownConverter';
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: 'Free Markdown to HTML Converter - Online MD Editor | Cuer.io',
  description: 'Convert markdown to clean, sanitized HTML instantly. Free online markdown converter with live preview. Supports GitHub Flavored Markdown, code blocks, tables, and more. No signup required.',
  keywords: ["markdown converter", "markdown to html", "md to html", "markdown editor", "github markdown", "markdown preview", "online markdown", "markdown tool", "convert markdown"],
  canonicalUrlRelative: "/markdown",
  openGraph: {
    title: 'Free Markdown to HTML Converter | Cuer.io',
    description: 'Convert markdown to clean, sanitized HTML instantly. Supports GitHub Flavored Markdown with live preview.',
    url: "https://cuer.io/markdown",
  },
});

export default function MarkdownPage() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className="min-h-screen bg-base-200 py-8 px-4">
        <MarkdownConverter />

        {/* Membership CTA */}
        <div className="max-w-7xl mx-auto mt-12 px-4">
          <div className="card bg-gradient-to-br from-primary/5 via-base-200/80 to-accent/5 backdrop-blur-sm border border-primary/20 max-w-4xl mx-auto">
            <div className="card-body p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-primary">
                  Keep All Your Markdown Files Organized
                </h2>
                <p className="text-base-content/70">
                  Subscribe to unlock your dashboard and manage all your markdown files in one place
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3 p-4 bg-base-200/50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">File Management</h3>
                    <p className="text-sm text-base-content/60">
                      Access and manage all your converted markdown files from your dashboard
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-base-200/50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Version History</h3>
                    <p className="text-sm text-base-content/60">
                      Keep track of all your conversions and revisit previous versions
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
        </div>
      </main>
      <Footer />
    </>
  );
}
