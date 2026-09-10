import React, { useState } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { RotateCcw, Copy, Check, Palette } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const ColorConverter: React.FC = () => {
  const { showToast } = useToast();
  const [hex, setHex] = useState<string>('#4F46E5');

  const hexToRgb = (hexStr: string) => {
    let clean = hexStr.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    if (clean.length !== 6) return null;
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  // Luminance for WCAG contrast
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const rgb = hexToRgb(hex) || { r: 79, g: 70, b: 229 };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const lum = getLuminance(rgb.r, rgb.g, rgb.b);
  const contrastWhite = (1 + 0.05) / (lum + 0.05);
  const contrastBlack = (lum + 0.05) / (0 + 0.05);

  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  const copyVal = (val: string) => {
    navigator.clipboard.writeText(val);
    showToast(`Copied ${val}!`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs">
      <div className="space-y-6">
        {/* Color picker & preview */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-200">
          <div
            className="w-24 h-24 rounded-2xl border border-gray-300 shadow-inner flex items-center justify-center shrink-0"
            style={{ backgroundColor: hex }}
          >
            <input
              id="color-picker-native"
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value.toUpperCase())}
              className="opacity-0 w-full h-full cursor-pointer"
              title="Click to choose color"
            />
          </div>

          <div className="flex-1 w-full space-y-3">
            <div>
              <label htmlFor="hex-input" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                HEX Color Code
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="hex-input"
                  type="text"
                  value={hex}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (!val.startsWith('#') && val.length > 0) val = '#' + val;
                    setHex(val.toUpperCase());
                  }}
                  className="px-3.5 py-2 rounded-lg text-sm font-mono text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 max-w-xs"
                />
                <button
                  type="button"
                  onClick={() => copyVal(hex)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-100"
                >
                  Copy HEX
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Click the colored square to open the system color picker or type a hex code above.
            </p>
          </div>
        </div>

        {/* Converted formats list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-white">
            <div>
              <div className="text-[11px] font-semibold text-gray-400 uppercase">RGB Format</div>
              <div className="font-mono text-sm text-gray-900 font-medium mt-0.5">{rgbString}</div>
            </div>
            <button
              type="button"
              onClick={() => copyVal(rgbString)}
              className="px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-indigo-600 rounded-md border border-gray-200"
            >
              Copy
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-white">
            <div>
              <div className="text-[11px] font-semibold text-gray-400 uppercase">HSL Format</div>
              <div className="font-mono text-sm text-gray-900 font-medium mt-0.5">{hslString}</div>
            </div>
            <button
              type="button"
              onClick={() => copyVal(hslString)}
              className="px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-indigo-600 rounded-md border border-gray-200"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Accessibility & Contrast info */}
        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-3">
          <div className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
            WCAG Accessibility Contrast Ratios
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 block">Against White (#FFF)</span>
                <span className="text-base font-bold text-gray-900">
                  {contrastWhite.toFixed(2)} : 1
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  contrastWhite >= 4.5
                    ? 'bg-emerald-100 text-emerald-700'
                    : contrastWhite >= 3.0
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {contrastWhite >= 4.5 ? 'Pass (AA)' : contrastWhite >= 3.0 ? 'Large Text' : 'Fail'}
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 block">Against Dark (#111)</span>
                <span className="text-base font-bold text-gray-900">
                  {contrastBlack.toFixed(2)} : 1
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  contrastBlack >= 4.5
                    ? 'bg-emerald-100 text-emerald-700'
                    : contrastBlack >= 3.0
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {contrastBlack >= 4.5 ? 'Pass (AA)' : contrastBlack >= 3.0 ? 'Large Text' : 'Fail'}
              </span>
            </div>
          </div>
        </div>

        <ResultActionsRow resultText={`${hex} | ${rgbString} | ${hslString}`} className="mt-4" />
      </div>
    </div>
  );
};
