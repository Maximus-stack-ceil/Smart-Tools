import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResultActionsRow } from '../ResultActionsRow';
import { Scale, RotateCcw } from 'lucide-react';
import { trackEvent } from '../../../utils/analytics';

export const IdealWeightCalculator: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState<string>(searchParams.get('height') || '175');
  const [heightFeet, setHeightFeet] = useState<string>('5');
  const [heightInches, setHeightInches] = useState<string>('9');

  interface WeightFormulas {
    devine: number;
    robinson: number;
    miller: number;
    hamwi: number;
    healthyBmiMin: number;
    healthyBmiMax: number;
  }
  const [results, setResults] = useState<WeightFormulas | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    let totalInches = 0;
    let cm = 0;

    if (unit === 'metric') {
      cm = parseFloat(heightCm);
      if (isNaN(cm) || cm < 120 || cm > 250) {
        setError('Please enter a realistic height between 120 cm and 250 cm.');
        setResults(null);
        return;
      }
      totalInches = cm / 2.54;
    } else {
      const ft = parseFloat(heightFeet);
      const inc = parseFloat(heightInches);
      if (isNaN(ft) || ft < 3 || ft > 8 || isNaN(inc) || inc < 0 || inc >= 12) {
        setError('Please enter valid feet and inches.');
        setResults(null);
        return;
      }
      totalInches = ft * 12 + inc;
      cm = totalInches * 2.54;
    }

    const inchesOver5Ft = Math.max(0, totalInches - 60);

    // Formulations (standard medical formulas in kg):
    // J.D. Robinson (1983)
    // Male: 52 kg + 1.9 kg per inch over 5 feet
    // Female: 49 kg + 1.7 kg per inch over 5 feet
    const robinsonKg = gender === 'male' ? 52 + 1.9 * inchesOver5Ft : 49 + 1.7 * inchesOver5Ft;

    // Dr. B.J. Devine (1974)
    // Male: 50.0 kg + 2.3 kg per inch over 5 feet
    // Female: 45.5 kg + 2.3 kg per inch over 5 feet
    const devineKg = gender === 'male' ? 50.0 + 2.3 * inchesOver5Ft : 45.5 + 2.3 * inchesOver5Ft;

    // D.R. Miller (1983)
    // Male: 56.2 kg + 1.41 kg per inch over 5 feet
    // Female: 53.1 kg + 1.36 kg per inch over 5 feet
    const millerKg = gender === 'male' ? 56.2 + 1.41 * inchesOver5Ft : 53.1 + 1.36 * inchesOver5Ft;

    // G.J. Hamwi (1964)
    // Male: 48.0 kg + 2.7 kg per inch over 5 feet
    // Female: 45.5 kg + 2.2 kg per inch over 5 feet
    const hamwiKg = gender === 'male' ? 48.0 + 2.7 * inchesOver5Ft : 45.5 + 2.2 * inchesOver5Ft;

    // Healthy BMI Range (18.5 - 24.9 kg/m^2)
    const heightMeters = cm / 100;
    const healthyBmiMinKg = 18.5 * heightMeters * heightMeters;
    const healthyBmiMaxKg = 24.9 * heightMeters * heightMeters;

    setResults({
      devine: devineKg,
      robinson: robinsonKg,
      miller: millerKg,
      hamwi: hamwiKg,
      healthyBmiMin: healthyBmiMinKg,
      healthyBmiMax: healthyBmiMaxKg,
    });

    trackEvent('tool_used', { tool: 'ideal-weight-calculator', gender, cm });
  };

  useEffect(() => {
    calculate();
  }, [unit, gender, heightCm, heightFeet, heightInches]);

  const toDisplay = (kg: number) => {
    if (unit === 'imperial') {
      const lbs = kg * 2.20462;
      return `${lbs.toFixed(1)} lbs`;
    }
    return `${kg.toFixed(1)} kg`;
  };

  const handleReset = () => {
    setUnit('metric');
    setGender('male');
    setHeightCm('175');
    setHeightFeet('5');
    setHeightInches('9');
  };

  const averageIdeal = results ? (results.devine + results.robinson + results.miller + results.hamwi) / 4 : 0;
  const resultText = results
    ? `Ideal Weight for ${gender} (${unit === 'metric' ? `${heightCm} cm` : `${heightFeet}ft ${heightInches}in`}): Average ~ ${toDisplay(averageIdeal)} (Healthy BMI Range: ${toDisplay(results.healthyBmiMin)} - ${toDisplay(results.healthyBmiMax)})`
    : '';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setUnit('metric')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                unit === 'metric' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Metric (cm)
            </button>
            <button
              type="button"
              onClick={() => setUnit('imperial')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                unit === 'imperial' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Imperial (ft / in)
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Gender</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2 text-sm font-semibold rounded-xl border transition-all ${
                  gender === 'male'
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2 text-sm font-semibold rounded-xl border transition-all ${
                  gender === 'female'
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {unit === 'metric' ? (
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Height (cm)
              </label>
              <input
                type="number"
                min="100"
                max="250"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-base text-gray-900"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Height</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    min="3"
                    max="7"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    placeholder="Feet"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-base text-gray-900"
                  />
                  <span className="text-xs text-gray-500 mt-1 block">Feet</span>
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    placeholder="Inches"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-base text-gray-900"
                  />
                  <span className="text-xs text-gray-500 mt-1 block">Inches</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors pt-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to defaults</span>
          </button>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between bg-rose-50/40 rounded-xl p-6 border border-rose-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-800 mb-4">
              <Scale className="w-4 h-4 text-rose-600" />
              <span>Calculated Ideal Weight</span>
            </div>

            {error ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
                {error}
              </div>
            ) : results ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-rose-200">
                  <div className="text-xs text-gray-500 font-medium">Consensus Average Ideal</div>
                  <div className="text-4xl font-extrabold text-rose-600 tracking-tight mt-1">
                    {toDisplay(averageIdeal)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Healthy BMI range: {toDisplay(results.healthyBmiMin)} – {toDisplay(results.healthyBmiMax)}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-rose-100 overflow-hidden divide-y divide-gray-100 text-xs">
                  <div className="flex justify-between p-2.5">
                    <span className="font-semibold text-gray-700">Devine Formula (1974)</span>
                    <span className="font-bold text-gray-900">{toDisplay(results.devine)}</span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="font-semibold text-gray-700">Robinson Formula (1983)</span>
                    <span className="font-bold text-gray-900">{toDisplay(results.robinson)}</span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="font-semibold text-gray-700">Miller Formula (1983)</span>
                    <span className="font-bold text-gray-900">{toDisplay(results.miller)}</span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="font-semibold text-gray-700">Hamwi Formula (1964)</span>
                    <span className="font-bold text-gray-900">{toDisplay(results.hamwi)}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {results && (
            <div className="mt-6 pt-4 border-t border-rose-200">
              <ResultActionsRow
                resultText={resultText}
                queryParams={{
                  height: heightCm,
                  gender,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
