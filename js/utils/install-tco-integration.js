/**
 * TCO Analyzer Integration Loader
 * Loads the integrated TCO Analyzer with fixes
 */
(function() {
  console.log('Installing Integrated TCO Analyzer...');

  // Create the script element
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'js/integrated-tco-analyzer.js';

  // Handle load/error events
  script.onload = function() {
    console.log('Integrated TCO Analyzer installed successfully');
  };

  script.onerror = function() {
    console.error('Failed to install Integrated TCO Analyzer');
  };

  // Add to document
  document.head.appendChild(script);
})();
