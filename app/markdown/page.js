import { Suspense } from 'react'
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
      </main>
      <Footer />
    </>
  );
}
