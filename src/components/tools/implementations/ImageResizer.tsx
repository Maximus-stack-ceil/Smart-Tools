import React, { useState, useRef } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { Upload, Download, Lock, Unlock, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { trackEvent } from '../../../utils/analytics';

export const ImageResizer: React.FC = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image');
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);

  const [newWidth, setNewWidth] = useState<string>('800');
  const [newHeight, setNewHeight] = useState<string>('600');
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');

  const [resizedUrl, setResizedUrl] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    setFileName(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setOrigWidth(img.width);
        setOrigHeight(img.height);
        setNewWidth(img.width.toString());
        setNewHeight(img.height.toString());
        setImageSrc(src);
        renderResized(src, img.width, img.height, format);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const renderResized = (src: string, w: number, h: number, fmt: 'png' | 'jpeg' | 'webp') => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (fmt === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h);
      }

      ctx.drawImage(img, 0, 0, w, h);

      const mimeType = fmt === 'png' ? 'image/png' : fmt === 'jpeg' ? 'image/jpeg' : 'image/webp';
      const dataUrl = canvas.toDataURL(mimeType, 0.92);
      setResizedUrl(dataUrl);
      trackEvent('tool_used', { tool: 'image-resizer', width: w, height: h });
    };
  };

  const handleWidthChange = (val: string) => {
    setNewWidth(val);
    const w = parseInt(val, 10);
    if (!isNaN(w) && w > 0 && lockAspectRatio && origWidth > 0) {
      const ratio = origHeight / origWidth;
      const computedH = Math.round(w * ratio);
      setNewHeight(computedH.toString());
      if (imageSrc) renderResized(imageSrc, w, computedH, format);
    } else if (!isNaN(w) && w > 0 && imageSrc) {
      const h = parseInt(newHeight, 10) || origHeight;
      renderResized(imageSrc, w, h, format);
    }
  };

  const handleHeightChange = (val: string) => {
    setNewHeight(val);
    const h = parseInt(val, 10);
    if (!isNaN(h) && h > 0 && lockAspectRatio && origHeight > 0) {
      const ratio = origWidth / origHeight;
      const computedW = Math.round(h * ratio);
      setNewWidth(computedW.toString());
      if (imageSrc) renderResized(imageSrc, computedW, h, format);
    } else if (!isNaN(h) && h > 0 && imageSrc) {
      const w = parseInt(newWidth, 10) || origWidth;
      renderResized(imageSrc, w, h, format);
    }
  };

  const handlePresetScale = (scale: number) => {
    if (origWidth === 0) return;
    const w = Math.round(origWidth * scale);
    const h = Math.round(origHeight * scale);
    setNewWidth(w.toString());
    setNewHeight(h.toString());
    if (imageSrc) renderResized(imageSrc, w, h, format);
  };

  const handleDownload = () => {
    if (!resizedUrl) return;
    const link = document.createElement('a');
    link.href = resizedUrl;
    link.download = `${fileName}-${newWidth}x${newHeight}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Resized image downloaded!');
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
          <h3 className="text-base font-bold text-gray-900">Upload an image to resize</h3>
          <p className="text-xs text-gray-500 mt-1">Scale dimensions by pixels or percentage in-browser.</p>
        </div>
      ) : (
        <div>
          {/* Dimension Controls */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={newWidth}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={newHeight}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center gap-2 pb-1">
                <button
                  type="button"
                  onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    lockAspectRatio
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-white border-gray-300 text-gray-700'
                  }`}
                >
                  {lockAspectRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{lockAspectRatio ? 'Ratio Locked' : 'Unlocked'}</span>
                </button>
              </div>
            </div>

            {/* Quick scale presets */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
              <span className="text-xs font-medium text-gray-500">Scale Presets:</span>
              {[0.25, 0.5, 0.75, 1, 1.5, 2].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handlePresetScale(s)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                  {s * 100}%
                </button>
              ))}
              <span className="text-xs text-gray-400 ml-auto">
                Original: {origWidth}×{origHeight} px
              </span>
            </div>
          </div>

          {/* Preview Box */}
          <div className="border border-gray-200 rounded-xl p-4 mb-6 bg-slate-900/5 text-center">
            <div className="text-xs text-gray-500 mb-2 font-medium">
              Output Dimensions: {newWidth} × {newHeight} px
            </div>
            <div className="h-64 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden p-2">
              {resizedUrl && (
                <img
                  src={resizedUrl}
                  alt="Resized output"
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Resized Image</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
