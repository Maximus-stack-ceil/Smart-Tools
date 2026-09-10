import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResultActionsRow } from '../ResultActionsRow';
import { ArrowRightLeft, RotateCcw } from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'speed';

interface UnitDef {
  id: string;
  name: string;
  symbol: string;
  // ratio to base unit or custom formula
  toBase?: (val: number) => number;
  fromBase?: (val: number) => number;
}

const UNIT_DATA: Record<UnitCategory, { name: string; baseUnit: string; units: UnitDef[] }> = {
  length: {
    name: 'Length & Distance',
    baseUnit: 'meters',
    units: [
      { id: 'm', name: 'Meters', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km', name: 'Kilometers', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
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

export const UnitConverter: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [category, setCategory] = useState<UnitCategory>(
    (searchParams.get('cat') as UnitCategory) || 'length'
  );
  const [fromUnit, setFromUnit] = useState<string>('km');
  const [toUnit, setToUnit] = useState<string>('mi');
  const [value, setValue] = useState<string>('10');
  const [error, setError] = useState<string | null>(null);

  // Update unit selectors when category switches
  useEffect(() => {
    const currentUnits = UNIT_DATA[category].units;
    if (category === 'length') {
      setFromUnit('km');
      setToUnit('mi');
    } else if (category === 'weight') {
      setFromUnit('kg');
      setToUnit('lb');
    } else if (category === 'temperature') {
      setFromUnit('c');
      setToUnit('f');
    } else if (category === 'speed') {
      setFromUnit('kmh');
      setToUnit('mph');
    }
  }, [category]);

  const convert = () => {
    setError(null);
    const num = parseFloat(value);
    if (isNaN(num)) {
      setError('Please enter a valid number.');
      return null;
    }

    const units = UNIT_DATA[category].units;
    const fromDef = units.find((u) => u.id === fromUnit);
    const toDef = units.find((u) => u.id === toUnit);

    if (!fromDef || !toDef) return null;

    const baseVal = fromDef.toBase!(num);
    const converted = toDef.fromBase!(baseVal);

    return {
      sourceVal: num,
      fromSymbol: fromDef.symbol,
      fromName: fromDef.name,
      toSymbol: toDef.symbol,
      toName: toDef.name,
      resultVal: converted,
      formattedResult: Math.abs(converted) < 0.0001 || Math.abs(converted) > 1000000
        ? converted.toExponential(4)
        : Number(converted.toFixed(4)).toString(),
    };
  };

  const result = convert();

  const handleSwap = () => {
    const prevFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(prevFrom);
  };

  const handleReset = () => {
    setValue('10');
    setError(null);
  };

  const resultText = result
    ? `${result.sourceVal} ${result.fromSymbol} = ${result.formattedResult} ${result.toSymbol}`
    : '';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs">
      {/* Category selector */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-xl mb-6">
        {(Object.keys(UNIT_DATA) as UnitCategory[]).map((catKey) => (
          <button
            key={catKey}
            type="button"
            onClick={() => setCategory(catKey)}
            className={`flex-1 min-w-[120px] py-1.5 px-3 text-xs font-semibold rounded-lg transition-all ${
              category === catKey
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {UNIT_DATA[catKey].name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {/* Value input and units grid */}
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 items-end">
          {/* Amount input */}
          <div className="sm:col-span-3">
            <label htmlFor="unit-amount" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Enter Value
            </label>
            <input
              id="unit-amount"
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. 10"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>

          {/* From Unit */}
          <div className="sm:col-span-2">
            <label htmlFor="unit-from" className="block text-sm font-semibold text-gray-900 mb-1.5">
              From
            </label>
            <select
              id="unit-from"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            >
              {UNIT_DATA[category].units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="sm:col-span-2 flex items-center gap-2">
            <div className="flex-1">
              <label htmlFor="unit-to" className="block text-sm font-semibold text-gray-900 mb-1.5">
                To
              </label>
              <select
                id="unit-to"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
              >
                {UNIT_DATA[category].units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleSwap}
              title="Swap units"
              className="p-2.5 mt-6 border border-gray-200 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors shrink-0"
              aria-label="Swap units"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

        {/* Result reveal panel */}
        {result && (
          <div
            id="unit-result-panel"
            className="mt-6 p-5 sm:p-6 rounded-xl bg-indigo-50/50 border border-indigo-100 transition-all duration-200 animate-in fade-in"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700 mb-1">
              Converted Result
            </div>

            <div className="flex flex-wrap items-baseline gap-2 py-1">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-indigo-900">
                {result.formattedResult}
              </span>
              <span className="text-lg sm:text-xl font-bold text-indigo-700">
                {result.toSymbol}
              </span>
              <span className="text-sm text-gray-500 ml-1">({result.toName})</span>
            </div>

            <div className="mt-2 text-xs text-gray-600">
              Equivalent to:{' '}
              <span className="font-semibold text-gray-800">
                {result.sourceVal} {result.fromName} ({result.fromSymbol})
              </span>
            </div>

            <ResultActionsRow
              resultText={resultText}
              queryParams={{ cat: category, val: value, from: fromUnit, to: toUnit }}
              className="mt-4"
            />
          </div>
        )}
      </div>
    </div>
  );
};
