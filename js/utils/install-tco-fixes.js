/**
 * TCO Analyzer Fix Installation Script
 * Automatically applies all fixes and optimizations to the TCO Analyzer
 */

(function() {
  console.log('Installing TCO Analyzer fixes...');
  
  // Function to load a script
  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  
  // Function to load a stylesheet
  function loadStylesheet(url) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }
  
  // Install the consolidated fix script
  loadScript('fixes/tco-master-fix.js')
    .then(() => {
      console.log('Master fix script loaded successfully');
      
      // Load the consolidated CSS
      return loadStylesheet('css/tco-consolidated.css');
    })
    .then(() => {
      console.log('Consolidated CSS loaded successfully');
      console.log('All TCO Analyzer fixes installed successfully!');
      
      // Notify user
      if (typeof window.NotificationManager !== 'undefined') {
        window.NotificationManager.showSuccess('TCO Analyzer enhancements applied successfully!');
      } else {
        // Simple fallback if notification manager isn't available
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#65BD44';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        notification.style.zIndex = '9999';
        notification.innerHTML = 'TCO Analyzer enhancements applied successfully!';
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 5000);
      }
    })
    .catch(error => {
      console.error('Error installing TCO Analyzer fixes:', error);
      
      // Notify user of error
      alert('There was an error applying the TCO Analyzer enhancements. Please check the console for details.');
    });
})();
