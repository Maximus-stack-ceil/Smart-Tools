import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORIES, TOOLS_LIST } from '../data/toolsData';
import { ToolCard } from '../components/common/ToolCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { DynamicIcon } from '../components/common/DynamicIcon';
import { NativeAdSlot } from '../components/common/NativeAdSlot';
import { Search, ArrowLeft } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [filterQuery, setFilterQuery] = useState('');

  const category = categorySlug ? CATEGORIES[categorySlug] : undefined;
  const tools = TOOLS_LIST.filter((t) => t.categoryId === categorySlug);
  const otherCategories = Object.values(CATEGORIES).filter((c) => c.id !== categorySlug);

  const filteredTools = filterQuery.trim()
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
          t.shortDescription.toLowerCase().includes(filterQuery.toLowerCase())
      )
    : tools;

  useEffect(() => {
    if (category) {
      document.title = `${category.name} Tools — Free Online Utilities | SmartTools`;
      window.scrollTo(0, 0);
    }
  }, [category]);

  if (!category) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Category Not Found</h1>
        <p className="mt-2 text-sm text-gray-600">The requested category does not exist.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: category.name }]} />

      {/* Category Header */}
      <div className="bg-white rounded-2xl border border-black/[0.04] p-6 sm:p-8 mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${category.iconBg || 'bg-gray-100'} ${category.iconText || 'text-gray-700'}`}>
              <DynamicIcon name={category.iconName} className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                {category.name}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{category.description}</p>
            </div>
          </div>

          {/* In-category search filter */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder={`Search ${category.shortName}...`}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>
        </div>
      </div>

      {/* Layout with Tools Grid and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Tools Grid (8 Cols on Desktop) */}
        <div className="lg:col-span-8 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Available Tools ({filteredTools.length})
            </span>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-gray-200">
              <p className="text-sm text-gray-500">
                No tools found matching &ldquo;{filterQuery}&rdquo; in this category.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar with Native Ads and Other Categories (4 Cols on Desktop) */}
        <aside aria-label="Category Sidebar" className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <NativeAdSlot />

          <div className="bg-white rounded-2xl border border-black/[0.04] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Explore Other Categories
            </h3>
            <div className="space-y-1.5">
              {otherCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors text-xs text-gray-700 hover:text-indigo-600 group"
                >
                  <DynamicIcon name={cat.iconName} className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                  <span className="font-medium truncate">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};
