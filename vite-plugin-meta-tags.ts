import type { Plugin } from 'vite';
import { createClient } from '@supabase/supabase-js';

interface MetaTags {
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

async function getMetaTagsFromDB(): Promise<MetaTags | null> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Meta tags plugin: Missing Supabase env vars, using defaults');
    return null;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'meta_tags')
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.warn('⚠️ Meta tags plugin: Error fetching meta tags:', error.message);
      return null;
    }

    return (data as any)?.value || null;
  } catch (err) {
    console.warn('⚠️ Meta tags plugin: Failed to fetch meta tags:', err);
    return null;
  }
}

function generateMetaTagsHTML(metaTags: MetaTags): string {
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

  // Twitter Card tags
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

export function vitePluginMetaTags(): Plugin {
  return {
    name: 'vite-plugin-meta-tags',
    configureServer(server) {
      // Add middleware to inject meta tags in development
      server.middlewares.use(async (req, res, next) => {
        // Only handle HTML requests
        if (req.url === '/' || req.url?.endsWith('.html')) {
          try {
            const metaTags = await getMetaTagsFromDB();
            if (metaTags) {
              // Store meta tags in a way the HTML can access
              // We'll inject via a transform instead
            }
          } catch (err) {
            // Silently fail in dev
          }
        }
        next();
      });
    },
    async transformIndexHtml(html: string) {
      // In development, meta tags are handled client-side
      // In production build, we can inject them here if needed
      // But for now, server-side injection in main.ts handles production
      return html;
    },
  };
}

