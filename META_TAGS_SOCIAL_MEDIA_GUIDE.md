# Meta Tags & Social Media Link Previews Guide

## ✅ What's Fixed

Your meta tags will now work properly for **WhatsApp, LinkedIn, Facebook, and Twitter** link previews!

### Changes Made:

1. **Server-Side Meta Tag Injection** - Meta tags are now injected into the HTML **before** it's sent to the browser
2. **Production Server Updated** - The `main.ts` server now fetches meta tags from your database and injects them into the HTML
3. **Client-Side Updates** - The MetaTags component still updates tags dynamically for users browsing your site

## 🧪 How to Test

### 1. Update Meta Tags in Admin Panel

1. Go to `/admin/meta-tags`
2. Fill in all the fields:
   - **Basic SEO**: Title, Description, Keywords, Author
   - **Open Graph**: Type, URL, Title, Description, Image, Site Name
   - **Twitter Card**: Card Type, URL, Title, Description, Image
   - **Advanced**: Robots, Canonical URL, Theme Color
3. Click "Save Meta Tags"
4. Wait for the page to reload

### 2. Verify Meta Tags in HTML

**Option A: View Page Source**
1. Visit your website
2. Right-click → "View Page Source" (or Ctrl+U)
3. Look for the `<head>` section
4. You should see your meta tags with the values you entered

**Option B: Browser DevTools**
1. Open DevTools (F12)
2. Go to the "Elements" tab
3. Expand the `<head>` tag
4. Verify your meta tags are present

### 3. Test Social Media Link Previews

#### Facebook & LinkedIn:
1. Go to [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Enter your website URL
3. Click "Debug"
4. Click "Scrape Again" to clear cache and see your new meta tags
5. You should see your Open Graph image, title, and description

#### Twitter/X:
1. Go to [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Enter your website URL
3. You should see your Twitter Card preview

#### WhatsApp:
1. Open WhatsApp
2. Send your website URL to yourself or a test contact
3. Wait a moment for the preview to load
4. You should see your title, description, and image

## ⚠️ Important Notes

### Cache Clearing

Social media platforms cache link previews. After updating meta tags:

1. **Facebook/LinkedIn**: Use the [Sharing Debugger](https://developers.facebook.com/tools/debug/) and click "Scrape Again"
2. **Twitter**: Use the [Card Validator](https://cards-dev.twitter.com/validator) - it automatically clears cache
3. **WhatsApp**: Cache usually expires after 24-48 hours, or you can try adding `?v=2` to your URL

### Image Requirements

For best results:
- **Open Graph Image**: 1200x630px (recommended)
- **Twitter Image**: 1200x675px (recommended)
- **Format**: JPG or PNG
- **Size**: Under 5MB
- **URL**: Must be a full, absolute URL (e.g., `https://yoursite.com/image.jpg`)

### URL Requirements

- All URLs (og:url, twitter:url, canonical) must be **full absolute URLs**
- Example: `https://yoursite.com` (not `/` or `yoursite.com`)

## 🔧 How It Works

### Production (Deployed Site)

1. User or crawler requests your website
2. Server (`main.ts`) fetches meta tags from Supabase database
3. Server injects meta tags into the HTML
4. HTML with meta tags is sent to the browser/crawler
5. Social media crawlers can now read the meta tags from the initial HTML

### Development (Local)

- Meta tags are updated client-side via the `MetaTags` component
- For testing social media previews locally, you'll need to:
  - Deploy to a staging environment, OR
  - Use a tool like [ngrok](https://ngrok.com/) to expose your local server

## 🐛 Troubleshooting

### Meta Tags Not Showing in Preview

1. **Check Database**: Verify meta tags are saved in the admin panel
2. **Check HTML Source**: View page source and verify meta tags are in the HTML
3. **Clear Cache**: Use the debugger tools to clear cache
4. **Check URLs**: Ensure all URLs are absolute (start with `https://`)
5. **Check Images**: Verify image URLs are accessible and return 200 status

### Meta Tags Not Updating

1. **Wait for Reload**: After saving, the page reloads automatically
2. **Hard Refresh**: Try Ctrl+Shift+R (or Cmd+Shift+R on Mac)
3. **Check Console**: Open browser console for any errors
4. **Verify Database**: Check Supabase dashboard to confirm data is saved

### Server Errors

If you see errors in production:
1. Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set as environment variables
2. Check server logs for specific error messages
3. Verify Supabase connection is working

## 📝 Example Meta Tags Configuration

Here's an example of what your meta tags should look like:

```html
<title>Your Site Title</title>
<meta name="title" content="Your Site Title" />
<meta name="description" content="Your site description here" />
<meta name="keywords" content="keyword1, keyword2, keyword3" />
<meta name="author" content="Your Name" />
<meta name="robots" content="index, follow" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://yoursite.com" />
<meta property="og:title" content="Your Site Title" />
<meta property="og:description" content="Your site description here" />
<meta property="og:image" content="https://yoursite.com/og-image.jpg" />
<meta property="og:site_name" content="Your Site Name" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://yoursite.com" />
<meta name="twitter:title" content="Your Site Title" />
<meta name="twitter:description" content="Your site description here" />
<meta name="twitter:image" content="https://yoursite.com/twitter-image.jpg" />
```

## ✅ Success Checklist

- [ ] Meta tags are saved in admin panel
- [ ] Meta tags appear in HTML source code
- [ ] Facebook Sharing Debugger shows correct preview
- [ ] Twitter Card Validator shows correct preview
- [ ] WhatsApp link preview works (may take 24-48 hours for cache to clear)
- [ ] LinkedIn link preview works

---

**Need Help?** If meta tags still aren't working, check:
1. Browser console for errors
2. Server logs for errors
3. Supabase dashboard to verify data is saved
4. Network tab to verify meta tags are in the HTML response


