import { Hono } from "hono";
import { serveStatic } from "hono/deno";

const app = new Hono();

// Helper to fetch meta tags from Supabase
async function getMetaTags(): Promise<any> {
  const supabaseUrl = Deno.env.get("VITE_SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("VITE_SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/site_settings?key=eq.meta_tags&select=value`,
      {
        headers: {
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data?.[0]?.value || null;
  } catch (err) {
    console.warn("Failed to fetch meta tags:", err);
    return null;
  }
}

// Helper to inject meta tags into HTML
function injectMetaTags(html: string, metaTags: any): string {
  if (!metaTags) return html;

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

  let metaHTML = '';

  // Title
  if (metaTags.title) {
    metaHTML += `  <title>${escapeHtml(metaTags.title)}</title>\n`;
    metaHTML += `  <meta name="title" content="${escapeHtml(metaTags.title)}" />\n`;
  }

  // Basic meta tags
  if (metaTags.description) {
    metaHTML += `  <meta name="description" content="${escapeHtml(metaTags.description)}" />\n`;
  }
  if (metaTags.keywords) {
    metaHTML += `  <meta name="keywords" content="${escapeHtml(metaTags.keywords)}" />\n`;
  }
  if (metaTags.author) {
    metaHTML += `  <meta name="author" content="${escapeHtml(metaTags.author)}" />\n`;
  }
  if (metaTags.robots) {
    metaHTML += `  <meta name="robots" content="${escapeHtml(metaTags.robots)}" />\n`;
  }
  if (metaTags.canonical) {
    metaHTML += `  <link rel="canonical" href="${escapeHtml(metaTags.canonical)}" />\n`;
  }
  if (metaTags.themeColor) {
    metaHTML += `  <meta name="theme-color" content="${escapeHtml(metaTags.themeColor)}" />\n`;
  }

  // Open Graph
  if (metaTags.og) {
    if (metaTags.og.type) metaHTML += `  <meta property="og:type" content="${escapeHtml(metaTags.og.type)}" />\n`;
    if (metaTags.og.url) metaHTML += `  <meta property="og:url" content="${escapeHtml(metaTags.og.url)}" />\n`;
    if (metaTags.og.title) metaHTML += `  <meta property="og:title" content="${escapeHtml(metaTags.og.title)}" />\n`;
    if (metaTags.og.description) metaHTML += `  <meta property="og:description" content="${escapeHtml(metaTags.og.description)}" />\n`;
    if (metaTags.og.image) metaHTML += `  <meta property="og:image" content="${escapeHtml(metaTags.og.image)}" />\n`;
    if (metaTags.og.siteName) metaHTML += `  <meta property="og:site_name" content="${escapeHtml(metaTags.og.siteName)}" />\n`;
  }

  // Twitter Card
  if (metaTags.twitter) {
    if (metaTags.twitter.card) {
      metaHTML += `  <meta name="twitter:card" content="${escapeHtml(metaTags.twitter.card)}" />\n`;
      metaHTML += `  <meta property="twitter:card" content="${escapeHtml(metaTags.twitter.card)}" />\n`;
    }
    if (metaTags.twitter.url) {
      metaHTML += `  <meta name="twitter:url" content="${escapeHtml(metaTags.twitter.url)}" />\n`;
      metaHTML += `  <meta property="twitter:url" content="${escapeHtml(metaTags.twitter.url)}" />\n`;
    }
    if (metaTags.twitter.title) {
      metaHTML += `  <meta name="twitter:title" content="${escapeHtml(metaTags.twitter.title)}" />\n`;
      metaHTML += `  <meta property="twitter:title" content="${escapeHtml(metaTags.twitter.title)}" />\n`;
    }
    if (metaTags.twitter.description) {
      metaHTML += `  <meta name="twitter:description" content="${escapeHtml(metaTags.twitter.description)}" />\n`;
      metaHTML += `  <meta property="twitter:description" content="${escapeHtml(metaTags.twitter.description)}" />\n`;
    }
    if (metaTags.twitter.image) {
      metaHTML += `  <meta name="twitter:image" content="${escapeHtml(metaTags.twitter.image)}" />\n`;
      metaHTML += `  <meta property="twitter:image" content="${escapeHtml(metaTags.twitter.image)}" />\n`;
    }
  }

  // Remove old meta tags and inject new ones
  const cleaned = html.replace(
    /<!-- Primary Meta Tags -->[\s\S]*?<!-- Theme Color -->/,
    '<!-- Primary Meta Tags (Injected from Database) -->'
  );

  return cleaned.replace(
    /(<!-- Primary Meta Tags \(Injected from Database\) -->)/,
    `$1\n${metaHTML}  <!-- Theme Color -->`
  );
}

// 1) Serve anything in /assets/**
app.use("/assets/*", serveStatic({ root: "./dist/assets" }));

// 2) Serve static files (CSS, JS, images, etc.) but not HTML
app.use("/assets/*", serveStatic({ root: "./dist" }));
app.use("/*.css", serveStatic({ root: "./dist" }));
app.use("/*.js", serveStatic({ root: "./dist" }));
app.use("/*.png", serveStatic({ root: "./dist" }));
app.use("/*.jpg", serveStatic({ root: "./dist" }));
app.use("/*.svg", serveStatic({ root: "./dist" }));
app.use("/*.ico", serveStatic({ root: "./dist" }));
app.use("/*.webmanifest", serveStatic({ root: "./dist" }));

// 3) Handle HTML files with meta tag injection for social media crawlers
app.get("*", async (c) => {
  try {
    // Read index.html file
    const file = await Deno.readTextFile("./dist/index.html");
    
    // Fetch meta tags from database
    const metaTags = await getMetaTags();
    
    // Inject meta tags into HTML
    const injectedHTML = injectMetaTags(file, metaTags);
    
    return c.html(injectedHTML);
  } catch (err) {
    console.error("Error serving HTML:", err);
    // Fallback to static file serving
    return serveStatic({ path: "./dist/index.html" })(c);
  }
});

Deno.serve(app.fetch);
