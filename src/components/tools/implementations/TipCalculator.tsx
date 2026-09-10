import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResultActionsRow } from '../ResultActionsRow';
import { DollarSign, Users, RotateCcw } from 'lucide-react';
import { trackEvent } from '../../../utils/analytics';

export const TipCalculator: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [bill, setBill] = useState<string>(searchParams.get('bill') || '65.00');
  const [tipPercent, setTipPercent] = useState<string>(searchParams.get('tip') || '18');
  const [people, setPeople] = useState<string>(searchParams.get('people') || '2');
  const [roundUp, setRoundUp] = useState<boolean>(searchParams.get('round') === 'true');

  const [tipAmount, setTipAmount] = useState<number | null>(null);
  const [totalBill, setTotalBill] = useState<number | null>(null);
  const [tipPerPerson, setTipPerPerson] = useState<number | null>(null);
  const [totalPerPerson, setTotalPerPerson] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    const b = parseFloat(bill);
    const t = parseFloat(tipPercent);
    const p = parseInt(people, 10);

    if (isNaN(b) || b < 0) {
      setError('Please enter a valid bill amount.');
      return;
    }
    if (isNaN(t) || t < 0) {
      setError('Please enter a valid tip percentage.');
      return;
    }
    if (isNaN(p) || p <= 0) {
      setError('Number of people must be at least 1.');
      return;
    }

    let calculatedTip = b * (t / 100);
    let calculatedTotal = b + calculatedTip;

    if (roundUp) {
      const perPersonRough = calculatedTotal / p;
      const roundedPerPerson = Math.ceil(perPersonRough);
      calculatedTotal = roundedPerPerson * p;
      calculatedTip = calculatedTotal - b;
    }

    setTipAmount(calculatedTip);
    setTotalBill(calculatedTotal);
    setTipPerPerson(calculatedTip / p);
    setTotalPerPerson(calculatedTotal / p);

    trackEvent('tool_used', { tool: 'tip-calculator', bill: b, tip: t, people: p });
  };

  useEffect(() => {
    calculate();
  }, [bill, tipPercent, people, roundUp]);

  const presetTips = [10, 15, 18, 20, 22, 25];

  const handleReset = () => {
    setBill('65.00');
    setTipPercent('18');
    setPeople('2');
    setRoundUp(false);
  };

  const resultText = totalBill !== null
    ? `Bill: $${bill} | Tip (${tipPercent}%): $${tipAmount?.toFixed(2)} | Total: $${totalBill.toFixed(2)} | Split (${people} people): $${totalPerPerson?.toFixed(2)} per person`
    : '';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input parameters */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Bill Amount ($)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={bill}
                onChange={(e) => setBill(e.target.value)}
                placeholder="65.00"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-base text-gray-900"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-gray-800">
                Tip Percentage (%)
              </label>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                {tipPercent}%
              </span>
            </div>
            <input
              type="number"
              min="0"
              max="100"
              value={tipPercent}
              onChange={(e) => setTipPercent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-base text-gray-900"
            />
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {presetTips.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTipPercent(p.toString())}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    tipPercent === p.toString()
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Split between (number of people)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Users className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="1"
                step="1"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-base text-gray-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="roundUpCheckbox"
              checked={roundUp}
              onChange={(e) => setRoundUp(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label htmlFor="roundUpCheckbox" className="text-sm text-gray-700 font-medium cursor-pointer">
              Round up to neat dollar per person
            </label>
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

        {/* Results */}
        <div className="flex flex-col justify-between bg-emerald-50/50 rounded-xl p-6 border border-emerald-100">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-4">
              Payment Summary
            </div>

            {error ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
                {error}
              </div>
            ) : totalBill !== null ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-emerald-200">
                  <div className="text-xs text-gray-500 font-medium">Total Per Person</div>
                  <div className="text-4xl font-extrabold text-emerald-700 tracking-tight mt-1">
                    ${totalPerPerson?.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    (${tipPerPerson?.toFixed(2)} tip per person)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-emerald-100">
                    <div className="text-xs text-gray-500">Total Tip</div>
                    <div className="text-lg font-bold text-gray-900 mt-0.5">
                      ${tipAmount?.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-emerald-100">
                    <div className="text-xs text-gray-500">Total Bill + Tip</div>
                    <div className="text-lg font-bold text-gray-900 mt-0.5">
                      ${totalBill?.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-emerald-900 bg-white/70 p-3 rounded-lg border border-emerald-100">
                  Bill of <span className="font-semibold">${parseFloat(bill || '0').toFixed(2)}</span> with{' '}
                  <span className="font-semibold">{tipPercent}% tip</span> divided evenly among{' '}
                  <span className="font-semibold">{people} {parseInt(people, 10) === 1 ? 'person' : 'people'}</span>.
                </div>
              </div>
            ) : null}
          </div>

          {totalBill !== null && (
            <div className="mt-6 pt-4 border-t border-emerald-200">
              <ResultActionsRow
                resultText={resultText}
                queryParams={{
                  bill,
                  tip: tipPercent,
                  people,
                  round: roundUp ? 'true' : 'false',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
