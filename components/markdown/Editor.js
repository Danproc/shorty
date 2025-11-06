'use client';

import { useState, useRef } from 'react';
import { readFile, isValidMarkdownFile, formatFileSize } from '@/libs/files';
import toast from 'react-hot-toast';

/**
 * Editor component for markdown input
 * Supports drag & drop, paste, and file upload
 */
export default function Editor({ value, onChange, onFileLoad }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if leaving the editor container
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);

    if (files.length === 0) return;

    const file = files[0]; // Only process first file

    if (!isValidMarkdownFile(file)) {
      toast.error('Please drop a valid markdown file (.md, .markdown, .txt)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File is too large (max 5MB)');
      return;
    }

    try {
      const content = await readFile(file);
      onChange(content);
      if (onFileLoad) {
        onFileLoad(file.name);
      }
      toast.success(`Loaded ${file.name} (${formatFileSize(file.size)})`);
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error('Failed to read file');
    }
  };

  const handlePaste = async (e) => {
    // Check if there are files in the clipboard
    const items = Array.from(e.clipboardData.items);
    const fileItem = items.find(item => item.kind === 'file');

    if (fileItem) {
      e.preventDefault();
      const file = fileItem.getAsFile();

      if (!isValidMarkdownFile(file)) {
        toast.error('Please paste a valid markdown file');
        return;
      }

      try {
        const content = await readFile(file);
        onChange(content);
        if (onFileLoad) {
          onFileLoad(file.name);
        }
        toast.success(`Pasted ${file.name}`);
      } catch (error) {
        console.error('Error reading pasted file:', error);
        toast.error('Failed to read pasted file');
      }
    }
    // If no file, let default paste behavior handle text
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const file = files[0];

    if (!isValidMarkdownFile(file)) {
      toast.error('Please select a valid markdown file (.md, .markdown, .txt)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large (max 5MB)');
      return;
    }

    try {
      const content = await readFile(file);
      onChange(content);
      if (onFileLoad) {
        onFileLoad(file.name);
      }
      toast.success(`Loaded ${file.name} (${formatFileSize(file.size)})`);
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error('Failed to read file');
    }

    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`relative h-full ${isDragging ? 'ring-2 ring-primary ring-offset-2' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        placeholder="# Start typing your markdown here...

Or drag & drop a .md file, or paste content from clipboard

**Supports:**
- GitHub Flavored Markdown
- Tables
- Task lists: - [ ] Todo
- Code blocks with syntax highlighting
- And more!"
        className="textarea textarea-bordered w-full h-full font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        style={{ minHeight: '500px' }}
      />

      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-lg font-semibold text-primary">Drop your markdown file here</p>
            <p className="text-sm text-base-content/60">Supports .md, .markdown, .txt files</p>
          </div>
        </div>
      )}

      {/* Upload button hint */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={triggerFileUpload}
          className="btn btn-ghost btn-sm gap-2 opacity-50 hover:opacity-100"
          title="Upload markdown file"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload File
        </button>
      </div>
    </div>
  );
}
