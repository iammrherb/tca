/**
 * Debugging Helper
 * Provides tools for runtime debugging and error recovery
 */
class DebugHelper {
  constructor() {
    this.isDebugMode = window.location.search.includes('debug=true');
    this.errorCount = 0;
    this.initTime = Date.now();
    
    // Initialize error handling
    this.setupErrorHandling();
    
    if (this.isDebugMode) {
      this.createDebugPanel();
    }
    
    this.log('DebugHelper initialized');
  }
  
  /**
   * Setup global error handling
   */
  setupErrorHandling() {
    const self = this;
    
    // Capture global errors
    window.addEventListener('error', function(event) {
      self.errorCount++;
      self.logError('Global error', event.error || event.message);
      
      // Add to debug panel if it exists
      if (self.debugPanel) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'debug-error';
        errorDiv.innerHTML = `<strong>Error:</strong> ${event.message} <br>
                             <strong>File:</strong> ${event.filename} <br>
                             <strong>Line:</strong> ${event.lineno}:${event.colno}`;
        self.debugPanel.appendChild(errorDiv);
      }
      
      return false; // Allow default error handling
    });
    
    // Capture promise rejections
    window.addEventListener('unhandledrejection', function(event) {
      self.errorCount++;
      self.logError('Unhandled promise rejection', event.reason);
      
      // Add to debug panel if it exists
      if (self.debugPanel) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'debug-error';
        errorDiv.innerHTML = `<strong>Unhandled Promise Rejection:</strong> ${event.reason}`;
        self.debugPanel.appendChild(errorDiv);
      }
    });
  }
  
  /**
   * Log message to console
   * @param {string} message - Message to log
   * @param {any} data - Optional data to log
   */
  log(message, data) {
    if (!this.isDebugMode) return;
    
    const timestamp = ((Date.now() - this.initTime) / 1000).toFixed(2);
    
    if (data !== undefined) {
      console.log(`[DEBUG:${timestamp}] ${message}`, data);
    } else {
      console.log(`[DEBUG:${timestamp}] ${message}`);
    }
  }
  
  /**
   * Log error to console
   * @param {string} message - Error message
   * @param {Error} error - Error object
   */
  logError(message, error) {
    const timestamp = ((Date.now() - this.initTime) / 1000).toFixed(2);
    console.error(`[ERROR:${timestamp}] ${message}`, error);
  }
  
  /**
   * Create debug panel in UI
   */
  createDebugPanel() {
    // Create debug panel
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.className = 'debug-panel';
    debugPanel.innerHTML = `
      <div class="debug-header">
        <h3>Debug Panel</h3>
        <button id="debug-close">×</button>
      </div>
      <div class="debug-content">
        <div class="debug-info">
          <strong>Debug Mode:</strong> Active<br>
          <strong>Browser:</strong> ${navigator.userAgent}<br>
          <div id="debug-status">Loading...</div>
        </div>
        <div class="debug-actions">
          <button id="debug-check-scripts" class="btn btn-sm btn-outline">Check Scripts</button>
          <button id="debug-reload" class="btn btn-sm btn-outline">Reload Page</button>
          <button id="debug-toggle-charts" class="btn btn-sm btn-outline">Check Charts</button>
        </div>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .debug-panel {
        position: fixed;
        bottom: 0;
        right: 0;
        width: 400px;
        height: 300px;
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid #ddd;
        border-radius: 5px 0 0 0;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        z-index: 9999;
        display: flex;
        flex-direction: column;
      }
      .debug-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 10px;
        background: #f0f0f0;
        border-bottom: 1px solid #ddd;
      }
      .debug-header h3 {
        margin: 0;
        font-size: 14px;
      }
      .debug-header button {
        border: none;
        background: none;
        font-size: 18px;
        cursor: pointer;
      }
      .debug-content {
        flex: 1;
        padding: 10px;
        overflow-y: auto;
      }
      .debug-info {
        margin-bottom: 10px;
        font-size: 12px;
      }
      .debug-actions {
        display: flex;
        gap: 5px;
        margin-bottom: 10px;
      }
      .debug-error {
        margin: 5px 0;
        padding: 8px;
        background: #fff0f0;
        border-left: 3px solid #ff5555;
        font-size: 12px;
      }
      .btn-sm {
        font-size: 12px;
        padding: 3px 8px;
      }
    `;
    
    // Add to document
    document.head.appendChild(style);
    document.body.appendChild(debugPanel);
    this.debugPanel = debugPanel.querySelector('.debug-content');
    
    // Add close button handler
    document.getElementById('debug-close').addEventListener('click', function() {
      debugPanel.style.display = 'none';
    });
    
    // Add action button handlers
    document.getElementById('debug-check-scripts').addEventListener('click', () => {
      this._checkScripts();
    });
    
    document.getElementById('debug-reload').addEventListener('click', () => {
      window.location.reload();
    });
    
    document.getElementById('debug-toggle-charts').addEventListener('click', () => {
      this._checkCharts();
    });
    
    // Update status every 2 seconds
    setInterval(() => {
      const statusEl = document.getElementById('debug-status');
      if (statusEl) {
        statusEl.innerHTML = `
          <strong>Errors:</strong> ${this.errorCount}<br>
          <strong>Runtime:</strong> ${((Date.now() - this.initTime) / 1000).toFixed(1)}s<br>
          <strong>Memory:</strong> ${this._formatMemory(window.performance?.memory?.usedJSHeapSize || 0)}
        `;
      }
    }, 2000);
  }
  
  /**
   * Check scripts loading status
   */
  _checkScripts() {
    const scripts = [
      { name: 'Chart.js', check: () => typeof Chart !== 'undefined' },
      { name: 'Vendor Data', check: () => typeof window.vendorData !== 'undefined' },
      { name: 'Enhanced Calculator', check: () => typeof window.enhancedCalculator !== 'undefined' },
      { name: 'UI Controller', check: () => typeof EnhancedUIController !== 'undefined' },
      { name: 'Documentation', check: () => typeof window.nacDocumentation !== 'undefined' }
    ];
    
    let html = '<div class="debug-section"><h4>Script Status</h4><ul>';
    scripts.forEach(script => {
      try {
        const loaded = script.check();
        html += `<li class="${loaded ? 'success' : 'error'}">${script.name}: ${loaded ? 'Loaded' : 'Not Loaded'}</li>`;
      } catch (e) {
        html += `<li class="error">${script.name}: Error - ${e.message}</li>`;
      }
    });
    html += '</ul></div>';
    
    // Add to debug panel
    const debug = document.createElement('div');
    debug.innerHTML = html;
    this.debugPanel.appendChild(debug);
  }
  
  /**
   * Check charts initialization
   */
  _checkCharts() {
    const chartCanvases = document.querySelectorAll('canvas');
    
    let html = '<div class="debug-section"><h4>Chart Status</h4><ul>';
    
    if (chartCanvases.length === 0) {
      html += '<li class="warning">No chart canvases found on page</li>';
    } else {
      chartCanvases.forEach(canvas => {
        const chartInstance = typeof Chart !== 'undefined' && Chart.getChart ? Chart.getChart(canvas) : null;
        html += `<li class="${chartInstance ? 'success' : 'error'}">${canvas.id || 'Canvas'}: ${chartInstance ? 'Chart initialized' : 'No chart instance'}</li>`;
      });
    }
    html += '</ul></div>';
    
    // Add to debug panel
    const debug = document.createElement('div');
    debug.innerHTML = html;
    this.debugPanel.appendChild(debug);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .debug-section {
        margin-bottom: 15px;
        padding: 5px;
        background: #f5f5f5;
        border-radius: 3px;
      }
      .debug-section h4 {
        margin: 0 0 5px 0;
        font-size: 13px;
      }
      .debug-section ul {
        margin: 0;
        padding: 0 0 0 20px;
        font-size: 12px;
      }
      .success {
        color: #4caf50;
      }
      .error {
        color: #f44336;
      }
      .warning {
        color: #ff9800;
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * Format memory size
   * @param {number} bytes - Memory size in bytes
   * @returns {string} Formatted memory size
   */
  _formatMemory(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}

// Initialize debug helper
if (!window.debugHelper) {
  window.debugHelper = new DebugHelper();
}
