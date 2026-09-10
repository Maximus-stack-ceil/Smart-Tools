import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResultActionsRow } from '../ResultActionsRow';
import { Flame, RotateCcw } from 'lucide-react';
import { trackEvent } from '../../../utils/analytics';

export const CalorieCalculator: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>(searchParams.get('age') || '28');
  const [weightKg, setWeightKg] = useState<string>(searchParams.get('weight') || '72');
  const [heightCm, setHeightCm] = useState<string>(searchParams.get('height') || '175');
  const [activity, setActivity] = useState<number>(1.375); // 1.2 = Sedentary, 1.375 = Light, 1.55 = Moderate, 1.725 = Very Active, 1.9 = Extra

  interface CalorieGoals {
    bmr: number;
    tdee: number;
    mildLoss: number;
    weightLoss: number;
    extremeLoss: number;
    mildGain: number;
  }
  const [goals, setGoals] = useState<CalorieGoals | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    const a = parseInt(age, 10);
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm);

    if (isNaN(a) || a < 15 || a > 110) {
      setError('Please enter an age between 15 and 110.');
      setGoals(null);
      return;
    }
    if (isNaN(w) || w < 30 || w > 300) {
      setError('Please enter a weight between 30 and 300 kg.');
      setGoals(null);
      return;
    }
    if (isNaN(h) || h < 100 || h > 250) {
      setError('Please enter a height between 100 and 250 cm.');
      setGoals(null);
      return;
    }

    // Mifflin-St Jeor Equation:
    // BMR (male) = 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) + 5
    // BMR (female) = 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) - 161
    let bmr = 10 * w + 6.25 * h - 5 * a;
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const tdee = bmr * activity;

    setGoals({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      mildLoss: Math.round(tdee - 250), // 0.25 kg / 0.5 lb loss per week
      weightLoss: Math.round(tdee - 500), // 0.5 kg / 1 lb loss per week
      extremeLoss: Math.round(tdee - 1000), // 1 kg / 2 lb loss per week
      mildGain: Math.round(tdee + 350), // clean lean bulk
    });

    trackEvent('tool_used', { tool: 'calorie-calculator', tdee: Math.round(tdee) });
  };

  useEffect(() => {
    calculate();
  }, [gender, age, weightKg, heightCm, activity]);

  const handleReset = () => {
    setGender('male');
    setAge('28');
    setWeightKg('72');
    setHeightCm('175');
    setActivity(1.375);
  };

  const resultText = goals
    ? `Daily Calorie Needs: Maintenance = ${goals.tdee} kcal/day | Mild Weight Loss = ${goals.mildLoss} kcal/day | Standard Weight Loss = ${goals.weightLoss} kcal/day | Muscle Gain = ${goals.mildGain} kcal/day (BMR: ${goals.bmr} kcal)`
    : '';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Gender</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2 text-sm font-semibold rounded-xl border transition-all ${
                  gender === 'male'
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                    : 'bg-white border-gray-300 text-gray-700'
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
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Age</label>
              <input
                type="number"
                min="15"
                max="110"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-indigo-600 text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                min="30"
                max="300"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-indigo-600 text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Height (cm)</label>
              <input
                type="number"
                min="100"
                max="250"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-indigo-600 text-sm text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Activity Level
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(parseFloat(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-sm font-medium bg-white text-gray-900"
            >
              <option value="1.2">Sedentary (Little or no exercise, desk job)</option>
              <option value="1.375">Light Exercise (1-3 days per week)</option>
              <option value="1.55">Moderate Exercise (3-5 days per week)</option>
              <option value="1.725">Heavy / Active (6-7 days per week)</option>
              <option value="1.9">Athlete / Physical Labor (2x per day)</option>
            </select>
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
        <div className="flex flex-col justify-between bg-amber-50/50 rounded-xl p-6 border border-amber-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 mb-4">
              <Flame className="w-4 h-4 text-amber-600" />
              <span>Daily Calorie Breakdown</span>
            </div>

            {error ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
                {error}
              </div>
            ) : goals ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-amber-200">
                  <div className="text-xs text-gray-500 font-medium">Maintenance Calories (TDEE)</div>
                  <div className="text-4xl font-extrabold text-amber-700 tracking-tight mt-1">
                    {goals.tdee.toLocaleString()} kcal/day
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Base metabolic rate (BMR): {goals.bmr.toLocaleString()} kcal
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-amber-100 overflow-hidden divide-y divide-gray-100 text-xs">
                  <div className="flex justify-between p-2.5 items-center">
                    <div>
                      <span className="font-semibold text-gray-800">Weight Loss (1 lb / 0.5kg/wk)</span>
                      <span className="text-[11px] text-gray-500 block">Healthy sustainable deficit (-500 kcal)</span>
                    </div>
                    <span className="font-bold text-emerald-600 text-sm">{goals.weightLoss.toLocaleString()} kcal</span>
                  </div>
                  <div className="flex justify-between p-2.5 items-center">
                    <div>
                      <span className="font-semibold text-gray-800">Mild Weight Loss (0.5 lb/wk)</span>
                      <span className="text-[11px] text-gray-500 block">Gradual gentle deficit (-250 kcal)</span>
                    </div>
                    <span className="font-bold text-gray-900 text-sm">{goals.mildLoss.toLocaleString()} kcal</span>
                  </div>
                  <div className="flex justify-between p-2.5 items-center">
                    <div>
                      <span className="font-semibold text-gray-800">Lean Muscle Building</span>
                      <span className="text-[11px] text-gray-500 block">Moderate surplus (+350 kcal)</span>
                    </div>
                    <span className="font-bold text-indigo-600 text-sm">{goals.mildGain.toLocaleString()} kcal</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {goals && (
            <div className="mt-6 pt-4 border-t border-amber-200">
              <ResultActionsRow
                resultText={resultText}
                queryParams={{
                  age,
                  weight: weightKg,
                  height: heightCm,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
