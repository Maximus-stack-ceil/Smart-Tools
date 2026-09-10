import React, { useState } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { Sparkles, Copy, Check, RefreshCw } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { trackEvent } from '../../../utils/analytics';

export const UsernameGenerator: React.FC = () => {
  const { showToast } = useToast();

  const [style, setStyle] = useState<'tech' | 'aesthetic' | 'gaming' | 'minimal' | 'creative'>('tech');
  const [seedKeyword, setSeedKeyword] = useState<string>('');
  const [appendNumber, setAppendNumber] = useState<boolean>(true);
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const wordBank = {
    tech: {
      prefixes: ['Cyber', 'Byte', 'Hyper', 'Data', 'Quantum', 'Cloud', 'Logic', 'Code', 'Sync', 'Bit', 'Pixel', 'Vector'],
      suffixes: ['Craft', 'Stack', 'Dev', 'Labs', 'Pulse', 'Matrix', 'Flow', 'Grid', 'Node', 'Wave', 'Core', 'Forge'],
    },
    aesthetic: {
      prefixes: ['Velvet', 'Lunar', 'Sol', 'Misty', 'Echo', 'Amber', 'Aura', 'Frost', 'Opal', 'Dusk', 'Dawn', 'Breeze'],
      suffixes: ['Glow', 'Haven', 'Meadow', 'Bloom', 'Petal', 'Whim', 'Spire', 'Haze', 'Muse', 'Loom', 'Song', 'Fern'],
    },
    gaming: {
      prefixes: ['Vortex', 'Shadow', 'Apex', 'Phantom', 'Inferno', 'Titan', 'Savage', 'Viper', 'Rogue', 'Venom', 'Strike', 'Havoc'],
      suffixes: ['Slayer', 'Sniper', 'Ghost', 'Knight', 'Fury', 'Rider', 'Fang', 'Blade', 'Wolf', 'Storm', 'Claw', 'Beast'],
    },
    minimal: {
      prefixes: ['Arc', 'Mono', 'Null', 'Neo', 'Zen', 'Mod', 'Omni', 'True', 'Alt', 'Pure', 'Kona', 'Lux'],
      suffixes: ['io', 'ly', 'os', 'ix', 'on', 'ex', 'is', 'co', 'up', 'hq', 'go', 'lab'],
    },
    creative: {
      prefixes: ['Cosmic', 'Curious', 'Whimsical', 'Artisan', 'Dream', 'Spark', 'Wonder', 'Quirk', 'Prism', 'Kaleido'],
      suffixes: ['Studio', 'Fable', 'Tale', 'Canvas', 'Brush', 'Charm', 'Quest', 'Vibe', 'Notes', 'Venture'],
    },
  };

  const generateNames = (): string[] => {
    const bank = wordBank[style];
    const results: string[] = [];
    const used = new Set<string>();

    for (let i = 0; i < 12; i++) {
      const p = bank.prefixes[Math.floor(Math.random() * bank.prefixes.length)];
      const s = bank.suffixes[Math.floor(Math.random() * bank.suffixes.length)];
      let name = '';

      if (seedKeyword.trim()) {
        const clean = seedKeyword.trim().replace(/\s+/g, '');
        name = Math.random() > 0.5 ? `${clean}${s}` : `${p}${clean}`;
      } else {
        name = `${p}${s}`;
      }

      if (appendNumber && Math.random() > 0.3) {
        const num = Math.floor(Math.random() * 90) + 10;
        name = `${name}${num}`;
      }

      if (!used.has(name)) {
        used.add(name);
        results.push(name);
      }
    }

    return results;
  };

  const [usernames, setUsernames] = useState<string[]>(generateNames());

  const handleRefresh = () => {
    setUsernames(generateNames());
    trackEvent('tool_used', { tool: 'username-generator', style });
  };

  const handleCopySingle = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedName(name);
      showToast(`Copied "@${name}" to clipboard!`);
      setTimeout(() => setCopiedName(null), 2000);
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(['tech', 'aesthetic', 'gaming', 'minimal', 'creative'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setStyle(s);
              setTimeout(() => handleRefresh(), 0);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              style === s
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Include Custom Keyword (Optional)
          </label>
          <input
            type="text"
            value={seedKeyword}
            onChange={(e) => setSeedKeyword(e.target.value)}
            placeholder="e.g. Alex, Design, Swift"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-600 text-sm text-gray-900"
          />
        </div>

        <div className="flex items-center justify-between pt-6">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
            <input
              type="checkbox"
              checked={appendNumber}
              onChange={(e) => setAppendNumber(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span>Append Random Numbers (e.g. 42)</span>
          </label>

          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate New</span>
          </button>
        </div>
      </div>

      {/* Grid of Generated Usernames */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {usernames.map((name, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleCopySingle(name)}
            className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/30 transition-all text-left group"
          >
            <span className="font-mono text-sm font-semibold text-gray-900 truncate">
              @{name}
            </span>
            <span className="text-gray-400 group-hover:text-indigo-600 shrink-0 ml-1">
              {copiedName === name ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </span>
          </button>
        ))}
      </div>

      <div className="pt-2 border-t border-gray-200">
        <ResultActionsRow resultText={usernames.map((u) => `@${u}`).join(', ')} />
      </div>
    </div>
  );
};
