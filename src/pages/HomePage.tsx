import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, Zap, Shield, Smartphone, Globe, ArrowRight, Layers } from 'lucide-react';
import { CATEGORIES, TOOLS_LIST } from '../data/toolsData';
import { ToolCard } from '../components/common/ToolCard';
import { DynamicIcon } from '../components/common/DynamicIcon';
import { AdSlot } from '../components/common/AdSlot';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const matchingTools = searchQuery.trim()
    ? TOOLS_LIST.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const popularTools = TOOLS_LIST.filter((t) => t.isPopular);

  const handleSelectTool = (slug: string) => {
    navigate(`/tools/${slug}`);
  };

  return (
    <main id="homepage-main" className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-14 sm:pt-16 sm:pb-20 border-b border-gray-200/80 bg-linear-to-b from-white via-white to-gray-50/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Subtle Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Simple tools. Smarter everyday tasks.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-950 leading-tight">
            Free Online Tools for Everyday Tasks
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Fast, simple and free tools to calculate, convert, generate and manage everyday tasks.
            Works instantly in your browser with zero registration.
          </p>

          {/* Prominent Search Bar (Primary UX Entry Point) */}
          <div className="mt-8 sm:mt-10 max-w-2xl mx-auto relative text-left">
            <div className="relative shadow-sm rounded-2xl">
              <Search className="w-5 h-5 text-gray-400 absolute left-4.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                id="hero-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a tool (e.g. age, percentage, qr code, json, bmi)..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-base text-gray-900 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-indigo-600 focus:outline-hidden focus:ring-4 focus:ring-indigo-600/10 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Instant client-side dropdown results */}
            {searchQuery.trim() && (
              <div
                id="hero-search-dropdown"
                className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 divide-y divide-gray-100 max-h-96 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2"
              >
                {matchingTools.length > 0 ? (
                  <>
                    <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50/80">
                      Matching Tools ({matchingTools.length})
                    </div>
                    {matchingTools.map((tool) => (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => handleSelectTool(tool.slug)}
                        className="w-full text-left px-4 py-3 flex items-center gap-3.5 hover:bg-indigo-50/70 transition-colors group"
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors shrink-0 ${CATEGORIES[tool.categoryId]?.iconBg || 'bg-gray-100'} ${CATEGORIES[tool.categoryId]?.iconText || 'text-gray-700'}`}>
                          <DynamicIcon name={tool.iconName} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 flex items-center gap-2">
                            <span>{tool.name}</span>
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${CATEGORIES[tool.categoryId]?.badgeBg || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                              {tool.categoryId}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 truncate mt-0.5">
                            {tool.shortDescription}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="p-6 text-center text-sm text-gray-500">
                    No tools found matching &ldquo;{searchQuery}&rdquo;. Try another term.
                  </div>
                )}
              </div>
            )}

            {/* Category quick filter pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-black/[0.04] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-gray-50'
                }`}
              >
                All Tools
              </button>
              {Object.values(CATEGORIES).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedCategoryFilter === cat.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-gray-600 border border-black/[0.04] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-gray-50'
                  }`}
                >
                  {cat.shortName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Top Advertisement Slot (Clean Reserved Height) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot position="top" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-16">
        {/* Popular Tools Section (Curated 8-10 cards) */}
        {selectedCategoryFilter === 'all' && (
          <section aria-labelledby="popular-tools-heading">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  id="popular-tools-heading"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900"
                >
                  Popular Tools
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Hand-picked utilities used every day for calculations, conversions, and code.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {popularTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Filtered Category View if user clicked a pill */}
        {selectedCategoryFilter !== 'all' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {CATEGORIES[selectedCategoryFilter]?.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {CATEGORIES[selectedCategoryFilter]?.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('all')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                ← Back to All Categories
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {TOOLS_LIST.filter((t) => t.categoryId === selectedCategoryFilter).map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Categorized Sections when showing all */}
        {selectedCategoryFilter === 'all' && (
          <div className="space-y-16">
            {Object.values(CATEGORIES).map((cat) => {
              const catTools = TOOLS_LIST.filter((t) => t.categoryId === cat.id);
              if (catTools.length === 0) return null;

              return (
                <section key={cat.id} aria-labelledby={`category-${cat.id}-heading`}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.iconBg || 'bg-gray-100'} ${cat.iconText || 'text-gray-700'}`}>
                        <DynamicIcon name={cat.iconName} className="w-4 h-4" />
                      </div>
                      <div>
                        <h2
                          id={`category-${cat.id}-heading`}
                          className="text-lg sm:text-xl font-bold tracking-tight text-gray-900"
                        >
                          {cat.name}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500">{cat.description}</p>
                      </div>
                    </div>

                    <Link
                      to={`/category/${cat.id}`}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0"
                    >
                      <span>View category</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catTools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Why SmartTools Section */}
        <section
          aria-labelledby="why-smarttools-heading"
          className="bg-white rounded-2xl border border-black/[0.04] p-8 sm:p-12 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
        >
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2
              id="why-smarttools-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900"
            >
              Why People Choose SmartTools
            </h2>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Designed as a focused, trustworthy alternative to bloated utility sites. Clean, fast, and
              built with privacy first.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Fast & Browser-Based</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Calculations and transformations execute client-side with native browser speed. No slow
                server roundtrips.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Privacy-Conscious</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Your data, numbers, passwords, and images never leave your computer. We do not store or
                harvest your inputs.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">100% Free & No Sign-Up</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Instant access to all calculators and utilities without creating an account or paying a
                subscription.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Mobile-First Design</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Carefully optimized touch targets, accessible contrasts, and responsive views that work
                seamlessly on any device.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Ad Slot */}
        <AdSlot position="bottom" />
      </div>
    </main>
  );
};
