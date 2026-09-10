import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResultActionsRow } from '../ResultActionsRow';
import { Droplet, RotateCcw, Check } from 'lucide-react';
import { trackEvent } from '../../../utils/analytics';

export const WaterIntakeCalculator: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [weightKg, setWeightKg] = useState<string>(searchParams.get('weight') || '70');
  const [exerciseMins, setExerciseMins] = useState<string>(searchParams.get('exercise') || '30');
  const [climate, setClimate] = useState<'normal' | 'hot'>('normal');
  const [isPregnantOrNursing, setIsPregnantOrNursing] = useState<boolean>(false);

  const [liters, setLiters] = useState<number | null>(null);
  const [ounces, setOunces] = useState<number | null>(null);
  const [glasses, setGlasses] = useState<number | null>(null);
  const [checkedGlasses, setCheckedGlasses] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    const w = parseFloat(weightKg);
    const ex = parseFloat(exerciseMins);

    if (isNaN(w) || w < 20 || w > 300) {
      setError('Please enter a valid body weight between 20 and 300 kg.');
      setLiters(null);
      return;
    }
    if (isNaN(ex) || ex < 0) {
      setError('Please enter valid exercise minutes.');
      setLiters(null);
      return;
    }

    // Baseline: ~35 ml per kg of body weight
    let ml = w * 35;

    // +350 ml for every 30 minutes of exercise
    ml += (ex / 30) * 350;

    // +500 ml for hot/humid climate
    if (climate === 'hot') {
      ml += 500;
    }

    // +700 ml for pregnant / nursing
    if (isPregnantOrNursing) {
      ml += 700;
    }

    const calculatedLiters = ml / 1000;
    const calculatedOz = ml / 29.5735;
    const calculatedGlasses = Math.round(calculatedOz / 8); // standard 8oz glasses

    setLiters(calculatedLiters);
    setOunces(calculatedOz);
    setGlasses(calculatedGlasses);

    trackEvent('tool_used', { tool: 'water-intake-calculator', liters: calculatedLiters });
  };

  useEffect(() => {
    calculate();
  }, [weightKg, exerciseMins, climate, isPregnantOrNursing]);

  const handleReset = () => {
    setWeightKg('70');
    setExerciseMins('30');
    setClimate('normal');
    setIsPregnantOrNursing(false);
    setCheckedGlasses(0);
  };

  const toggleGlass = (index: number) => {
    if (checkedGlasses === index + 1) {
      setCheckedGlasses(index);
    } else {
      setCheckedGlasses(index + 1);
    }
  };

  const resultText = liters !== null
    ? `Recommended Daily Water Intake: ${liters.toFixed(1)} Liters (${Math.round(ounces || 0)} fl oz or ~${glasses} cups of 8oz water)`
    : '';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Body Weight (kg)
            </label>
            <input
              type="number"
              min="20"
              max="300"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-base text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Daily Exercise / Active Time (Minutes)
            </label>
            <input
              type="number"
              min="0"
              max="360"
              step="15"
              value={exerciseMins}
              onChange={(e) => setExerciseMins(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-base text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Climate & Weather
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setClimate('normal')}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                  climate === 'normal'
                    ? 'bg-sky-50 border-sky-600 text-sky-700'
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                Moderate / Temperate
              </button>
              <button
                type="button"
                onClick={() => setClimate('hot')}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                  climate === 'hot'
                    ? 'bg-sky-50 border-sky-600 text-sky-700'
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                Hot / Humid / High Altitude
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="pregnantCheckbox"
              checked={isPregnantOrNursing}
              onChange={(e) => setIsPregnantOrNursing(e.target.checked)}
              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-gray-300"
            />
            <label htmlFor="pregnantCheckbox" className="text-xs text-gray-700 font-medium cursor-pointer">
              Pregnant or breastfeeding (+700 ml hydration needs)
            </label>
          </div>

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
        <div className="flex flex-col justify-between bg-sky-50/50 rounded-xl p-6 border border-sky-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-900 mb-4">
              <Droplet className="w-4 h-4 text-sky-600" />
              <span>Recommended Daily Hydration</span>
            </div>

            {error ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
                {error}
              </div>
            ) : liters !== null ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-sky-200">
                  <div className="text-xs text-gray-500 font-medium">Target Water Volume</div>
                  <div className="text-4xl font-extrabold text-sky-600 tracking-tight mt-1">
                    {liters.toFixed(1)} Liters
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Equivalent to {Math.round(ounces || 0)} fl oz (~{glasses} glasses of 250ml)
                  </div>
                </div>

                {/* Interactive Glass Tracker */}
                <div className="bg-white p-3.5 rounded-xl border border-sky-100">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-2.5">
                    <span>Interactive Glass Tracker ({checkedGlasses}/{glasses || 8} drunk)</span>
                    <button
                      type="button"
                      onClick={() => setCheckedGlasses(0)}
                      className="text-sky-600 hover:text-sky-800 text-[11px]"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: Math.min(glasses || 8, 16) }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleGlass(i)}
                        title={`Glass #${i + 1}`}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          i < checkedGlasses
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'bg-sky-50 border border-sky-200 text-sky-300 hover:border-sky-400'
                        }`}
                      >
                        {i < checkedGlasses ? <Check className="w-4 h-4" /> : <Droplet className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {liters !== null && (
            <div className="mt-6 pt-4 border-t border-sky-200">
              <ResultActionsRow
                resultText={resultText}
                queryParams={{
                  weight: weightKg,
                  exercise: exerciseMins,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
