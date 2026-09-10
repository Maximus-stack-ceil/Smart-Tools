import React, { useState } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { Link2, ArrowLeftRight, RotateCcw } from 'lucide-react';
import { trackEvent } from '../../../utils/analytics';

export const UrlEncoderDecoder: React.FC = () => {
  const sample = 'https://example.com/search?q=smart tools & free calculators=1&tag=#1';

  const [input, setInput] = useState<string>(sample);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeMode, setEncodeMode] = useState<'component' | 'full'>('component');

  const processText = (): string => {
    if (!input) return '';
    try {
      if (mode === 'encode') {
        return encodeMode === 'component' ? encodeURIComponent(input) : encodeURI(input);
      } else {
        return decodeURIComponent(input);
      }
    } catch {
      return 'Error: Malformed URI sequence encountered.';
    }
  };

  const output = processText();

  // Extract query parameters if input looks like a URL
  const extractParams = () => {
    try {
      let target = input;
      if (!target.startsWith('http://') && !target.startsWith('https://')) {
        target = 'https://dummy.domain/' + (target.startsWith('?') ? target : `?${target}`);
      }
      const parsed = new URL(target);
      const entries: [string, string][] = [];
      parsed.searchParams.forEach((val, key) => {
        entries.push([key, val]);
      });
      return entries;
    } catch {
      return [];
    }
  };

  const queryParams = extractParams();

  const handleSwap = () => {
    setInput(output);
    setMode(mode === 'encode' ? 'decode' : 'encode');
    trackEvent('tool_used', { tool: 'url-encoder-decoder', action: 'swap' });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      {/* Mode Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl mb-5">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('encode')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'encode'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            URL Encode
          </button>
          <button
            type="button"
            onClick={() => setMode('decode')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'decode'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            URL Decode
          </button>
        </div>

        {mode === 'encode' && (
          <div className="flex items-center gap-3 text-xs font-medium text-gray-700">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="encodeScope"
                checked={encodeMode === 'component'}
                onChange={() => setEncodeMode('component')}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span>encodeURIComponent (all special characters)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="encodeScope"
                checked={encodeMode === 'full'}
                onChange={() => setEncodeMode('full')}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span>encodeURI (preserve URL syntax)</span>
            </label>
          </div>
        )}

        <button
          type="button"
          onClick={handleSwap}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Swap Input & Output</span>
        </button>
      </div>

      {/* Editor Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Input URL or Text
          </label>
          <textarea
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste URL or encoded string here..."
            className="w-full p-3.5 font-mono text-xs text-gray-900 border border-gray-300 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1.5">
            {mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}
          </label>
          <textarea
            readOnly
            rows={8}
            value={output}
            className="w-full p-3.5 font-mono text-xs text-gray-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
          />
        </div>
      </div>

      {/* Parsed Query Parameters Table if applicable */}
      {queryParams.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Parsed Query Parameters ({queryParams.length})
          </div>
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden divide-y divide-gray-100 text-xs font-mono">
            {queryParams.map(([k, v], idx) => (
              <div key={idx} className="flex justify-between p-2.5">
                <span className="font-bold text-indigo-700">{k}</span>
                <span className="text-gray-700 break-all pl-4 text-right">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-gray-200">
        <ResultActionsRow resultText={output} />
      </div>
    </div>
  );
};
