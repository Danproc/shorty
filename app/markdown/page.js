import { Suspense } from 'react'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarkdownConverter from '@/components/MarkdownConverter';

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
      </main>
      <Footer />
    </>
  );
}
