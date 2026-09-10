import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResultActionsRow } from '../ResultActionsRow';
import { RotateCcw, DollarSign, Calendar, Percent } from 'lucide-react';

export const LoanCalculator: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [principal, setPrincipal] = useState<string>(searchParams.get('amount') || '250000');
  const [interestRate, setInterestRate] = useState<string>(searchParams.get('rate') || '6.5');
  const [termYears, setTermYears] = useState<string>(searchParams.get('years') || '30');
  const [errors, setErrors] = useState<{ principal?: string; interestRate?: string; termYears?: string }>({});

  interface LoanSummary {
    monthlyPayment: number;
    totalInterest: number;
    totalPayment: number;
    principalPct: number;
    interestPct: number;
  }
  const [summary, setSummary] = useState<LoanSummary | null>(null);

  const calculateLoan = () => {
    const newErrors: { principal?: string; interestRate?: string; termYears?: string } = {};

    const P = parseFloat(principal);
    const annualR = parseFloat(interestRate);
    const years = parseFloat(termYears);

    if (isNaN(P) || P <= 0) {
      newErrors.principal = 'Please enter a valid loan amount greater than 0.';
    }
    if (isNaN(annualR) || annualR < 0) {
      newErrors.interestRate = 'Please enter an annual interest rate (e.g., 6.5).';
    }
    if (isNaN(years) || years <= 0 || years > 50) {
      newErrors.termYears = 'Please enter a term between 1 and 50 years.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setSummary(null);
      return;
    }

    const n = years * 12;
    const r = annualR / 100 / 12;

    let monthly = 0;
    if (r === 0) {
      monthly = P / n;
    } else {
      monthly = (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    }

    const totalPayment = monthly * n;
    const totalInterest = totalPayment - P;

    const principalPct = Math.round((P / totalPayment) * 100);
    const interestPct = 100 - principalPct;

    setSummary({
      monthlyPayment: monthly,
      totalInterest,
      totalPayment,
      principalPct,
      interestPct,
    });
  };

  useEffect(() => {
    calculateLoan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setPrincipal('250000');
    setInterestRate('6.5');
    setTermYears('30');
    setErrors({});
  };

  const formattedSummary = summary
    ? `Monthly Payment: $${summary.monthlyPayment.toFixed(2)} | Total Interest: $${summary.totalInterest.toFixed(2)} | Total Cost: $${summary.totalPayment.toFixed(2)}`
    : '';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          calculateLoan();
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Loan Amount */}
          <div>
            <label htmlFor="loan-amount" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Loan Amount ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-medium">$</span>
              <input
                id="loan-amount"
                type="number"
                step="any"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                aria-invalid={!!errors.principal}
                aria-describedby={errors.principal ? 'loan-amount-error' : undefined}
                className={`w-full pl-7 pr-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border transition-all ${
                  errors.principal ? 'border-red-500' : 'border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20'
                }`}
              />
            </div>
            {errors.principal && (
              <p id="loan-amount-error" className="mt-1 text-xs text-red-600">
                {errors.principal}
              </p>
            )}
          </div>

          {/* Interest Rate */}
          <div>
            <label htmlFor="loan-rate" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Annual Interest Rate (%)
            </label>
            <div className="relative">
              <input
                id="loan-rate"
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                aria-invalid={!!errors.interestRate}
                aria-describedby={errors.interestRate ? 'loan-rate-error' : undefined}
                className={`w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border transition-all ${
                  errors.interestRate ? 'border-red-500' : 'border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20'
                }`}
              />
              <span className="absolute right-3 top-2.5 text-gray-400 text-sm font-medium">%</span>
            </div>
            {errors.interestRate && (
              <p id="loan-rate-error" className="mt-1 text-xs text-red-600">
                {errors.interestRate}
              </p>
            )}
          </div>

          {/* Loan Term */}
          <div>
            <label htmlFor="loan-term" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Loan Term (Years)
            </label>
            <select
              id="loan-term"
              value={termYears}
              onChange={(e) => setTermYears(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all"
            >
              <option value="10">10 Years (120 Months)</option>
              <option value="15">15 Years (180 Months)</option>
              <option value="20">20 Years (240 Months)</option>
              <option value="25">25 Years (300 Months)</option>
              <option value="30">30 Years (360 Months)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            id="calculate-loan-btn"
            type="submit"
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
          >
            Calculate Loan
          </button>
          <button
            id="reset-loan-btn"
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

      {summary && (
        <div
          id="loan-result-panel"
          className="mt-6 p-5 sm:p-6 rounded-xl bg-indigo-50/50 border border-indigo-100 transition-all duration-200 animate-in fade-in"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700 mb-1">
            Estimated Monthly Payment
          </div>

          <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-indigo-900 py-1">
            ${summary.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-base sm:text-lg font-medium text-gray-600 ml-1.5">/ month</span>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-indigo-100">
            <div className="bg-white p-3 rounded-lg border border-indigo-100/70">
              <span className="text-[11px] text-gray-500 block">Total Principal</span>
              <span className="text-base font-bold text-gray-900">
                ${parseFloat(principal).toLocaleString()}
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-indigo-100/70">
              <span className="text-[11px] text-gray-500 block">Total Interest Paid</span>
              <span className="text-base font-bold text-rose-600">
                ${summary.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-indigo-100/70">
              <span className="text-[11px] text-gray-500 block">Total Payment (Principal + Interest)</span>
              <span className="text-base font-bold text-gray-900">
                ${summary.totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Principal vs Interest Visual Bar */}
          <div className="mt-4 bg-white p-3 rounded-lg border border-indigo-100/70">
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-indigo-700">Principal: {summary.principalPct}%</span>
              <span className="text-rose-600">Interest: {summary.interestPct}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
              <div
                className="bg-indigo-600 h-full"
                style={{ width: `${summary.principalPct}%` }}
              />
              <div
                className="bg-rose-500 h-full"
                style={{ width: `${summary.interestPct}%` }}
              />
            </div>
          </div>

          <ResultActionsRow
            resultText={formattedSummary}
            queryParams={{ amount: principal, rate: interestRate, years: termYears }}
            className="mt-4"
          />
        </div>
      )}
    </div>
  );
};
