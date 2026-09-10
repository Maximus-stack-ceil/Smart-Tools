import React, { useState } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { RotateCcw, ArrowRightLeft, Binary } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const Base64Tool: React.FC = () => {
  const { showToast } = useToast();

  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputText, setInputText] = useState<string>('Hello from SmartTools!');
  const [urlSafe, setUrlSafe] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Safe UTF-8 Base64 Encoding
  const utf8ToBase64 = (str: string) => {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
  };

  // Safe UTF-8 Base64 Decoding
  const base64ToUtf8 = (str: string) => {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(str), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  };

  const processText = () => {
    setError(null);
    if (!inputText.trim()) {
      return '';
    }

    try {
      if (mode === 'encode') {
        let b64 = utf8ToBase64(inputText);
        if (urlSafe) {
          b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }
        return b64;
      } else {
        let b64 = inputText.trim();
        if (urlSafe) {
          b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
          while (b64.length % 4) {
            b64 += '=';
          }
        }
        return base64ToUtf8(b64);
      }
    } catch (err: any) {
      setError(
        mode === 'decode'
          ? 'Failed to decode Base64. Ensure input contains valid Base64 string.'
          : 'Failed to encode input text.'
      );
      return '';
    }
  };

  const outputText = processText();

  const handleSwap = () => {
    if (outputText) {
      setInputText(outputText);
      setMode(mode === 'encode' ? 'decode' : 'encode');
    } else {
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
    setError(null);
  };

  const handleReset = () => {
    setInputText('');
    setError(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs">
      {/* Mode toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode('encode');
              setError(null);
            }}
            className={`py-1.5 px-4 text-xs font-semibold rounded-lg transition-all ${
              mode === 'encode'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Encode (Text → Base64)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('decode');
              setError(null);
            }}
            className={`py-1.5 px-4 text-xs font-semibold rounded-lg transition-all ${
              mode === 'decode'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Decode (Base64 → Text)
          </button>
        </div>

        <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={urlSafe}
            onChange={(e) => setUrlSafe(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 border-gray-300"
          />
          <span>URL-Safe Base64</span>
        </label>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="base64-input" className="block text-sm font-semibold text-gray-900">
              {mode === 'encode' ? 'Plain Text Input' : 'Base64 Input String'}
            </label>
            <button
              type="button"
              onClick={handleSwap}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Swap Input & Output
            </button>
          </div>
          <textarea
            id="base64-input"
            rows={4}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setError(null);
            }}
            placeholder={
              mode === 'encode' ? 'Type text to encode to Base64...' : 'Paste Base64 string to decode...'
            }
            className="w-full px-4 py-3 rounded-xl text-sm font-mono text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
          />
        </div>

        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

        {/* Output box */}
        <div>
          <label htmlFor="base64-output" className="block text-sm font-semibold text-gray-900 mb-1.5">
            {mode === 'encode' ? 'Encoded Base64 Output' : 'Decoded Plain Text'}
          </label>
          <div className="relative">
            <textarea
              id="base64-output"
              rows={4}
              readOnly
              value={outputText}
              placeholder="Output will appear here automatically..."
              className="w-full px-4 py-3 rounded-xl text-sm font-mono text-gray-900 bg-gray-50 border border-gray-200 select-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>

        <ResultActionsRow resultText={outputText || inputText} className="mt-4" />
      </div>
    </div>
  );
};
