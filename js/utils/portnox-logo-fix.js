/**
 * Portnox Logo Fix
 * Ensures the correct Portnox logo is displayed consistently
 */
(function() {
  console.log('Installing Portnox logo fix...');
  
  // Official Portnox logo URL
  const OFFICIAL_LOGO_URL = 'https://events.vmblog.com/images/Mega%20Series/logo-portnox.png';
  window.officialPortnoxLogo = OFFICIAL_LOGO_URL;
  
  // Function to replace all logos
  function enforceOfficialLogo() {
    document.querySelectorAll('img').forEach(img => {
      if (img.className && img.className.includes('logo') || 
          img.closest('.logo') ||
          img.src && img.src.toLowerCase().includes('portnox') ||
          img.closest('.vendor-card[data-vendor="portnox"]')) {
        
        // Skip if already using the official logo
        if (img.src === OFFICIAL_LOGO_URL) return;
        
        // Set the official logo
        img.src = OFFICIAL_LOGO_URL;
        img.alt = 'Portnox Logo';
        
        // Remove any onerror handlers
        img.removeAttribute('onerror');
      }
    });
  }
  
  // Apply logo enforcement immediately and periodically
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enforceOfficialLogo);
  } else {
    enforceOfficialLogo();
  }
  
  // Continue checking periodically
  setInterval(enforceOfficialLogo, 1000);
  
  console.log('Portnox logo fix installed');
})();
