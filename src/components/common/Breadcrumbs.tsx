import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showBackArrow?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = 'mb-4',
  showBackArrow = false,
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs text-gray-500 overflow-x-auto whitespace-nowrap py-1 ${className}`}
    >
      {showBackArrow && (
        <>
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-indigo-600 transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-indigo-600 rounded pr-1 group shrink-0"
            aria-label="Back to Home"
            title="Back to Home"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-600 group-hover:-translate-x-0.5 transition-all shrink-0" />
            <span className="hidden sm:inline font-medium text-gray-500 group-hover:text-indigo-600">
              Back to Home
            </span>
          </Link>
          <span className="text-gray-300 mx-2 select-none shrink-0" aria-hidden="true">
            |
          </span>
        </>
      )}

      <Link
        to="/"
        className="flex items-center gap-1 hover:text-indigo-600 transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-indigo-600 rounded shrink-0"
      >
        <Home className="w-3.5 h-3.5 text-gray-400 shrink-0" />
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
              <span
                className="font-semibold text-indigo-700 truncate"
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
