import React, { useState, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResultActionsRow } from '../ResultActionsRow';
import {
  RotateCcw,
  ArrowRightLeft,
  Binary,
  Upload,
  Download,
  Copy,
  Check,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

/**
 * Robust UTF-8 Base64 Encoder
 * Handles full unicode spectrum (emojis, multi-language scripts, binary bytes)
 */
function utf8ToBase64(str: string, urlSafe = false): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  let b64 = window.btoa(binary);
  if (urlSafe) {
    b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  return b64;
}

/**
 * Robust UTF-8 Base64 Decoder
 * Tolerates data URLs, newlines, spaces, unpadded/padded and url-safe Base64
 */
function base64ToUtf8(rawInput: string): string {
  let cleaned = rawInput.trim();
  if (!cleaned) return '';

  // Strip data URL prefixes if present e.g. "data:text/plain;base64,"
  if (cleaned.includes('base64,')) {
    cleaned = cleaned.split('base64,')[1].trim();
  }

  // Remove whitespace and newlines often present in PEM / MIME / JWT
  cleaned = cleaned.replace(/\s+/g, '');

  // Normalize URL-safe characters
  cleaned = cleaned.replace(/-/g, '+').replace(/_/g, '/');

  // Add missing '=' padding if needed
  while (cleaned.length % 4 !== 0) {
    cleaned += '=';
  }

  const binary = window.atob(cleaned);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const decoder = new TextDecoder('utf-8', { fatal: false });
  return decoder.decode(bytes);
}

export const Base64Tool: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialMode = searchParams.get('mode') === 'decode' ? 'decode' : 'encode';
  const initialText = searchParams.get('text') ?? 'Hello from SmartTools! 🚀';

  const [mode, setMode] = useState<'encode' | 'decode'>(initialMode);
  const [inputText, setInputText] = useState<string>(initialText);
  const [urlSafe, setUrlSafe] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [lineBreakEvery, setLineBreakEvery] = useState<number | null>(null);

  // Compute processed result & error safely
  const { outputText, error } = useMemo(() => {
    if (!inputText.trim()) {
      return { outputText: '', error: null };
    }

    try {
      if (mode === 'encode') {
        let b64 = utf8ToBase64(inputText, urlSafe);
        if (lineBreakEvery && lineBreakEvery > 0) {
          const regex = new RegExp(`.{1,${lineBreakEvery}}`, 'g');
          b64 = b64.match(regex)?.join('\n') || b64;
        }
        return { outputText: b64, error: null };
      } else {
        const decoded = base64ToUtf8(inputText);
        return { outputText: decoded, error: null };
      }
    } catch (err: any) {
      return {
        outputText: '',
        error:
          mode === 'decode'
            ? 'Invalid Base64 string. Please verify the characters and formatting.'
            : 'Encoding failed: ' + (err?.message || 'Unable to encode input.'),
      };
    }
  }, [inputText, mode, urlSafe, lineBreakEvery]);

  const handleSwap = () => {
    if (outputText) {
      setInputText(outputText);
      setMode((prev) => (prev === 'encode' ? 'decode' : 'encode'));
    } else {
      setMode((prev) => (prev === 'encode' ? 'decode' : 'encode'));
    }
  };

  const handleReset = () => {
    setInputText('');
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      showToast('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    const filename = mode === 'encode' ? 'encoded-base64.txt' : 'decoded-output.txt';
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded as ${filename}`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (mode === 'decode') {
      // Read as text
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setInputText(reader.result);
          showToast(`Loaded ${file.name}`);
        }
      };
      reader.readAsText(file);
    } else {
      // Encode file to Base64 (Data URI or raw base64)
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const rawB64 = reader.result.includes('base64,')
            ? reader.result.split('base64,')[1]
            : reader.result;
          setInputText(rawB64);
          setMode('decode'); // switch to show the decoded text or loaded
          showToast(`File ${file.name} converted to Base64`);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const loadSample = (type: 'text' | 'json' | 'arabic') => {
    if (type === 'text') {
      setInputText('SmartTools: Free, fast, privacy-focused online tools! ⚡');
    } else if (type === 'json') {
      setInputText(JSON.stringify({ tool: 'Base64', version: '2.0', active: true }, null, 2));
    } else if (type === 'arabic') {
      setInputText('أهلاً بك في منصة الأدوات الذكية - تشفير وفك تشفير Base64 فوري');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs">
      {/* Top Header & Mode selector tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
          <button
            type="button"
            id="base64-tab-encode"
            onClick={() => setMode('encode')}
            className={`py-2 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              mode === 'encode'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Encode (Text → Base64)
          </button>
          <button
            type="button"
            id="base64-tab-decode"
            onClick={() => setMode('decode')}
            className={`py-2 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              mode === 'decode'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Decode (Base64 → Text)
          </button>
        </div>

        {/* URL-Safe & Formatting Options */}
        <div className="flex items-center gap-4 flex-wrap">
          {mode === 'encode' && (
            <>
              <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="base64-url-safe-check"
                  checked={urlSafe}
                  onChange={(e) => setUrlSafe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span className="font-medium">URL-Safe (- / _)</span>
              </label>

              <select
                id="base64-line-wrap-select"
                aria-label="Line formatting"
                value={lineBreakEvery === null ? '' : String(lineBreakEvery)}
                onChange={(e) => {
                  const val = e.target.value;
                  setLineBreakEvery(val ? parseInt(val, 10) : null);
                }}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-700 bg-white"
              >
                <option value="">No Line Wrap</option>
                <option value="64">Wrap at 64 chars (PEM)</option>
                <option value="76">Wrap at 76 chars (MIME)</option>
              </select>
            </>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            id="base64-file-upload-input"
          />
          <button
            type="button"
            id="base64-file-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-indigo-600 font-medium py-1 px-2.5 rounded-lg border border-gray-200 hover:border-indigo-200 bg-gray-50 transition-colors"
            title="Upload a file to process"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {/* Input Area */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="base64-input" className="block text-sm font-semibold text-gray-900">
              {mode === 'encode' ? 'Source Text / Content' : 'Base64 Encoded Input'}
            </label>

            <div className="flex items-center gap-3">
              {/* Quick sample chips */}
              <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-500" /> Samples:
                </span>
                <button
                  type="button"
                  onClick={() => loadSample('text')}
                  className="hover:text-indigo-600 underline font-medium"
                >
                  Emoji
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => loadSample('json')}
                  className="hover:text-indigo-600 underline font-medium"
                >
                  JSON
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => loadSample('arabic')}
                  className="hover:text-indigo-600 underline font-medium"
                >
                  العربية
                </button>
              </div>

              <button
                type="button"
                id="base64-swap-button"
                onClick={handleSwap}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                title="Swap input and output"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Swap</span>
              </button>
            </div>
          </div>

          <textarea
            id="base64-input"
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              mode === 'encode'
                ? 'Enter plain text, emojis, or paste content to encode into Base64...'
                : 'Paste Base64 encoded string here to decode...'
            }
            className={`w-full px-4 py-3 rounded-xl text-sm font-mono text-gray-900 bg-white border transition-colors focus:outline-hidden focus:ring-2 ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-300 focus:border-indigo-600 focus:ring-indigo-600/20'
            }`}
          />

          <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
            <span>
              Length: <strong className="text-gray-700">{inputText.length}</strong> characters (
              {new TextEncoder().encode(inputText).length} bytes)
            </span>
            <button
              type="button"
              id="base64-clear-button"
              onClick={handleReset}
              className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium animate-in fade-in">
            {error}
          </div>
        )}

        {/* Output Area */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="base64-output" className="block text-sm font-semibold text-gray-900">
              {mode === 'encode' ? 'Base64 Encoded Output' : 'Decoded Plain Text'}
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="base64-copy-btn"
                onClick={handleCopy}
                disabled={!outputText}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                type="button"
                id="base64-download-btn"
                onClick={handleDownload}
                disabled={!outputText}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save .txt</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              id="base64-output"
              rows={5}
              readOnly
              value={outputText}
              placeholder="Converted result will appear here automatically in real time..."
              className="w-full px-4 py-3 rounded-xl text-sm font-mono text-gray-900 bg-gray-50 border border-gray-200 focus:outline-hidden select-all"
            />
          </div>

          {outputText && (
            <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
              <span>
                Output: <strong className="text-gray-700">{outputText.length}</strong> characters (
                {new TextEncoder().encode(outputText).length} bytes)
              </span>
            </div>
          )}
        </div>

        {/* Share & actions */}
        <ResultActionsRow
          resultText={outputText || inputText}
          queryParams={{ mode, text: inputText }}
          onDownload={handleDownload}
          downloadLabel="Download Text"
          className="mt-6"
        />
      </div>
    </div>
  );
};
