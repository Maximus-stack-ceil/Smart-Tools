import React, { useState, useEffect } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { RotateCcw, Copy, Check, RefreshCw } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const UuidGenerator: React.FC = () => {
  const { showToast } = useToast();

  const [count, setCount] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [removeHyphens, setRemoveHyphens] = useState<boolean>(false);
  const [uuids, setUuids] = useState<string[]>([]);

  const generateUuids = () => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let id = window.crypto.randomUUID ? window.crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });

      if (removeHyphens) {
        id = id.replace(/-/g, '');
      }
      if (uppercase) {
        id = id.toUpperCase();
      } else {
        id = id.toLowerCase();
      }
      list.push(id);
    }
    setUuids(list);
  };

  useEffect(() => {
    generateUuids();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, uppercase, removeHyphens]);

  const handleCopySingle = (id: string) => {
    navigator.clipboard.writeText(id);
    showToast('Copied UUID to clipboard!');
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    showToast(`Copied ${uuids.length} UUIDs to clipboard!`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs">
      <div className="space-y-5">
        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="uuid-count" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Quantity to Generate: {count}
            </label>
            <input
              id="uuid-count"
              type="range"
              min={1}
              max={30}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>1</span>
              <span>10</span>
              <span>20</span>
              <span>30</span>
            </div>
          </div>

          <div className="sm:col-span-2 flex flex-wrap items-center gap-4 pt-4 sm:pt-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 border-gray-300"
              />
              <span>UPPERCASE</span>
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={removeHyphens}
                onChange={(e) => setRemoveHyphens(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 border-gray-300"
              />
              <span>Remove Hyphens</span>
            </label>

            <button
              type="button"
              onClick={generateUuids}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1.5 ml-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
            <span>Generated UUIDs ({uuids.length})</span>
            <button
              type="button"
              onClick={handleCopyAll}
              className="text-indigo-600 hover:text-indigo-800 normal-case font-medium flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy All
            </button>
          </div>

          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto rounded-xl border border-gray-200">
            {uuids.map((id, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 p-3 hover:bg-gray-50 bg-white transition-colors"
              >
                <span className="font-mono text-xs sm:text-sm text-gray-900 select-all truncate">
                  {id}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopySingle(id)}
                  className="px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-md border border-gray-200 shrink-0 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>

        <ResultActionsRow resultText={uuids.join('\n')} className="mt-4" />
      </div>
    </div>
  );
};
