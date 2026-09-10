import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResultActionsRow } from '../ResultActionsRow';
import { Landmark, RotateCcw } from 'lucide-react';
import { trackEvent } from '../../../utils/analytics';

export const SimpleInterestCalculator: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [principal, setPrincipal] = useState<string>(searchParams.get('principal') || '5000');
  const [rate, setRate] = useState<string>(searchParams.get('rate') || '6.5');
  const [time, setTime] = useState<string>(searchParams.get('time') || '3');
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');

  const [interest, setInterest] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);

    if (isNaN(p) || p < 0) {
      setError('Please enter a valid principal amount.');
      return;
    }
    if (isNaN(r) || r < 0) {
      setError('Please enter a valid interest rate.');
      return;
    }
    if (isNaN(t) || t < 0) {
      setError('Please enter a valid time duration.');
      return;
    }

    const years = timeUnit === 'years' ? t : t / 12;
    // Formula: I = P * R * T / 100
    const calculatedInterest = (p * r * years) / 100;
    const maturity = p + calculatedInterest;

    setInterest(calculatedInterest);
    setTotalAmount(maturity);

    trackEvent('tool_used', { tool: 'simple-interest-calculator', principal: p, rate: r, years });
  };

  useEffect(() => {
    calculate();
  }, [principal, rate, time, timeUnit]);

  const handleReset = () => {
    setPrincipal('5000');
    setRate('6.5');
    setTime('3');
    setTimeUnit('years');
  };

  const resultText = totalAmount !== null
    ? `Principal: $${principal} | Rate: ${rate}% p.a. | Time: ${time} ${timeUnit} | Simple Interest: $${interest?.toFixed(2)} | Total Maturity Value: $${totalAmount.toFixed(2)}`
    : '';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Principal Amount ($)
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-base text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Annual Interest Rate (% per year)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-base text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Time Period
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                min="0"
                step="0.5"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-2/3 px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-base text-gray-900"
              />
              <select
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value as 'years' | 'months')}
                className="w-1/3 px-3 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-sm font-medium bg-white text-gray-900"
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors pt-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to defaults</span>
          </button>
        </div>

        <div className="flex flex-col justify-between bg-slate-50 rounded-xl p-6 border border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
              <Landmark className="w-4 h-4 text-indigo-600" />
              <span>Investment Return</span>
            </div>

            {error ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
                {error}
              </div>
            ) : totalAmount !== null ? (
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 font-medium">Total Maturity Value</div>
                  <div className="text-4xl font-extrabold text-gray-900 tracking-tight mt-1">
                    ${totalAmount.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Principal plus earned interest
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="text-xs text-gray-500">Simple Interest</div>
                    <div className="text-lg font-bold text-emerald-600 mt-0.5">
                      ${interest?.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="text-xs text-gray-500">Initial Principal</div>
                    <div className="text-lg font-bold text-gray-900 mt-0.5">
                      ${parseFloat(principal || '0').toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-white/80 p-3 rounded-lg border border-slate-200">
                  <span className="font-semibold">Formula:</span> Interest = (P × R × T) / 100 = (${principal} × {rate}% × {timeUnit === 'years' ? `${time}y` : `${(parseFloat(time)/12).toFixed(2)}y`}) = <span className="font-semibold text-gray-900">${interest?.toFixed(2)}</span>.
                </div>
              </div>
            ) : null}
          </div>

          {totalAmount !== null && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <ResultActionsRow
                resultText={resultText}
                queryParams={{
                  principal,
                  rate,
                  time,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
