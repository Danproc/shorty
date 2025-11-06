import crypto from 'crypto';

/**
 * Hash a string using SHA-256
 * @param {string} str - String to hash
 * @returns {string} Hashed string
 */
export function hashString(str) {
  if (!str) return null;
  return crypto.createHash('sha256').update(str).digest('hex');
}

/**
 * Get session ID from cookies or generate a new one
 * @param {Request} req - The request object
 * @returns {string} Session ID
 */
export function getSessionId(req) {
  // In a real implementation, you'd use cookies
  // For now, we'll hash the IP + user agent
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const date = new Date().toISOString().split('T')[0]; // Daily session

  return hashString(`${ip}_${userAgent}_${date}`);
}

/**
 * Extract country code from request headers (if available via CF or similar)
 * @param {Request} req - The request object
 * @returns {string|null} Country code
 */
export function getCountryCode(req) {
  // CloudFlare adds this header
  return req.headers.get('cf-ipcountry') || null;
}

/**
 * Get referer from request
 * @param {Request} req - The request object
 * @returns {string|null} Referer URL
 */
export function getReferer(req) {
  return req.headers.get('referer') || req.headers.get('referrer') || null;
}
