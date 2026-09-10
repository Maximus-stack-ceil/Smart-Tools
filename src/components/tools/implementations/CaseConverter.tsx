import React, { useState } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { RotateCcw, Copy, Check } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const CaseConverter: React.FC = () => {
  const [inputText, setInputText] = useState<string>('Free online tools for everyday tasks');
  const { showToast } = useToast();

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toWords = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .trim()
      .split(/\s+/);
  };

  const toCamelCase = (str: string) => {
    const words = toWords(str);
    return words
      .map((w, i) =>
        i === 0
          ? w.toLowerCase()
          : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      )
      .join('');
  };

  const toPascalCase = (str: string) => {
    const words = toWords(str);
    return words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('');
  };

  const toSnakeCase = (str: string) => {
    return toWords(str)
      .map((w) => w.toLowerCase())
      .join('_');
  };

  const toKebabCase = (str: string) => {
    return toWords(str)
      .map((w) => w.toLowerCase())
      .join('-');
  };

  const transform = (type: string) => {
    switch (type) {
      case 'upper':
        setInputText(inputText.toUpperCase());
        break;
      case 'lower':
        setInputText(inputText.toLowerCase());
        break;
      case 'title':
        setInputText(toTitleCase(inputText));
        break;
      case 'sentence':
        setInputText(toSentenceCase(inputText));
        break;
      case 'camel':
        setInputText(toCamelCase(inputText));
        break;
      case 'pascal':
        setInputText(toPascalCase(inputText));
        break;
      case 'snake':
        setInputText(toSnakeCase(inputText));
        break;
      case 'kebab':
        setInputText(toKebabCase(inputText));
        break;
      default:
        break;
    }
  };

  const formats = [
    { id: 'upper', label: 'UPPERCASE', preview: inputText.toUpperCase() },
    { id: 'lower', label: 'lowercase', preview: inputText.toLowerCase() },
    { id: 'title', label: 'Title Case', preview: toTitleCase(inputText) },
    { id: 'sentence', label: 'Sentence case', preview: toSentenceCase(inputText) },
    { id: 'camel', label: 'camelCase', preview: toCamelCase(inputText) },
    { id: 'pascal', label: 'PascalCase', preview: toPascalCase(inputText) },
    { id: 'snake', label: 'snake_case', preview: toSnakeCase(inputText) },
    { id: 'kebab', label: 'kebab-case', preview: toKebabCase(inputText) },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs">
      <div className="space-y-4">
        <div>
          <label htmlFor="case-input" className="block text-sm font-semibold text-gray-900 mb-1.5">
            Input Text
          </label>
          <textarea
            id="case-input"
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
          />
        </div>

        {/* Action format grid */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2.5">
            Quick Convert Options
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {formats.map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => transform(fmt.id)}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 text-gray-700 border border-gray-200 transition-colors text-center truncate"
              >
                {fmt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Real-time formatted cards preview */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Instant Previews
          </div>
          <div className="space-y-2.5">
            {formats.map((fmt) => (
              <div
                key={fmt.id}
                className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold text-gray-400 uppercase">
                    {fmt.label}
                  </div>
                  <div className="text-sm font-medium text-gray-900 truncate mt-0.5">
                    {fmt.preview || '—'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(fmt.preview);
                    showToast(`Copied ${fmt.label}!`);
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-indigo-600 hover:bg-white rounded-md border border-gray-200 transition-colors shrink-0"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>

        <ResultActionsRow resultText={inputText} className="mt-4" />
      </div>
    </div>
  );
};
