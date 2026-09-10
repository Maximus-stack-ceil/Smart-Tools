import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResultActionsRow } from '../ResultActionsRow';
import { TrendingUp, RotateCcw } from 'lucide-react';
import { trackEvent } from '../../../utils/analytics';

export const CompoundInterestCalculator: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [principal, setPrincipal] = useState<string>(searchParams.get('principal') || '10000');
  const [monthlyContribution, setMonthlyContribution] = useState<string>(searchParams.get('pmt') || '200');
  const [rate, setRate] = useState<string>(searchParams.get('rate') || '7');
  const [years, setYears] = useState<string>(searchParams.get('years') || '10');
  const [frequency, setFrequency] = useState<number>(12); // 12 = monthly, 1 = annually, 4 = quarterly, 365 = daily

  const [futureValue, setFutureValue] = useState<number | null>(null);
  const [totalInvested, setTotalInvested] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    const p = parseFloat(principal);
    const pmt = parseFloat(monthlyContribution || '0');
    const r = parseFloat(rate) / 100;
    const y = parseFloat(years);
    const n = frequency;

    if (isNaN(p) || p < 0) {
      setError('Please enter a valid starting principal.');
      return;
    }
    if (isNaN(r) || r < 0) {
      setError('Please enter a valid interest rate.');
      return;
    }
    if (isNaN(y) || y <= 0) {
      setError('Investment duration must be at least 1 year.');
      return;
    }

    // Compound Interest with regular monthly contributions
    // Future value of principal: P * (1 + r/n)^(n*t)
    const principalFV = p * Math.pow(1 + r / n, n * y);

    // Future value of monthly contributions
    // PMT * [ ( (1 + r/12)^(12*y) - 1 ) / (r/12) ]
    let pmtFV = 0;
    const monthlyRate = r / 12;
    const totalMonths = y * 12;

    if (pmt > 0) {
      if (monthlyRate > 0) {
        pmtFV = pmt * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
      } else {
        pmtFV = pmt * totalMonths;
      }
    }

    const totalFV = principalFV + pmtFV;
    const invested = p + pmt * totalMonths;
    const interest = totalFV - invested;

    setFutureValue(totalFV);
    setTotalInvested(invested);
    setTotalInterest(interest);

    trackEvent('tool_used', { tool: 'compound-interest-calculator', principal: p, pmt, rate: r * 100, years: y });
  };

  useEffect(() => {
    calculate();
  }, [principal, monthlyContribution, rate, years, frequency]);

  const handleReset = () => {
    setPrincipal('10000');
    setMonthlyContribution('200');
    setRate('7');
    setYears('10');
    setFrequency(12);
  };

  const resultText = futureValue !== null
    ? `Principal: $${principal} + $${monthlyContribution}/mo for ${years} yrs at ${rate}% | Total Future Value: $${futureValue.toFixed(2)} (Earned Interest: $${totalInterest?.toFixed(2)})`
    : '';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Initial Principal ($)
            </label>
            <input
              type="number"
              min="0"
              step="500"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-base text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Monthly Contribution ($)
            </label>
            <input
              type="number"
              min="0"
              step="50"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-base text-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Annual Rate (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.25"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-base text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Period (Years)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-base text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Compounding Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-sm font-medium bg-white text-gray-900"
            >
              <option value="12">Compounded Monthly (12/yr)</option>
              <option value="365">Compounded Daily (365/yr)</option>
              <option value="4">Compounded Quarterly (4/yr)</option>
              <option value="1">Compounded Annually (1/yr)</option>
            </select>
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
        <div className="flex flex-col justify-between bg-indigo-50/50 rounded-xl p-6 border border-indigo-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-900 mb-4">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Projected Future Wealth</span>
            </div>

            {error ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
                {error}
              </div>
            ) : futureValue !== null ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-indigo-200">
                  <div className="text-xs text-gray-500 font-medium">Estimated Future Balance</div>
                  <div className="text-4xl font-extrabold text-indigo-700 tracking-tight mt-1">
                    ${futureValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    After {years} years of compounded growth
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-indigo-100">
                    <div className="text-xs text-gray-500">Total Contributions</div>
                    <div className="text-base font-bold text-gray-800 mt-0.5">
                      ${totalInvested?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-indigo-100">
                    <div className="text-xs text-gray-500">Interest Earned</div>
                    <div className="text-base font-bold text-emerald-600 mt-0.5">
                      +${totalInterest?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-indigo-900 bg-white/80 p-3 rounded-lg border border-indigo-100">
                  Compound interest accounts for{' '}
                  <span className="font-bold text-emerald-600">
                    {futureValue > 0 ? (((totalInterest || 0) / futureValue) * 100).toFixed(1) : 0}%
                  </span>{' '}
                  of your total ending portfolio value.
                </div>
              </div>
            ) : null}
          </div>

          {futureValue !== null && (
            <div className="mt-6 pt-4 border-t border-indigo-200">
              <ResultActionsRow
                resultText={resultText}
                queryParams={{
                  principal,
                  pmt: monthlyContribution,
                  rate,
                  years,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
