/**
 * QR Code utility functions for generating and downloading QR codes
 */

/**
 * QR code generation options
 */
export const QR_CODE_DEFAULTS = {
  size: 256,
  level: 'M', // Error correction level: L, M, Q, H
  bgColor: '#ffffff',
  fgColor: '#000000',
  includeMargin: true,
};

/**
 * Get QR code options with custom overrides
 * @param {object} overrides - Custom options to override defaults
 * @returns {object} - Merged options
 */
export function getQRCodeOptions(overrides = {}) {
  return {
    ...QR_CODE_DEFAULTS,
    ...overrides,
  };
}

/**
 * Download QR code as PNG
 * @param {string} shortCode - Short code for the file name
 */
export function downloadQRCode(shortCode) {
  const canvas = document.getElementById('qr-code-canvas');

  if (!canvas) {
    console.error('QR code canvas not found');
    return;
  }

  // Create download link
  const url = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = url;
  link.download = `qr-code-${shortCode}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download QR code as SVG
 * @param {string} shortCode - Short code for the file name
 */
export function downloadQRCodeSVG(shortCode) {
  const svg = document.getElementById('qr-code-svg');

  if (!svg) {
    console.error('QR code SVG not found');
    return;
  }

  // Get SVG data
  const svgData = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  // Create download link
  const link = document.createElement('a');
  link.href = url;
  link.download = `qr-code-${shortCode}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Copy QR code to clipboard
 * @param {string} shortUrl - Short URL to copy
 * @returns {Promise<boolean>} - True if successful
 */
export async function copyQRCodeToClipboard(shortUrl) {
  try {
    await navigator.clipboard.writeText(shortUrl);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Get QR code size based on screen size
 * @returns {number} - QR code size in pixels
 */
export function getResponsiveQRSize() {
  if (typeof window === 'undefined') return 256;

  const width = window.innerWidth;

  if (width < 640) return 200; // mobile
  if (width < 768) return 220; // tablet
  if (width < 1024) return 240; // small desktop
  return 256; // large desktop
}

/**
 * Validate if QR code can be generated for the given text
 * @param {string} text - Text to validate (URL, plain text, etc.)
 * @returns {boolean} - True if valid
 */
export function canGenerateQRCode(text) {
  if (!text || typeof text !== 'string') return false;

  // QR codes have a maximum capacity
  // For alphanumeric data with error correction level M, max is ~2953 chars
  // We use 2000 as a safe limit to ensure compatibility
  if (text.length > 2000) return false;

  return true;
}
