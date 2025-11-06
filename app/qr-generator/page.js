import { Suspense } from 'react'
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
        </div>
      </main>
      <Footer />
    </>
  );
}
