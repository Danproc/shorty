import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@/libs/supabase/server';
import { getSEOTags } from '@/libs/seo';
import '../../../app/markdown/markdown-themes.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const supabase = await createClient();
  const { slug } = await params;

  const { data: share } = await supabase
    .from('markdown_shares')
    .select(`
      *,
      markdown_conversions (title)
    `)
    .eq('slug', slug)
    .eq('is_public', true)
    .single();

  if (!share) {
    return getSEOTags({
      title: 'Shared Markdown Not Found | Cuer.io',
    });
  }

  const title = share.markdown_conversions?.title || 'Shared Markdown';

  return getSEOTags({
    title: `${title} - Shared Markdown | Cuer.io`,
    description: `View and download shared markdown: ${title}`,
    canonicalUrlRelative: `/shared/${slug}`,
  });
}

export default async function SharedMarkdownPage({ params }) {
  const supabase = await createClient();
  const { slug } = await params;

  // Fetch share and file data
  const { data: share, error } = await supabase
    .from('markdown_shares')
    .select(`
      *,
      markdown_conversions (
        id,
        title,
        markdown_content,
        html_content,
        settings,
        created_at,
        updated_at
      )
    `)
    .eq('slug', slug)
    .eq('is_public', true)
    .single();

  if (error || !share) {
    notFound();
  }

  // Increment view count
  await supabase.rpc('increment_share_view_count', { share_slug: slug });

  const file = share.markdown_conversions;
  const settings = file.settings || {};

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense>
        <Header />
      </Suspense>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css"
      />

      <main className="flex-1 bg-base-200 py-8 px-4">
        <div className="w-full max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">
              {file.title || 'Shared Markdown'}
            </h1>
            <p className="text-base-content/70">
              Shared on {new Date(share.created_at).toLocaleDateString()} •{' '}
              {share.view_count || 0} views
            </p>
          </div>

          {/* Download Actions */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                const blob = new Blob([file.html_content], {
                  type: 'text/html',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${file.title || 'document'}.html`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="btn btn-primary gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download HTML
            </button>

            <button
              onClick={() => {
                const blob = new Blob([file.markdown_content], {
                  type: 'text/markdown',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${file.title || 'document'}.md`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="btn btn-outline gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Markdown
            </button>
          </div>

          {/* Preview */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="tabs tabs-boxed mb-4 bg-base-200">
                <a className="tab tab-active">Preview</a>
              </div>

              <div className="border border-base-300 rounded-lg bg-base-200/50 overflow-auto p-4">
                <div
                  className={`markdown-preview theme-${settings.theme || 'minimal'} prose max-w-none`}
                  dangerouslySetInnerHTML={{ __html: file.html_content }}
                />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <p className="font-semibold">Want to create your own?</p>
              <p className="text-sm">
                Try our free{' '}
                <a href="/markdown" className="link link-primary">
                  Markdown to HTML Converter
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
