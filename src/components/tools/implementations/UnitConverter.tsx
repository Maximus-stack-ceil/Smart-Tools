import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResultActionsRow } from '../ResultActionsRow';
import { ArrowRightLeft, RotateCcw, ArrowRight } from 'lucide-react';

export type UnitCategory = 'length' | 'weight' | 'temperature' | 'speed';

interface UnitDef {
  id: string;
  name: string;
  symbol: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}

export const UNIT_DATA: Record<UnitCategory, { name: string; baseUnit: string; units: UnitDef[] }> = {
  length: {
    name: 'Length & Distance',
    baseUnit: 'meters',
    units: [
      { id: 'km', name: 'Kilometers', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'm', name: 'Meters', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
      { id: 'cm', name: 'Centimeters', symbol: 'cm', toBase: (v) => v * 0.01, fromBase: (v) => v / 0.01 },
      { id: 'mm', name: 'Millimeters', symbol: 'mm', toBase: (v) => v * 0.001, fromBase: (v) => v / 0.001 },
      { id: 'mi', name: 'Miles', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      { id: 'yd', name: 'Yards', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { id: 'ft', name: 'Feet', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { id: 'in', name: 'Inches', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    ],
  },
  weight: {
    name: 'Weight & Mass',
    baseUnit: 'kilograms',
    units: [
      { id: 'kg', name: 'Kilograms', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
      { id: 'g', name: 'Grams', symbol: 'g', toBase: (v) => v * 0.001, fromBase: (v) => v / 0.001 },
      { id: 'mg', name: 'Milligrams', symbol: 'mg', toBase: (v) => v * 0.000001, fromBase: (v) => v / 0.000001 },
      { id: 'lb', name: 'Pounds', symbol: 'lbs', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      { id: 'oz', name: 'Ounces', symbol: 'oz', toBase: (v) => v * 0.02834952, fromBase: (v) => v / 0.02834952 },
      { id: 'st', name: 'Stone (UK)', symbol: 'st', toBase: (v) => v * 6.350293, fromBase: (v) => v / 6.350293 },
    ],
  },
  temperature: {
    name: 'Temperature',
    baseUnit: 'celsius',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => (v * 9) / 5 + 32 },
      { id: 'k', name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  speed: {
    name: 'Speed & Velocity',
    baseUnit: 'mps',
    units: [
      { id: 'kmh', name: 'Kilometers per hour', symbol: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      { id: 'mph', name: 'Miles per hour', symbol: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      { id: 'mps', name: 'Meters per second', symbol: 'm/s', toBase: (v) => v, fromBase: (v) => v },
      { id: 'knot', name: 'Knots', symbol: 'kn', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
    ],
  },
};

const DEFAULT_UNITS: Record<UnitCategory, { from: string; to: string }> = {
  length: { from: 'km', to: 'mi' },
  weight: { from: 'kg', to: 'lb' },
  temperature: { from: 'c', to: 'f' },
  speed: { from: 'kmh', to: 'mph' },
};

function formatNumber(num: number): string {
  if (!isFinite(num)) return 'Error';
  if (Math.abs(num) === 0) return '0';
  if (Math.abs(num) < 0.00001 || Math.abs(num) >= 10000000) {
    return num.toExponential(4);
  }
  // Trim trailing zeros after decimal
  return parseFloat(num.toFixed(6)).toString();
}

export const UnitConverter: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Validate initial category from search params
  const paramCat = searchParams.get('cat') as UnitCategory | null;
  const initialCategory: UnitCategory = paramCat && UNIT_DATA[paramCat] ? paramCat : 'length';

  const [category, setCategory] = useState<UnitCategory>(initialCategory);

  const initialFrom = searchParams.get('from') || DEFAULT_UNITS[initialCategory].from;
  const initialTo = searchParams.get('to') || DEFAULT_UNITS[initialCategory].to;

  const validFrom = UNIT_DATA[initialCategory].units.some((u) => u.id === initialFrom)
    ? initialFrom
    : DEFAULT_UNITS[initialCategory].from;
  const validTo = UNIT_DATA[initialCategory].units.some((u) => u.id === initialTo)
    ? initialTo
    : DEFAULT_UNITS[initialCategory].to;

  const [fromUnit, setFromUnit] = useState<string>(validFrom);
  const [toUnit, setToUnit] = useState<string>(validTo);
  const [value, setValue] = useState<string>(searchParams.get('val') || '10');

  // Switch category and update units synchronously
  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat);
    setFromUnit(DEFAULT_UNITS[newCat].from);
    setToUnit(DEFAULT_UNITS[newCat].to);
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleReset = () => {
    setValue('10');
    setFromUnit(DEFAULT_UNITS[category].from);
    setToUnit(DEFAULT_UNITS[category].to);
  };

  // Safe pure computation without any setState during render
  const unitsList = UNIT_DATA[category].units;
  const fromDef = unitsList.find((u) => u.id === fromUnit) || unitsList[0];
  const toDef = unitsList.find((u) => u.id === toUnit) || unitsList[1] || unitsList[0];

  const parsedNum = parseFloat(value);
  const isEmpty = value.trim() === '';
  const isInvalid = !isEmpty && isNaN(parsedNum);

  let resultData: {
    sourceVal: number;
    fromSymbol: string;
    fromName: string;
    toSymbol: string;
    toName: string;
    resultVal: number;
    formattedResult: string;
  } | null = null;

  if (!isEmpty && !isInvalid && fromDef && toDef) {
    const baseVal = fromDef.toBase(parsedNum);
    const converted = toDef.fromBase(baseVal);
    resultData = {
      sourceVal: parsedNum,
      fromSymbol: fromDef.symbol,
      fromName: fromDef.name,
      toSymbol: toDef.symbol,
      toName: toDef.name,
      resultVal: converted,
      formattedResult: formatNumber(converted),
    };
  }

  const resultText = resultData
    ? `${resultData.sourceVal} ${resultData.fromSymbol} = ${resultData.formattedResult} ${resultData.toSymbol}`
    : '';

  // All conversions table for the current value in this category
  const allConversions = !isEmpty && !isInvalid && fromDef
    ? unitsList.map((targetUnit) => {
        const baseVal = fromDef.toBase(parsedNum);
        const conv = targetUnit.fromBase(baseVal);
        return {
          id: targetUnit.id,
          name: targetUnit.name,
          symbol: targetUnit.symbol,
          value: formatNumber(conv),
          isCurrentTarget: targetUnit.id === toUnit,
          isCurrentSource: targetUnit.id === fromUnit,
        };
      })
    : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs">
      {/* Category selector tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100/90 rounded-xl mb-6">
        {(Object.keys(UNIT_DATA) as UnitCategory[]).map((catKey) => {
          const isActive = category === catKey;
          return (
            <button
              key={catKey}
              type="button"
              id={`unit-category-tab-${catKey}`}
              onClick={() => handleCategoryChange(catKey)}
              className={`flex-1 min-w-[120px] py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                isActive
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              {UNIT_DATA[catKey].name}
            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        {/* Value input and units grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          {/* Amount input */}
          <div className="sm:col-span-5">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="unit-amount" className="block text-sm font-semibold text-gray-900">
                Enter Value
              </label>
              <button
                type="button"
                onClick={handleReset}
                title="Reset to default"
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
            <input
              id="unit-amount"
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. 10"
              className={`w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border focus:outline-hidden focus:ring-2 transition-colors ${
                isInvalid
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-gray-300 focus:border-indigo-600 focus:ring-indigo-600/20'
              }`}
            />
          </div>

          {/* From Unit */}
          <div className="sm:col-span-3">
            <label htmlFor="unit-from" className="block text-sm font-semibold text-gray-900 mb-1.5">
              From
            </label>
            <select
              id="unit-from"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            >
              {unitsList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="sm:col-span-1 flex justify-center pb-0.5">
            <button
              type="button"
              id="unit-swap-button"
              onClick={handleSwap}
              title="Swap units"
              className="p-2.5 border border-gray-200 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-50 active:bg-gray-100 transition-colors shrink-0"
              aria-label="Swap units"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* To Unit */}
          <div className="sm:col-span-3">
            <label htmlFor="unit-to" className="block text-sm font-semibold text-gray-900 mb-1.5">
              To
            </label>
            <select
              id="unit-to"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            >
              {unitsList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Validation message */}
        {isInvalid && (
          <p className="text-xs text-red-600 font-medium">
            Please enter a valid numeric value to convert.
          </p>
        )}

        {/* Result reveal panel */}
        {resultData && (
          <div
            id="unit-result-panel"
            className="p-5 sm:p-6 rounded-xl bg-indigo-50/60 border border-indigo-100 transition-all duration-200 animate-in fade-in"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700 mb-1">
              Converted Result
            </div>

            <div className="flex flex-wrap items-baseline gap-2 py-1">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-indigo-950">
                {resultData.formattedResult}
              </span>
              <span className="text-lg sm:text-xl font-bold text-indigo-700">
                {resultData.toSymbol}
              </span>
              <span className="text-sm text-gray-600 ml-1">({resultData.toName})</span>
            </div>

            <div className="mt-2 text-xs text-gray-600 flex items-center gap-1.5">
              <span>Equivalent conversion for:</span>
              <span className="font-semibold text-gray-900">
                {resultData.sourceVal} {resultData.fromName} ({resultData.fromSymbol})
              </span>
            </div>

            <ResultActionsRow
              resultText={resultText}
              queryParams={{ cat: category, val: value, from: fromUnit, to: toUnit }}
              className="mt-4"
            />
          </div>
        )}

        {/* Breakdown / Quick reference table across all units in this category */}
        {allConversions.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Equivalent in All {UNIT_DATA[category].name} Units
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {allConversions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setToUnit(item.id)}
                  title={`Set target unit to ${item.name}`}
                  className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                    item.isCurrentTarget
                      ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-200'
                      : item.isCurrentSource
                      ? 'bg-gray-50 border-gray-300'
                      : 'bg-white border-gray-200 hover:border-indigo-200 hover:bg-gray-50/80'
                  }`}
                >
                  <div className="text-[11px] text-gray-500 truncate">{item.name}</div>
                  <div className="font-semibold text-gray-900 truncate mt-0.5">
                    {item.value} <span className="text-indigo-600 font-bold">{item.symbol}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
