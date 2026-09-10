import React, { useState } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { Sparkles, Trash2, RotateCcw } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { trackEvent } from '../../../utils/analytics';

export const TextCleaner: React.FC = () => {
  const { showToast } = useToast();

  const sampleInput = `  Hello    World!   <p>This is <b>HTML</b></p> 😊🚀\n\n\nToo   many     spaces   and blank lines.   `;

  const [text, setText] = useState<string>(sampleInput);

  const [removeExtraSpaces, setRemoveExtraSpaces] = useState<boolean>(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState<boolean>(true);
  const [stripHtml, setStripHtml] = useState<boolean>(true);
  const [stripEmojis, setStripEmojis] = useState<boolean>(false);
  const [trimLines, setTrimLines] = useState<boolean>(true);

  const cleanText = (): string => {
    let result = text;

    if (stripHtml) {
      result = result.replace(/<[^>]*>/g, '');
    }

    if (stripEmojis) {
      result = result.replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
        ''
      );
    }

    if (trimLines) {
      result = result
        .split('\n')
        .map((line) => line.trim())
        .join('\n');
    }

    if (removeExtraSpaces) {
      result = result.replace(/[ \t]+/g, ' ');
    }

    if (removeEmptyLines) {
      result = result
        .split('\n')
        .filter((line) => line.trim() !== '')
        .join('\n');
    }

    return result.trim();
  };

  const outputText = cleanText();

  const handleClear = () => {
    setText('');
    trackEvent('tool_used', { tool: 'text-cleaner', action: 'clear' });
  };

  const handleReset = () => {
    setText(sampleInput);
    setRemoveExtraSpaces(true);
    setRemoveEmptyLines(true);
    setStripHtml(true);
    setStripEmojis(false);
    setTrimLines(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      {/* Configuration Options */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Cleaning Operations</span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Rules</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-medium text-gray-700">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeExtraSpaces}
              onChange={(e) => setRemoveExtraSpaces(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span>Multiple Spaces &rarr; 1</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeEmptyLines}
              onChange={(e) => setRemoveEmptyLines(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span>Strip Blank Lines</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={stripHtml}
              onChange={(e) => setStripHtml(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span>Strip HTML/XML Tags</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={stripEmojis}
              onChange={(e) => setStripEmojis(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span>Remove Emojis</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={trimLines}
              onChange={(e) => setTrimLines(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span>Trim Line Ends</span>
          </label>
        </div>
      </div>

      {/* Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Raw Input Text
            </label>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-rose-600"
            >
              Clear
            </button>
          </div>
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text here to clean formatting..."
            className="w-full p-3.5 text-xs text-gray-900 border border-gray-300 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 font-sans leading-relaxed"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Cleaned Output
            </label>
            <span className="text-[11px] text-gray-500 font-medium">
              {outputText.length} characters
            </span>
          </div>
          <textarea
            readOnly
            rows={10}
            value={outputText}
            className="w-full p-3.5 text-xs text-gray-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden font-sans leading-relaxed"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-gray-200">
        <ResultActionsRow resultText={outputText} />
      </div>
    </div>
  );
};
