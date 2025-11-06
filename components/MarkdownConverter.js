'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { trackEvent } from '@/libs/posthog/client';
import { markdownToHtml } from '@/libs/markdown';
import { downloadMarkdown, downloadHtml, copyToClipboard, copyFormattedHtml, sanitizeFilename } from '@/libs/files';
import { useKeyboardShortcuts } from '@/libs/useKeyboardShortcuts';

// Import new components
import Editor from './markdown/Editor';
import Preview from './markdown/Preview';
import Toolbar from './markdown/Toolbar';
import StatusBar from './markdown/StatusBar';
import SettingsModal from './markdown/SettingsModal';

const DEFAULT_MARKDOWN = `# Welcome to Markdown Converter

This is a **powerful** markdown to HTML converter with live preview.

## Features

- ✅ GitHub Flavored Markdown support
- ✅ Tables, task lists, strikethrough
- ✅ Code syntax highlighting
- ✅ Drag & drop file upload
- ✅ Download as HTML or MD
- ✅ Copy formatted HTML for Word

## Example Code

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

## Task List

- [x] Support GFM features
- [x] Add syntax highlighting
- [ ] Your task here

## Table

| Feature | Supported |
|---------|-----------|
| Tables | ✅ |
| Code | ✅ |
| Images | ✅ |

Try editing this markdown or drag & drop your own file!`;

