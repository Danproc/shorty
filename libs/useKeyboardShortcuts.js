import { useEffect } from 'react';

/**
 * Custom hook for keyboard shortcuts
 * @param {Object} handlers - Object mapping key combinations to handler functions
 * @param {Function} handlers.onCopyHtml - Handler for Ctrl/Cmd+C when HTML tab is active
 * @param {Function} handlers.onDownloadHtml - Handler for Ctrl/Cmd+S
 * @param {Function} handlers.onRefresh - Handler for Ctrl/Cmd+Enter
 * @param {Function} handlers.onClear - Handler for Escape
 * @param {string} activeTab - Currently active tab ('editor' or 'html')
 * @param {boolean} isModalOpen - Whether settings modal is open
 */
export function useKeyboardShortcuts(handlers, { activeTab, isModalOpen } = {}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Don't trigger shortcuts if modal is open
      if (isModalOpen) {
        // Allow Escape to close modal
        if (event.key === 'Escape' && handlers.onClear) {
          event.preventDefault();
          handlers.onClear();
        }
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

      // Ctrl/Cmd + C (when HTML tab is active)
      if (cmdOrCtrl && event.key === 'c' && activeTab === 'html' && handlers.onCopyHtml) {
        event.preventDefault();
        handlers.onCopyHtml();
        return;
      }

      // Ctrl/Cmd + S (Download HTML)
      if (cmdOrCtrl && event.key === 's' && handlers.onDownloadHtml) {
        event.preventDefault();
        handlers.onDownloadHtml();
        return;
      }

      // Ctrl/Cmd + Enter (Refresh/Re-render)
      if (cmdOrCtrl && event.key === 'Enter' && handlers.onRefresh) {
        event.preventDefault();
        handlers.onRefresh();
        return;
      }

      // Escape (Clear confirmation - handled by parent)
      if (event.key === 'Escape' && handlers.onEscape) {
        event.preventDefault();
        handlers.onEscape();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers, activeTab, isModalOpen]);
}

/**
 * Get keyboard shortcut display text based on platform
 */
export function getShortcutText(key) {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const mod = isMac ? '⌘' : 'Ctrl';

  const shortcuts = {
    copy: `${mod}+C`,
    save: `${mod}+S`,
    refresh: `${mod}+Enter`,
    escape: 'Esc',
  };

  return shortcuts[key] || '';
}
