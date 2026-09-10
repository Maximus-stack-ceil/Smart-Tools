import React, { useState } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ShieldCheck, Mail, CheckCircle2, FileText } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const AboutPage: React.FC = () => {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumbs items={[{ label: 'About Us' }]} />
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">About SmartTools</h1>
      <div className="prose text-sm text-gray-700 space-y-4 leading-relaxed bg-white rounded-2xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 sm:p-8">
        <p>
          <strong>SmartTools</strong> is a fast, free, global online utility platform dedicated to
          making everyday digital tasks effortless. Whether calculating loan amortizations, checking
          chronological age, resizing images, generating cryptographically random passwords, or
          formatting complex JSON datasets, SmartTools gives you instant results with no sign-ups or
          software installations.
        </p>
        <h2 className="text-lg font-bold text-gray-900 pt-2">Our Core Principles</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>
            <strong>100% Free Forever:</strong> All tools are accessible at zero financial cost, with no
            gated paywalls.
          </li>
          <li>
            <strong>Client-Side Processing First:</strong> Whenever technically possible, all mathematical
            computations, text transformations, and image conversions execute locally inside your web
            browser engine.
          </li>
          <li>
            <strong>No Required Registration:</strong> You never need to surrender an email address or
            create a user account to use any tool on our platform.
          </li>
          <li>
            <strong>Minimalist Design System:</strong> We reject cluttered banner-stuffed layouts in favor
            of a clean, high-contrast, distraction-free environment.
          </li>
        </ul>
      </div>
    </main>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Privacy Policy</h1>
      <div className="text-sm text-gray-700 space-y-4 leading-relaxed bg-white rounded-2xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 sm:p-8">
        <p className="text-xs text-gray-400">Last updated: September 2026</p>
        <h2 className="text-base font-bold text-gray-900">1. Client-Side Data Execution</h2>
        <p>
          At SmartTools, privacy is an architectural guarantee rather than an afterthought. The vast
          majority of our tools (including calculators, password generators, base64 encoders, JSON
          formatters, and image converters) execute strictly within your local browser runtime. Your
          typed inputs, numerical data, and uploaded files are never sent across the internet to our
          servers.
        </p>
        <h2 className="text-base font-bold text-gray-900">2. Cookies and Third-Party Advertising</h2>
        <p>
          SmartTools may partner with third-party ad networks (such as Google AdSense or Adsterra) to
          support our free operational infrastructure. These partners may use non-sensitive technical
          identifiers or cookies to serve relevant advertisements. Users can manage or disable cookie
          preferences directly through their web browser settings.
        </p>
        <h2 className="text-base font-bold text-gray-900">3. Log Files</h2>
        <p>
          Like standard web platforms, our CDN hosting infrastructure records standard access logs
          (such as user-agent strings, HTTP status codes, and browser versions) for performance
          monitoring and DDoS mitigation.
        </p>
      </div>
    </main>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumbs items={[{ label: 'Terms of Service' }]} />
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Terms of Service</h1>
      <div className="text-sm text-gray-700 space-y-4 leading-relaxed bg-white rounded-2xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 sm:p-8">
        <p>
          Welcome to SmartTools. By accessing or utilizing any calculator, converter, or utility on our
          website, you agree to comply with these terms.
        </p>
        <h2 className="text-base font-bold text-gray-900">1. Informational Utility Purpose</h2>
        <p>
          All calculations, conversions, formulas, and generators are provided for informational and
          general utility purposes only. While we take pride in mathematical rigor, users should not
          rely on calculations as certified professional financial, tax, legal, or medical advice.
        </p>
        <h2 className="text-base font-bold text-gray-900">2. Acceptable Use</h2>
        <p>
          You agree not to use any tool on SmartTools for unlawful purposes, or to conduct denial of
          service attacks against our infrastructure.
        </p>
      </div>
    </main>
  );
};

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill out all contact fields.', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Your feedback has been received! Thank you.');
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Contact & Feedback</h1>
      <p className="text-sm text-gray-600 mb-6">
        Have an idea for a new tool or noticed an issue? We appreciate user suggestions.
      </p>

      <div className="bg-white rounded-2xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 sm:p-8">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Message Received!</h2>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">
              Thank you for reaching out. We review every tool suggestion and bug report.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setMessage('');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-900 mb-1">
                Your Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Smith"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
                required
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-900 mb-1">
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
                required
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-900 mb-1">
                Message / Tool Suggestion
              </label>
              <textarea
                id="contact-message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Suggest a tool feature or report an issue..."
                className="w-full px-3.5 py-2.5 rounded-lg text-sm border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </main>
  );
};
