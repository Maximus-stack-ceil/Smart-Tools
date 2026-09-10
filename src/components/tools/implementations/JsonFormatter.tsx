import React, { useState } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { RotateCcw, Braces, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const JsonFormatter: React.FC = () => {
  const { showToast } = useToast();

  const [inputJson, setInputJson] = useState<string>(
    '{\n  "platform": "SmartTools",\n  "status": "active",\n  "features": ["calculators", "converters", "generators"],\n  "version": 1.0,\n  "clientSide": true\n}'
  );
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>('Valid JSON');

  const formatJson = (spaces: number = 2) => {
    setError(null);
    if (!inputJson.trim()) {
      setError('Please enter JSON text to format.');
      setStatusMessage(null);
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, spaces);
      setInputJson(formatted);
      setStatusMessage(`Valid JSON formatted with ${spaces} spaces`);
      showToast(`Formatted JSON with ${spaces} spaces!`);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax.');
      setStatusMessage(null);
    }
  };

  const minifyJson = () => {
    setError(null);
    if (!inputJson.trim()) {
      setError('Please enter JSON text to minify.');
      setStatusMessage(null);
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setInputJson(minified);
      setStatusMessage('Valid JSON minified');
      showToast('JSON minified!');
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax.');
      setStatusMessage(null);
    }
  };

  const validateOnly = () => {
    setError(null);
    if (!inputJson.trim()) {
      setError('Please enter JSON text.');
      setStatusMessage(null);
      return;
    }
    try {
      JSON.parse(inputJson);
      setStatusMessage('Valid JSON syntax confirmed.');
      showToast('JSON is valid!');
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax.');
      setStatusMessage(null);
    }
  };

  const handleReset = () => {
    setInputJson('');
    setError(null);
    setStatusMessage(null);
  };

  const handleSample = () => {
    setInputJson(
      '{"service":"SmartTools","stats":{"users":10000,"rating":4.9},"categories":["finance","datetime","text","developer"],"ready":true}'
    );
    setError(null);
    setStatusMessage('Sample JSON loaded');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="json-editor" className="block text-sm font-semibold text-gray-900">
            JSON Input & Output
          </label>
          <button
            type="button"
            onClick={handleSample}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Load Sample JSON
          </button>
        </div>

        <div className="relative">
          <textarea
            id="json-editor"
            rows={10}
            value={inputJson}
            onChange={(e) => {
              setInputJson(e.target.value);
              setError(null);
              setStatusMessage(null);
            }}
            placeholder='Paste raw JSON here: {"key": "value"}'
            className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm font-mono text-gray-900 bg-gray-50 border border-gray-300 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Status Indicators */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-xs border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">JSON Syntax Error: </span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {statusMessage && !error && (
          <div className="flex items-center gap-2 p-2.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs border border-emerald-200">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            id="format-json-2"
            type="button"
            onClick={() => formatJson(2)}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
          >
            Format (2 Spaces)
          </button>

          <button
            id="format-json-4"
            type="button"
            onClick={() => formatJson(4)}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
          >
            Format (4 Spaces)
          </button>

          <button
            id="minify-json-btn"
            type="button"
            onClick={minifyJson}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Minify (Strip Spaces)
          </button>

          <button
            id="validate-json-btn"
            type="button"
            onClick={validateOnly}
            className="px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Validate Syntax
          </button>

          <button
            id="clear-json-btn"
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors ml-auto flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>

        <ResultActionsRow resultText={inputJson} className="mt-4" />
      </div>
    </div>
  );
};
