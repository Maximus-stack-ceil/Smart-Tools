import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { ResultActionsRow } from '../ResultActionsRow';
import { QrCode, Download, RotateCcw } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const QrCodeGenerator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [text, setText] = useState<string>(
    searchParams.get('text') || 'https://smarttools.io'
  );
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [size, setSize] = useState<number>(256);
  const [dataUrl, setDataUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQr = async () => {
    setError(null);
    if (!text.trim()) {
      setError('Please enter a URL or text to generate a QR code.');
      setDataUrl('');
      return;
    }

    try {
      const url = await QRCode.toDataURL(text, {
        errorCorrectionLevel: errorLevel,
        width: size,
        margin: 2,
        color: {
          dark: '#111827',
          light: '#FFFFFF',
        },
      });
      setDataUrl(url);
    } catch (err: any) {
      setError(err.message || 'Failed to generate QR code.');
      setDataUrl('');
    }
  };

  useEffect(() => {
    generateQr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorLevel, size]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'smarttools-qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('QR code downloaded successfully!');
  };

  const handleReset = () => {
    setText('https://smarttools.io');
    setErrorLevel('M');
    setSize(256);
    setError(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          generateQr();
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="qr-content-input" className="block text-sm font-semibold text-gray-900 mb-1.5">
            Website URL or Text Content
          </label>
          <input
            id="qr-content-input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. https://example.com or WiFi details"
            className="w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
          />
          {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="qr-error-correction" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Error Correction Level
            </label>
            <select
              id="qr-error-correction"
              value={errorLevel}
              onChange={(e) => setErrorLevel(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="L">Low (7% recovery, best for clean links)</option>
              <option value="M">Medium (15% recovery, recommended)</option>
              <option value="Q">Quartile (25% recovery)</option>
              <option value="H">High (30% recovery, best for printing)</option>
            </select>
          </div>

          <div>
            <label htmlFor="qr-size-select" className="block text-sm font-semibold text-gray-900 mb-1.5">
              Resolution Size
            </label>
            <select
              id="qr-size-select"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-lg text-sm text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="192">192 × 192 px (Small)</option>
              <option value="256">256 × 256 px (Standard)</option>
              <option value="384">384 × 384 px (High Quality)</option>
              <option value="512">512 × 512 px (Print Ready)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            id="generate-qr-btn"
            type="submit"
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
          >
            Generate QR Code
          </button>
          <button
            id="reset-qr-btn"
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

      {/* Result Panel */}
      {dataUrl && (
        <div
          id="qr-result-panel"
          className="mt-6 p-6 rounded-xl bg-indigo-50/50 border border-indigo-100 flex flex-col items-center justify-center animate-in fade-in"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700 mb-3">
            Generated Scannable QR Code
          </div>

          <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <img
              src={dataUrl}
              alt="Generated QR Code"
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
            />
          </div>

          <p className="mt-3 text-xs text-gray-500 text-center max-w-sm truncate">
            Target: <span className="font-mono text-gray-700">{text}</span>
          </p>

          <div className="w-full mt-4">
            <ResultActionsRow
              resultText={text}
              queryParams={{ text }}
              onDownload={handleDownload}
              downloadLabel="Download PNG"
            />
          </div>
        </div>
      )}
    </div>
  );
};
