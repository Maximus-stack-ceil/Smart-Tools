import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, TOOLS_LIST } from '../../data/toolsData';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const popularTools = TOOLS_LIST.filter((t) => t.isPopular).slice(0, 6);

  return (
    <footer id="main-footer" className="border-t border-gray-200 bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2.5 focus:outline-hidden">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                <span>S</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900">
                Smart<span className="text-indigo-600">Tools</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Simple tools. Smarter everyday tasks. Fast, client-side online calculators, converters,
              and generators designed with privacy and speed in mind.
            </p>
            <div className="pt-2 text-xs text-gray-400">
              No sign-up required. Free forever.
            </div>
          </div>

          {/* Popular Tools Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-3">
              Popular Tools
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {popularTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    to={`/tools/${tool.slug}`}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-3">
              Tool Categories
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {Object.values(CATEGORIES).slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.id}`}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-3">
              Resources & Legal
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/about" className="hover:text-indigo-600 transition-colors">
                  About SmartTools
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-indigo-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-indigo-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-600 transition-colors">
                  Contact & Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {currentYear} SmartTools. All rights reserved. Calculations are processed locally in your browser.</p>
          <div className="flex items-center gap-6">
            <span>Client-side Privacy Protected</span>
            <span>•</span>
            <span>Zero Tracking Logs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
