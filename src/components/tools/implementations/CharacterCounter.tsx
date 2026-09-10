import React, { useState } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { AlignLeft, RotateCcw } from 'lucide-react';
import { trackEvent } from '../../../utils/analytics';

export const CharacterCounter: React.FC = () => {
  const [text, setText] = useState<string>(
    'SmartTools is a fast, free, global online tools platform designed to work instantly in your browser.'
  );

  const charWithSpaces = text.length;
  const charWithoutSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const sentences = text.trim() === '' ? 0 : (text.match(/[.!?]+(?:\s|$)/g) || []).length || (text.trim() ? 1 : 0);
  const paragraphs = text.trim() === '' ? 0 : text.split(/\n+/).filter((p) => p.trim() !== '').length;
  const byteSize = new Blob([text]).size;
  const readingTimeMins = Math.ceil(words / 200);

  // Social limits
  const twitterLimit = 280;
  const smsLimit = 160;
  const metaLimit = 160;

  const handleClear = () => {
    setText('');
    trackEvent('tool_used', { tool: 'character-counter', action: 'clear' });
  };

  const resultText = `Characters: ${charWithSpaces} (no spaces: ${charWithoutSpaces}) | Words: ${words} | Sentences: ${sentences} | Paragraphs: ${paragraphs} | Size: ${byteSize} bytes`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      {/* Live Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3.5 text-center">
          <div className="text-3xl font-extrabold text-indigo-700 tracking-tight">{charWithSpaces}</div>
          <div className="text-xs font-semibold text-gray-600 mt-0.5">Characters</div>
        </div>
        <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 text-center">
          <div className="text-3xl font-extrabold text-blue-700 tracking-tight">{charWithoutSpaces}</div>
          <div className="text-xs font-semibold text-gray-600 mt-0.5">Without Spaces</div>
        </div>
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 text-center">
          <div className="text-3xl font-extrabold text-emerald-700 tracking-tight">{words}</div>
          <div className="text-xs font-semibold text-gray-600 mt-0.5">Words</div>
        </div>
        <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-3.5 text-center">
          <div className="text-3xl font-extrabold text-purple-700 tracking-tight">{sentences}</div>
          <div className="text-xs font-semibold text-gray-600 mt-0.5">Sentences</div>
        </div>
      </div>

      {/* Input Text Area */}
      <div className="relative mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
            <AlignLeft className="w-4 h-4 text-indigo-600" />
            <span>Enter or paste your text</span>
          </label>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-medium text-gray-500 hover:text-rose-600 transition-colors"
          >
            Clear Text
          </button>
        </div>
        <textarea
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here to measure character and word length in real-time..."
          className="w-full p-4 rounded-xl border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-gray-900 leading-relaxed font-sans"
        />
      </div>

      {/* Social / Channel Character Limits */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Channel Limits Progress
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
              <span>X (Twitter)</span>
              <span className={charWithSpaces > twitterLimit ? 'text-rose-600' : 'text-gray-500'}>
                {charWithSpaces} / {twitterLimit}
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${charWithSpaces > twitterLimit ? 'bg-rose-500' : 'bg-sky-500'}`}
                style={{ width: `${Math.min(100, (charWithSpaces / twitterLimit) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
              <span>SMS Standard</span>
              <span className={charWithSpaces > smsLimit ? 'text-rose-600' : 'text-gray-500'}>
                {charWithSpaces} / {smsLimit}
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${charWithSpaces > smsLimit ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(100, (charWithSpaces / smsLimit) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
              <span>SEO Meta Description</span>
              <span className={charWithSpaces > metaLimit ? 'text-rose-600' : 'text-gray-500'}>
                {charWithSpaces} / {metaLimit}
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${charWithSpaces > metaLimit ? 'bg-rose-500' : 'bg-indigo-500'}`}
                style={{ width: `${Math.min(100, (charWithSpaces / metaLimit) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-3 mt-3 border-t border-slate-200">
          <span>Paragraphs: <strong>{paragraphs}</strong></span>
          <span>Size: <strong>{byteSize} bytes</strong></span>
          <span>Estimated Reading Time: <strong>~{readingTimeMins} min</strong></span>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-200">
        <ResultActionsRow resultText={resultText} />
      </div>
    </div>
  );
};
