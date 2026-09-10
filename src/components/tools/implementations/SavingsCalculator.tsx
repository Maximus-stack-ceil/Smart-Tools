import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResultActionsRow } from '../ResultActionsRow';
import { PiggyBank, RotateCcw } from 'lucide-react';
import { trackEvent } from '../../../utils/analytics';

export const SavingsCalculator: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [initialSavings, setInitialSavings] = useState<string>(searchParams.get('init') || '1000');
  const [monthlyDeposit, setMonthlyDeposit] = useState<string>(searchParams.get('deposit') || '300');
  const [targetGoal, setTargetGoal] = useState<string>(searchParams.get('goal') || '20000');
  const [apy, setApy] = useState<string>(searchParams.get('apy') || '4.5');

  const [monthsNeeded, setMonthsNeeded] = useState<number | null>(null);
  const [totalDeposited, setTotalDeposited] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    const p = parseFloat(initialSavings);
    const d = parseFloat(monthlyDeposit);
    const goal = parseFloat(targetGoal);
    const rate = parseFloat(apy) / 100 / 12;

    if (isNaN(p) || p < 0 || isNaN(d) || d <= 0 || isNaN(goal) || goal <= 0) {
      setError('Please provide positive values for savings, monthly deposit, and target goal.');
      return;
    }
    if (p >= goal) {
      setError('Your initial savings already meet or exceed your target goal!');
      setMonthsNeeded(0);
      setTotalDeposited(p);
      setTotalInterest(0);
      return;
    }

    // Iterative month-by-month compounding calculation until goal reached
    let balance = p;
    let months = 0;
    let accumulatedDeposits = p;
    const maxMonths = 1200; // 100 years max

    while (balance < goal && months < maxMonths) {
      months++;
      balance = balance * (1 + rate) + d;
      accumulatedDeposits += d;
    }

    if (months >= maxMonths) {
      setError('Goal cannot be reached within a realistic timeframe at this deposit rate.');
      return;
    }

    setMonthsNeeded(months);
    setTotalDeposited(accumulatedDeposits);
    setTotalInterest(Math.max(0, balance - accumulatedDeposits));

    trackEvent('tool_used', { tool: 'savings-calculator', months, goal });
  };

  useEffect(() => {
    calculate();
  }, [initialSavings, monthlyDeposit, targetGoal, apy]);

  const handleReset = () => {
    setInitialSavings('1000');
    setMonthlyDeposit('300');
    setTargetGoal('20000');
    setApy('4.5');
  };

  const years = monthsNeeded !== null ? Math.floor(monthsNeeded / 12) : 0;
  const remainingMonths = monthsNeeded !== null ? monthsNeeded % 12 : 0;

  const resultText = monthsNeeded !== null
    ? `Savings Goal: $${targetGoal} | Reached in: ${years} years, ${remainingMonths} months with $${monthlyDeposit}/mo deposit at ${apy}% APY`
    : '';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Target Savings Goal ($)
            </label>
            <input
              type="number"
              min="0"
              step="500"
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-base text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Initial Deposit / Current Savings ($)
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={initialSavings}
              onChange={(e) => setInitialSavings(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-base text-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Monthly Deposit ($)
              </label>
              <input
                type="number"
                min="10"
                step="50"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-base text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Annual APY (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={apy}
                onChange={(e) => setApy(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-base text-gray-900"
              />
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

        {/* Results */}
        <div className="flex flex-col justify-between bg-emerald-50/50 rounded-xl p-6 border border-emerald-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-4">
              <PiggyBank className="w-4 h-4 text-emerald-600" />
              <span>Goal Timeline</span>
            </div>

            {error ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
                {error}
              </div>
            ) : monthsNeeded !== null ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-emerald-200">
                  <div className="text-xs text-gray-500 font-medium">Time to Reach Goal</div>
                  <div className="text-3xl font-extrabold text-emerald-700 tracking-tight mt-1">
                    {years > 0 ? `${years} yrs ` : ''}{remainingMonths} months
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ({monthsNeeded} total monthly deposits)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-emerald-100">
                    <div className="text-xs text-gray-500">Your Direct Deposits</div>
                    <div className="text-base font-bold text-gray-800 mt-0.5">
                      ${totalDeposited?.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-emerald-100">
                    <div className="text-xs text-gray-500">Earned Interest (Free)</div>
                    <div className="text-base font-bold text-emerald-600 mt-0.5">
                      +${totalInterest?.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-emerald-900 bg-white/70 p-3 rounded-lg border border-emerald-100">
                  Depositing <span className="font-semibold">${monthlyDeposit}/month</span> earns you{' '}
                  <span className="font-semibold text-emerald-700">${totalInterest?.toFixed(0)}</span> in compounded yield to help reach your{' '}
                  <span className="font-semibold">${parseFloat(targetGoal || '0').toLocaleString()}</span> goal.
                </div>
              </div>
            ) : null}
          </div>

          {monthsNeeded !== null && (
            <div className="mt-6 pt-4 border-t border-emerald-200">
              <ResultActionsRow
                resultText={resultText}
                queryParams={{
                  init: initialSavings,
                  deposit: monthlyDeposit,
                  goal: targetGoal,
                  apy,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
