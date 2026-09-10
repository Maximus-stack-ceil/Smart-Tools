import React, { useState } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { CheckCircle2, AlertTriangle, Code2, Copy, Minimize2, Maximize2 } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { trackEvent } from '../../../utils/analytics';

export const JsonValidator: React.FC = () => {
  const { showToast } = useToast();

  const sampleJson = `{\n  "status": "success",\n  "code": 200,\n  "data": {\n    "platform": "SmartTools",\n    "version": "1.0.0",\n    "active": true\n  }\n}`;

  const [inputJson, setInputJson] = useState<string>(sampleJson);

  interface ValidationResult {
    isValid: boolean;
    errorMsg?: string;
    line?: number;
    column?: number;
    formatted?: string;
  }

  const validateJson = (): ValidationResult => {
    if (inputJson.trim() === '') {
      return { isValid: false, errorMsg: 'Please enter JSON code to validate.' };
    }

    try {
      const parsed = JSON.parse(inputJson);
      return {
        isValid: true,
        formatted: JSON.stringify(parsed, null, 2),
      };
    } catch (err: any) {
      // Attempt to extract line and column from error message
      let line: number | undefined;
      let column: number | undefined;
      const match = err.message.match(/at position (\d+)/i);
      if (match) {
        const pos = parseInt(match[1], 10);
        const upToPos = inputJson.slice(0, pos);
        const lines = upToPos.split('\n');
        line = lines.length;
        column = lines[lines.length - 1].length + 1;
      }
      return {
        isValid: false,
        errorMsg: err.message,
        line,
        column,
      };
    }
  };

  const validation = validateJson();

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed, null, 2));
      showToast('JSON beautified');
      trackEvent('tool_used', { tool: 'json-validator', action: 'beautify' });
    } catch {
      showToast('Cannot format invalid JSON', 'error');
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed));
      showToast('JSON minified');
      trackEvent('tool_used', { tool: 'json-validator', action: 'minify' });
    } catch {
      showToast('Cannot minify invalid JSON', 'error');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      {/* Validation Status Banner */}
      <div className="mb-5">
        {validation.isValid ? (
          <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Valid JSON — Syntax is compliant with RFC 8259 JSON standards.</span>
          </div>
        ) : (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Invalid JSON Syntax</span>
            </div>
            <p className="mt-1 text-xs text-rose-700 pl-7 font-mono">
              {validation.errorMsg}
              {validation.line ? ` (Approx Line ${validation.line}, Col ${validation.column})` : ''}
            </p>
          </div>
        )}
      </div>

      {/* Editor Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <label className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
          <Code2 className="w-4 h-4 text-indigo-600" />
          <span>JSON Editor</span>
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFormat}
            disabled={!validation.isValid}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Beautify</span>
          </button>
          <button
            type="button"
            onClick={handleMinify}
            disabled={!validation.isValid}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify</span>
          </button>
          <button
            type="button"
            onClick={() => setInputJson('')}
            className="px-2.5 py-1.5 text-xs text-gray-500 hover:text-rose-600 font-medium transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <textarea
        rows={12}
        value={inputJson}
        onChange={(e) => setInputJson(e.target.value)}
        placeholder="Paste your JSON here to validate..."
        className="w-full p-4 font-mono text-xs text-gray-900 border border-gray-300 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 bg-slate-900/5"
      />

      <div className="mt-4 pt-3 border-t border-gray-200">
        <ResultActionsRow resultText={validation.isValid ? inputJson : ''} />
      </div>
    </div>
  );
};
