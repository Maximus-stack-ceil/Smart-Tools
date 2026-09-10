import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResultActionsRow } from '../ResultActionsRow';
import { Timer, Play, Pause, RotateCcw, Bell } from 'lucide-react';
import { trackEvent } from '../../../utils/analytics';

export const CountdownTimer: React.FC = () => {
  const [searchParams] = useSearchParams();

  const getDefaultTarget = () => {
    const nextYear = new Date().getFullYear() + 1;
    return `${nextYear}-01-01T00:00`;
  };

  const [eventName, setEventName] = useState<string>(searchParams.get('name') || 'New Year');
  const [targetDateStr, setTargetDateStr] = useState<string>(
    searchParams.get('target') || getDefaultTarget()
  );
  const [isActive, setIsActive] = useState<boolean>(true);

  interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
    isFinished: boolean;
  }

  const calculateTimeLeft = (): TimeLeft => {
    const target = new Date(targetDateStr).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (isNaN(target) || difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isFinished: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      totalSeconds: Math.floor(difference / 1000),
      isFinished: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining.isFinished) {
        setIsActive(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateStr, isActive]);

  const setQuickPreset = (name: string, hoursAhead: number) => {
    const d = new Date();
    d.setHours(d.getHours() + hoursAhead);
    const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setEventName(name);
    setTargetDateStr(localIso);
    setIsActive(true);
    trackEvent('tool_used', { tool: 'countdown-timer', preset: name });
  };

  const resultText = timeLeft.isFinished
    ? `${eventName} countdown has finished!`
    : `${eventName}: ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} mins, ${timeLeft.seconds} secs remaining until ${new Date(targetDateStr).toLocaleString()}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      {/* Event Header Config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Event / Milestone Name
          </label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g. Product Launch, Vacation, Exam"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-base text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Target Date & Time
          </label>
          <input
            type="datetime-local"
            value={targetDateStr}
            onChange={(e) => {
              setTargetDateStr(e.target.value);
              setIsActive(true);
            }}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-base text-gray-900"
          />
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-1">
          Quick Presets:
        </span>
        <button
          type="button"
          onClick={() => setQuickPreset('1 Hour Focus Timer', 1)}
          className="px-2.5 py-1 text-xs rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
        >
          +1 Hour
        </button>
        <button
          type="button"
          onClick={() => setQuickPreset('24-Hour Deadline', 24)}
          className="px-2.5 py-1 text-xs rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
        >
          +24 Hours
        </button>
        <button
          type="button"
          onClick={() => setQuickPreset('1 Week Sprint', 24 * 7)}
          className="px-2.5 py-1 text-xs rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
        >
          +7 Days
        </button>
        <button
          type="button"
          onClick={() => {
            const nextYear = new Date().getFullYear() + 1;
            setEventName('New Year');
            setTargetDateStr(`${nextYear}-01-01T00:00`);
            setIsActive(true);
          }}
          className="px-2.5 py-1 text-xs rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium"
        >
          Next New Year
        </button>
      </div>

      {/* Live Countdown Clock Display */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden">
        <div className="flex items-center justify-center gap-2 text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-4">
          <Timer className="w-4 h-4" />
          <span>{eventName || 'Countdown'}</span>
        </div>

        {timeLeft.isFinished ? (
          <div className="py-6 space-y-2">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
              <Bell className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-3xl font-black text-white">Event Reached!</h3>
            <p className="text-slate-400 text-sm">
              The target timestamp has elapsed ({new Date(targetDateStr).toLocaleString()}).
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                Days
              </div>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                Hours
              </div>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                Minutes
              </div>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-indigo-400 font-mono">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                Seconds
              </div>
            </div>
          </div>
        )}

        {/* Live Controls */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isActive ? 'Pause Timer' : 'Resume Timer'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTargetDateStr(getDefaultTarget());
              setIsActive(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <ResultActionsRow
          resultText={resultText}
          queryParams={{
            name: eventName,
            target: targetDateStr,
          }}
        />
      </div>
    </div>
  );
};
