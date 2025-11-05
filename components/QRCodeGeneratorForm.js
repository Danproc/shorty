'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import QRCodeDisplay from './QRCodeDisplay';

export default function QRCodeGeneratorForm() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText) {
      toast.error('Please enter some text');
      return;
    }

    // Check character limit for QR code capacity
    if (trimmedText.length > 2000) {
      toast.error('Text is too long. Please keep it under 2000 characters.');
      return;
    }

    setResult({ text: trimmedText });
    toast.success('QR Code generated successfully!');
  };

  const handleReset = () => {
    setResult(null);
    setText('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Text Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Enter text to generate QR code</span>
            </label>
            <textarea
              placeholder="Enter any text, URL, phone number, email, etc."
              className="textarea textarea-bordered w-full h-32"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={2000}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Enter any text (up to 2000 characters) to generate a scannable QR code
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

          {/* Text Display */}
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-sm text-base-content/60">Encoded Text</h3>
              <div className="mt-2">
                {(() => {
                  // Check if text is a valid URL
                  try {
                    const url = new URL(result.text);
                    if (url.protocol === 'http:' || url.protocol === 'https:') {
                      return (
                        <a
                          href={result.text}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline break-all"
                        >
                          {result.text}
                        </a>
                      );
                    }
                  } catch {
                    // Not a valid URL, display as plain text
                  }
                  return <p className="text-sm break-all whitespace-pre-wrap">{result.text}</p>;
                })()}
              </div>
            </div>
          </div>

          {/* QR Code Display */}
          <QRCodeDisplay url={result.text} />

          {/* Create Another Button */}
          <button onClick={handleReset} className="btn btn-outline w-full">
            Generate Another QR Code
          </button>
        </div>
      )}
    </div>
  );
}
