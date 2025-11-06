'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import toast from 'react-hot-toast';
import { trackEvent } from '@/libs/posthog/client';

export default function MarkdownConverter() {
  const [markdown, setMarkdown] = useState('# Hello, Markdown!\n\nStart typing your **markdown** here...');
  const [html, setHtml] = useState('');
  const [activeTab, setActiveTab] = useState('editor');
  const previewRef = useRef(null);

  // Auto-convert markdown to HTML whenever markdown changes
  useEffect(() => {
    const convertMarkdown = async () => {
      if (!markdown.trim()) {
        setHtml('');
        return;
      }

      try {
        const response = await axios.post('/api/markdown/convert', {
          markdown: markdown.trim(),
        });

        if (response.data.success) {
          setHtml(response.data.html);
        }
      } catch (error) {
        console.error('Error converting markdown:', error);
      }
    };

    // Debounce the conversion to avoid too many API calls
    const timer = setTimeout(() => {
      convertMarkdown();
    }, 500);

    return () => clearTimeout(timer);
  }, [markdown]);

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard!`);

      // Track event in PostHog
      trackEvent('MD Converted', {
        output_type: type.toLowerCase(),
      });
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleCopyFormatted = async () => {
    try {
      // Use the clean HTML from the API (which has no classes/IDs)
      if (!html.trim()) {
        toast.error('No content to copy');
        return;
      }

      // Create a ClipboardItem with both HTML and plain text formats
      // This ensures it pastes cleanly into Word with proper formatting
      const htmlBlob = new Blob([html], { type: 'text/html' });
      const textBlob = new Blob([markdown], { type: 'text/plain' });

      const clipboardItem = new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob,
      });

      await navigator.clipboard.write([clipboardItem]);
      toast.success('Formatted HTML copied! Paste into Word to preserve formatting.');

      // Track event in PostHog
      trackEvent('MD Converted', {
        output_type: 'formatted-html',
      });
    } catch (error) {
      console.error('Error copying formatted HTML:', error);
      // Fallback to copying just the HTML code if the Clipboard API fails
      try {
        await navigator.clipboard.writeText(html);
        toast.success('HTML copied (fallback mode)');
      } catch (fallbackError) {
        toast.error('Failed to copy formatted HTML');
      }
    }
  };

  const handleClear = () => {
    setMarkdown('');
    setHtml('');
    setActiveTab('editor');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Markdown to HTML Converter</h1>
        <p className="text-base-content/70">
          Convert markdown to clean, Word-friendly HTML - paste directly into documents with perfect formatting
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Editor */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="card-title">Markdown Input</h2>
              <button
                onClick={handleClear}
                className="btn btn-ghost btn-sm"
              >
                Clear
              </button>
            </div>

            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Enter your markdown here..."
              className="textarea textarea-bordered w-full font-mono text-sm"
              style={{ minHeight: '400px' }}
              rows={20}
            />

            <div className="text-xs text-base-content/60 mt-2">
              Supports{' '}
              <a
                href="https://www.markdownguide.org/basic-syntax/"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary"
              >
                Markdown syntax
              </a>
              : **bold**, *italic*, [links](url), # headers, lists, code blocks, and more
            </div>

            <div className="card-actions flex-col space-y-2 mt-4">
              <div className="flex gap-2 w-full">
                <button
                  onClick={handleCopyFormatted}
                  className="btn btn-primary flex-1"
                  disabled={!html.trim()}
                  title="Copy formatted HTML that pastes cleanly into Word"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Copy for Word
                </button>
                <button
                  onClick={() => handleCopy(html, 'HTML')}
                  className="btn btn-outline flex-1"
                  disabled={!html.trim()}
                  title="Copy HTML code"
                >
                  Copy HTML Code
                </button>
              </div>

              <button
                onClick={() => handleCopy(markdown, 'Markdown')}
                className="btn btn-ghost btn-sm w-full"
                disabled={!markdown.trim()}
              >
                Copy Markdown
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Tabs */}
            <div className="tabs tabs-boxed mb-4">
              <button
                className={`tab ${activeTab === 'editor' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('editor')}
              >
                Preview
              </button>
              <button
                className={`tab ${activeTab === 'html' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('html')}
              >
                HTML Code
              </button>
            </div>

            {/* Preview Tab */}
            {activeTab === 'editor' && (
              <div
                ref={previewRef}
                className="prose prose-sm max-w-none p-4 border border-base-300 rounded-lg bg-base-200/50 overflow-auto"
                style={{ minHeight: '400px' }}
              >
                {markdown ? (
                  <ReactMarkdown>{markdown}</ReactMarkdown>
                ) : (
                  <p className="text-base-content/50 italic">
                    Enter markdown to see the preview
                  </p>
                )}
              </div>
            )}

            {/* HTML Tab */}
            {activeTab === 'html' && (
              <div className="relative">
                <textarea
                  value={html}
                  readOnly
                  placeholder="Converted HTML will appear here..."
                  className="textarea textarea-bordered w-full font-mono text-xs bg-base-200"
                  style={{ minHeight: '400px' }}
                  rows={20}
                />
                {html && (
                  <button
                    onClick={() => handleCopy(html, 'HTML')}
                    className="btn btn-sm btn-primary absolute top-2 right-2"
                  >
                    Copy HTML
                  </button>
                )}
              </div>
            )}

            {/* Character Count */}
            <div className="text-xs text-base-content/60 mt-2">
              {markdown.length.toLocaleString()} characters
              {html && ` • ${html.length.toLocaleString()} HTML characters`}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
