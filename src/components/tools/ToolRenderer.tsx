import React from 'react';
import { getToolBySlug } from '../../data/registry';

interface ToolRendererProps {
  slug: string;
}

export const ToolRenderer: React.FC<ToolRendererProps> = ({ slug }) => {
  const tool = getToolBySlug(slug);

  if (!tool || !tool.component) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-gray-200">
        <p className="text-gray-600 font-medium">Tool &ldquo;{slug}&rdquo; is not available.</p>
      </div>
    );
  }

  const Component = tool.component;
  return <Component />;
};
