import React, { useState } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { Globe, Clock, RotateCcw } from 'lucide-react';
import { trackEvent } from '../../../utils/analytics';

interface CityZone {
  city: string;
  country: string;
  timeZone: string;
  flag: string;
}

const WORLD_CITIES: CityZone[] = [
  { city: 'UTC / GMT', country: 'Universal Time', timeZone: 'UTC', flag: '🌐' },
  { city: 'London', country: 'United Kingdom', timeZone: 'Europe/London', flag: '🇬🇧' },
  { city: 'New York', country: 'United States (EDT/EST)', timeZone: 'America/New_York', flag: '🇺🇸' },
  { city: 'San Francisco', country: 'United States (PDT/PST)', timeZone: 'America/Los_Angeles', flag: '🇺🇸' },
  { city: 'Berlin / Paris', country: 'Central Europe', timeZone: 'Europe/Berlin', flag: '🇪🇺' },
  { city: 'Dubai', country: 'United Arab Emirates', timeZone: 'Asia/Dubai', flag: '🇦🇪' },
  { city: 'Mumbai / Delhi', country: 'India (IST)', timeZone: 'Asia/Kolkata', flag: '🇮🇳' },
  { city: 'Singapore', country: 'Singapore (SGT)', timeZone: 'Asia/Singapore', flag: '🇸🇬' },
  { city: 'Tokyo', country: 'Japan (JST)', timeZone: 'Asia/Tokyo', flag: '🇯🇵' },
  { city: 'Sydney', country: 'Australia (AEST)', timeZone: 'Australia/Sydney', flag: '🇦🇺' },
];

export const TimeZoneConverter: React.FC = () => {
  // Base reference date state (stored as Epoch ms)
  const [baseTimestamp, setBaseTimestamp] = useState<number>(Date.now());
  const [selectedBaseTz, setSelectedBaseTz] = useState<string>('UTC');

  const baseDate = new Date(baseTimestamp);

  const formatCityTime = (tz: string) => {
    try {
      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      return {
        time: timeFormatter.format(baseDate),
        date: dateFormatter.format(baseDate),
      };
    } catch {
      return { time: '--:--', date: '---' };
    }
  };

  const handleSliderChange = (minutesFromMidnight: number) => {
    const d = new Date(baseTimestamp);
    d.setUTCHours(Math.floor(minutesFromMidnight / 60));
    d.setUTCMinutes(minutesFromMidnight % 60);
    setBaseTimestamp(d.getTime());
    trackEvent('tool_used', { tool: 'time-zone-converter', minutes: minutesFromMidnight });
  };

  const handleReset = () => {
    setBaseTimestamp(Date.now());
    setSelectedBaseTz('UTC');
  };

  const currentUtcMinutes = baseDate.getUTCHours() * 60 + baseDate.getUTCMinutes();

  const resultText = `Reference UTC Time: ${formatCityTime('UTC').time} (${formatCityTime('UTC').date}) | New York: ${formatCityTime('America/New_York').time} | London: ${formatCityTime('Europe/London').time} | Tokyo: ${formatCityTime('Asia/Tokyo').time}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      {/* Top Header & Interactive Time Slider */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Interactive Hour Slider (UTC Time)</span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sync to Current Live Time</span>
          </button>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="1439"
            step="15"
            value={currentUtcMinutes}
            onChange={(e) => handleSliderChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[11px] text-gray-500 font-mono">
            <span>00:00 (Midnight)</span>
            <span>06:00 AM</span>
            <span>12:00 PM (Noon)</span>
            <span>18:00 (6 PM)</span>
            <span>23:59</span>
          </div>
        </div>
      </div>

      {/* Grid of Global Cities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {WORLD_CITIES.map((city) => {
          const { time, date } = formatCityTime(city.timeZone);
          const isSelected = selectedBaseTz === city.timeZone;

          return (
            <div
              key={city.city}
              className={`p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-200'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xl">{city.flag}</span>
                <span className="text-xs font-medium text-gray-500">{date}</span>
              </div>
              <div className="font-bold text-gray-900 text-sm mt-0.5">{city.city}</div>
              <div className="text-2xl font-black text-gray-900 tracking-tight mt-1 font-mono">
                {time}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5 truncate">{city.country}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <ResultActionsRow resultText={resultText} />
      </div>
    </div>
  );
};
