/**
 * Main Enhancement Script
 * Integrates all enhancements into the Total Cost Analyzer
 */
(function() {
  console.log("Initializing Total Cost Analyzer Enhancement");
  
  // Execute when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Update page title
    document.title = "Total Cost Analyzer";
    
    // Update header text
    const headerTitle = document.querySelector('.logo h1');
    if (headerTitle) {
      headerTitle.textContent = "Total Cost Analyzer";
    }
    
    // Initialize enhancements
    initializeEnhancements();
  });
  
  // Initialize all enhancements
  function initializeEnhancements() {
    console.log("Setting up enhancements...");
    
    // Fix TCO Wizard
    loadScript('js/components/tco-wizard-fix.js');
    
    // Add Industry and Compliance tabs
    loadScript('js/components/industry-compliance-tabs.js');
    
    // Add Executive View
    loadScript('js/views/executive-view.js');
    
    // Add Financial View
    loadScript('js/views/financial-view.js');
    
    // Add Security View
    loadScript('js/views/security-view.js');
    
    // Add Technical View
    loadScript('js/views/technical-view.js');
    
    // Restore original theme
    loadStylesheet('css/themes/original-theme.css');
    
    console.log("Enhancements set up successfully");
  }
  
  // Function to load a script
  function loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    
    if (callback) {
      script.onload = callback;
    }
    
    document.head.appendChild(script);
    console.log(`Script loaded: ${url}`);
  }
  
  // Function to load a stylesheet
  function loadStylesheet(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
    console.log(`Stylesheet loaded: ${url}`);
  }
})();
