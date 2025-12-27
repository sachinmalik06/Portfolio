/**
 * Utility functions to inject meta tags into HTML for social media crawlers
 * This ensures WhatsApp, LinkedIn, Facebook, and Twitter can read meta tags
 * from the initial HTML response (not just after JavaScript loads)
 */

export interface MetaTags {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  robots?: string;
  canonical?: string;
  themeColor?: string;
  og?: {
    type?: string;
    url?: string;
    title?: string;
    description?: string;
    image?: string;
    siteName?: string;
  };
  twitter?: {
    card?: string;
    url?: string;
    title?: string;
    description?: string;
    image?: string;
  };
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export function generateMetaTagsHTML(metaTags: MetaTags | null): string {
  if (!metaTags) return '';

  let html = '';

  // Title
  if (metaTags.title) {
    html += `  <title>${escapeHtml(metaTags.title)}</title>\n`;
    html += `  <meta name="title" content="${escapeHtml(metaTags.title)}" />\n`;
  }

  // Basic meta tags
  if (metaTags.description) {
    html += `  <meta name="description" content="${escapeHtml(metaTags.description)}" />\n`;
  }
  if (metaTags.keywords) {
    html += `  <meta name="keywords" content="${escapeHtml(metaTags.keywords)}" />\n`;
  }
  if (metaTags.author) {
    html += `  <meta name="author" content="${escapeHtml(metaTags.author)}" />\n`;
  }
  if (metaTags.robots) {
    html += `  <meta name="robots" content="${escapeHtml(metaTags.robots)}" />\n`;
  }

  // Canonical URL
  if (metaTags.canonical) {
    html += `  <link rel="canonical" href="${escapeHtml(metaTags.canonical)}" />\n`;
  }

  // Theme color
  if (metaTags.themeColor) {
    html += `  <meta name="theme-color" content="${escapeHtml(metaTags.themeColor)}" />\n`;
  }

  // Open Graph tags
  if (metaTags.og) {
    if (metaTags.og.type) {
      html += `  <meta property="og:type" content="${escapeHtml(metaTags.og.type)}" />\n`;
    }
    if (metaTags.og.url) {
      html += `  <meta property="og:url" content="${escapeHtml(metaTags.og.url)}" />\n`;
    }
    if (metaTags.og.title) {
      html += `  <meta property="og:title" content="${escapeHtml(metaTags.og.title)}" />\n`;
    }
    if (metaTags.og.description) {
      html += `  <meta property="og:description" content="${escapeHtml(metaTags.og.description)}" />\n`;
    }
    if (metaTags.og.image) {
      html += `  <meta property="og:image" content="${escapeHtml(metaTags.og.image)}" />\n`;
    }
    if (metaTags.og.siteName) {
      html += `  <meta property="og:site_name" content="${escapeHtml(metaTags.og.siteName)}" />\n`;
    }
  }

  // Twitter Card tags (both name and property for maximum compatibility)
  if (metaTags.twitter) {
    if (metaTags.twitter.card) {
      html += `  <meta name="twitter:card" content="${escapeHtml(metaTags.twitter.card)}" />\n`;
      html += `  <meta property="twitter:card" content="${escapeHtml(metaTags.twitter.card)}" />\n`;
    }
    if (metaTags.twitter.url) {
      html += `  <meta name="twitter:url" content="${escapeHtml(metaTags.twitter.url)}" />\n`;
      html += `  <meta property="twitter:url" content="${escapeHtml(metaTags.twitter.url)}" />\n`;
    }
    if (metaTags.twitter.title) {
      html += `  <meta name="twitter:title" content="${escapeHtml(metaTags.twitter.title)}" />\n`;
      html += `  <meta property="twitter:title" content="${escapeHtml(metaTags.twitter.title)}" />\n`;
    }
    if (metaTags.twitter.description) {
      html += `  <meta name="twitter:description" content="${escapeHtml(metaTags.twitter.description)}" />\n`;
      html += `  <meta property="twitter:description" content="${escapeHtml(metaTags.twitter.description)}" />\n`;
    }
    if (metaTags.twitter.image) {
      html += `  <meta name="twitter:image" content="${escapeHtml(metaTags.twitter.image)}" />\n`;
      html += `  <meta property="twitter:image" content="${escapeHtml(metaTags.twitter.image)}" />\n`;
    }
  }

  return html;
}

/**
 * Injects meta tags into HTML string
 * Replaces the existing meta tags section with fresh ones from database
 */
export function injectMetaTagsIntoHTML(html: string, metaTags: MetaTags | null): string {
  if (!metaTags) return html;

  const metaTagsHTML = generateMetaTagsHTML(metaTags);

  // Remove old meta tags section (from <!-- Primary Meta Tags --> to <!-- Theme Color -->)
  const cleanedHTML = html.replace(
    /<!-- Primary Meta Tags -->[\s\S]*?<!-- Theme Color -->/,
    '<!-- Primary Meta Tags (Injected from Database) -->'
  );

  // Insert new meta tags before </head>
  const newHTML = cleanedHTML.replace(
    /(<!-- Primary Meta Tags \(Injected from Database\) -->)/,
    `$1\n${metaTagsHTML}  <!-- Theme Color -->`
  );

  return newHTML;
}

