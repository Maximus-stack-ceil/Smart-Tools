import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const SCROLL_THRESHOLD = 400;

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isFooterVisible, setIsFooterVisible] = useState<boolean>(false);

  useEffect(() => {
    // 1. Scroll listener for scroll threshold
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsVisible(scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. IntersectionObserver to detect when footer is in view
    const footerElement = document.getElementById('main-footer');
    let observer: IntersectionObserver | null = null;

    if (footerElement && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          setIsFooterVisible(entry.isIntersecting);
        },
        {
          root: null,
          threshold: 0.05,
        }
      );
      observer.observe(footerElement);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const isShowing = isVisible && !isFooterVisible;

  return (
    <button
      type="button"
      id="scroll-to-top-button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      tabIndex={isShowing ? 0 : -1}
      aria-hidden={!isShowing}
      className={`fixed z-40 right-5 sm:right-8 bottom-20 sm:bottom-8 w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full bg-white text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/80 border border-gray-200/90 shadow-md hover:shadow-lg focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 flex items-center justify-center transition-all duration-300 transform active:scale-95 ${
        isShowing
          ? 'opacity-100 translate-y-0 pointer-events-auto visible'
          : 'opacity-0 translate-y-4 pointer-events-none invisible'
      }`}
    >
      <ArrowUp className="w-5 h-5 stroke-[2.25] text-indigo-600" />
    </button>
  );
};
