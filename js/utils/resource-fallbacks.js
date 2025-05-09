/**
 * Resource Fallbacks
 *
 * This script provides fallbacks for missing resources to prevent
 * 404 errors and ensure the application functions correctly.
 */

(function() {
  console.log('Setting up resource fallbacks...');

  // Intercept fetch to provide fallbacks
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    // Check if the URL is for a missing font
    if (typeof url === 'string' && url.includes('fa-solid-900')) {
      // Redirect to local copy
      if (url.endsWith('.woff2')) {
        url = 'webfonts/fa-solid-900.woff2';
      } else if (url.endsWith('.ttf')) {
        url = 'webfonts/fa-solid-900.ttf';
      }
    }

    return originalFetch(url, options);
  };

  // Create fallback CSS for missing styles
  const fallbackCSS = document.createElement('style');
  fallbackCSS.textContent = `
    /* Fallback for FA icons */
    .fa, .fas, .far, .fal, .fab {
      display: inline-block;
      font-style: normal;
      font-variant: normal;
      text-rendering: auto;
      line-height: 1;
    }

    /* Fallback for missing vendor logos */
    .vendor-card img {
      min-height: 60px;
      min-width: 60px;
      background-color: #f9fafb;
      border-radius: 4px;
    }
  `;
  document.head.appendChild(fallbackCSS);

  console.log('Resource fallbacks set up');
})();
