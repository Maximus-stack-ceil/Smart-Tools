import React, { useState, useRef } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { Upload, Image as ImageIcon, Download, RotateCcw, Check } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const ImageConverter: React.FC = () => {
  const { showToast } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<'image/webp' | 'image/png' | 'image/jpeg'>('image/webp');
  const [quality, setQuality] = useState<number>(0.85);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPEG, WebP, etc.).', 'error');
      return;
    }
    setSelectedFile(file);
    setConvertedUrl(null);
    setConvertedSize(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleConvert = () => {
    if (!selectedFile || !previewUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = previewUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      // If converting to JPEG, draw white background first
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          setIsProcessing(false);
          if (blob) {
            const url = URL.createObjectURL(blob);
            setConvertedUrl(url);
            setConvertedSize(blob.size);
            showToast('Image converted successfully!');
          }
        },
        targetFormat,
        quality
      );
    };
  };

  const handleDownload = () => {
    if (!convertedUrl || !selectedFile) return;
    const ext = targetFormat.replace('image/', '');
    const baseName = selectedFile.name.replace(/\.[^/.]+$/, '');
    const link = document.createElement('a');
    link.href = convertedUrl;
    link.download = `${baseName}-converted.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Image downloaded!');
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setConvertedUrl(null);
    setConvertedSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs">
      <div className="space-y-5">
        {/* Drag & Drop Upload Container */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-indigo-600 bg-indigo-50/50'
              : 'border-gray-300 hover:border-indigo-400 bg-gray-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center text-indigo-600">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-900">
                Click to upload an image
              </span>
              <span className="text-sm text-gray-500"> or drag and drop</span>
            </div>
            <p className="text-xs text-gray-400">
              Supports PNG, JPG, GIF, WebP, SVG (All processed locally in your browser)
            </p>
          </div>
        </div>

        {selectedFile && (
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                  />
                )}
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-gray-900 truncate">
                    {selectedFile.name}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Original size: {(selectedFile.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-gray-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>

            {/* Conversion Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Convert To Format
                </label>
                <select
                  value={targetFormat}
                  onChange={(e) => {
                    setTargetFormat(e.target.value as any);
                    setConvertedUrl(null);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white"
                >
                  <option value="image/webp">WebP (Modern, Smallest Size)</option>
                  <option value="image/png">PNG (Lossless Quality)</option>
                  <option value="image/jpeg">JPEG (Universal Compatibility)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  type="range"
                  min={0.4}
                  max={1.0}
                  step={0.05}
                  value={quality}
                  onChange={(e) => {
                    setQuality(parseFloat(e.target.value));
                    setConvertedUrl(null);
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleConvert}
              disabled={isProcessing}
              className="w-full py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
            >
              {isProcessing ? 'Converting in browser...' : 'Convert Image Now'}
            </button>
          </div>
        )}

        {/* Result Area */}
        {convertedUrl && (
          <div className="p-5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={convertedUrl}
                alt="Converted"
                className="w-16 h-16 object-cover rounded-lg border border-indigo-200 bg-white"
              />
              <div>
                <div className="text-xs font-bold text-indigo-900">
                  Ready for Download ({targetFormat.replace('image/', '').toUpperCase()})
                </div>
                {convertedSize && (
                  <div className="text-xs text-gray-600 mt-0.5">
                    New size: {(convertedSize / 1024).toFixed(1)} KB
                    {selectedFile && (
                      <span className="text-emerald-700 font-semibold ml-1.5">
                        ({Math.round(((convertedSize - selectedFile.size) / selectedFile.size) * 100)}%)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download Image</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
