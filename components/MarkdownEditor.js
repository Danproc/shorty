'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * MarkdownEditor component with live preview
 * @param {Object} props
 * @param {string} props.value - Current markdown content
 * @param {Function} props.onChange - Callback when markdown changes
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.showPreview - Whether to show live preview (default: true)
 * @param {number} props.minHeight - Minimum height in pixels (default: 200)
 */
export default function MarkdownEditor({
  value = '',
  onChange,
  placeholder = 'Enter markdown content here...',
  showPreview = true,
  minHeight = 200,
}) {
  const [activeTab, setActiveTab] = useState('write');

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      {showPreview && (
        <div className="tabs tabs-boxed mb-2 bg-base-200">
          <button
            className={`tab ${activeTab === 'write' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('write')}
          >
            Write
          </button>
          <button
            className={`tab ${activeTab === 'preview' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
        </div>
      )}

      {/* Editor */}
      {activeTab === 'write' ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="textarea textarea-bordered w-full font-mono text-sm"
          style={{ minHeight: `${minHeight}px` }}
          rows={10}
        />
      ) : (
        /* Preview */
        <div
          className="prose prose-sm max-w-none p-4 border border-base-300 rounded-lg bg-base-100"
          style={{ minHeight: `${minHeight}px` }}
        >
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <p className="text-base-content/50 italic">Nothing to preview</p>
          )}
        </div>
      )}

      {/* Helper Text */}
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
        : **bold**, *italic*, [links](url), # headers, lists, and more
      </div>
    </div>
  );
}
