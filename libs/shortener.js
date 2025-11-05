import { nanoid } from 'nanoid';

/**
 * Generate a unique short code
 * @param {number} length - Length of the short code (default: 7)
 * @returns {string} - Unique short code
 */
export function generateShortCode(length = 7) {
  return nanoid(length);
}

/**
 * Validate if a URL is properly formatted
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Normalize URL by ensuring it has a protocol
 * @param {string} url - URL to normalize
 * @returns {string} - Normalized URL
 */
export function normalizeUrl(url) {
  if (!url) return '';

  // Remove whitespace
  url = url.trim();

  // Add https:// if no protocol specified
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  return url;
}

/**
 * Validate custom slug (alphanumeric, hyphens, underscores only)
 * @param {string} slug - Custom slug to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidCustomSlug(slug) {
  if (!slug || slug.length < 3 || slug.length > 20) {
    return false;
  }

  // Only allow alphanumeric characters, hyphens, and underscores
  const slugRegex = /^[a-zA-Z0-9_-]+$/;
  return slugRegex.test(slug);
}

/**
 * Check if a slug is reserved (system routes)
 * @param {string} slug - Slug to check
 * @returns {boolean} - True if reserved, false otherwise
 */
export function isReservedSlug(slug) {
  const reserved = [
    'api',
    'dashboard',
    'signin',
    'signup',
    'blog',
    'privacy-policy',
    'tos',
    'admin',
    'app',
    'static',
    '_next',
    'public',
    'r', // our redirect route prefix
  ];

  return reserved.includes(slug.toLowerCase());
}

/**
 * Format click count for display
 * @param {number} count - Click count
 * @returns {string} - Formatted count (e.g., "1.2K", "3.4M")
 */
export function formatClickCount(count) {
  if (!count || count < 1000) {
    return count?.toString() || '0';
  }

  if (count < 1000000) {
    return (count / 1000).toFixed(1) + 'K';
  }

  return (count / 1000000).toFixed(1) + 'M';
}

/**
 * Get the full short URL
 * @param {string} shortCode - Short code
 * @param {string} baseUrl - Base URL (from env or config)
 * @returns {string} - Full short URL
 */
export function getShortUrl(shortCode, baseUrl) {
  // Remove trailing slash from baseUrl if present
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  return `${cleanBaseUrl}/r/${shortCode}`;
}

/**
 * Check if URL has expired
 * @param {string|Date} expiresAt - Expiration date
 * @returns {boolean} - True if expired, false otherwise
 */
export function isExpired(expiresAt) {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}
