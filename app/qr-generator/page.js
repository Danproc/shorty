import { Suspense } from 'react'
import Link from 'next/link'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QRCodeGeneratorForm from "@/components/QRCodeGeneratorForm";
import { getSEOTags } from "@/libs/seo";

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

export default function QRGeneratorPage() {
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
              QR Code Generator
            </h1>
            <p className="text-lg text-base-content/70 max-w-xl mx-auto">
              Create scannable QR codes for any text, URLs, phone numbers, emails, and more.
            </p>
          </div>

          {/* Tool */}
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <QRCodeGeneratorForm />
            </div>
          </div>

          {/* Membership CTA */}
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
        </div>
      </main>
      <Footer />
    </>
  );
}
