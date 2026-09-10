import React, { useState, useRef } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { Upload, Download, ArrowRight, Palette } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { trackEvent } from '../../../utils/analytics';

export const PngToJpg: React.FC = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('converted-image');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [quality, setQuality] = useState<number>(90);
  const [jpgDataUrl, setJpgDataUrl] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('png')) {
      showToast('Please upload a PNG image file', 'error');
      return;
    }

    setFileName(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      convertToJpg(src, bgColor, quality);
    };
    reader.readAsDataURL(file);
  };

  const convertToJpg = (src: string, bg: string, q: number) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // JPEG does not support transparency; fill canvas with selected background color
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, img.width, img.height);

      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', q / 100);
      setJpgDataUrl(dataUrl);
      trackEvent('tool_used', { tool: 'png-to-jpg', quality: q });
    };
  };

  const handleBgChange = (newBg: string) => {
    setBgColor(newBg);
    if (imageSrc) convertToJpg(imageSrc, newBg, quality);
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (imageSrc) convertToJpg(imageSrc, bgColor, newQ);
  };

  const handleDownload = () => {
    if (!jpgDataUrl) return;
    const link = document.createElement('a');
    link.href = jpgDataUrl;
    link.download = `${fileName}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('JPG image downloaded!');
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
            accept=".png,image/png"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Select or drop a PNG file</h3>
          <p className="text-xs text-gray-500 mt-1">Converts transparent or standard PNG to JPG with custom background fill.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-bold uppercase">PNG</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-bold uppercase">JPG</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                  <Palette className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Background fill for transparency:</span>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => handleBgChange(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border border-gray-300"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold ml-2"
                >
                  Change File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,image/png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-700 font-semibold mb-1">
                <span>JPEG Compression Quality</span>
                <span>{quality}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={quality}
                onChange={(e) => handleQualityChange(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          <div className="h-64 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden p-2">
            {jpgDataUrl && (
              <img
                src={jpgDataUrl}
                alt="Converted JPG"
                className="max-h-full max-w-full object-contain"
              />
            )}
          </div>

          <div className="flex justify-end pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Converted JPG</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
