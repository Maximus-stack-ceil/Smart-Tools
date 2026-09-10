import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResultActionsRow } from '../ResultActionsRow';
import { Tag, RotateCcw, DollarSign } from 'lucide-react';
import { trackEvent } from '../../../utils/analytics';

export const DiscountCalculator: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [price, setPrice] = useState<string>(searchParams.get('price') || '100');
  const [discountPercent, setDiscountPercent] = useState<string>(searchParams.get('discount') || '20');
  const [extraDiscount, setExtraDiscount] = useState<string>(searchParams.get('extra') || '0');
  const [taxPercent, setTaxPercent] = useState<string>(searchParams.get('tax') || '0');

  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [totalSaved, setTotalSaved] = useState<number | null>(null);
  const [effectiveDiscount, setEffectiveDiscount] = useState<number | null>(null);
  const [taxAmount, setTaxAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    const p = parseFloat(price);
    const d = parseFloat(discountPercent);
    const ed = parseFloat(extraDiscount || '0');
    const t = parseFloat(taxPercent || '0');

    if (isNaN(p) || p < 0) {
      setError('Please enter a valid original price.');
      setFinalPrice(null);
      return;
    }
    if (isNaN(d) || d < 0 || d > 100) {
      setError('Discount must be between 0% and 100%.');
      setFinalPrice(null);
      return;
    }
    if (isNaN(ed) || ed < 0 || ed > 100) {
      setError('Additional discount must be between 0% and 100%.');
      setFinalPrice(null);
      return;
    }

    // Calculation
    const afterFirst = p * (1 - d / 100);
    const afterSecond = afterFirst * (1 - ed / 100);
    const tax = t > 0 ? afterSecond * (t / 100) : 0;
    const finalVal = afterSecond + tax;
    const saved = Math.max(0, p - afterSecond);
    const effPct = p > 0 ? (saved / p) * 100 : 0;

    setFinalPrice(finalVal);
    setTotalSaved(saved);
    setTaxAmount(tax);
    setEffectiveDiscount(effPct);

    trackEvent('tool_used', { tool: 'discount-calculator', price: p, discount: d });
  };

  useEffect(() => {
    calculate();
  }, [price, discountPercent, extraDiscount, taxPercent]);

  const presetDiscounts = [10, 15, 20, 25, 30, 40, 50, 70];

  const handleReset = () => {
    setPrice('100');
    setDiscountPercent('20');
    setExtraDiscount('0');
    setTaxPercent('0');
  };

  const resultText = finalPrice !== null
    ? `Original Price: $${parseFloat(price || '0').toFixed(2)} | Discount: ${discountPercent}% | You Pay: $${finalPrice.toFixed(2)} (You Save: $${totalSaved?.toFixed(2)})`
    : '';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Inputs */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Original Price ($)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="100.00"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-base text-gray-900 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-gray-800">
                Primary Discount (%)
              </label>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                {discountPercent}% OFF
              </span>
            </div>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-base text-gray-900 transition-colors"
            />
            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {presetDiscounts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setDiscountPercent(p.toString())}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    discountPercent === p.toString()
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Extra Coupon / Store Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={extraDiscount}
                onChange={(e) => setExtraDiscount(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-indigo-600 text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Sales Tax (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-indigo-600 text-sm text-gray-900"
              />
            </div>
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

        {/* Right: Results Display */}
        <div className="flex flex-col justify-between bg-slate-50 rounded-xl p-6 border border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Tag className="w-4 h-4 text-emerald-600" />
              <span>Calculated Price</span>
            </div>

            {error ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
                {error}
              </div>
            ) : finalPrice !== null ? (
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 font-medium">Final Sale Price</div>
                  <div className="text-4xl font-extrabold text-gray-900 tracking-tight mt-1">
                    ${finalPrice.toFixed(2)}
                  </div>
                  {taxAmount && taxAmount > 0 ? (
                    <div className="text-xs text-gray-500 mt-0.5">
                      (Includes ${taxAmount.toFixed(2)} sales tax)
                    </div>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="text-xs text-gray-500">You Save</div>
                    <div className="text-lg font-bold text-emerald-600 mt-0.5">
                      ${totalSaved?.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="text-xs text-gray-500">Total Discount</div>
                    <div className="text-lg font-bold text-indigo-600 mt-0.5">
                      {effectiveDiscount?.toFixed(1)}% OFF
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-white/80 p-3 rounded-lg border border-slate-200">
                  <span className="font-semibold">Savings breakdown:</span> You are paying{' '}
                  <span className="font-semibold text-gray-900">${finalPrice.toFixed(2)}</span> instead of{' '}
                  <span className="line-through text-gray-400">${parseFloat(price || '0').toFixed(2)}</span>.
                </div>
              </div>
            ) : null}
          </div>

          {finalPrice !== null && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <ResultActionsRow
                resultText={resultText}
                queryParams={{
                  price,
                  discount: discountPercent,
                  extra: extraDiscount,
                  tax: taxPercent,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
