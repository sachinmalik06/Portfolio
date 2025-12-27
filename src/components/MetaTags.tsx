import { useEffect } from 'react';
import { useMetaTags } from '@/hooks/use-cms';

/**
 * MetaTags Component
 * 
 * Updates all meta tags dynamically when data is loaded from the database.
 * 
 * Note: For social media link previews (Facebook, Twitter, LinkedIn), crawlers
 * read the initial HTML response. Since this is a SPA, meta tags are added via
 * JavaScript. For best results:
 * 1. Clear cache using Facebook Debugger or Twitter Card Validator after updating
 * 2. Consider using a prerendering service for production
 * 3. Meta tags will be visible to users and search engines after page load
 */
export function MetaTags() {
  const { data: metaTags } = useMetaTags();

  useEffect(() => {
    if (!metaTags) return;

    // Helper function to update or create meta tag
    // Now handles empty content to clear old values
    const updateMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
      // Find existing tag by attribute
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      // Also check for alternative attribute (some tags might use both)
      if (!element && attribute === 'name') {
        element = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement;
      } else if (!element && attribute === 'property') {
        element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      }
      
      if (content) {
        // Update or create tag with content
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute(attribute, name);
          document.head.appendChild(element);
        }
        element.setAttribute('content', content);
      } else if (element) {
        // Remove tag if content is empty
        element.remove();
      }
    };

    // Helper function to update or create link tag
    const updateLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      
      if (href) {
        if (!element) {
          element = document.createElement('link');
          element.setAttribute('rel', rel);
          document.head.appendChild(element);
        }
        element.setAttribute('href', href);
      } else if (element) {
        element.remove();
      }
    };

    // Update document title and meta name="title"
    if (metaTags.title) {
      document.title = metaTags.title;
      updateMetaTag('title', metaTags.title, 'name');
    }

    // Basic meta tags - always update even if empty to clear old values
    updateMetaTag('description', metaTags.description || '', 'name');
    updateMetaTag('keywords', metaTags.keywords || '', 'name');
    updateMetaTag('author', metaTags.author || '', 'name');
    updateMetaTag('robots', metaTags.robots || 'index, follow', 'name');

    // Canonical URL
    updateLinkTag('canonical', metaTags.canonical || '');

    // Theme color
    updateMetaTag('theme-color', metaTags.themeColor || '', 'name');

    // Open Graph tags
    if (metaTags.og) {
      updateMetaTag('og:type', metaTags.og.type || '', 'property');
      updateMetaTag('og:url', metaTags.og.url || '', 'property');
      updateMetaTag('og:title', metaTags.og.title || '', 'property');
      updateMetaTag('og:description', metaTags.og.description || '', 'property');
      updateMetaTag('og:image', metaTags.og.image || '', 'property');
      updateMetaTag('og:site_name', metaTags.og.siteName || '', 'property');
    }

    // Twitter Card tags - support both name and property attributes for better compatibility
    if (metaTags.twitter) {
      const twitterCard = metaTags.twitter.card || 'summary_large_image';
      const twitterUrl = metaTags.twitter.url || '';
      const twitterTitle = metaTags.twitter.title || '';
      const twitterDescription = metaTags.twitter.description || '';
      const twitterImage = metaTags.twitter.image || '';

      // Update with name attribute (standard)
      updateMetaTag('twitter:card', twitterCard, 'name');
      updateMetaTag('twitter:url', twitterUrl, 'name');
      updateMetaTag('twitter:title', twitterTitle, 'name');
      updateMetaTag('twitter:description', twitterDescription, 'name');
      updateMetaTag('twitter:image', twitterImage, 'name');

      // Also add property attribute for better compatibility with some platforms
      if (twitterCard) updateMetaTag('twitter:card', twitterCard, 'property');
      if (twitterUrl) updateMetaTag('twitter:url', twitterUrl, 'property');
      if (twitterTitle) updateMetaTag('twitter:title', twitterTitle, 'property');
      if (twitterDescription) updateMetaTag('twitter:description', twitterDescription, 'property');
      if (twitterImage) updateMetaTag('twitter:image', twitterImage, 'property');
    }
  }, [metaTags]);

  return null;
}







