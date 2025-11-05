import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Configure marked with secure defaults
 */
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert line breaks to <br>
  headerIds: true, // Add IDs to headers
  mangle: false, // Don't mangle email addresses
});

/**
 * Convert markdown to sanitized HTML
 * @param {string} markdown - The markdown string to convert
 * @returns {string} - Sanitized HTML string
 */
export function markdownToHtml(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  try {
    // Convert markdown to HTML
    const rawHtml = marked.parse(markdown);

    // Sanitize HTML to prevent XSS attacks
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'ul', 'ol', 'li',
        'blockquote', 'pre', 'code',
        'a', 'strong', 'em', 'del', 'ins',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'img',
      ],
      ALLOWED_ATTR: ['href', 'title', 'alt', 'src', 'class', 'id'],
      ALLOW_DATA_ATTR: false,
    });

    return cleanHtml;
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    return '';
  }
}

/**
 * Validate markdown content
 * @param {string} markdown - The markdown to validate
 * @returns {object} - Validation result with isValid and error properties
 */
export function validateMarkdown(markdown) {
  if (!markdown) {
    return { isValid: false, error: 'Markdown content is required' };
  }

  if (typeof markdown !== 'string') {
    return { isValid: false, error: 'Markdown must be a string' };
  }

  if (markdown.length > 100000) {
    return { isValid: false, error: 'Markdown content is too long (max 100KB)' };
  }

  return { isValid: true };
}
