import React, { useState, useRef } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { Upload, Download, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { trackEvent } from '../../../utils/analytics';

export const JpgToPng: React.FC = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('converted-image');
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
      showToast('Please upload a JPG / JPEG image file', 'error');
      return;
    }

    setFileName(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      convertToPng(src);
    };
    reader.readAsDataURL(file);
  };

  const convertToPng = (src: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      setPngDataUrl(dataUrl);
      trackEvent('tool_used', { tool: 'jpg-to-png' });
    };
  };

  const handleDownload = () => {
    if (!pngDataUrl) return;
    const link = document.createElement('a');
    link.href = pngDataUrl;
    link.download = `${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('PNG image downloaded!');
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
            accept=".jpg,.jpeg,image/jpeg"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Select or drop a JPG / JPEG file</h3>
          <p className="text-xs text-gray-500 mt-1">Converts locally to lossless high-fidelity PNG format.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-bold uppercase">JPG</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-bold uppercase">PNG</span>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Convert Another Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,image/jpeg"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div className="h-64 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden p-2">
            {pngDataUrl && (
              <img
                src={pngDataUrl}
                alt="Converted PNG"
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
              <span>Download Converted PNG</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
