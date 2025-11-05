import MarkdownConverter from '@/components/MarkdownConverter';

export const metadata = {
  title: 'Markdown to HTML Converter | Shorty',
  description: 'Convert your markdown to clean, sanitized HTML instantly. Supports GitHub Flavored Markdown with live preview.',
};

export default function MarkdownPage() {
  return (
    <main className="min-h-screen bg-base-200 py-8 px-4">
      <MarkdownConverter />
    </main>
  );
}
