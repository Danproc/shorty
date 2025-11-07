'use client';

import { useState } from 'react';

export default function TextContentDisplay({ content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy to clipboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card bg-base-100 shadow-xl max-w-2xl w-full">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">QR Code Content</h2>
          <div className="bg-base-200 p-6 rounded-lg mb-4">
            <p className="whitespace-pre-wrap break-words text-lg">{content}</p>
          </div>
          <button
            className={`btn ${copied ? 'btn-success' : 'btn-primary'}`}
            onClick={handleCopy}
          >
            {copied ? '✓ Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
