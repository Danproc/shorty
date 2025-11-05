'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import QRCodeDisplay from './QRCodeDisplay';
import MarkdownEditor from './MarkdownEditor';

export default function URLShortenerForm({ showCustomSlug = false }) {
  const [url, setUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [title, setTitle] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/urls/create', {
        url: url.trim(),
        customSlug: customSlug.trim() || undefined,
        title: title.trim() || undefined,
        markdownContent: markdownContent.trim() || undefined,
      });

      if (response.data.success) {
        setResult(response.data.data);
        toast.success('Short URL created successfully!');

        // Reset form
        setUrl('');
        setCustomSlug('');
        setTitle('');
        setMarkdownContent('');
        setShowAdvanced(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create short URL';
      toast.error(errorMessage);
      console.error('Error creating short URL:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleReset = () => {
    setResult(null);
    setUrl('');
    setCustomSlug('');
    setTitle('');
    setMarkdownContent('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Enter your long URL</span>
            </label>
            <input
              type="text"
              placeholder="https://example.com/very/long/url"
              className="input input-bordered w-full"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Advanced Options Toggle */}
          {showCustomSlug && (
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={showAdvanced}
                  onChange={(e) => setShowAdvanced(e.target.checked)}
                />
                <span className="label-text">Advanced options</span>
              </label>
            </div>
          )}

          {/* Advanced Options */}
          {showAdvanced && showCustomSlug && (
            <div className="space-y-4 border-l-4 border-primary pl-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Custom slug (optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="my-custom-link"
                  className="input input-bordered w-full"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  disabled={loading}
                  pattern="[a-zA-Z0-9_-]+"
                  maxLength={20}
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    Use 3-20 characters (letters, numbers, hyphens, underscores)
                  </span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title (optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="My important link"
                  className="input input-bordered w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                  maxLength={100}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Markdown content (optional)</span>
                  <span className="label-text-alt text-base-content/60">
                    Add custom content to display with your short URL
                  </span>
                </label>
                <MarkdownEditor
                  value={markdownContent}
                  onChange={setMarkdownContent}
                  placeholder="# Welcome&#10;&#10;Add markdown content here..."
                  minHeight={150}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner"></span>
                Shortening...
              </>
            ) : (
              'Shorten URL'
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Success Message */}
          <div className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Your short URL is ready!</span>
          </div>

          {/* Short URL Display */}
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-sm text-base-content/60">Short URL</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={result.shortUrl}
                  readOnly
                  className="input input-bordered flex-1 font-mono"
                />
                <button
                  onClick={() => handleCopy(result.shortUrl)}
                  className="btn btn-square btn-primary"
                  title="Copy to clipboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                </button>
              </div>

              {result.title && (
                <div className="mt-2">
                  <span className="text-sm text-base-content/60">Title: </span>
                  <span className="text-sm font-medium">{result.title}</span>
                </div>
              )}

              <div className="mt-2">
                <span className="text-sm text-base-content/60">Original: </span>
                <a
                  href={result.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline break-all"
                >
                  {result.originalUrl}
                </a>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <QRCodeDisplay url={result.shortUrl} shortCode={result.shortCode} />

          {/* Create Another Button */}
          <button onClick={handleReset} className="btn btn-outline w-full">
            Create Another Short URL
          </button>
        </div>
      )}
    </div>
  );
}
