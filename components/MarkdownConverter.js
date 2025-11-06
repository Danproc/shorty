'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import toast from 'react-hot-toast';
import { trackEvent } from '@/libs/posthog/client';

export default function MarkdownConverter() {
  const [markdown, setMarkdown] = useState('# Hello, Markdown!\n\nStart typing your **markdown** here...');
  const [html, setHtml] = useState('');
  const [activeTab, setActiveTab] = useState('editor');
  const [title, setTitle] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleSave = async () => {
    if (!markdown.trim()) {
      toast.error('Please enter some markdown content');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/markdown/save', {
        markdown: markdown.trim(),
        title: title.trim() || undefined,
        isPublic,
      });

      if (response.data.success) {
        toast.success('Saved successfully!');
        setTitle('');

        // Track event in PostHog
        trackEvent('Asset Created', {
          kind: 'markdown',
          is_public: isPublic,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to save conversion';
      toast.error(errorMessage);
      console.error('Error saving markdown:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleClear = () => {
    setMarkdown('');
    setHtml('');
    setTitle('');
    setActiveTab('editor');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Markdown to HTML Converter</h1>
        <p className="text-base-content/70">
          Convert your markdown to clean, sanitized HTML instantly
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
                disabled={loading}
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

            <div className="card-actions justify-between items-center mt-4">
              <button
                onClick={() => handleCopy(html, 'HTML')}
                className="btn btn-primary"
                disabled={!html.trim()}
              >
                Copy HTML
              </button>

              <button
                onClick={() => handleCopy(markdown, 'Markdown')}
                className="btn btn-ghost btn-sm"
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

      {/* Save Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Save Conversion</h2>
          <p className="text-sm text-base-content/70">
            Save your markdown conversion for later use
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title (optional)</span>
              </label>
              <input
                type="text"
                placeholder="My markdown document"
                className="input input-bordered w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                maxLength={100}
              />
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  disabled={loading}
                />
                <span className="label-text">Make this conversion public</span>
              </label>
              <p className="text-xs text-base-content/60 mt-2">
                Public conversions can be viewed by anyone with the link
              </p>
            </div>
          </div>

          <div className="card-actions mt-4">
            <button
              onClick={handleSave}
              className="btn btn-secondary"
              disabled={loading || !markdown.trim()}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                'Save Conversion'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Features Info */}
      <div className="alert">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3 className="font-bold">Features</h3>
          <div className="text-xs">
            ✓ Live preview • ✓ Secure HTML sanitization • ✓ Save for later • ✓ GitHub Flavored Markdown
          </div>
        </div>
      </div>
    </div>
  );
}
