import React, { useState } from 'react';
import { Copy, Check, Link2, Share2, Download } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ResultActionsRowProps {
  resultText: string;
  queryParams?: Record<string, string | number>;
  onDownload?: () => void;
  downloadLabel?: string;
  className?: string;
}

export const ResultActionsRow: React.FC<ResultActionsRowProps> = ({
  resultText,
  queryParams,
  onDownload,
  downloadLabel = 'Download',
  className = '',
}) => {
  const { showToast } = useToast();
  const [copiedResult, setCopiedResult] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyResult = async () => {
    try {
      await navigator.clipboard.writeText(resultText);
      setCopiedResult(true);
      showToast('Result copied to clipboard!');
      setTimeout(() => setCopiedResult(false), 2000);
    } catch {
      showToast('Failed to copy result', 'error');
    }
  };

  const getShareableUrl = () => {
    const url = new URL(window.location.href);
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, val]) => {
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          url.searchParams.set(key, String(val));
        }
      });
    }
    return url.toString();
  };

  const handleCopyLink = async () => {
    const shareableUrl = getShareableUrl();
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopiedLink(true);
      showToast('Shareable link with values copied!');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      showToast('Failed to copy link', 'error');
    }
  };

  const handleShare = async () => {
    const shareableUrl = getShareableUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SmartTools Result',
          text: `Calculation Result: ${resultText}`,
          url: shareableUrl,
        });
      } catch {
        // User dismissed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-2 pt-3 border-t border-indigo-100/70 text-xs ${className}`}
    >
      <button
        type="button"
        onClick={handleCopyResult}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
      >
        {copiedResult ? (
          <Check className="w-3.5 h-3.5 text-emerald-600" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-gray-400" />
        )}
        <span>{copiedResult ? 'Copied!' : 'Copy Result'}</span>
      </button>

      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
      >
        {copiedLink ? (
          <Check className="w-3.5 h-3.5 text-emerald-600" />
        ) : (
          <Link2 className="w-3.5 h-3.5 text-gray-400" />
        )}
        <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
      >
        <Share2 className="w-3.5 h-3.5 text-gray-400" />
        <span>Share</span>
      </button>

      {onDownload && (
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{downloadLabel}</span>
        </button>
      )}
    </div>
  );
};
