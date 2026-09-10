import React from 'react';
import { Link } from 'react-router-dom';
import { ToolDefinition } from '../../types';
import { CATEGORIES } from '../../data/toolsData';
import { DynamicIcon } from './DynamicIcon';
import { ArrowUpRight } from 'lucide-react';

interface ToolCardProps {
  tool: ToolDefinition;
  compact?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, compact = false }) => {
  const category = CATEGORIES[tool.categoryId];

  return (
    <Link
      to={`/tools/${tool.slug}`}
      id={`tool-card-${tool.slug}`}
      className={`group relative flex flex-col justify-between bg-white rounded-xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-200 hover:border-black/[0.08] hover:shadow-md hover:-translate-y-0.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 ${
        compact ? 'p-4' : 'p-5'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div
            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${
              category?.iconBg && category?.iconText
                ? `${category.iconBg} ${category.iconText} border-transparent`
                : 'bg-gray-50 text-gray-700 border-black/[0.04]'
            }`}
          >
            <DynamicIcon name={tool.iconName} className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {category && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${category.badgeBg}`}
              >
                {category.shortName}
              </span>
            )}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 group-hover:text-indigo-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug">
          {tool.name}
        </h3>

        <p className="mt-1.5 text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-4 pt-1 flex items-center justify-between text-xs text-gray-400">
        <span className="font-medium text-indigo-600 group-hover:text-indigo-700 flex items-center gap-1">
          Open tool →
        </span>
        <span className="capitalize">{tool.categoryId}</span>
      </div>
    </Link>
  );
};
