import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResultActionsRow } from '../ResultActionsRow';
import { RotateCcw, Percent, TrendingUp, TrendingDown } from 'lucide-react';

export const PercentageCalculator: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [mode, setMode] = useState<'percent_of' | 'is_what_percent' | 'change'>(
    (searchParams.get('mode') as any) || 'percent_of'
  );
  const [val1, setVal1] = useState<string>(searchParams.get('v1') || '15');
  const [val2, setVal2] = useState<string>(searchParams.get('v2') || '120');
  const [error, setError] = useState<string | null>(null);

  interface CalcResult {
    headline: string;
    formatted: string;
    formulaExplanation: string;
    isNegative?: boolean;
  }
  const [result, setResult] = useState<CalcResult | null>(null);

  const calculate = () => {
    setError(null);
    const n1 = parseFloat(val1);
    const n2 = parseFloat(val2);

    if (val1.trim() === '' || val2.trim() === '') {
      setError('Please enter both numerical values.');
      setResult(null);
      return;
    }

    if (isNaN(n1) || isNaN(n2)) {
      setError('Please enter valid numbers.');
      setResult(null);
      return;
    }

    if (mode === 'percent_of') {
      const res = (n1 / 100) * n2;
      const formatted = Number.isInteger(res) ? res.toString() : res.toFixed(2);
      setResult({
        headline: `${n1}% of ${n2}`,
        formatted,
        formulaExplanation: `(${n1} ÷ 100) × ${n2} = ${formatted}`,
      });
    } else if (mode === 'is_what_percent') {
      if (n2 === 0) {
        setError('Cannot divide by zero. Please enter a non-zero base value.');
        setResult(null);
        return;
      }
      const res = (n1 / n2) * 100;
      const formatted = Number.isInteger(res) ? `${res}%` : `${res.toFixed(2)}%`;
      setResult({
        headline: `${n1} of ${n2}`,
        formatted,
        formulaExplanation: `(${n1} ÷ ${n2}) × 100 = ${formatted}`,
      });
    } else if (mode === 'change') {
      if (n1 === 0) {
        setError('Original value cannot be zero for percentage change calculation.');
        setResult(null);
        return;
      }
      const diff = n2 - n1;
      const pct = (diff / Math.abs(n1)) * 100;
      const isNeg = diff < 0;
      const formatted = `${isNeg ? '' : '+'}${pct.toFixed(2)}%`;
      setResult({
        headline: isNeg ? 'Percentage Decrease' : 'Percentage Increase',
        formatted,
        isNegative: isNeg,
        formulaExplanation: `((${n2} - ${n1}) ÷ |${n1}|) × 100 = ${formatted} (${diff >= 0 ? '+' : ''}${diff})`,
      });
    }
  };

  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const handleReset = () => {
    setVal1('15');
    setVal2('120');
    setError(null);
    setMode('percent_of');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs">
      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
        <button
          type="button"
          onClick={() => setMode('percent_of')}
          className={`flex-1 min-w-[140px] py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            mode === 'percent_of'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          What is X% of Y?
        </button>
        <button
          type="button"
          onClick={() => setMode('is_what_percent')}
          className={`flex-1 min-w-[140px] py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            mode === 'is_what_percent'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          X is what % of Y?
        </button>
        <button
          type="button"
          onClick={() => setMode('change')}
          className={`flex-1 min-w-[140px] py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            mode === 'change'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          % Increase / Decrease
        </button>
      </div>

      {/* Input Fields */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          calculate();
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="percentage-val1"
              className="block text-sm font-semibold text-gray-900 mb-1.5"
            >
              {mode === 'percent_of'
                ? 'Percentage (%)'
                : mode === 'is_what_percent'
                ? 'Part Value (X)'
                : 'Initial / Original Value'}
            </label>
            <input
              id="percentage-val1"
              type="number"
              step="any"
              value={val1}
              onChange={(e) => setVal1(e.target.value)}
              placeholder="e.g. 15"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="percentage-val2"
              className="block text-sm font-semibold text-gray-900 mb-1.5"
            >
              {mode === 'percent_of'
                ? 'Total Base Number (Y)'
                : mode === 'is_what_percent'
                ? 'Total Base Number (Y)'
                : 'Final / New Value'}
            </label>
            <input
              id="percentage-val2"
              type="number"
              step="any"
              value={val2}
              onChange={(e) => setVal2(e.target.value)}
              placeholder="e.g. 120"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all"
            />
          </div>
        </div>

        {error && (
          <p id="percentage-error" className="text-xs text-red-600 font-medium pt-1">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            id="calculate-percentage-btn"
            type="submit"
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
          >
            Calculate
          </button>
          <button
            id="reset-percentage-btn"
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-gray-500" />
              <span>Reset</span>
            </span>
          </button>
        </div>
      </form>

      {/* Result Panel */}
      {result && (
        <div
          id="percentage-result-panel"
          className="mt-6 p-5 sm:p-6 rounded-xl bg-indigo-50/50 border border-indigo-100 transition-all duration-200 animate-in fade-in"
        >
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-indigo-700 mb-2">
            <span>{result.headline}</span>
            {result.isNegative !== undefined && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                  result.isNegative
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {result.isNegative ? (
                  <TrendingDown className="w-3.5 h-3.5" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5" />
                )}
                {result.isNegative ? 'Decrease' : 'Increase'}
              </span>
            )}
          </div>

          <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-indigo-900 py-1">
            {result.formatted}
          </div>

          <div className="mt-3 text-xs text-gray-600 font-mono bg-white/70 py-1.5 px-3 rounded-md border border-indigo-100/70 inline-block">
            {result.formulaExplanation}
          </div>

          <ResultActionsRow
            resultText={`${result.headline}: ${result.formatted} (${result.formulaExplanation})`}
            queryParams={{ mode, v1: val1, v2: val2 }}
            className="mt-4"
          />
        </div>
      )}
    </div>
  );
};
