/**
 * Main Integration Script for NAC Total Cost Analyzer
 * Loads and initializes all the enhanced features
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing NAC Total Cost Analyzer enhancements');
  
  // Load compatibility layer
  loadScript('js/fixes/chart-builder-compat.js', function() {
    console.log('Chart Builder compatibility layer loaded');
    
    // Load fixes
    loadScript('js/fixes/enhanced-charts.js');
    loadScript('js/fixes/wizard-fixes.js');
    loadScript('js/fixes/layout-fixes.js');
    
    // Load libraries
    loadScript('js/libraries/countUp.min.js');
    
    console.log('Enhancement scripts loaded');
  });
  
  // Function to load script
  function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    
    if (callback) {
      script.onload = callback;
    }
    
    document.head.appendChild(script);
    console.log(`Loading script: ${src}`);
  }
});
