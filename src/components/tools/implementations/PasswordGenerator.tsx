import React, { useState, useEffect } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { RotateCcw, ShieldCheck, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const PasswordGenerator: React.FC = () => {
  const { showToast } = useToast();

  const [length, setLength] = useState<number>(18);
  const [useUpper, setUseUpper] = useState<boolean>(true);
  const [useLower, setUseLower] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const generatePassword = () => {
    setError(null);
    let charset = '';

    let uppers = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    if (!excludeAmbiguous) uppers += 'IO';

    let lowers = 'abcdefghijkmnopqrstuvwxyz';
    if (!excludeAmbiguous) lowers += 'l';

    let numbers = '23456789';
    if (!excludeAmbiguous) numbers += '01';

    const symbols = '!@#$%^&*()_+~|}{[]:;?><,.-=';

    if (useUpper) charset += uppers;
    if (useLower) charset += lowers;
    if (useNumbers) charset += numbers;
    if (useSymbols) charset += symbols;

    if (!charset) {
      setError('Please select at least one character set.');
      setPassword('');
      return;
    }

    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    let generated = '';
    for (let i = 0; i < length; i++) {
      generated += charset[randomValues[i] % charset.length];
    }
    setPassword(generated);
  };

  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous]);

  const calculateStrength = () => {
    let score = 0;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (useUpper) score += 1;
    if (useLower) score += 1;
    if (useNumbers) score += 1;
    if (useSymbols) score += 1;

    if (score <= 2) return { label: 'Weak', color: 'text-rose-600', bg: 'bg-rose-500', width: '25%' };
    if (score <= 4) return { label: 'Moderate', color: 'text-amber-600', bg: 'bg-amber-500', width: '50%' };
    if (score <= 5) return { label: 'Strong', color: 'text-indigo-600', bg: 'bg-indigo-500', width: '75%' };
    return { label: 'Very Strong', color: 'text-emerald-600', bg: 'bg-emerald-500', width: '100%' };
  };

  const strength = calculateStrength();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs">
      {/* Generated Password Hero Box */}
      <div className="relative mb-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="font-mono text-lg sm:text-2xl font-bold tracking-wide text-gray-900 break-all select-all">
            {password || 'Select options below'}
          </div>
          <button
            type="button"
            onClick={generatePassword}
            title="Generate new password"
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors ml-2 shrink-0"
            aria-label="Regenerate password"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Strength Meter Bar */}
        <div className="mt-2.5 flex items-center justify-between text-xs">
          <span className="text-gray-500 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
            Security Score: <span className={`font-bold ${strength.color}`}>{strength.label}</span>
          </span>
          <span className="text-gray-400">{length} characters</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strength.bg}`}
            style={{ width: strength.width }}
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-600 font-medium mb-3">{error}</p>}

      {/* Options Controls */}
      <div className="space-y-4 pt-2 border-t border-gray-100">
        {/* Length Slider */}
        <div>
          <div className="flex justify-between items-center text-sm font-semibold text-gray-900 mb-1.5">
            <label htmlFor="password-length">Password Length: {length}</label>
          </div>
          <input
            id="password-length"
            type="range"
            min={8}
            max={48}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[11px] text-gray-400 mt-1">
            <span>8 (Minimum)</span>
            <span>16 (Recommended)</span>
            <span>32 (High Security)</span>
            <span>48</span>
          </div>
        </div>

        {/* Checkbox toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useUpper}
              onChange={(e) => setUseUpper(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span>Uppercase Letters (A-Z)</span>
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useLower}
              onChange={(e) => setUseLower(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span>Lowercase Letters (a-z)</span>
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => setUseNumbers(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span>Numbers (0-9)</span>
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={(e) => setUseSymbols(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span>Symbols (!@#$%^&*)</span>
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none sm:col-span-2">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span>Exclude Look-Alike Characters (e.g. 0, O, 1, l)</span>
          </label>
        </div>

        <div className="flex items-center gap-3 pt-3">
          <button
            type="button"
            onClick={generatePassword}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generate New</span>
          </button>
        </div>

        <ResultActionsRow resultText={password} className="mt-4" />
      </div>
    </div>
  );
};
