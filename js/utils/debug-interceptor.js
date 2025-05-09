/**
 * Debug Interceptor
 * Aggressively intercepts and logs all JavaScript errors
 */
(function() {
  console.log('Installing Debug Interceptor');
  
  // Store original console methods
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error
  };
  
  // Create log storage
  window.debugLogs = [];
  
  // Override console methods
  console.log = function() {
    // Store log
    window.debugLogs.push({
      type: 'log',
      message: Array.from(arguments).join(' '),
      timestamp: new Date()
    });
    
    // Call original method
    return originalConsole.log.apply(console, arguments);
  };
  
  console.warn = function() {
    // Store warning
    window.debugLogs.push({
      type: 'warn',
      message: Array.from(arguments).join(' '),
      timestamp: new Date()
    });
    
    // Call original method
    return originalConsole.warn.apply(console, arguments);
  };
  
  console.error = function() {
    // Store error
    window.debugLogs.push({
      type: 'error',
      message: Array.from(arguments).join(' '),
      timestamp: new Date()
    });
    
    // Call original method
    return originalConsole.error.apply(console, arguments);
  };
  
  // Capture all unhandled errors
  window.addEventListener('error', function(event) {
    window.debugLogs.push({
      type: 'unhandled',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error ? event.error.stack : null,
      timestamp: new Date()
    });
    
    console.error('Unhandled error:', event.message, 'at', event.filename, 'line', event.lineno);
    
    // Don't prevent default to allow normal error handling
    return false;
  });
  
  // Capture all unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    window.debugLogs.push({
      type: 'unhandledrejection',
      message: event.reason ? (event.reason.message || String(event.reason)) : 'Unknown promise rejection',
      stack: event.reason && event.reason.stack,
      timestamp: new Date()
    });
    
    console.error('Unhandled promise rejection:', event.reason);
    
    // Don't prevent default to allow normal error handling
    return false;
  });
  
  // Add debug panel
  function createDebugPanel() {
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.style.cssText = `
      position: fixed;
      bottom: 0;
      right: 0;
      width: 50px;
      height: 50px;
      background-color: red;
      color: white;
      border-radius: 25px 0 0 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      cursor: pointer;
      z-index: 9999;
      transition: all 0.3s ease;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    `;
    debugPanel.innerHTML = '🐞';
    debugPanel.title = 'Show debug info';
    
    // Error counter
    const errorCounter = document.createElement('div');
    errorCounter.id = 'error-counter';
    errorCounter.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      background-color: white;
      color: red;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    `;
    errorCounter.textContent = '0';
    debugPanel.appendChild(errorCounter);
    
    // Debug info panel
    const debugInfo = document.createElement('div');
    debugInfo.id = 'debug-info';
    debugInfo.style.cssText = `
      position: fixed;
      bottom: 0;
      right: 0;
      width: 100%;
      max-width: 800px;
      height: 400px;
      background-color: rgba(0, 0, 0, 0.9);
      color: white;
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 9998;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      font-family: monospace;
    `;
    
    // Debug header
    const debugHeader = document.createElement('div');
    debugHeader.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      background-color: #333;
      border-bottom: 1px solid #555;
    `;
    debugHeader.innerHTML = `
      <span>Debug Information</span>
      <button id="close-debug" style="background: none; border: none; color: white; cursor: pointer;">✕</button>
    `;
    debugInfo.appendChild(debugHeader);
    
    // Debug content
    const debugContent = document.createElement('div');
    debugContent.id = 'debug-content';
    debugContent.style.cssText = `
      flex: 1;
      overflow: auto;
      padding: 10px;
    `;
    debugInfo.appendChild(debugContent);
    
    // Debug footer
    const debugFooter = document.createElement('div');
    debugFooter.style.cssText = `
      display: flex;
      justify-content: space-between;
      padding: 10px;
      background-color: #333;
      border-top: 1px solid #555;
    `;
    debugFooter.innerHTML = `
      <button id="clear-logs" style="background: #555; border: none; color: white; padding: 5px 10px; cursor: pointer; border-radius: 3px;">Clear Logs</button>
      <button id="fix-charts" style="background: #007bff; border: none; color: white; padding: 5px 10px; cursor: pointer; border-radius: 3px;">Fix Charts</button>
      <button id="force-init" style="background: #28a745; border: none; color: white; padding: 5px 10px; cursor: pointer; border-radius: 3px;">Force Init</button>
      <button id="debug-dump" style="background: #dc3545; border: none; color: white; padding: 5px 10px; cursor: pointer; border-radius: 3px;">Download Logs</button>
    `;
    debugInfo.appendChild(debugFooter);
    
    // Add to body when DOM is loaded
    if (document.body) {
      document.body.appendChild(debugPanel);
      document.body.appendChild(debugInfo);
      addDebugListeners();
    } else {
      window.addEventListener('DOMContentLoaded', function() {
        document.body.appendChild(debugPanel);
        document.body.appendChild(debugInfo);
        addDebugListeners();
      });
    }
    
    // Add event listeners
    function addDebugListeners() {
      // Show debug panel
      document.getElementById('debug-panel').addEventListener('click', function() {
        document.getElementById('debug-info').style.display = 'flex';
      });
      
      // Close debug panel
      document.getElementById('close-debug').addEventListener('click', function() {
        document.getElementById('debug-info').style.display = 'none';
      });
      
      // Clear logs
      document.getElementById('clear-logs').addEventListener('click', function() {
        window.debugLogs = [];
        updateDebugContent();
      });
      
      // Fix charts
      document.getElementById('fix-charts').addEventListener('click', function() {
        fixAllCharts();
      });
      
      // Force init
      document.getElementById('force-init').addEventListener('click', function() {
        forceInitialization();
      });
      
      // Download logs
      document.getElementById('debug-dump').addEventListener('click', function() {
        downloadLogs();
      });
      
      // Initial update
      updateDebugContent();
      
      // Start log monitoring
      setInterval(updateDebugContent, 1000);
    }
  }
  
  // Update debug content
  function updateDebugContent() {
    const content = document.getElementById('debug-content');
    if (!content) return;
    
    // Clear content
    content.innerHTML = '';
    
    // Count errors
    let errorCount = 0;
    
    // Add logs
    window.debugLogs.slice(-100).forEach(function(log) {
      // Count errors
      if (log.type === 'error' || log.type === 'unhandled' || log.type === 'unhandledrejection') {
        errorCount++;
      }
      
      // Create log element
      const logElement = document.createElement('div');
      logElement.className = 'log-entry log-' + log.type;
      logElement.style.cssText = `
        margin-bottom: 5px;
        padding: 5px;
        border-radius: 3px;
        border-left: 3px solid;
        word-break: break-all;
        white-space: pre-wrap;
      `;
      
      // Set color based on type
      switch (log.type) {
        case 'error':
        case 'unhandled':
        case 'unhandledrejection':
          logElement.style.borderLeftColor = '#dc3545';
          logElement.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
          break;
        case 'warn':
          logElement.style.borderLeftColor = '#ffc107';
          logElement.style.backgroundColor = 'rgba(255, 193, 7, 0.1)';
          break;
        default:
          logElement.style.borderLeftColor = '#28a745';
          logElement.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
      }
      
      // Format timestamp
      const time = log.timestamp.toTimeString().split(' ')[0];
      
      // Set content
      logElement.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
          <span style="font-weight: bold;">${log.type.toUpperCase()}</span>
          <span style="color: #aaa;">${time}</span>
        </div>
        <div>${log.message}</div>
        ${log.stack ? `<div style="color: #999; margin-top: 3px; font-size: 0.9em;">${log.stack}</div>` : ''}
      `;
      
      // Add to content
      content.appendChild(logElement);
    });
    
    // Update error counter
    const counter = document.getElementById('error-counter');
    if (counter) {
      counter.textContent = errorCount > 99 ? '99+' : errorCount;
      counter.style.display = errorCount > 0 ? 'flex' : 'none';
    }
    
    // Scroll to bottom
    content.scrollTop = content.scrollHeight;
  }
  
  // Fix all charts
  function fixAllCharts() {
    console.log('Aggressively fixing all charts...');
    
    try {
      // Try to get all canvases
      const canvases = document.querySelectorAll('canvas');
      console.log(`Found ${canvases.length} canvases`);
      
      // Destroy all Chart.js instances
      if (window.Chart) {
        // Different approaches for different Chart.js versions
        if (window.Chart.instances) {
          // Chart.js v2.x
          console.log('Using Chart.js v2.x approach');
          
          // Create a copy of the instances array to avoid modification during iteration
          const instances = Object.values(window.Chart.instances);
          console.log(`Found ${instances.length} Chart.js instances`);
          
          // Destroy each instance
          instances.forEach(function(chart) {
            try {
              chart.destroy();
              console.log(`Destroyed chart ${chart.id}`);
            } catch (error) {
              console.warn(`Error destroying chart ${chart.id}:`, error);
            }
          });
        } else if (window.Chart.getChart) {
          // Chart.js v3.x+
          console.log('Using Chart.js v3.x+ approach');
          
          // Destroy each chart
          canvases.forEach(function(canvas) {
            try {
              const chart = window.Chart.getChart(canvas);
              if (chart) {
                chart.destroy();
                console.log(`Destroyed chart on canvas ${canvas.id}`);
              }
            } catch (error) {
              console.warn(`Error destroying chart on canvas ${canvas.id}:`, error);
            }
          });
        } else {
          // Fallback
          console.log('Using fallback approach');
          
          // Try to destroy by accessing the Chart instance via __chartjs__
          canvases.forEach(function(canvas) {
            try {
              if (canvas.__chartjs__ && canvas.__chartjs__.chart) {
                canvas.__chartjs__.chart.destroy();
                console.log(`Destroyed chart on canvas ${canvas.id} using __chartjs__ property`);
              }
            } catch (error) {
              console.warn(`Error destroying chart on canvas ${canvas.id} using __chartjs__ property:`, error);
            }
          });
        }
      }
      
      // Reset all canvases
      canvases.forEach(function(canvas) {
        try {
          // Get dimensions
          const width = canvas.width;
          const height = canvas.height;
          
          // Clear canvas
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, width, height);
          
          // Reset size to force redraw
          canvas.width = 1;
          canvas.height = 1;
          canvas.width = width;
          canvas.height = height;
          
          console.log(`Reset canvas ${canvas.id}`);
        } catch (error) {
          console.warn(`Error resetting canvas ${canvas.id}:`, error);
        }
      });
      
      // Reset Chart.js registry if available
      if (window.Chart && window.Chart.register) {
        try {
          window.Chart.registry.clear();
          console.log('Cleared Chart.js registry');
        } catch (error) {
          console.warn('Error clearing Chart.js registry:', error);
        }
      }
      
      // Reset chart registry
      if (window.chartRegistry) {
        window.chartRegistry = {};
        console.log('Reset chart registry');
      }
      
      // Force chart initialization if available
      if (typeof window.initializeCharts === 'function') {
        try {
          window.initializeCharts();
          console.log('Forced chart initialization');
        } catch (error) {
          console.error('Error forcing chart initialization:', error);
        }
      }
      
      console.log('Chart fix completed');
    } catch (error) {
      console.error('Error fixing charts:', error);
    }
  }
  
  // Force initialization
  function forceInitialization() {
    console.log('Forcing application initialization...');
    
    try {
      // Reset initialization flags
      window.initialized = false;
      
      // Run initialization functions if available
      const initFunctions = [
        'init',
        'initialize',
        'initializeCharts',
        'initApp',
        'initializeApp',
        'setupCharts',
        'setupApp'
      ];
      
      // Try to call all potential initialization functions
      initFunctions.forEach(function(funcName) {
        if (typeof window[funcName] === 'function') {
          try {
            window[funcName]();
            console.log(`Called ${funcName}()`);
          } catch (error) {
            console.warn(`Error calling ${funcName}():`, error);
          }
        }
      });
      
      // Try to trigger DOMContentLoaded event
      try {
        const event = new Event('DOMContentLoaded');
        window.dispatchEvent(event);
        console.log('Triggered DOMContentLoaded event');
      } catch (error) {
        console.warn('Error triggering DOMContentLoaded event:', error);
      }
      
      // Fix charts after initialization
      setTimeout(fixAllCharts, 500);
      
      console.log('Initialization force completed');
    } catch (error) {
      console.error('Error forcing initialization:', error);
    }
  }
  
  // Download logs
  function downloadLogs() {
    try {
      // Create logs content
      const logs = window.debugLogs.map(function(log) {
        return `[${log.timestamp.toISOString()}] [${log.type.toUpperCase()}] ${log.message}${log.stack ? '\n' + log.stack : ''}`;
      }).join('\n\n');
      
      // Create blob
      const blob = new Blob([logs], { type: 'text/plain' });
      
      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `nac-designer-logs-${new Date().toISOString()}.txt`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Logs downloaded');
    } catch (error) {
      console.error('Error downloading logs:', error);
    }
  }
  
  // Create debug panel when DOM is loaded
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', createDebugPanel);
  } else {
    createDebugPanel();
  }
  
  console.log('Debug Interceptor installed');
})();
