import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResultActionsRow } from '../ResultActionsRow';
import { Calendar, RotateCcw, Sparkles } from 'lucide-react';

export const AgeCalculator: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Initial values from search params or sensible defaults
  const [birthDate, setBirthDate] = useState<string>(
    searchParams.get('dob') || '1998-05-15'
  );
  const [targetDate, setTargetDate] = useState<string>(
    searchParams.get('target') || new Date().toISOString().split('T')[0]
  );
  const [errors, setErrors] = useState<{ birthDate?: string; targetDate?: string }>({});

  interface AgeResult {
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalWeeks: number;
    totalHours: number;
    nextBirthdayDays: number;
    nextBirthdayWeekday: string;
  }

  const [result, setResult] = useState<AgeResult | null>(null);

  const calculateAge = () => {
    const newErrors: { birthDate?: string; targetDate?: string } = {};

    if (!birthDate) {
      newErrors.birthDate = 'Please select a valid birth date.';
    }
    if (!targetDate) {
      newErrors.targetDate = 'Please select a target date.';
    }

    const birth = new Date(birthDate + 'T00:00:00');
    const target = new Date(targetDate + 'T00:00:00');

    if (isNaN(birth.getTime())) {
      newErrors.birthDate = 'Invalid birth date entered.';
    }
    if (isNaN(target.getTime())) {
      newErrors.targetDate = 'Invalid target date entered.';
    }
    if (birth > target) {
      newErrors.targetDate = 'Target date must be on or after your birth date.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setResult(null);
      return;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total days lived
    const diffTime = Math.abs(target.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;

    // Next birthday calculation
    let nextBdayYear = target.getFullYear();
    const bdayThisYear = new Date(nextBdayYear, birth.getMonth(), birth.getDate());
    if (bdayThisYear < target) {
      nextBdayYear += 1;
    }
    const nextBday = new Date(nextBdayYear, birth.getMonth(), birth.getDate());
    const nextBdayDiff = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const nextBdayWeekday = weekdays[nextBday.getDay()];

    setResult({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      nextBirthdayDays: nextBdayDiff === 0 ? 0 : nextBdayDiff,
      nextBirthdayWeekday: nextBdayWeekday,
    });
  };

  useEffect(() => {
    calculateAge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setBirthDate('1998-05-15');
    setTargetDate(new Date().toISOString().split('T')[0]);
    setErrors({});
    setTimeout(calculateAge, 0);
  };

  const resultSummary = result
    ? `${result.years} years, ${result.months} months, ${result.days} days (${result.totalDays.toLocaleString()} total days lived)`
    : '';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs">
      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          calculateAge();
        }}
        className="space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Birth Date */}
          <div>
            <label
              htmlFor="birth-date-input"
              className="block text-sm font-semibold text-gray-900 mb-1.5"
            >
              Date of Birth
            </label>
            <div className="relative">
              <input
                id="birth-date-input"
                type="date"
                value={birthDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setBirthDate(e.target.value)}
                aria-invalid={!!errors.birthDate}
                aria-describedby={errors.birthDate ? 'birth-date-error' : undefined}
                className={`w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border transition-all focus:outline-hidden focus:ring-2 ${
                  errors.birthDate
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-indigo-600 focus:ring-indigo-600/20'
                }`}
              />
            </div>
            {errors.birthDate && (
              <p id="birth-date-error" className="mt-1.5 text-xs text-red-600 font-medium">
                {errors.birthDate}
              </p>
            )}
          </div>

          {/* Target Date */}
          <div>
            <label
              htmlFor="target-date-input"
              className="block text-sm font-semibold text-gray-900 mb-1.5"
            >
              Age at the Date of
            </label>
            <div className="relative">
              <input
                id="target-date-input"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                aria-invalid={!!errors.targetDate}
                aria-describedby={errors.targetDate ? 'target-date-error' : undefined}
                className={`w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border transition-all focus:outline-hidden focus:ring-2 ${
                  errors.targetDate
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-indigo-600 focus:ring-indigo-600/20'
                }`}
              />
            </div>
            {errors.targetDate && (
              <p id="target-date-error" className="mt-1.5 text-xs text-red-600 font-medium">
                {errors.targetDate}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            id="calculate-age-btn"
            type="submit"
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            Calculate Age
          </button>
          <button
            id="reset-age-btn"
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-gray-300"
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
          id="age-result-panel"
          className="mt-6 p-5 sm:p-6 rounded-xl bg-indigo-50/50 border border-indigo-100 transition-all duration-200 animate-in fade-in"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Exact Chronological Age</span>
          </div>

          {/* Hero Result Typography */}
          <div className="mt-2 flex flex-wrap items-baseline gap-2 text-gray-900">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-indigo-900">
              {result.years}
            </span>
            <span className="text-base sm:text-lg font-medium text-gray-600">years</span>
            <span className="text-2xl sm:text-3xl font-bold text-indigo-900 ml-2">
              {result.months}
            </span>
            <span className="text-base sm:text-lg font-medium text-gray-600">months</span>
            <span className="text-2xl sm:text-3xl font-bold text-indigo-900 ml-2">
              {result.days}
            </span>
            <span className="text-base sm:text-lg font-medium text-gray-600">days</span>
          </div>

          {/* Detailed Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-indigo-100 text-left">
            <div className="bg-white/80 p-3 rounded-lg border border-indigo-100/70">
              <span className="text-[11px] text-gray-500 block font-medium">Total Days Lived</span>
              <span className="text-base font-bold text-gray-900">
                {result.totalDays.toLocaleString()}
              </span>
            </div>
            <div className="bg-white/80 p-3 rounded-lg border border-indigo-100/70">
              <span className="text-[11px] text-gray-500 block font-medium">Total Weeks Lived</span>
              <span className="text-base font-bold text-gray-900">
                {result.totalWeeks.toLocaleString()}
              </span>
            </div>
            <div className="bg-white/80 p-3 rounded-lg border border-indigo-100/70">
              <span className="text-[11px] text-gray-500 block font-medium">Total Hours Lived</span>
              <span className="text-base font-bold text-gray-900">
                {result.totalHours.toLocaleString()}
              </span>
            </div>
            <div className="bg-white/80 p-3 rounded-lg border border-indigo-100/70">
              <span className="text-[11px] text-gray-500 block font-medium">Next Birthday In</span>
              <span className="text-base font-bold text-indigo-600">
                {result.nextBirthdayDays === 0 ? 'Today! 🎉' : `${result.nextBirthdayDays} days`}
              </span>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                ({result.nextBirthdayWeekday})
              </span>
            </div>
          </div>

          {/* Action Row */}
          <ResultActionsRow
            resultText={resultSummary}
            queryParams={{ dob: birthDate, target: targetDate }}
            className="mt-4"
          />
        </div>
      )}
    </div>
  );
};
