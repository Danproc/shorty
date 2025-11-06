'use client';

import { useEffect, useRef } from 'react';

/**
 * Preview component for rendered HTML
 * Shows the converted HTML with theme support
 */
export default function Preview({ html, theme = 'minimal', className = '' }) {
  const previewRef = useRef(null);

  useEffect(() => {
    // Apply syntax highlighting when HTML changes
    if (previewRef.current && window.Prism) {
      window.Prism.highlightAllUnder(previewRef.current);
    }
  }, [html]);

  return (
    <div
      ref={previewRef}
      className={`markdown-preview theme-${theme} prose max-w-none ${className}`}
      style={{ minHeight: '500px' }}
      dangerouslySetInnerHTML={{ __html: html || '<p class="text-base-content/50 italic">Enter markdown to see the preview...</p>' }}
    />
  );
}
