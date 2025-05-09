/**
 * Ultimate Master Fix for TCO Analyzer
 * Comprehensive solution addressing all identified issues and enhancing the UI
 */
(function() {
  console.log('Applying Ultimate TCO Analyzer Fix...');
  
  // Create the CSS enhancements
  function addCriticalCSS() {
    const style = document.createElement('style');
    style.textContent = `
      /* Critical chart fixes */
      .chart-container {
        display: block !important;
        height: 300px !important;
        position: relative !important;
        width: 100% !important;
        margin-bottom: 20px !important;
      }
      
      canvas {
        display: block !important;
      }
      
      /* Logo fixes */
      .logo img {
        height: 40px !important;
        width: auto !important;
        object-fit: contain !important;
      }
      
      /* Hide sidebar industry content */
      .sidebar-industry-preview,
      .industry-templates-card,
      .compliance-info-container {
        display: none !important;
      }
      
      /* Enhanced tab styling */
      .tab-pane {
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      
      .tab-pane.active {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize all fixes
  function init() {
    // First apply critical CSS
    addCriticalCSS();
    
    // Load fix scripts in sequence
    loadFixScripts([
      'fixes/deduplication-fix.js',
      'fixes/branding-fix.js',
      'fixes/chart-fix.js',
      'fixes/pdf-fix.js',
      'fixes/combined-tab.js',
      'fixes/enhanced-cost-config.js'
    ]);
    
    console.log('TCO Analyzer fix initialization complete');
  }
  
  // Helper for loading scripts
  function loadFixScripts(scripts) {
    scripts.forEach(script => {
      const scriptEl = document.createElement('script');
      scriptEl.src = script;
      document.head.appendChild(scriptEl);
    });
  }
  
  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
