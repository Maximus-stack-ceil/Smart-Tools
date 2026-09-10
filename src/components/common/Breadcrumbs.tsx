import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-gray-500 mb-4 overflow-x-auto whitespace-nowrap py-1">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-indigo-600 transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-indigo-600 rounded"
      >
        <Home className="w-3.5 h-3.5 text-gray-400" />
        <span>Home</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-gray-300 shrink-0" />
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="hover:text-indigo-600 transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-indigo-600 rounded"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-indigo-700 truncate" aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
