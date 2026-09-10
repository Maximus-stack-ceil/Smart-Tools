import React, { useState } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { Dices, RefreshCw, RotateCcw } from 'lucide-react';
import { trackEvent } from '../../../utils/analytics';

export const RandomNumberGenerator: React.FC = () => {
  const [min, setMin] = useState<string>('1');
  const [max, setMax] = useState<string>('100');
  const [count, setCount] = useState<string>('5');
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(true);
  const [isDecimal, setIsDecimal] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  const [numbers, setNumbers] = useState<number[]>([14, 42, 77, 88, 93]);
  const [error, setError] = useState<string | null>(null);

  const generate = () => {
    setError(null);
    const minVal = parseFloat(min);
    const maxVal = parseFloat(max);
    const qty = parseInt(count, 10);

    if (isNaN(minVal) || isNaN(maxVal)) {
      setError('Please enter valid Min and Max values.');
      return;
    }
    if (minVal >= maxVal) {
      setError('Min value must be less than Max value.');
      return;
    }
    if (isNaN(qty) || qty <= 0 || qty > 1000) {
      setError('Quantity must be between 1 and 1000.');
      return;
    }

    if (!allowDuplicates && !isDecimal) {
      const possibleRange = maxVal - minVal + 1;
      if (qty > possibleRange) {
        setError(`Cannot generate ${qty} unique integers in a range of ${possibleRange} possible values.`);
        return;
      }
    }

    const results: number[] = [];
    const used = new Set<number>();

    while (results.length < qty) {
      let num: number;
      if (isDecimal) {
        num = parseFloat((Math.random() * (maxVal - minVal) + minVal).toFixed(2));
      } else {
        num = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
      }

      if (!allowDuplicates) {
        if (!used.has(num)) {
          used.add(num);
          results.push(num);
        }
      } else {
        results.push(num);
      }
    }

    if (sortOrder === 'asc') {
      results.sort((a, b) => a - b);
    } else if (sortOrder === 'desc') {
      results.sort((a, b) => b - a);
    }

    setNumbers(results);
    trackEvent('tool_used', { tool: 'random-number-generator', count: qty, min: minVal, max: maxVal });
  };

  const handleRollDice = (sides: number) => {
    setMin('1');
    setMax(sides.toString());
    setCount('1');
    setAllowDuplicates(true);
    setIsDecimal(false);
    const rolled = Math.floor(Math.random() * sides) + 1;
    setNumbers([rolled]);
    trackEvent('tool_used', { tool: 'random-number-generator', preset: `d${sides}` });
  };

  const resultText = numbers.join(', ');

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      {/* Quick Dice Presets */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-1">
          Dice & Games:
        </span>
        <button
          type="button"
          onClick={() => handleRollDice(6)}
          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Roll 6-Sided Die (d6)
        </button>
        <button
          type="button"
          onClick={() => handleRollDice(20)}
          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Roll d20
        </button>
        <button
          type="button"
          onClick={() => handleRollDice(2)}
          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Coin Flip (1 or 2)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Minimum (From)</label>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-indigo-600 text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Maximum (To)</label>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-indigo-600 text-sm text-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                max="500"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-indigo-600 text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Sort Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-indigo-600 text-xs font-medium bg-white text-gray-900"
              >
                <option value="none">As Generated</option>
                <option value="asc">Ascending (Low &rarr; High)</option>
                <option value="desc">Descending (High &rarr; Low)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-700 pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={allowDuplicates}
                onChange={(e) => setAllowDuplicates(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span>Allow Duplicates</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isDecimal}
                onChange={(e) => setIsDecimal(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span>Decimal (Floats)</span>
            </label>
          </div>

          <button
            type="button"
            onClick={generate}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generate Random Numbers</span>
          </button>
        </div>

        {/* Results Box */}
        <div className="flex flex-col justify-between bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              <span className="flex items-center gap-1.5">
                <Dices className="w-4 h-4 text-indigo-600" />
                <span>Generated Output ({numbers.length})</span>
              </span>
            </div>

            {error ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
                {error}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-2">
                {numbers.map((n, idx) => (
                  <div
                    key={idx}
                    className="px-3.5 py-2 bg-white rounded-xl border border-gray-200 text-gray-900 font-mono font-bold text-base shadow-xs"
                  >
                    {n}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200">
            <ResultActionsRow resultText={resultText} />
          </div>
        </div>
      </div>
    </div>
  );
};
