/**
 * Improved TCO Analyzer Fix
 * Fixes wizard, charts, PDF generation and adds industry recommendations
 */
(function() {
  console.log('Installing Improved TCO Analyzer Fix...');

  // First, remove any problematic script tags that might be causing conflicts
  document.querySelectorAll('script[src*="compliance-insights.js"]').forEach(script => {
    script.remove();
    console.log('Removed conflicting compliance-insights.js script');
  });

  document.querySelectorAll('script[src*="enhanced-pdf-generator.js"]').forEach(script => {
    script.remove();
    console.log('Removed conflicting enhanced-pdf-generator.js script');
  });

  document.querySelectorAll('script[src*="consolidated-fix.js"]').forEach(script => {
    script.remove();
    console.log('Removed conflicting consolidated-fix.js script');
  });

  document.querySelectorAll('script[src*="enhanced-fix.js"]').forEach(script => {
    script.remove();
    console.log('Removed conflicting enhanced-fix.js script');
  });

  document.querySelectorAll('script[src*="final-fix.js"]').forEach(script => {
    script.remove();
    console.log('Removed conflicting final-fix.js script');
  });

  // Create and append the fix script
  const script = document.createElement('script');
  script.src = 'fixes/improved-fix.js';
  script.async = false;
  document.head.appendChild(script);

  // Add event listener to confirm loading
  script.onload = function() {
    console.log('Improved TCO Analyzer fix loaded successfully!');
  };

  script.onerror = function() {
    console.error('Failed to load Improved TCO Analyzer fix. Check file path and try again.');
  };

  // Fix Portnox logo immediately
  const logoImg = document.querySelector('.logo img');
  if (logoImg) {
    logoImg.src = 'img/portnox-logo.png';
    logoImg.style.height = '40px';
    logoImg.style.width = 'auto';
    logoImg.style.objectFit = 'contain';
    console.log('Portnox logo restored (immediate)');
  }
})();
