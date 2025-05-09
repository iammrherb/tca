/**
 * Simple Portnox logo fix
 */
(function() {
  // Set the official Portnox logo URL - no fallbacks
  const PORTNOX_LOGO_URL = 'https://events.vmblog.com/images/Mega%20Series/logo-portnox.png';
  window.portnoxLogoUrl = PORTNOX_LOGO_URL;
  
  // Replace logos when DOM is ready
  function replaceLogo() {
    console.log('Applying Portnox logo fix...');
    
    // Replace all logo images
    document.querySelectorAll('.logo img, .vendor-card[data-vendor="portnox"] img').forEach(img => {
      img.src = PORTNOX_LOGO_URL;
      img.alt = 'Portnox Logo';
      img.removeAttribute('onerror');
    });
  }
  
  // Apply logo fix on page load and periodically
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', replaceLogo);
  } else {
    replaceLogo();
  }
  
  // Reapply every second to catch any dynamically added images
  setInterval(replaceLogo, 1000);
})();
