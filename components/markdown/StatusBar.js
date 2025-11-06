'use client';

import { countWords } from '@/libs/markdown';

/**
 * StatusBar component for markdown converter
 * Shows character count, word count, and render time
 */
export default function StatusBar({ markdown = '', renderTime = 0 }) {
  const charCount = markdown.length;
  const wordCount = countWords(markdown);

  return (
    <div className="flex items-center justify-between text-xs text-base-content/60 px-4 py-2 bg-base-200 border-t border-base-300">
      <div className="flex items-center gap-4">
        <span title="Character count">
          {charCount.toLocaleString()} characters
        </span>
        <span className="text-base-content/40">•</span>
        <span title="Word count">
          {wordCount.toLocaleString()} words
        </span>
      </div>

      {renderTime > 0 && (
        <div className="flex items-center gap-2">
          <span title="Render time">
            Rendered in {renderTime}ms
          </span>
        </div>
      )}
    </div>
  );
}
