/**
 * Portnox Logo Enforcer
 * Ensures only the official Portnox logo is used with no fallbacks
 */
(function() {
  console.log('Installing Portnox logo enforcer...');
  
  // Official Portnox logo URL - never changes
  const OFFICIAL_LOGO_URL = 'https://events.vmblog.com/images/Mega%20Series/logo-portnox.png';
  window.officialPortnoxLogo = OFFICIAL_LOGO_URL;
  
  // Create and preload the official logo to ensure it's cached
  const preloadImage = new Image();
  preloadImage.src = OFFICIAL_LOGO_URL;
  
  // Aggressive replacement function that handles both direct and dynamic images
  function enforceOfficialLogo() {
    console.log('Enforcing official Portnox logo...');
    
    // Replace all logo images, both in logo containers and Portnox vendor cards
    document.querySelectorAll('img').forEach(img => {
      if (img.className && img.className.includes('logo') || 
          img.closest('.logo') ||
          img.src && (img.src.toLowerCase().includes('portnox') || img.src.includes('undefined')) ||
          img.closest('.vendor-card[data-vendor="portnox"]')) {
        
        // Skip if already using the official logo
        if (img.src === OFFICIAL_LOGO_URL) return;
        
        // Set the official logo
        img.src = OFFICIAL_LOGO_URL;
        img.alt = 'Portnox Logo';
        
        // Remove any onerror handlers
        img.removeAttribute('onerror');
        
        // Set consistent styling
        img.style.height = '40px';
        img.style.width = 'auto';
        img.style.objectFit = 'contain';
        img.style.marginRight = '10px';
      }
    });
  }
  
  // Override the Image constructor to intercept any new images
  const OrigImage = window.Image;
  window.Image = function() {
    const img = new OrigImage(...arguments);
    
    // Override src setter
    const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    Object.defineProperty(img, 'src', {
      get: originalSrcDescriptor.get,
      set: function(value) {
        // If this looks like a logo image, use the official logo
        if ((this.className && this.className.includes('logo')) ||
            (this.parentElement && this.parentElement.className && this.parentElement.className.includes('logo')) ||
            (typeof value === 'string' && (
              value.toLowerCase().includes('portnox') || 
              value.includes('logo') || 
              value.includes('undefined')
            ))) {
          originalSrcDescriptor.set.call(this, OFFICIAL_LOGO_URL);
        } else {
          originalSrcDescriptor.set.call(this, value);
        }
      }
    });
    
    return img;
  };
  window.Image.prototype = OrigImage.prototype;
  
  // Override setAttribute to catch logo changes
  const originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name, value) {
    if (name === 'src' && this.tagName === 'IMG' && 
        ((this.className && this.className.includes('logo')) ||
         (this.parentElement && this.parentElement.className && this.parentElement.className.includes('logo')) ||
         (typeof value === 'string' && (
           value.toLowerCase().includes('portnox') || 
           value.includes('logo')
         )))) {
      originalSetAttribute.call(this, name, OFFICIAL_LOGO_URL);
    } else {
      originalSetAttribute.call(this, name, value);
    }
  };
  
  // Add a style sheet to ensure logo styling
  const style = document.createElement('style');
  style.textContent = `
    .logo img, img.logo, .vendor-card[data-vendor="portnox"] img {
      content: url(${OFFICIAL_LOGO_URL}) !important;
      height: 40px !important;
      width: auto !important;
      object-fit: contain !important;
      margin-right: 10px !important;
    }
  `;
  
  // Add style to head
  if (document.head) {
    document.head.appendChild(style);
  } else {
    // If head is not available yet, wait for it
    document.addEventListener('DOMContentLoaded', function() {
      document.head.appendChild(style);
    });
  }
  
  // Apply logo enforcement immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enforceOfficialLogo);
  } else {
    enforceOfficialLogo();
  }
  
  // Continue enforcing periodically for dynamically loaded content
  setInterval(enforceOfficialLogo, 1000);
  
  console.log('Portnox logo enforcer installed');
})();
