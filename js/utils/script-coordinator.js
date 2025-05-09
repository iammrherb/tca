/**
 * Script Load Coordinator - Prevents duplicate script loading
 */
(function() {
  console.log('Initializing script load coordinator...');
  
  // Track loaded scripts
  const loadedScripts = new Set();
  
  // Override the original loadScript function if it exists
  if (window.appIntegrator && window.appIntegrator.loadScript) {
    const originalLoadScript = window.appIntegrator.loadScript;
    
    window.appIntegrator.loadScript = function(src, callback) {
      // Check if script is already loaded
      if (loadedScripts.has(src)) {
        console.log(`Script already loaded: ${src}, skipping`);
        if (callback) callback();
        return;
      }
      
      // Mark as loaded
      loadedScripts.add(src);
      
      // Call original function
      originalLoadScript(src, callback);
    };
  }
  
  // Create global script loader
  window.loadScriptOnce = function(src, callback) {
    // Check if script is already loaded
    if (loadedScripts.has(src)) {
      console.log(`Script already loaded: ${src}, skipping`);
      if (callback) callback();
      return;
    }
    
    // Check if script is already in DOM
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      console.log(`Script already in DOM: ${src}, marking as loaded`);
      loadedScripts.add(src);
      if (callback) callback();
      return;
    }
    
    // Mark as loaded
    loadedScripts.add(src);
    
    // Create script element
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    
    // Set callback
    if (callback) {
      script.onload = callback;
    }
    
    // Add to document
    document.body.appendChild(script);
    console.log(`Loaded script: ${src}`);
  };
  
  console.log('Script load coordinator initialized');
})();
