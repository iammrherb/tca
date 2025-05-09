/**
 * Direct logo fix that executes immediately
 */
(function() {
  const portnoxLogoUrl = 'https://events.vmblog.com/images/Mega%20Series/logo-portnox.png';
  
  // Replace logos on page load
  document.addEventListener('DOMContentLoaded', function() {
    // Replace all Portnox logos
    document.querySelectorAll('img[src*="portnox"]').forEach(img => {
      if (!img.src.includes('events.vmblog.com')) {
        img.src = portnoxLogoUrl;
        img.alt = 'Portnox Logo';
      }
    });
    
    // Replace main logo
    document.querySelectorAll('.logo img').forEach(img => {
      img.src = portnoxLogoUrl;
      img.alt = 'Portnox Logo';
    });
    
    // Replace any vendor logos for Portnox
    document.querySelectorAll('.vendor-card[data-vendor="portnox"] img').forEach(img => {
      img.src = portnoxLogoUrl;
      img.alt = 'Portnox Logo';
    });
    
    console.log('Direct logo fix applied');
  });
  
  // Set global variable for other scripts
  window.portnoxLogoUrl = portnoxLogoUrl;
})();
