import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getToolBySlug } from '../data/registry';
import { ToolLayout } from '../components/tools/ToolLayout';
import { ToolRenderer } from '../components/tools/ToolRenderer';
import { updatePageSEO } from '../utils/seo';
import { Search, ArrowLeft } from 'lucide-react';

export const ToolDetailPage: React.FC = () => {
  const { toolSlug } = useParams<{ toolSlug: string }>();

  const tool = toolSlug ? getToolBySlug(toolSlug) : undefined;

  useEffect(() => {
    if (!tool) return;

    window.scrollTo(0, 0);

    // Build schemas for SoftwareApplication and FAQPage
    const schemas: Record<string, unknown>[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: tool.name,
        description: tool.shortDescription,
        url: window.location.href,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All modern web browsers',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    ];

    if (tool.faqs && tool.faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: tool.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      });
    }

    const cleanupSEO = updatePageSEO({
      title: tool.seoTitle || `${tool.name} — Free Online Tool | SmartTools`,
      description: tool.seoDescription || tool.shortDescription,
      canonicalUrl: `${window.location.origin}/tool/${tool.slug}`,
      ogType: 'website',
      schema: schemas,
    });

    return cleanupSEO;
  }, [tool]);

  if (!tool) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
          <Search className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Tool Not Found</h1>
        <p className="mt-2 text-sm text-gray-600">
          The requested tool &ldquo;{toolSlug}&rdquo; does not exist or has moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to SmartTools Home</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <ToolLayout tool={tool as any}>
      <ToolRenderer slug={tool.slug} />
    </ToolLayout>
  );
};
