'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/libs/supabase/client';
import axios from 'axios';
import toast from 'react-hot-toast';
import QRCodeDisplay from './QRCodeDisplay';
import { trackEvent } from '@/libs/posthog/client';

export default function QRCodeGeneratorForm() {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    setIsLoggedIn(!!user);
  };

  const handleSubmit = async (e) => {
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

    setLoading(true);

    try {
      // If logged in, save to database
      if (isLoggedIn) {
        const response = await axios.post('/api/qr/create', {
          targetUrl: trimmedText,
          title: title.trim() || undefined,
        });

        if (response.data.success) {
          setResult({
            text: trimmedText,
            saved: true,
            id: response.data.data.id,
            qrCode: response.data.data.qrCode,
          });
          toast.success('QR Code created and saved!');

          // Track event in PostHog
          trackEvent('Asset Created', {
            kind: 'qr_code',
            has_title: !!title,
          });
        }
      } else {
        // Anonymous user - just display
        setResult({ text: trimmedText, saved: false });
        toast.success('QR Code generated! Sign in to save and track scans.');

        // Track event in PostHog
        trackEvent('Asset Created', {
          kind: 'qr_code',
          anonymous: true,
        });
      }
    } catch (error) {
      console.error('Error creating QR code:', error);
      toast.error('Failed to create QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setText('');
    setTitle('');
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
              disabled={loading}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Enter any text (up to 2000 characters) to generate a scannable QR code
              </span>
            </label>
          </div>

          {/* Title Input (for logged-in users) */}
          {isLoggedIn && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title (optional)</span>
              </label>
              <input
                type="text"
                placeholder="My QR Code"
                className="input input-bordered w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                maxLength={100}
              />
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
                Generating...
              </>
            ) : (
              'Generate QR Code'
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
