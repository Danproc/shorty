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
      <main className="min-h-screen flex items-center justify-center px-8 py-20">
        <div className="max-w-3xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-bold text-5xl lg:text-6xl tracking-tight mb-4">
              QR Code Generator
            </h1>
            <p className="text-lg text-base-content/70 max-w-xl mx-auto">
              Create scannable QR codes for any URL.
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
