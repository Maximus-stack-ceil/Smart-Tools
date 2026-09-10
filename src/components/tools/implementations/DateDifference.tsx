import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResultActionsRow } from '../ResultActionsRow';
import { RotateCcw, Calendar, CalendarDays } from 'lucide-react';

export const DateDifference: React.FC = () => {
  const [searchParams] = useSearchParams();

  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const [startDate, setStartDate] = useState<string>(searchParams.get('start') || today);
  const [endDate, setEndDate] = useState<string>(searchParams.get('end') || nextMonth);
  const [includeEndDay, setIncludeEndDay] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  interface DateDiffResult {
    totalDays: number;
    businessDays: number;
    weekendDays: number;
    weeks: number;
    remainderDays: number;
    calendarMonths: number;
    calendarDays: number;
    totalHours: number;
  }
  const [result, setResult] = useState<DateDiffResult | null>(null);

  const calculateDiff = () => {
    setError(null);
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      setResult(null);
      return;
    }

    const d1 = new Date(startDate + 'T00:00:00');
    const d2 = new Date(endDate + 'T00:00:00');

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      setError('Invalid dates entered.');
      setResult(null);
      return;
    }

    const isReverse = d2 < d1;
    const start = isReverse ? d2 : d1;
    const end = isReverse ? d1 : d2;

    const diffTime = end.getTime() - start.getTime();
    let totalDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (includeEndDay) {
      totalDays += 1;
    }

    // Count business days (Monday-Friday)
    let businessDays = 0;
    let weekendDays = 0;
    const curr = new Date(start.getTime());
    const limit = new Date(end.getTime());
    if (includeEndDay) {
      limit.setDate(limit.getDate() + 1);
    }

    while (curr < limit) {
      const day = curr.getDay();
      if (day === 0 || day === 6) {
        weekendDays++;
      } else {
        businessDays++;
      }
      curr.setDate(curr.getDate() + 1);
    }

    const weeks = Math.floor(totalDays / 7);
    const remainderDays = totalDays % 7;

    // Approximate months
    const calendarMonths = Math.floor(totalDays / 30.4375);
    const calendarDays = Math.round(totalDays % 30.4375);

    setResult({
      totalDays,
      businessDays,
      weekendDays,
      weeks,
      remainderDays,
      calendarMonths,
      calendarDays,
      totalHours: totalDays * 24,
    });
  };

  useEffect(() => {
    calculateDiff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, includeEndDay]);

  const handleReset = () => {
    setStartDate(today);
    setEndDate(nextMonth);
    setIncludeEndDay(true);
    setError(null);
  };

  const resultSummary = result
    ? `${result.totalDays} total days (${result.businessDays} business days, ${result.weeks} weeks and ${result.remainderDays} days)`
    : '';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="diff-start-date" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Start Date
            </label>
            <input
              id="diff-start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>

          <div>
            <label htmlFor="diff-end-date" className="block text-sm font-semibold text-gray-900 mb-1.5">
              End Date
            </label>
            <input
              id="diff-end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeEndDay}
              onChange={(e) => setIncludeEndDay(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 border-gray-300"
            />
            <span>Include end day in calculation (+1 day)</span>
          </label>

          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to default
          </button>
        </div>

        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

        {result && (
          <div
            id="date-diff-result"
            className="mt-6 p-5 sm:p-6 rounded-xl bg-indigo-50/50 border border-indigo-100 transition-all duration-200 animate-in fade-in"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700 mb-1">
              Time Span Difference
            </div>

            <div className="flex flex-wrap items-baseline gap-2 py-1">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-indigo-900">
                {result.totalDays}
              </span>
              <span className="text-lg sm:text-xl font-bold text-gray-600">days</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-indigo-100">
              <div className="bg-white p-3 rounded-lg border border-indigo-100/70">
                <span className="text-[11px] text-gray-500 block">Working Business Days</span>
                <span className="text-base font-bold text-indigo-700">{result.businessDays} days</span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-indigo-100/70">
                <span className="text-[11px] text-gray-500 block">Weekend Days</span>
                <span className="text-base font-bold text-gray-700">{result.weekendDays} days</span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-indigo-100/70">
                <span className="text-[11px] text-gray-500 block">In Weeks & Days</span>
                <span className="text-base font-bold text-gray-900">
                  {result.weeks}w {result.remainderDays}d
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-indigo-100/70">
                <span className="text-[11px] text-gray-500 block">Total Hours</span>
                <span className="text-base font-bold text-gray-900">
                  {result.totalHours.toLocaleString()} hrs
                </span>
              </div>
            </div>

            <ResultActionsRow
              resultText={resultSummary}
              queryParams={{ start: startDate, end: endDate }}
              className="mt-4"
            />
          </div>
        )}
      </div>
    </div>
  );
};
