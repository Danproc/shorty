/**
 * File helper utilities for markdown converter
 */

/**
 * Download a file to the user's computer
 * @param {string} content - File content
 * @param {string} filename - Name of the file
 * @param {string} mimeType - MIME type (default: text/plain)
 */
export function downloadFile(content, filename, mimeType = 'text/plain') {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error downloading file:', error);
    return false;
  }
}

/**
 * Download markdown as .md file
 * @param {string} content - Markdown content
 * @param {string} filename - Filename without extension
 */
export function downloadMarkdown(content, filename = 'document') {
  const cleanFilename = filename.replace(/\.[^/.]+$/, '');
  return downloadFile(content, `${cleanFilename}.md`, 'text/markdown');
}

/**
 * Download HTML as .html file with proper structure
 * @param {string} htmlContent - HTML content (can be a fragment)
 * @param {string} filename - Filename without extension
 * @param {object} options - HTML generation options
 * @param {string} options.title - Document title
 * @param {string} options.theme - CSS theme to include
 * @param {boolean} options.includeStyles - Whether to include styles
 */
export function downloadHtml(htmlContent, filename = 'document', options = {}) {
  const cleanFilename = filename.replace(/\.[^/.]+$/, '');
  const title = options.title || cleanFilename;

  // Build complete HTML document
  let fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>`;

  // Add Prism CSS for code highlighting if needed
  if (options.includeStyles !== false) {
    fullHtml += `
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css">
  <style>
    body {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    ${getThemeStyles(options.theme)}
  </style>`;
  }

  fullHtml += `
</head>
<body>
  ${htmlContent}
</body>
</html>`;

  return downloadFile(fullHtml, `${cleanFilename}.html`, 'text/html');
}

/**
 * Get CSS styles for a specific theme
 * @param {string} theme - Theme name (plain, minimal, github)
 * @returns {string} - CSS styles
 */
function getThemeStyles(theme) {
  switch (theme) {
    case 'minimal':
      return `
        h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 600; }
        h1 { font-size: 2.5em; border-bottom: 2px solid #eee; padding-bottom: 0.3em; }
        h2 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
        code { background: #f6f6f6; padding: 0.2em 0.4em; border-radius: 3px; font-size: 0.9em; }
        pre { background: #f6f6f6; padding: 1em; border-radius: 5px; overflow-x: auto; }
        pre code { background: none; padding: 0; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 1em; color: #666; }
        table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        th, td { border: 1px solid #ddd; padding: 0.5em; text-align: left; }
        th { background: #f6f6f6; font-weight: 600; }
      `;

    case 'github':
      return `
        h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25; }
        h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
        h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
        code { background: rgba(27,31,35,.05); padding: 0.2em 0.4em; border-radius: 3px; font-size: 85%; }
        pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
        pre code { background: none; padding: 0; }
        blockquote { border-left: 4px solid #dfe2e5; margin: 0; padding: 0 1em; color: #6a737d; }
        table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        th, td { border: 1px solid #dfe2e5; padding: 6px 13px; }
        th { background: #f6f8fa; font-weight: 600; }
        tr:nth-child(2n) { background: #f6f8fa; }
        a { color: #0366d6; text-decoration: none; }
        a:hover { text-decoration: underline; }
      `;

    default: // plain
      return `
        h1, h2, h3, h4, h5, h6 { margin-top: 1em; margin-bottom: 0.5em; }
        code { font-family: 'Courier New', Courier, monospace; }
        pre { overflow-x: auto; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; }
      `;
  }
}

/**
 * Read a file from user's computer
 * @param {File} file - File object from input or drop event
 * @returns {Promise<string>} - File content as text
 */
export function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      resolve(e.target.result);
    };

    reader.onerror = (e) => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Validate file type for markdown
 * @param {File} file - File object
 * @returns {boolean} - True if valid markdown file
 */
export function isValidMarkdownFile(file) {
  const validExtensions = ['.md', '.markdown', '.txt'];
  const fileName = file.name.toLowerCase();
  return validExtensions.some(ext => fileName.endsWith(ext));
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Generate a safe filename from a title
 * @param {string} title - Title or text
 * @returns {string} - Safe filename
 */
export function sanitizeFilename(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50) || 'document';
}

/**
 * Copy text to clipboard with fallback
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

/**
 * Copy formatted HTML to clipboard (for Word paste)
 * @param {string} html - HTML content
 * @param {string} plainText - Plain text fallback
 * @returns {Promise<boolean>} - Success status
 */
export async function copyFormattedHtml(html, plainText) {
  try {
    const htmlBlob = new Blob([html], { type: 'text/html' });
    const textBlob = new Blob([plainText], { type: 'text/plain' });

    const clipboardItem = new ClipboardItem({
      'text/html': htmlBlob,
      'text/plain': textBlob,
    });

    await navigator.clipboard.write([clipboardItem]);
    return true;
  } catch (error) {
    console.error('Error copying formatted HTML:', error);
    // Fallback to copying just the HTML string
    return copyToClipboard(html);
  }
}
