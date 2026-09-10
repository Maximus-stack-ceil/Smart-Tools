import React, { useState, useRef } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { Upload, Download, Sliders, Image as ImageIcon, Check } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { trackEvent } from '../../../utils/analytics';

export const ImageCompressor: React.FC = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [fileName, setFileName] = useState<string>('image');
  const [quality, setQuality] = useState<number>(75);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/webp'>('image/jpeg');

  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    setOriginalSize(file.size);
    setFileName(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      compressImage(src, quality, outputFormat);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (src: string, q: number, format: string) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedBlob(blob);
            setCompressedSize(blob.size);
            const url = URL.createObjectURL(blob);
            setCompressedUrl(url);
          }
          setIsProcessing(false);
          trackEvent('tool_used', { tool: 'image-compressor', quality: q });
        },
        format,
        q / 100
      );
    };
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (imageSrc) {
      compressImage(imageSrc, newQ, outputFormat);
    }
  };

  const handleDownload = () => {
    if (!compressedUrl) return;
    const ext = outputFormat === 'image/webp' ? 'webp' : 'jpg';
    const link = document.createElement('a');
    link.href = compressedUrl;
    link.download = `${fileName}-compressed.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Compressed image downloaded!');
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const dm = 1;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const savingsPercent = originalSize > 0 && compressedSize > 0
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 hover:border-indigo-500 rounded-2xl p-10 text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-indigo-50/30"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Upload an image to compress</h3>
          <p className="text-xs text-gray-500 mt-1">Supports PNG, JPEG, WebP. 100% private, client-side processing.</p>
        </div>
      ) : (
        <div>
          {/* Controls Bar */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-bold text-gray-900">Compression Quality: {quality}%</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOutputFormat('image/jpeg');
                    compressImage(imageSrc, quality, 'image/jpeg');
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg ${
                    outputFormat === 'image/jpeg' ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-700'
                  }`}
                >
                  JPEG
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOutputFormat('image/webp');
                    compressImage(imageSrc, quality, 'image/webp');
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg ${
                    outputFormat === 'image/webp' ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-700'
                  }`}
                >
                  WebP (Best)
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900 ml-2"
                >
                  Change Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            <input
              type="range"
              min="5"
              max="95"
              step="5"
              value={quality}
              onChange={(e) => handleQualityChange(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Side by side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-200 rounded-xl p-4 text-center">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
                <span>Original File</span>
                <span>{formatBytes(originalSize)}</span>
              </div>
              <div className="h-56 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={imageSrc}
                  alt="Original preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>

            <div className="border border-emerald-200 bg-emerald-50/20 rounded-xl p-4 text-center">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 mb-2">
                <span>Compressed Preview</span>
                <span className="font-bold text-emerald-600">{formatBytes(compressedSize)} ({savingsPercent}% smaller)</span>
              </div>
              <div className="h-56 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {compressedUrl ? (
                  <img
                    src={compressedUrl}
                    alt="Compressed preview"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-gray-400">Processing...</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Compressed Image</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