export default function MarkdownConverter({ isAuthenticated = false }) {
  // State
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [html, setHtml] = useState('');
  const [renderTime, setRenderTime] = useState(0);
  const [activeTab, setActiveTab] = useState('preview');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    openLinksInNewTab: false,
    addRelAttribute: true,
    allowHtml: false,
    smartQuotes: false,
    highlightCode: true,
    theme: 'minimal',
  });
  const [fileName, setFileName] = useState('');

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('mdConverterSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }

    // Load last session markdown
    const savedMarkdown = localStorage.getItem('mdConverterLastMarkdown');
    if (savedMarkdown) {
      setMarkdown(savedMarkdown);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('mdConverterSettings', JSON.stringify(settings));
  }, [settings]);

  // Auto-convert markdown with debounce
  useEffect(() => {
    const convertMarkdown = () => {
      if (!markdown.trim()) {
        setHtml('');
        setRenderTime(0);
        return;
      }

      try {
        const parseOptions = {
          openLinksInNewTab: settings.openLinksInNewTab,
          rel: settings.addRelAttribute ? 'nofollow noopener noreferrer' : '',
          allowHtml: settings.allowHtml,
          smartQuotes: settings.smartQuotes,
          highlightCode: settings.highlightCode,
        };

        const { html: convertedHtml, renderTime: time } = markdownToHtml(markdown, parseOptions);
        setHtml(convertedHtml);
        setRenderTime(time);

        // Save to localStorage for persistence
        localStorage.setItem('mdConverterLastMarkdown', markdown);

        trackEvent('md_render_success', {
          chars: markdown.length,
          ms: time,
        });
      } catch (error) {
        console.error('Error converting markdown:', error);
        toast.error('Failed to convert markdown');
        trackEvent('error_render', {
          message: error.message,
        });
      }
    };

    const timer = setTimeout(() => {
      convertMarkdown();
    }, 150); // Debounce 150ms

    return () => clearTimeout(timer);
  }, [markdown, settings]);

  // Handlers
  const handleCopyMarkdown = async () => {
    const success = await copyToClipboard(markdown);
    if (success) {
      toast.success('Markdown copied to clipboard!');
      trackEvent('copy_markdown', { chars: markdown.length });
    } else {
      toast.error('Failed to copy markdown');
    }
  };

  const handleCopyHtml = async () => {
    if (!html.trim()) {
      toast.error('No content to copy');
      return;
    }

    const success = await copyFormattedHtml(html, markdown);
    if (success) {
      toast.success('HTML copied! Paste into Word to preserve formatting.');
      trackEvent('copy_html', { chars: html.length });
    } else {
      toast.error('Failed to copy HTML');
    }
  };

  const handleDownloadMarkdown = () => {
    const name = fileName || sanitizeFilename(markdown.slice(0, 50));
    const success = downloadMarkdown(markdown, name);
    if (success) {
      toast.success('Markdown file downloaded!');
      trackEvent('download_md', { chars: markdown.length });
    } else {
      toast.error('Failed to download markdown');
    }
  };

  const handleDownloadHtml = () => {
    const name = fileName || sanitizeFilename(markdown.slice(0, 50));
    const success = downloadHtml(html, name, {
      title: name,
      theme: settings.theme,
      includeStyles: true,
    });
    if (success) {
      toast.success('HTML file downloaded!');
      trackEvent('download_html', { chars: html.length });
    } else {
      toast.error('Failed to download HTML');
    }
  };

  const handleClear = () => {
    if (markdown.trim() && !confirm('Are you sure you want to clear all content?')) {
      return;
    }
    setMarkdown('');
    setHtml('');
    setRenderTime(0);
    setFileName('');
    localStorage.removeItem('mdConverterLastMarkdown');
    toast.success('Content cleared');
  };

  const handleFileLoad = (name) => {
    setFileName(name.replace(/\.(md|markdown|txt)$/i, ''));
    trackEvent('md_dropfile', { fileName: name });
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save files');
      return;
    }

    try {
      const response = await axios.post('/api/markdown/save', {
        markdown_content: markdown,
        html_content: html,
        title: fileName || 'Untitled',
        settings: settings,
      });

      if (response.data.success) {
        toast.success('File saved to dashboard!');
        trackEvent('save_success', { id: response.data.id });
      }
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('Failed to save file');
    }
  };

  const handleShare = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to create share links');
      return;
    }

    try {
      // First save the file
      const saveResponse = await axios.post('/api/markdown/save', {
        markdown_content: markdown,
        html_content: html,
        title: fileName || 'Untitled',
        settings: settings,
      });

      if (!saveResponse.data.success) {
        throw new Error('Failed to save file');
      }

      // Then create a share link
      const shareResponse = await axios.post('/api/markdown/share', {
        file_id: saveResponse.data.id,
      });

      if (shareResponse.data.success) {
        const shareUrl = `${window.location.origin}/shared/${shareResponse.data.slug}`;
        await copyToClipboard(shareUrl);
        toast.success('Share link copied to clipboard!');
        trackEvent('share_created', { slug: shareResponse.data.slug });
      }
    } catch (error) {
      console.error('Error creating share link:', error);
      toast.error('Failed to create share link');
    }
  };

  const handleRefresh = () => {
    // Force re-render (mainly for demo purposes with keyboard shortcut)
    setMarkdown(m => m);
    toast.success('Preview refreshed');
  };

  // Keyboard shortcuts
  useKeyboardShortcuts(
    {
      onCopyHtml: handleCopyHtml,
      onDownloadHtml: handleDownloadHtml,
      onRefresh: handleRefresh,
      onEscape: () => setIsSettingsOpen(false),
    },
    {
      activeTab,
      isModalOpen: isSettingsOpen,
    }
  );

  return (
    <>
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Markdown to HTML Converter</h1>
          <p className="text-base-content/70">
            Convert markdown to clean HTML with live preview, syntax highlighting, and export options
          </p>
        </div>

        {/* Toolbar */}
        <Toolbar
          onCopyMarkdown={handleCopyMarkdown}
          onCopyHtml={handleCopyHtml}
          onDownloadMarkdown={handleDownloadMarkdown}
          onDownloadHtml={handleDownloadHtml}
          onClear={handleClear}
          onSettings={() => setIsSettingsOpen(true)}
          onShare={handleShare}
          onSave={handleSave}
          hasContent={markdown.trim().length > 0}
          isAuthenticated={isAuthenticated}
        />

        {/* Main Layout - Side by Side on Desktop, Tabs on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Editor */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
                <h2 className="font-semibold">Markdown Input</h2>
                {fileName && (
                  <span className="text-xs text-base-content/60">{fileName}</span>
                )}
              </div>

              <Editor
                value={markdown}
                onChange={setMarkdown}
                onFileLoad={handleFileLoad}
              />
            </div>
          </div>

          {/* Right Panel - Preview/HTML */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">
              {/* Tabs */}
              <div className="tabs tabs-boxed m-4 mb-0 bg-base-200">
                <button
                  className={`tab ${activeTab === 'preview' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('preview')}
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

              {/* Content */}
              <div className="px-4 pb-4">
                {activeTab === 'preview' ? (
                  <div className="border border-base-300 rounded-lg bg-base-200/50 overflow-auto">
                    <Preview html={html} theme={settings.theme} />
                  </div>
                ) : (
                  <div className="relative">
                    <textarea
                      value={html}
                      readOnly
                      placeholder="Converted HTML will appear here..."
                      className="textarea textarea-bordered w-full font-mono text-xs bg-base-200"
                      style={{ minHeight: '500px' }}
                      rows={20}
                    />
                    {html && (
                      <button
                        onClick={handleCopyHtml}
                        className="btn btn-sm btn-primary absolute top-2 right-2"
                      >
                        Copy HTML
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <StatusBar markdown={markdown} renderTime={renderTime} />

        {/* Info Section */}
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div className="text-sm">
            <p className="font-semibold">Keyboard Shortcuts:</p>
            <ul className="list-disc list-inside ml-4 text-xs">
              <li><kbd className="kbd kbd-xs">Ctrl/Cmd</kbd> + <kbd className="kbd kbd-xs">C</kbd> (HTML tab active) - Copy HTML</li>
              <li><kbd className="kbd kbd-xs">Ctrl/Cmd</kbd> + <kbd className="kbd kbd-xs">S</kbd> - Download HTML</li>
              <li><kbd className="kbd kbd-xs">Ctrl/Cmd</kbd> + <kbd className="kbd kbd-xs">Enter</kbd> - Refresh preview</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </>
  );
}
