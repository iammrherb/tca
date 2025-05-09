/**
 * Branding Fix
 * Ensures consistent Portnox logo and correct title display
 */
(function() {
  console.log('Applying branding fixes...');
  
  // Official Portnox logo URL
  const OFFICIAL_LOGO_URL = 'https://events.vmblog.com/images/Mega%20Series/logo-portnox.png';
  
  // Function to fix all logos
  function fixLogos() {
    document.querySelectorAll('.logo img, .vendor-card[data-vendor="portnox"] img').forEach(img => {
      if (img.src !== OFFICIAL_LOGO_URL) {
        img.src = OFFICIAL_LOGO_URL;
        img.alt = 'Portnox Logo';
        img.removeAttribute('onerror');
      }
    });
  }
  
  // Function to fix title
  function fixTitle() {
    // Fix document title
    if (document.title.includes('Portnox Total Cost')) {
      document.title = document.title.replace(/Portnox Total Cost/g, 'Total Cost');
    }
    
    // Fix headings
    document.querySelectorAll('.logo h1, h1, h2, h3').forEach(heading => {
      if (heading.textContent.includes('Portnox Total Cost')) {
        heading.textContent = heading.textContent.replace(/Portnox Total Cost/g, 'Total Cost');
      }
    });
    
    // Fix other text nodes
    const walker = document.createTreeWalker(
      document.body, 
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while (node = walker.nextNode()) {
      if (node.nodeValue && node.nodeValue.includes('Portnox Total Cost')) {
        node.nodeValue = node.nodeValue.replace(/Portnox Total Cost/g, 'Total Cost');
      }
    }
  }
  
  // Apply fixes immediately
  fixLogos();
  fixTitle();
  
  // Continue checking periodically
  setInterval(fixLogos, 2000);
  setInterval(fixTitle, 5000);
  
  console.log('Branding fixes applied');
})();
