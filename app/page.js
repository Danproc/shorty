import { Suspense } from 'react'
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Cuer.io - Free URL Shortener, QR Code Generator & Markdown Converter",
  description: "Free online tools to shorten URLs, generate QR codes, and convert markdown to HTML. Fast, secure, and no signup required. Create short links and beautiful QR codes instantly.",
  keywords: ["url shortener", "qr code generator", "markdown converter", "free url shortener", "qr generator", "short link", "link shortener", "free qr code", "markdown to html"],
  canonicalUrlRelative: "/",
  openGraph: {
    title: "Cuer.io - Free URL Shortener & QR Code Generator",
    description: "Free online tools to shorten URLs and generate QR codes. Fast, secure, and no signup required.",
    url: "https://cuer.io/",
  },
});

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense>
        <Header />
      </Suspense>
      <main className="flex-1">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}