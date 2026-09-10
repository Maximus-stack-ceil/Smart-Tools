// SEO and Structured Data manager for SmartTools

export interface SEOConfig {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: string;
  schema?: Record<string, unknown>[];
}

export function updatePageSEO(config: SEOConfig): () => void {
  const originalTitle = document.title;
  document.title = config.title;

  const setMeta = (attr: string, value: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${value}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, value);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('name', 'description', config.description);
  setMeta('property', 'og:title', config.title);
  setMeta('property', 'og:description', config.description);
  setMeta('property', 'og:type', config.ogType || 'website');
  setMeta('name', 'twitter:title', config.title);
  setMeta('name', 'twitter:description', config.description);

  if (config.canonicalUrl) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', config.canonicalUrl);
  }

  // Structured Data Schema injection
  const scriptId = 'smarttools-structured-data';
  let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = scriptId;
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  if (config.schema && config.schema.length > 0) {
    scriptEl.textContent = JSON.stringify(config.schema.length === 1 ? config.schema[0] : config.schema);
  } else {
    scriptEl.textContent = '';
  }

  // Return cleanup function
  return () => {
    document.title = originalTitle;
    const s = document.getElementById(scriptId);
    if (s) {
      s.remove();
    }
  };
}
