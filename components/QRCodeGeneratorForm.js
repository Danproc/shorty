'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import QRCodeDisplay from './QRCodeDisplay';

export default function QRCodeGeneratorForm() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    // Validate URL format
    try {
      new URL(url.trim());
      setResult({ url: url.trim() });
      toast.success('QR Code generated successfully!');
    } catch (error) {
      toast.error('Please enter a valid URL (including http:// or https://)');
    }
  };

  const handleReset = () => {
    setResult(null);
    setUrl('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Enter URL to generate QR code</span>
            </label>
            <input
              type="text"
              placeholder="https://example.com"
              className="input input-bordered w-full"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Enter any valid URL to generate a scannable QR code
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            Generate QR Code
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Success Message */}
          <div className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Your QR code is ready!</span>
          </div>

          {/* URL Display */}
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-sm text-base-content/60">URL</h3>
              <div className="mt-2">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline break-all"
                >
                  {result.url}
                </a>
              </div>
            </div>
          </div>

          {/* QR Code Display */}
          <QRCodeDisplay url={result.url} />

          {/* Create Another Button */}
          <button onClick={handleReset} className="btn btn-outline w-full">
            Generate Another QR Code
          </button>
        </div>
      )}
    </div>
  );
}
