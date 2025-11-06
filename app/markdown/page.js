import { Suspense } from 'react'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarkdownConverter from '@/components/MarkdownConverter';
import Link from 'next/link';

export const metadata = {
  title: 'Markdown to HTML Converter | Cuer.io',
  description: 'Convert your markdown to clean, sanitized HTML instantly. Supports GitHub Flavored Markdown with live preview.',
};

export default function MarkdownPage() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className="min-h-screen bg-base-200 py-8 px-4">
        <MarkdownConverter />

        {/* Membership CTA */}
        <div className="max-w-5xl mx-auto mt-12 px-4">
          <div className="card bg-gradient-to-br from-primary/5 via-base-200 to-accent/5 border border-primary/20">
            <div className="card-body">
              <h2 className="text-2xl font-bold mb-3 text-center">
                Keep All Your Markdown Files Organized
              </h2>
              <p className="text-base-content/70 mb-6 text-center max-w-xl mx-auto">
                Upgrade to a premium membership to access your personal dashboard where you can save, view, and manage all your markdown conversions with full version history.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">File Management</h3>
                    <p className="text-sm text-base-content/60">Access all your markdown files anytime, anywhere</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Version History</h3>
                    <p className="text-sm text-base-content/60">Track changes and revert to previous versions</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/pricing" className="btn btn-primary">
                  View Pricing
                </Link>
                <Link href="/signin" className="btn btn-outline">
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
