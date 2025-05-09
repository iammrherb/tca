/**
 * Wizard Master Fix
 * Coordinates loading of all components
 */
(function() {
  console.log('=== WIZARD MASTER FIX STARTING ===');
  
  // Function to load a script
  function loadScript(src, callback) {
    console.log('Loading script:', src);
    const script = document.createElement('script');
    script.src = src;
    script.onload = function() {
      console.log('Loaded script:', src);
      if (callback) callback();
    };
    script.onerror = function() {
      console.error('Error loading script:', src);
    };
    document.head.appendChild(script);
  }
  
  // Function to load a stylesheet
  function loadStylesheet(href) {
    console.log('Loading stylesheet:', href);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
  
  // Show the results container
  function showResults() {
    setTimeout(function() {
      const resultsContainer = document.getElementById('results-container');
      if (resultsContainer) {
        resultsContainer.classList.remove('hidden');
        resultsContainer.style.display = 'flex';
        resultsContainer.style.visibility = 'visible';
      }
    }, 1000);
  }
  
  // Add a basic CSS fix for visibility issues
  const style = document.createElement('style');
  style.textContent = `
    /* Force elements to be visible */
    #results-container {
      display: flex !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
    
    .chart-container {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      height: 300px !important;
    }
    
    canvas {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
    
    .tab-pane.active {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
  `;
  document.head.appendChild(style);
  
  // Load scripts in sequence
  function initializeScripts() {
    // First load the direct data fix
    loadScript('js/fixes/direct-data-fix.js', function() {
      // Then load the Cost Wizard
      loadScript('js/components/cost-wizard.js', function() {
        console.log('All components loaded');
        
        // Show results after a delay
        showResults();
        
        // Trigger calculation
        setTimeout(function() {
          const calculateBtn = document.getElementById('calculate-btn');
          if (calculateBtn) calculateBtn.click();
        }, 1500);
      });
    });
  }
  
  // Start loading scripts
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeScripts);
  } else {
    initializeScripts();
  }
  
  console.log('=== WIZARD MASTER FIX INITIALIZED ===');
})();
