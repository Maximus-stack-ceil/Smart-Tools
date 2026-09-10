import React, { useState } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { Copy, Trash2, RotateCcw, Filter } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { trackEvent } from '../../../utils/analytics';

export const RemoveDuplicateLines: React.FC = () => {
  const { showToast } = useToast();

  const sampleInput = `apple\nbanana\norange\napple\nApple\ngrape\nbanana\nwatermelon`;

  const [inputLines, setInputLines] = useState<string>(sampleInput);
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true);
  const [sortAlpha, setSortAlpha] = useState<boolean>(false);

  // Compute deduplicated lines
  const rawArray = inputLines.split('\n');
  const totalOriginal = rawArray.length;

  const seen = new Set<string>();
  const outputArray: string[] = [];

  rawArray.forEach((line) => {
    let key = trimWhitespace ? line.trim() : line;
    if (!caseSensitive) {
      key = key.toLowerCase();
    }

    if (!seen.has(key)) {
      seen.add(key);
      outputArray.push(trimWhitespace ? line.trim() : line);
    }
  });

  if (sortAlpha) {
    outputArray.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }

  const outputText = outputArray.join('\n');
  const duplicatesRemoved = totalOriginal - outputArray.length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      showToast('Deduplicated text copied!');
      trackEvent('tool_used', { tool: 'remove-duplicate-lines', action: 'copy' });
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleClear = () => {
    setInputLines('');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      {/* Configuration Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl mb-5">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-700">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span>Case Sensitive</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={trimWhitespace}
              onChange={(e) => setTrimWhitespace(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span>Trim Whitespace</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={sortAlpha}
              onChange={(e) => setSortAlpha(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span>Sort Alphabetically</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:text-rose-600 font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Side-by-side Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Input Text ({totalOriginal} lines)
            </label>
          </div>
          <textarea
            rows={10}
            value={inputLines}
            onChange={(e) => setInputLines(e.target.value)}
            placeholder="Paste multiple lines of text here..."
            className="w-full p-3.5 font-mono text-xs text-gray-900 border border-gray-300 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              <span>Deduplicated ({outputArray.length} unique lines)</span>
            </label>
            <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              {duplicatesRemoved} duplicates removed
            </span>
          </div>
          <textarea
            readOnly
            rows={10}
            value={outputText}
            className="w-full p-3.5 font-mono text-xs text-gray-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-gray-200">
        <ResultActionsRow resultText={outputText} />
      </div>
    </div>
  );
};
