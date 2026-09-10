import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, Wrench, Layers } from 'lucide-react';
import { CATEGORIES, TOOLS_LIST } from '../../data/toolsData';
import { DynamicIcon } from './DynamicIcon';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const threshold = 80;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);

      // At the top or above threshold, header is always fully visible
      if (currentScrollY <= threshold) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // If user is actively interacting with search or menus, keep header visible
      if (
        isSearchFocused ||
        searchQuery.trim().length > 0 ||
        isSearchOpen ||
        isMobileMenuOpen ||
        showCategoryDropdown
      ) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const delta = currentScrollY - lastScrollY.current;

      // Scroll down past threshold -> smoothly hide header
      if (delta > 4) {
        setIsVisible(false);
      }
      // Scroll up any amount -> immediately reveal header
      else if (delta < -4) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [
    isSearchFocused,
    searchQuery,
    isSearchOpen,
    isMobileMenuOpen,
    showCategoryDropdown,
  ]);

  // Measure and synchronize --header-height CSS variable with the un-scrolled (larger) header height
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        // Keep the content spacing set to the un-scrolled/larger state to prevent layout shift on scroll
        if (!isScrolled && height > 0) {
          document.documentElement.style.setProperty('--header-height', `${height}px`);
        }
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, [isScrolled]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setShowCategoryDropdown(false);
    setSearchQuery('');
  }, [location.pathname]);

  // Handle click outside for dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const searchResults = searchQuery.trim()
    ? TOOLS_LIST.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6)
    : [];

  const handleSelectTool = (slug: string) => {
    navigate(`/tools/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header
      ref={headerRef}
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-200 ease-in-out border-b bg-white/98 backdrop-blur-md ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0 pointer-events-none'
      } ${
        isScrolled
          ? 'py-2.5 border-gray-200/90 shadow-sm'
          : 'py-3.5 border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            id="brand-logo"
            className="flex items-center gap-2.5 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-md"
            aria-label="SmartTools Home"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-indigo-700 transition-colors">
              <span className="translate-y-[-0.5px]">S</span>
            </div>
            <div className="flex flex-col">
              <div className="text-xl font-bold tracking-tight text-gray-900 leading-none">
                Smart<span className="text-indigo-600">Tools</span>
              </div>
            </div>
          </Link>

          {/* Desktop Categories Dropdown */}
          <div className="relative hidden md:block" ref={dropdownRef}>
            <button
              id="categories-dropdown-btn"
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:text-indigo-600 rounded-md hover:bg-gray-100/80 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
              aria-expanded={showCategoryDropdown}
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Categories</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                  showCategoryDropdown ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showCategoryDropdown && (
              <div
                id="categories-dropdown-panel"
                className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Browse by Category
                </div>
                {Object.values(CATEGORIES).map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${cat.iconBg || 'bg-gray-100'} ${cat.iconText || 'text-gray-600'}`}>
                      <DynamicIcon name={cat.iconName} className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-xs text-gray-900 leading-tight">
                        {cat.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Direct Category Shortcuts */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-gray-700">
            <Link
              to="/category/finance"
              className="px-2.5 py-1 text-gray-700 hover:text-indigo-600 hover:bg-gray-100/70 rounded-md transition-colors"
            >
              Finance
            </Link>
            <Link
              to="/category/datetime"
              className="px-2.5 py-1 text-gray-700 hover:text-indigo-600 hover:bg-gray-100/70 rounded-md transition-colors"
            >
              Date & Time
            </Link>
            <Link
              to="/category/text"
              className="px-2.5 py-1 text-gray-700 hover:text-indigo-600 hover:bg-gray-100/70 rounded-md transition-colors"
            >
              Text Tools
            </Link>
            <Link
              to="/category/developer"
              className="px-2.5 py-1 text-gray-700 hover:text-indigo-600 hover:bg-gray-100/70 rounded-md transition-colors"
            >
              Developer
            </Link>
          </nav>
        </div>

        {/* Search and Mobile Controls */}
        <div className="flex items-center gap-2 flex-1 justify-end max-w-md">
          {/* Desktop Search Trigger / Input */}
          <div className="relative w-full hidden sm:block">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search 15+ free online tools..."
                className="w-full pl-9 pr-8 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-gray-400 hover:text-gray-600 p-0.5"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Instant Dropdown */}
            {searchQuery.trim() && (
              <div
                id="header-search-results"
                className="absolute right-0 left-0 mt-2 bg-white rounded-xl shadow-xl border border-black/[0.04] py-1.5 z-50 overflow-hidden"
              >
                {searchResults.length > 0 ? (
                  <>
                    <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Matching Tools ({searchResults.length})
                    </div>
                    {searchResults.map((tool) => (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => handleSelectTool(tool.slug)}
                        className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-indigo-50/70 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <DynamicIcon name={tool.iconName} className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-gray-900 group-hover:text-indigo-600">
                            {tool.name}
                          </div>
                          <div className="text-[11px] text-gray-500 truncate">
                            {tool.shortDescription}
                          </div>
                        </div>
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="p-4 text-center text-xs text-gray-500">
                    No tools found matching &ldquo;{searchQuery}&rdquo;.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Search Button */}
          <button
            id="mobile-search-toggle"
            type="button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="sm:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
            aria-label="Toggle search bar"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Mobile Hamburger Button */}
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-800 hover:text-indigo-600 rounded-lg hover:bg-gray-100/80 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Expandable Bar */}
      {isSearchOpen && (
        <div className="sm:hidden px-4 pt-2 pb-3 border-t border-gray-100 bg-white">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search for tools..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchQuery.trim() && (
            <div className="mt-2 bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
              {searchResults.length > 0 ? (
                searchResults.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => handleSelectTool(tool.slug)}
                    className="w-full text-left p-2.5 flex items-center gap-2 hover:bg-indigo-50"
                  >
                    <DynamicIcon name={tool.iconName} className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-gray-900">{tool.name}</div>
                      <div className="text-[10px] text-gray-500 truncate">{tool.shortDescription}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-gray-500">No tools found.</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3 shadow-md"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Categories
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(CATEGORIES).map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-semibold text-gray-800 bg-gray-50/90 border border-gray-200/80 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all"
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${cat.iconBg || 'bg-gray-100'} ${cat.iconText || 'text-gray-600'}`}>
                  <DynamicIcon name={cat.iconName} className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">{cat.shortName}</span>
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-600">
            <Link to="/about" className="hover:text-indigo-600">
              About
            </Link>
            <Link to="/privacy" className="hover:text-indigo-600">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-indigo-600">
              Terms
            </Link>
            <Link to="/contact" className="hover:text-indigo-600">
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
