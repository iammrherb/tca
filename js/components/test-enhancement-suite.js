// TCO Analyzer Enhancement Suite - Quick Tester
(function() {
  console.log('Testing TCO Analyzer Enhancement Suite...');
  
  // Load the consolidated fix
  const script = document.createElement('script');
  script.src = 'install-consolidated-fix.js';
  document.head.appendChild(script);
  
  // Add the enhanced styles
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'fixes/enhanced-styles.css';
  document.head.appendChild(link);
  
  console.log('Enhancement suite test initialized!');
})();
