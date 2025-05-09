/**
 * Portnox logo preloader
 */
(function() {
  // Create an image element and set the source to preload the image
  const img = new Image();
  img.src = 'https://events.vmblog.com/images/Mega%20Series/logo-portnox.png';
  window.portnoxLogoUrl = img.src;
  
  console.log('Portnox logo preloaded');
})();
