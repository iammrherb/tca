/**
 * Total Cost Analyzer Master Fix
 * This script coordinates all fixes
 */
(function() {
  console.log('=== TCO CALCULATOR MASTER FIX ===');
  
  // Function to load a script
  function loadScript(src, callback) {
    console.log('Loading script: ' + src);
    const script = document.createElement('script');
    script.src = src;
    script.onload = function() {
      console.log('Loaded script: ' + src);
      if (callback) callback();
    };
    script.onerror = function() {
      console.error('Error loading script: ' + src);
    };
    document.head.appendChild(script);
  }
  
  // Function to load a stylesheet
  function loadStylesheet(href) {
    console.log('Loading stylesheet: ' + href);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
  
  // Add the CSS fixes first
  loadStylesheet('css/fixes/chart-fixes.css');
  
  // Show success notification
  function showNotification() {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4caf50';
    notification.style.color = 'white';
    notification.style.padding = '10px 15px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.zIndex = '9999';
    notification.innerHTML = 'Total Cost Analyzer fixed successfully! <span style="font-size:18px">✓</span>';
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(function() {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.5s ease';
      setTimeout(function() {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }, 5000);
  }
  
  // Load scripts in sequence with dependencies
  loadScript('js/fixes/calculator-fix.js', function() {
    loadScript('js/fixes/direct-chart-fix.js', function() {
      console.log('All fixes loaded successfully');
      
      // Force the results container to be visible
      setTimeout(function() {
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
          resultsContainer.classList.remove('hidden');
          resultsContainer.style.display = 'block';
          resultsContainer.style.visibility = 'visible';
          resultsContainer.style.opacity = '1';
        }
        
        // Force calculator button click
        const calculateBtn = document.getElementById('calculate-btn');
        if (calculateBtn) {
          calculateBtn.click();
        }
        
        // Show success notification
        showNotification();
      }, 1500);
    });
  });
})();
