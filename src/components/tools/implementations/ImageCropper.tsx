import React, { useState, useRef } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { Upload, Download, Crop, RotateCcw } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { trackEvent } from '../../../utils/analytics';

export const ImageCropper: React.FC = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('cropped-image');
  const [aspectPreset, setAspectPreset] = useState<'free' | '1:1' | '16:9' | '4:3'>('1:1');

  // Crop percentage offsets: x, y, width, height (0 to 100%)
  const [cropX, setCropX] = useState<number>(10);
  const [cropY, setCropY] = useState<number>(10);
  const [cropWidth, setCropWidth] = useState<number>(80);
  const [cropHeight, setCropHeight] = useState<number>(80);

  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }

    setFileName(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      setTimeout(() => applyCrop(src, 10, 10, 80, 80), 100);
    };
    reader.readAsDataURL(file);
  };

  const applyCrop = (src: string, xPct: number, yPct: number, wPct: number, hPct: number) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      const realX = (xPct / 100) * img.width;
      const realY = (yPct / 100) * img.height;
      const realW = (wPct / 100) * img.width;
      const realH = (hPct / 100) * img.height;

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, realW);
      canvas.height = Math.max(1, realH);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, realX, realY, realW, realH, 0, 0, realW, realH);
      const dataUrl = canvas.toDataURL('image/png');
      setCroppedUrl(dataUrl);
      trackEvent('tool_used', { tool: 'image-cropper', aspect: aspectPreset });
    };
  };

  const handlePresetSelect = (preset: 'free' | '1:1' | '16:9' | '4:3') => {
    setAspectPreset(preset);
    let newW = 80;
    let newH = 80;
    if (preset === '16:9') {
      newW = 80;
      newH = 45;
    } else if (preset === '4:3') {
      newW = 80;
      newH = 60;
    } else if (preset === '1:1') {
      newW = 70;
      newH = 70;
    }
    setCropWidth(newW);
    setCropHeight(newH);
    if (imageSrc) {
      applyCrop(imageSrc, cropX, cropY, newW, newH);
    }
  };

  const handleDownload = () => {
    if (!croppedUrl) return;
    const link = document.createElement('a');
    link.href = croppedUrl;
    link.download = `${fileName}-cropped.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Cropped image downloaded!');
  };

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
          <h3 className="text-base font-bold text-gray-900">Upload an image to crop</h3>
          <p className="text-xs text-gray-500 mt-1">Preset aspect ratios (Square 1:1, 16:9, 4:3) or freeform crop.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Crop className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Aspect Ratio:</span>
              </div>
              <div className="flex gap-2">
                {(['1:1', '16:9', '4:3', 'free'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePresetSelect(p)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg capitalize ${
                      aspectPreset === p ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-gray-600 font-medium">Crop Width: {cropWidth}%</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={cropWidth}
                  onChange={(e) => {
                    const w = parseInt(e.target.value, 10);
                    setCropWidth(w);
                    if (imageSrc) applyCrop(imageSrc, cropX, cropY, w, cropHeight);
                  }}
                  className="w-full accent-indigo-600"
                />
              </div>
              <div>
                <label className="text-gray-600 font-medium">Crop Height: {cropHeight}%</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={cropHeight}
                  onChange={(e) => {
                    const h = parseInt(e.target.value, 10);
                    setCropHeight(h);
                    if (imageSrc) applyCrop(imageSrc, cropX, cropY, cropWidth, h);
                  }}
                  className="w-full accent-indigo-600"
                />
              </div>
              <div>
                <label className="text-gray-600 font-medium">Horizontal Offset: {cropX}%</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={cropX}
                  onChange={(e) => {
                    const x = parseInt(e.target.value, 10);
                    setCropX(x);
                    if (imageSrc) applyCrop(imageSrc, x, cropY, cropWidth, cropHeight);
                  }}
                  className="w-full accent-indigo-600"
                />
              </div>
              <div>
                <label className="text-gray-600 font-medium">Vertical Offset: {cropY}%</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={cropY}
                  onChange={(e) => {
                    const y = parseInt(e.target.value, 10);
                    setCropY(y);
                    if (imageSrc) applyCrop(imageSrc, cropX, y, cropWidth, cropHeight);
                  }}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Preview grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-xs text-gray-500 font-medium mb-2">Original with Crop Overlay</div>
              <div className="relative h-60 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Original"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>

            <div className="border border-indigo-200 bg-indigo-50/20 rounded-xl p-4 text-center">
              <div className="text-xs text-indigo-700 font-bold mb-2">Cropped Output Result</div>
              <div className="h-60 bg-white rounded-lg border border-indigo-100 flex items-center justify-center overflow-hidden p-2">
                {croppedUrl && (
                  <img
                    src={croppedUrl}
                    alt="Cropped Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Cropped Image</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
