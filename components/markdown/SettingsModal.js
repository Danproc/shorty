'use client';

/**
 * SettingsModal component for markdown converter
 * Provides options for parsing, rendering, and export settings
 */
export default function SettingsModal({ isOpen, onClose, settings = {}, onSettingsChange }) {
  if (!isOpen) return null;

  const handleToggle = (key) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleThemeChange = (theme) => {
    onSettingsChange({
      ...settings,
      theme: theme,
    });
  };

  const handleReset = () => {
    const defaultSettings = {
      openLinksInNewTab: false,
      addRelAttribute: true,
      allowHtml: false,
      smartQuotes: false,
      highlightCode: true,
      theme: 'minimal',
    };
    onSettingsChange(defaultSettings);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Converter Settings</h3>

        {/* Link Settings */}
        <div className="space-y-4">
          <div className="divider">Link Options</div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">
                <div className="font-semibold">Open links in new tab</div>
                <div className="text-xs text-base-content/60">Add target=&quot;_blank&quot; to all links</div>
              </span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.openLinksInNewTab || false}
                onChange={() => handleToggle('openLinksInNewTab')}
              />
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">
                <div className="font-semibold">Add rel=&quot;nofollow noopener&quot; to links</div>
                <div className="text-xs text-base-content/60">Recommended for security and SEO</div>
              </span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.addRelAttribute !== false}
                onChange={() => handleToggle('addRelAttribute')}
              />
            </label>
          </div>

          {/* HTML Settings */}
          <div className="divider">HTML Options</div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">
                <div className="font-semibold">Allow HTML inside Markdown</div>
                <div className="text-xs text-base-content/60">⚠️ Only enable if you trust the source</div>
              </span>
              <input
                type="checkbox"
                className="toggle toggle-warning"
                checked={settings.allowHtml || false}
                onChange={() => handleToggle('allowHtml')}
              />
            </label>
          </div>

          {/* Typography Settings */}
          <div className="divider">Typography</div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">
                <div className="font-semibold">Smart quotes</div>
                <div className="text-xs text-base-content/60">Convert straight quotes to curly quotes</div>
              </span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.smartQuotes || false}
                onChange={() => handleToggle('smartQuotes')}
              />
            </label>
          </div>

          {/* Code Settings */}
          <div className="divider">Code Blocks</div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">
                <div className="font-semibold">Syntax highlighting</div>
                <div className="text-xs text-base-content/60">Enable Prism syntax highlighting for code blocks</div>
              </span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.highlightCode !== false}
                onChange={() => handleToggle('highlightCode')}
              />
            </label>
          </div>

          {/* Preview Theme */}
          <div className="divider">Preview Theme</div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">CSS Preset for Preview</span>
            </label>
            <div className="flex gap-2">
              <button
                className={`btn btn-sm flex-1 ${settings.theme === 'plain' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleThemeChange('plain')}
              >
                Plain
              </button>
              <button
                className={`btn btn-sm flex-1 ${settings.theme === 'minimal' || !settings.theme ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleThemeChange('minimal')}
              >
                Minimal
              </button>
              <button
                className={`btn btn-sm flex-1 ${settings.theme === 'github' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleThemeChange('github')}
              >
                GitHub
              </button>
            </div>
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                This affects preview display only, not exported HTML
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button onClick={handleReset} className="btn btn-ghost btn-sm">
            Reset to Defaults
          </button>
          <button onClick={onClose} className="btn btn-primary">
            Done
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
