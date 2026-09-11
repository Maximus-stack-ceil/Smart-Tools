/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { ScrollToTopButton } from './components/common/ScrollToTopButton';
import { HomePage } from './pages/HomePage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { AboutPage, PrivacyPage, TermsPage, ContactPage } from './pages/StaticPages';

export default function App() {
  useEffect(() => {
    const scriptId = 'adsterra-socialbar-script';
    if (document.getElementById(scriptId)) return; // prevent duplicate injection

    const src = import.meta.env.VITE_ADSTERRA_SOCIALBAR_SRC;
    if (!src) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-[#111827] antialiased selection:bg-indigo-100 selection:text-indigo-900">
          <Header />
          <div
            id="main-content-wrapper"
            className="flex-1"
            style={{ paddingTop: 'var(--header-height, 65px)' }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tools/:toolSlug" element={<ToolDetailPage />} />
              <Route path="/tool/:toolSlug" element={<ToolDetailPage />} />
              <Route path="/category/:categorySlug" element={<CategoryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
          <ScrollToTopButton />
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}
