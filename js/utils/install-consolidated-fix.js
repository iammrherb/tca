/**
 * TCO Analyzer Consolidated Fix Installer
 * Installs all fixes and enhancements for the TCO Analyzer
 */
(function() {
  console.log('Installing consolidated fix...');
  
  // Mark installation as initiated
  console.log('Fix installation initiated');
  
  // Load the Ultimate Script Loader first to prevent duplicate script loading
  function loadScriptLoader(callback) {
    const script = document.createElement('script');
    script.src = 'fixes/ultimate-script-loader.js';
    script.onload = callback;
    document.head.appendChild(script);
  }
  
  // Load all fixes in the correct order
  function loadAllFixes() {
    // Add enhanced styles
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'fixes/enhanced-styles.css';
    document.head.appendChild(link);
    
    // Load scripts in sequence using the script loader
    window.ScriptLoader.loadScriptsSequentially([
      'fixes/ultimate-compliance-fix.js',
      'fixes/tab-organization.js',
      'fixes/ultimate-cost-configuration.js',
      'fixes/sensitivity-analyzer-fix.js',
      'fixes/cost-analysis-wizard.js',
      'fixes/vendor-comparison.js',
      'fixes/ultimate-master-fix.js'
    ], function() {
      console.log('All fixes loaded successfully');
      
      // Trigger calculation to update UI
      if (window.calculator && typeof window.calculator.calculate === 'function') {
        window.calculator.calculate();
      }
    });
  }
  
  // Start loading process
  loadScriptLoader(loadAllFixes);
  
  console.log('Ultimate Consolidated Fix setup complete');
})();
