import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToolDefinition } from '../../types';
import { CATEGORIES, TOOLS_LIST } from '../../data/toolsData';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { ToolCard } from '../common/ToolCard';
import { AdSlot } from '../common/AdSlot';
import { NativeAdSlot } from '../common/NativeAdSlot';
import { DynamicIcon } from '../common/DynamicIcon';
import { ChevronDown, HelpCircle, BookOpen, Lightbulb, Share2, ShieldCheck, Zap, Layers } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ToolLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ tool, children }) => {
  const category = CATEGORIES[tool.categoryId];
  const { showToast } = useToast();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const relatedTools = (tool.relatedToolSlugs || [])
    .map((slug) => TOOLS_LIST.find((t) => t.slug === slug))
    .filter((t): t is ToolDefinition => t !== undefined)
    .slice(0, 3);

  const categoryTools = TOOLS_LIST.filter(
    (t) => t.categoryId === tool.categoryId && t.slug !== tool.slug
  ).slice(0, 5);

  const handleSharePage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${tool.name} — SmartTools`,
          text: tool.shortDescription,
          url: window.location.href,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tool page link copied to clipboard!');
    }
  };

  return (
    <main className="w-full py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs
            items={[
              { label: category ? category.name : 'Tools', href: category ? `/category/${category.id}` : '/' },
              { label: tool.name },
            ]}
          />
        </div>

        {/* Responsive Two-Column Layout (Main Content + Side / Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Area (8 Columns on Desktop) */}
          <div className="lg:col-span-8 min-w-0">
            {/* Tool Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                {category && (
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${category.badgeBg}`}
                  >
                    <DynamicIcon name={category.iconName} className="w-3.5 h-3.5" />
                    <span>{category.name}</span>
                  </span>
                )}
                <span className="text-xs text-gray-400 font-medium">Free • Browser-Based</span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 leading-tight">
                    {tool.name}
                  </h1>
                  <p className="mt-1.5 text-sm sm:text-base text-gray-600 leading-relaxed">
                    {tool.shortDescription}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSharePage}
                  title="Share this tool"
                  className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                  aria-label="Share tool"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Primary Interactive Tool Area (The Hero of the page) */}
            <section aria-label="Interactive Tool" className="relative mb-8">
              {children}
            </section>

            {/* AdSlot directly below result panel & action buttons with protective spacing */}
            <div className="my-8 pt-2">
              <AdSlot position="result" />
            </div>

            {/* Content & Education Section: How to Use */}
            <section aria-labelledby="how-to-use-heading" className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4 text-gray-900">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h2 id="how-to-use-heading" className="text-lg font-bold">
                  How to Use the {tool.name}
                </h2>
              </div>
              <div className="bg-white rounded-xl border border-black/[0.04] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <ol className="space-y-3.5 text-sm text-gray-700">
                  {tool.howToUse.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* How It Works Explanation */}
            <section aria-labelledby="how-it-works-heading" className="mt-8">
              <div className="flex items-center gap-2 mb-3 text-gray-900">
                <Lightbulb className="w-5 h-5 text-indigo-600" />
                <h2 id="how-it-works-heading" className="text-lg font-bold">
                  How It Works & Calculation Logic
                </h2>
              </div>
              <div className="bg-white rounded-xl border border-black/[0.04] p-5 sm:p-6 text-sm text-gray-700 leading-relaxed shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <p>{tool.howItWorks}</p>
                <p className="mt-3 text-xs text-gray-500">
                  All computations are executed locally in real time inside your browser engine. Your inputs remain private and are never sent to external servers.
                </p>
              </div>
            </section>

            {/* FAQ Section */}
            {tool.faqs && tool.faqs.length > 0 && (
              <section aria-labelledby="faq-heading" className="mt-8">
                <div className="flex items-center gap-2 mb-3 text-gray-900">
                  <HelpCircle className="w-5 h-5 text-indigo-600" />
                  <h2 id="faq-heading" className="text-lg font-bold">
                    Frequently Asked Questions
                  </h2>
                </div>
                <div className="space-y-2.5">
                  {tool.faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="bg-white rounded-xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden transition-all hover:shadow-sm"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full px-5 py-4 text-left flex items-center justify-between gap-3 text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
                          aria-expanded={isOpen}
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180 text-indigo-600' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed pt-1">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <section aria-labelledby="related-tools-heading" className="mt-12 pt-8 border-t border-gray-200">
                <h2 id="related-tools-heading" className="text-lg font-bold text-gray-900 mb-4">
                  Related Tools You Might Find Useful
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedTools.map((relTool) => (
                    <ToolCard key={relTool.id} tool={relTool} compact />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Side Column / Sidebar Area ("في الجوانب") (4 Columns on Desktop) */}
          <aside aria-label="Sidebar" className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Native Ads Placement */}
            <NativeAdSlot />

            {/* Tool Security & Performance Highlights Card */}
            <div className="bg-white rounded-2xl border border-black/[0.04] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Tool Guarantee
              </h3>
              <ul className="space-y-2.5 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>100% Private:</strong> Data processed strictly on your device.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Instant Results:</strong> No waiting, registration, or hidden fees.</span>
                </li>
              </ul>
            </div>

            {/* Quick Category Tools Nav */}
            {categoryTools.length > 0 && (
              <div className="bg-white rounded-2xl border border-black/[0.04] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    More in {category?.name || 'Category'}
                  </h3>
                  {category && (
                    <Link
                      to={`/category/${category.id}`}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      View all →
                    </Link>
                  )}
                </div>
                <div className="space-y-1.5">
                  {categoryTools.map((item) => (
                    <Link
                      key={item.id}
                      to={`/tools/${item.slug}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors text-xs text-gray-700 hover:text-indigo-600 group"
                    >
                      <span className="font-medium truncate mr-2">{item.name}</span>
                      <span className="text-gray-400 group-hover:text-indigo-600 text-[11px] shrink-0">
                        Open →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
};

