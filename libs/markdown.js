import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import DOMPurify from 'isomorphic-dompurify';
import Prism from 'prismjs';

// Import Prism language definitions
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-diff';

// Configure marked with GFM extensions
marked.use(gfmHeadingId());

/**
 * Default markdown parsing options
 */
const DEFAULT_OPTIONS = {
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert line breaks to <br>
  headerIds: false, // Don't add IDs by default
  mangle: false, // Don't mangle email addresses
};

/**
 * Configure DOMPurify sanitization options
 */
const getSanitizeConfig = (options = {}) => {
  const config = {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'a', 'strong', 'em', 'del', 'ins', 'sup', 'sub',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
      'img', 'span', 'div',
      'input', // For task lists
    ],
    ALLOWED_ATTR: ['href', 'title', 'alt', 'src', 'type', 'checked', 'disabled', 'class'],
    ALLOW_DATA_ATTR: false,
  };

  // Add target and rel for links if option is set
  if (options.openLinksInNewTab) {
    config.ALLOWED_ATTR.push('target', 'rel');
  }

  // Allow HTML passthrough if option is set
  if (options.allowHtml) {
    config.ALLOWED_TAGS.push('iframe', 'video', 'audio', 'source');
    config.ALLOWED_ATTR.push('width', 'height', 'frameborder', 'allowfullscreen', 'controls', 'autoplay', 'loop', 'muted');
  }

  return config;
};

/**
 * Highlight code blocks using Prism
 */
const highlightCode = (code, lang) => {
  if (!lang || !Prism.languages[lang]) {
    return code;
  }

  try {
    return Prism.highlight(code, Prism.languages[lang], lang);
  } catch (error) {
    console.error(`Error highlighting code for language ${lang}:`, error);
    return code;
  }
};

/**
 * Custom renderer for code blocks with syntax highlighting
 */
const renderer = {
  code(code, infostring) {
    const lang = infostring || '';
    const validLang = lang && Prism.languages[lang] ? lang : 'text';
    const highlighted = highlightCode(code, validLang);

    return `<pre><code class="language-${validLang}">${highlighted}</code></pre>`;
  },

  // Render checkboxes for task lists
  listitem(text, task, checked) {
    if (task) {
      return `<li><input type="checkbox" ${checked ? 'checked' : ''} disabled /> ${text}</li>`;
    }
    return `<li>${text}</li>`;
  },

  // Process links based on options
  link(href, title, text) {
    const titleAttr = title ? ` title="${title}"` : '';
    return `<a href="${href}"${titleAttr}>${text}</a>`;
  }
};

/**
 * Convert markdown to sanitized HTML
 * @param {string} markdown - The markdown string to convert
 * @param {object} options - Parsing options
 * @param {boolean} options.openLinksInNewTab - Open links in new tab
 * @param {string} options.rel - rel attribute for links
 * @param {boolean} options.allowHtml - Allow HTML passthrough
 * @param {boolean} options.smartQuotes - Use smart quotes
 * @param {boolean} options.highlightCode - Enable syntax highlighting
 * @returns {object} - { html: string, renderTime: number }
 */
export function markdownToHtml(markdown, options = {}) {
  if (!markdown || typeof markdown !== 'string') {
    return { html: '', renderTime: 0 };
  }

  const startTime = performance.now();

  try {
    // Configure marked with options
    const markedOptions = {
      ...DEFAULT_OPTIONS,
      renderer: options.highlightCode !== false ? renderer : undefined,
      smartypants: options.smartQuotes || false,
    };

    marked.setOptions(markedOptions);

    // Convert markdown to HTML
    let rawHtml = marked.parse(markdown);

    // Post-process links if needed
    if (options.openLinksInNewTab) {
      const relAttr = options.rel || 'nofollow noopener noreferrer';
      rawHtml = rawHtml.replace(
        /<a href="([^"]+)"([^>]*)>/g,
        `<a href="$1" target="_blank" rel="${relAttr}"$2>`
      );
    }

    // Sanitize HTML to prevent XSS attacks
    const sanitizeConfig = getSanitizeConfig(options);
    const cleanHtml = DOMPurify.sanitize(rawHtml, sanitizeConfig);

    const renderTime = Math.round(performance.now() - startTime);

    return { html: cleanHtml, renderTime };
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    return { html: '', renderTime: 0, error: error.message };
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

  if (markdown.length > 500000) {
    return { isValid: false, error: 'Markdown content is too long (max 500KB)' };
  }

  return { isValid: true };
}

/**
 * Count words in text
 * @param {string} text - The text to count
 * @returns {number} - Word count
 */
export function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Estimate reading time in minutes
 * @param {string} text - The text to analyze
 * @returns {number} - Estimated reading time in minutes
 */
export function estimateReadingTime(text) {
  const words = countWords(text);
  return Math.ceil(words / 200); // Average reading speed: 200 words per minute
}
