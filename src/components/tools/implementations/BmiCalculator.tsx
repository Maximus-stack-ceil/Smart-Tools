import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResultActionsRow } from '../ResultActionsRow';
import { RotateCcw, HeartPulse } from 'lucide-react';

export const BmiCalculator: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>(
    (searchParams.get('unit') as any) || 'metric'
  );
  // Metric: cm, kg
  const [heightCm, setHeightCm] = useState<string>(searchParams.get('h_cm') || '175');
  const [weightKg, setWeightKg] = useState<string>(searchParams.get('w_kg') || '70');

  // Imperial: feet, inches, lbs
  const [heightFt, setHeightFt] = useState<string>(searchParams.get('h_ft') || '5');
  const [heightIn, setHeightIn] = useState<string>(searchParams.get('h_in') || '9');
  const [weightLbs, setWeightLbs] = useState<string>(searchParams.get('w_lbs') || '154');

  const [error, setError] = useState<string | null>(null);

  interface BmiResult {
    bmi: number;
    category: string;
    colorClass: string;
    bgClass: string;
    healthyRange: string;
  }
  const [result, setResult] = useState<BmiResult | null>(null);

  const calculateBmi = () => {
    setError(null);
    let bmiValue = 0;
    let minHealthyWeight = 0;
    let maxHealthyWeight = 0;

    if (unitSystem === 'metric') {
      const h = parseFloat(heightCm);
      const w = parseFloat(weightKg);

      if (isNaN(h) || h <= 50 || h > 260) {
        setError('Please enter a realistic height in cm (between 50 and 260 cm).');
        setResult(null);
        return;
      }
      if (isNaN(w) || w <= 20 || w > 400) {
        setError('Please enter a realistic weight in kg (between 20 and 400 kg).');
        setResult(null);
        return;
      }

      const hMeters = h / 100;
      bmiValue = w / (hMeters * hMeters);
      minHealthyWeight = 18.5 * (hMeters * hMeters);
      maxHealthyWeight = 24.9 * (hMeters * hMeters);
    } else {
      const ft = parseFloat(heightFt);
      const inc = parseFloat(heightIn);
      const w = parseFloat(weightLbs);

      if (isNaN(ft) || ft < 2 || ft > 8 || isNaN(inc) || inc < 0 || inc >= 12) {
        setError('Please enter a valid height in feet and inches.');
        setResult(null);
        return;
      }
      if (isNaN(w) || w <= 40 || w > 900) {
        setError('Please enter a realistic weight in pounds (lbs).');
        setResult(null);
        return;
      }

      const totalInches = ft * 12 + inc;
      bmiValue = (w / (totalInches * totalInches)) * 703;
      minHealthyWeight = (18.5 * (totalInches * totalInches)) / 703;
      maxHealthyWeight = (24.9 * (totalInches * totalInches)) / 703;
    }

    let category = 'Normal weight';
    let colorClass = 'text-emerald-700';
    let bgClass = 'bg-emerald-100 border-emerald-200';

    if (bmiValue < 18.5) {
      category = 'Underweight';
      colorClass = 'text-amber-700';
      bgClass = 'bg-amber-100 border-amber-200';
    } else if (bmiValue >= 25 && bmiValue < 29.9) {
      category = 'Overweight';
      colorClass = 'text-amber-700';
      bgClass = 'bg-amber-100 border-amber-200';
    } else if (bmiValue >= 30) {
      category = 'Obesity';
      colorClass = 'text-rose-700';
      bgClass = 'bg-rose-100 border-rose-200';
    }

    const healthyRange =
      unitSystem === 'metric'
        ? `${minHealthyWeight.toFixed(1)} kg – ${maxHealthyWeight.toFixed(1)} kg`
        : `${minHealthyWeight.toFixed(1)} lbs – ${maxHealthyWeight.toFixed(1)} lbs`;

    setResult({
      bmi: parseFloat(bmiValue.toFixed(1)),
      category,
      colorClass,
      bgClass,
      healthyRange,
    });
  };

  useEffect(() => {
    calculateBmi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitSystem]);

  const handleReset = () => {
    if (unitSystem === 'metric') {
      setHeightCm('175');
      setWeightKg('70');
    } else {
      setHeightFt('5');
      setHeightIn('9');
      setWeightLbs('154');
    }
    setError(null);
  };

  const formattedResult = result
    ? `BMI: ${result.bmi} (${result.category}) | Healthy weight target: ${result.healthyRange}`
    : '';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs">
      {/* Metric / Imperial toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6 max-w-xs">
        <button
          type="button"
          onClick={() => setUnitSystem('metric')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all ${
            unitSystem === 'metric'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Metric (cm / kg)
        </button>
        <button
          type="button"
          onClick={() => setUnitSystem('imperial')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all ${
            unitSystem === 'imperial'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Imperial (ft / lbs)
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          calculateBmi();
        }}
        className="space-y-4"
      >
        {unitSystem === 'metric' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="height-cm" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Height (cm)
              </label>
              <input
                id="height-cm"
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="e.g. 175"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
            <div>
              <label htmlFor="weight-kg" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Weight (kg)
              </label>
              <input
                id="weight-kg"
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="e.g. 70"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="height-ft" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Height (feet)
              </label>
              <input
                id="height-ft"
                type="number"
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                placeholder="5"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
            <div>
              <label htmlFor="height-in" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Height (inches)
              </label>
              <input
                id="height-in"
                type="number"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                placeholder="9"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
            <div>
              <label htmlFor="weight-lbs" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Weight (lbs)
              </label>
              <input
                id="weight-lbs"
                type="number"
                value={weightLbs}
                onChange={(e) => setWeightLbs(e.target.value)}
                placeholder="154"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
          </div>
        )}

        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button
            id="calculate-bmi-btn"
            type="submit"
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
          >
            Calculate BMI
          </button>
          <button
            id="reset-bmi-btn"
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-gray-500" />
              <span>Reset</span>
            </span>
          </button>
        </div>
      </form>

      {result && (
        <div
          id="bmi-result-panel"
          className="mt-6 p-5 sm:p-6 rounded-xl bg-indigo-50/50 border border-indigo-100 transition-all duration-200 animate-in fade-in"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700 mb-1">
            Body Mass Index (BMI) Score
          </div>

          <div className="flex flex-wrap items-baseline gap-3 py-1">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-indigo-900">
              {result.bmi}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${result.bgClass} ${result.colorClass}`}
            >
              {result.category}
            </span>
          </div>

          {/* Scale Gauge */}
          <div className="mt-4 pt-4 border-t border-indigo-100">
            <div className="grid grid-cols-4 gap-1 text-[11px] text-center font-medium text-gray-500 mb-1.5">
              <span>Under (&lt;18.5)</span>
              <span className="text-emerald-700 font-bold">Normal (18.5–24.9)</span>
              <span>Over (25–29.9)</span>
              <span>Obese (30+)</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden flex bg-gray-200">
              <div className="w-1/4 bg-amber-400" title="Underweight" />
              <div className="w-1/4 bg-emerald-500" title="Normal" />
              <div className="w-1/4 bg-amber-500" title="Overweight" />
              <div className="w-1/4 bg-rose-500" title="Obese" />
            </div>
          </div>

          <div className="mt-4 p-3 bg-white/80 rounded-lg border border-indigo-100/70 text-xs text-gray-700">
            <span className="font-semibold text-gray-900">Healthy Weight Target: </span>
            {result.healthyRange} (based on normal BMI 18.5–24.9)
          </div>

          <ResultActionsRow
            resultText={formattedResult}
            queryParams={
              unitSystem === 'metric'
                ? { unit: 'metric', h_cm: heightCm, w_kg: weightKg }
                : { unit: 'imperial', h_ft: heightFt, h_in: heightIn, w_lbs: weightLbs }
            }
            className="mt-4"
          />
        </div>
      )}
    </div>
  );
};
