/**
 * Ultimate Script Loader
 * Properly manages script loading sequence and prevents duplicates
 */
(function() {
  console.log('Applying Ultimate Script Loader...');
  
  // Track loaded scripts
  window._loadedScripts = window._loadedScripts || {};
  
  // Create enhanced script loader
  window.ScriptLoader = {
    // Load script safely with proper error handling and deduplication
    loadScript: function(url, callback, errorCallback) {
      // Check if already loaded
      if (window._loadedScripts[url]) {
        console.log(`Script already loaded: ${url}`);
        if (callback) callback();
        return;
      }
      
      console.log(`Loading script: ${url}`);
      
      // Create script element
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      
      // Handle success
      script.onload = function() {
        console.log(`Script loaded successfully: ${url}`);
        window._loadedScripts[url] = true;
        if (callback) callback();
      };
      
      // Handle errors
      script.onerror = function() {
        console.error(`Failed to load script: ${url}`);
        if (errorCallback) errorCallback();
      };
      
      // Add to document
      document.head.appendChild(script);
    },
    
    // Load multiple scripts in sequence
    loadScriptsSequentially: function(urls, finalCallback) {
      if (!urls || urls.length === 0) {
        if (finalCallback) finalCallback();
        return;
      }
      
      const url = urls.shift();
      this.loadScript(url, () => {
        this.loadScriptsSequentially(urls, finalCallback);
      });
    },
    
    // Load multiple scripts in parallel
    loadScriptsParallel: function(urls, finalCallback) {
      if (!urls || urls.length === 0) {
        if (finalCallback) finalCallback();
        return;
      }
      
      let loaded = 0;
      const total = urls.length;
      
      urls.forEach(url => {
        this.loadScript(url, () => {
          loaded++;
          if (loaded === total && finalCallback) finalCallback();
        });
      });
    }
  };
  
  // Override appendChild to prevent duplicate script tags
  const originalAppendChild = Node.prototype.appendChild;
  Node.prototype.appendChild = function(node) {
    // Only check for script nodes with src attribute
    if (node.nodeName === 'SCRIPT' && node.src) {
      const src = node.src;
      
      // Skip if already loaded
      if (window._loadedScripts[src]) {
        console.log(`Prevented duplicate script load: ${src}`);
        return node; // Return node without appending
      }
      
      // Skip problematic scripts
      if (src.includes('compliance-insights.js')) {
        console.log(`Prevented loading of known problematic script: ${src}`);
        return node; // Return node without appending
      }
      
      // Mark script as loaded
      window._loadedScripts[src] = true;
    }
    
    // Call original method for all other nodes
    return originalAppendChild.call(this, node);
  };
  
  console.log('Ultimate Script Loader setup complete');
})();
