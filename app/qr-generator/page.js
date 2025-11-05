import { Suspense } from 'react'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QRCodeGeneratorForm from "@/components/QRCodeGeneratorForm";

export const metadata = {
  title: "QR Code Generator - Create Free QR Codes",
  description: "Free QR code generator. Create scannable QR codes for any URL. Download as PNG or SVG.",
};

export default function QRGeneratorPage() {
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
              QR Code Generator
            </h1>
            <p className="text-lg lg:text-xl opacity-80 max-w-2xl mx-auto">
              Create beautiful, scannable QR codes for any URL. Perfect for print materials,
              business cards, and offline marketing.
            </p>
          </div>

          {/* Tool */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <QRCodeGeneratorForm />
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
                  <h3 className="font-bold">High Quality Output</h3>
                  <p className="text-sm opacity-70">Download QR codes in PNG or SVG format</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold">Instant Generation</h3>
                  <p className="text-sm opacity-70">Create QR codes instantly, no waiting</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold">No Signup Required</h3>
                  <p className="text-sm opacity-70">Start generating QR codes immediately</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold">Print Ready</h3>
                  <p className="text-sm opacity-70">Perfect for flyers, posters, and business cards</p>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Perfect For</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card bg-base-200">
                <div className="card-body">
                  <h3 className="card-title text-lg">Marketing Materials</h3>
                  <p className="text-sm opacity-70">Add QR codes to flyers, posters, and brochures</p>
                </div>
              </div>
              <div className="card bg-base-200">
                <div className="card-body">
                  <h3 className="card-title text-lg">Business Cards</h3>
                  <p className="text-sm opacity-70">Link to your website or contact information</p>
                </div>
              </div>
              <div className="card bg-base-200">
                <div className="card-body">
                  <h3 className="card-title text-lg">Product Packaging</h3>
                  <p className="text-sm opacity-70">Direct customers to product info or support</p>
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
