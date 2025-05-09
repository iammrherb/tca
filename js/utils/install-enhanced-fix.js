/**
 * Enhanced TCO Analyzer Fix Installation
 * Fully functional Cost Configuration Wizard, fixed Portnox logo, and PDF reports
 */
(function() {
  console.log('Installing Enhanced TCO Analyzer Fix...');
  
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
  
  // Create and append the enhanced fix script
  const script = document.createElement('script');
  script.src = 'fixes/enhanced-fix.js';
  script.async = false;
  document.head.appendChild(script);
  
  // Add event listener to confirm loading
  script.onload = function() {
    console.log('Enhanced TCO Analyzer fixes loaded successfully!');
  };
  
  script.onerror = function() {
    console.error('Failed to load Enhanced TCO Analyzer fixes. Check file path and try again.');
  };
  
  // Fix Portnox logo immediately
  document.addEventListener('DOMContentLoaded', function() {
    const logoImg = document.querySelector('.logo img');
    if (logoImg) {
      logoImg.src = 'img/portnox-logo.png';
      logoImg.style.height = '40px';
      logoImg.style.width = 'auto';
      logoImg.style.objectFit = 'contain';
      console.log('Portnox logo restored');
    }
  });
  
  // Force load the PNG logo even if DOMContentLoaded already fired
  if (document.readyState !== 'loading') {
    const logoImg = document.querySelector('.logo img');
    if (logoImg) {
      logoImg.src = 'img/portnox-logo.png';
      logoImg.style.height = '40px';
      logoImg.style.width = 'auto';
      logoImg.style.objectFit = 'contain';
      console.log('Portnox logo restored (immediate)');
    }
  }
})();
