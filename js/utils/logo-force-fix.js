/**
 * Force official Portnox logo everywhere
 * No fallbacks, no references to old logos
 */
(function() {
  // Official Portnox logo URL
  const OFFICIAL_LOGO_URL = 'https://events.vmblog.com/images/Mega%20Series/logo-portnox.png';
  
  // Store in global variable for other scripts
  window.officialPortnoxLogo = OFFICIAL_LOGO_URL;
  
  // Override Image constructor to intercept any image creation
  const originalImage = window.Image;
  window.Image = function() {
    const img = new originalImage(...arguments);
    
    // Watch for src changes
    const descriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    const originalSetter = descriptor.set;
    
    Object.defineProperty(img, 'src', {
      get: descriptor.get,
      set: function(value) {
        // If image is part of a logo class or has portnox in the URL, use official logo
        if (this.className && this.className.includes('logo') || 
            (typeof value === 'string' && value.toLowerCase().includes('portnox'))) {
          console.log('Intercepted logo image, using official Portnox logo');
          originalSetter.call(this, OFFICIAL_LOGO_URL);
        } else {
          originalSetter.call(this, value);
        }
      }
    });
    
    return img;
  };
  
  // Copy prototype
  window.Image.prototype = originalImage.prototype;
  
  // Override setAttribute for existing images
  const originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name, value) {
    if (name === 'src' && this.tagName === 'IMG' && 
        (this.className && this.className.includes('logo') || 
         (typeof value === 'string' && value.toLowerCase().includes('portnox')))) {
      console.log('Intercepted setAttribute for logo, using official Portnox logo');
      originalSetAttribute.call(this, name, OFFICIAL_LOGO_URL);
    } else {
      originalSetAttribute.call(this, name, value);
    }
  };
  
  // Function to replace all existing logo images
  function replaceAllLogos() {
    console.log('Replacing all logo images with official Portnox logo');
    
    // Find all images with logo in class or portnox in URL
    document.querySelectorAll('img').forEach(img => {
      if (img.className && img.className.includes('logo') || 
          (img.src && img.src.toLowerCase().includes('portnox'))) {
        img.src = OFFICIAL_LOGO_URL;
        img.alt = 'Portnox Logo';
        
        // Remove any onerror attributes to prevent fallbacks
        img.removeAttribute('onerror');
        
        // Set consistent styling
        img.style.height = '40px';
        img.style.width = 'auto';
        img.style.objectFit = 'contain';
      }
    });
    
    // Find specific vendor logos
    document.querySelectorAll('.vendor-card[data-vendor="portnox"] img').forEach(img => {
      img.src = OFFICIAL_LOGO_URL;
      img.alt = 'Portnox Logo';
      img.removeAttribute('onerror');
    });
  }
  
  // Apply logo fix immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', replaceAllLogos);
  } else {
    replaceAllLogos();
  }
  
  // Continue checking periodically for dynamic content
  setInterval(replaceAllLogos, 1000);
  
  console.log('Logo force fix installed');
})();
