import React, { useState, useEffect } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { Clock, RotateCcw, Calendar, ArrowRight } from 'lucide-react';
import { trackEvent } from '../../../utils/analytics';

export const UnixTimestampConverter: React.FC = () => {
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(Math.floor(Date.now() / 1000));
  const [inputTimestamp, setInputTimestamp] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [inputUnit, setInputUnit] = useState<'seconds' | 'milliseconds'>('seconds');

  // Human date picker to generate timestamp
  const [dateInput, setDateInput] = useState<string>(() => {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });

  // Keep live current timestamp ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute parsed dates
  const parsedMillis = (): number | null => {
    const num = parseFloat(inputTimestamp);
    if (isNaN(num)) return null;
    return inputUnit === 'seconds' ? num * 1000 : num;
  };

  const millis = parsedMillis();
  const dateObj = millis !== null ? new Date(millis) : null;
  const isValidDate = dateObj !== null && !isNaN(dateObj.getTime());

  // Relative time helper
  const getRelativeTime = (targetMs: number) => {
    const diffSec = Math.round((targetMs - Date.now()) / 1000);
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
    const diffMin = Math.round(diffSec / 60);
    if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
    const diffHr = Math.round(diffMin / 60);
    if (Math.abs(diffHr) < 24) return rtf.format(diffHr, 'hour');
    const diffDay = Math.round(diffHr / 24);
    if (Math.abs(diffDay) < 30) return rtf.format(diffDay, 'day');
    const diffMonth = Math.round(diffDay / 30);
    if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, 'month');
    return rtf.format(Math.round(diffDay / 365), 'year');
  };

  const handleSetCurrent = () => {
    setInputTimestamp(Math.floor(Date.now() / 1000).toString());
    setInputUnit('seconds');
    trackEvent('tool_used', { tool: 'unix-timestamp-converter', action: 'now' });
  };

  const handleConvertDateToTimestamp = () => {
    const ms = new Date(dateInput).getTime();
    if (!isNaN(ms)) {
      setInputTimestamp(Math.floor(ms / 1000).toString());
      setInputUnit('seconds');
    }
  };

  const resultText = isValidDate && dateObj
    ? `Unix Timestamp: ${inputTimestamp} (${inputUnit}) | UTC: ${dateObj.toUTCString()} | ISO: ${dateObj.toISOString()} | Local: ${dateObj.toLocaleString()}`
    : '';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      {/* Live Current Timestamp Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 text-white rounded-xl mb-6">
        <div>
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Current Epoch Unix Timestamp
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-indigo-400 tracking-tight mt-0.5">
            {currentTimestamp}
          </div>
        </div>
        <button
          type="button"
          onClick={handleSetCurrent}
          className="px-3.5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
        >
          Use Current Time
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timestamp to Date */}
        <div className="space-y-4">
          <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Timestamp to Human Date</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Enter Unix Timestamp
            </label>
            <input
              type="text"
              value={inputTimestamp}
              onChange={(e) => setInputTimestamp(e.target.value.trim())}
              className="w-full px-4 py-2.5 font-mono text-sm border border-gray-300 rounded-xl focus:border-indigo-600 text-gray-900"
            />
          </div>

          <div className="flex gap-3 text-xs font-semibold text-gray-700">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="unit"
                checked={inputUnit === 'seconds'}
                onChange={() => setInputUnit('seconds')}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span>Seconds (10 digits)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="unit"
                checked={inputUnit === 'milliseconds'}
                onChange={() => setInputUnit('milliseconds')}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span>Milliseconds (13 digits)</span>
            </label>
          </div>

          {/* Date Picker to Timestamp */}
          <div className="pt-4 border-t border-gray-200">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Or Convert Calendar Date &rarr; Timestamp
            </label>
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-indigo-600 text-gray-900"
              />
              <button
                type="button"
                onClick={handleConvertDateToTimestamp}
                className="px-3 py-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl shrink-0"
              >
                Convert
              </button>
            </div>
          </div>
        </div>

        {/* Results Box */}
        <div className="flex flex-col justify-between bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Converted Date & Time
            </div>

            {!isValidDate || !dateObj ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
                Please enter a valid numeric Unix timestamp.
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="text-[11px] font-sans font-semibold text-gray-500">UTC / GMT</div>
                  <div className="text-sm font-bold text-gray-900 mt-0.5">{dateObj.toUTCString()}</div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="text-[11px] font-sans font-semibold text-gray-500">Local Timezone</div>
                  <div className="text-sm font-bold text-gray-900 mt-0.5">{dateObj.toString()}</div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="text-[11px] font-sans font-semibold text-gray-500">ISO 8601</div>
                  <div className="text-sm font-bold text-indigo-700 mt-0.5">{dateObj.toISOString()}</div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="text-[11px] font-sans font-semibold text-gray-500">Relative Time</div>
                  <div className="text-sm font-bold text-emerald-600 mt-0.5 font-sans">
                    {getRelativeTime(dateObj.getTime())}
                  </div>
                </div>
              </div>
            )}
          </div>

          {isValidDate && (
            <div className="mt-4 pt-3 border-t border-slate-200">
              <ResultActionsRow resultText={resultText} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
