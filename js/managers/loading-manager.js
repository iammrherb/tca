/**
 * Enhanced loading indicator management with progress support
 */
class LoadingManager {
  constructor() {
    this.activeLoaders = new Map();
    this.defaultText = 'Loading...';
    this.progressTimers = new Map();
    this.globalLoader = null;
  }
  
  // Show loading indicator in a container
  show(containerId, text = this.defaultText, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    
    // Check if already has a loader
    if (this.activeLoaders.has(containerId)) {
      const existingLoader = this.activeLoaders.get(containerId);
      this.updateText(containerId, text);
      return existingLoader;
    }
    
    // Set default options
    const defaultOptions = {
      showSpinner: true,
      showProgress: false,
      color: null,
      overlay: true
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    // Create loading indicator
    const loader = document.createElement('div');
    loader.className = 'loading-indicator';
    
    if (!mergedOptions.overlay) {
      loader.classList.add('no-overlay');
    }
    
    if (mergedOptions.color) {
      loader.style.setProperty('--loader-color', mergedOptions.color);
    }
    
    // Add aria attributes
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-busy', 'true');
    loader.setAttribute('aria-live', 'polite');
    
    // Create spinner
    if (mergedOptions.showSpinner) {
      const spinner = document.createElement('div');
      spinner.className = 'spinner';
      loader.appendChild(spinner);
    }
    
    // Create progress bar if requested
    if (mergedOptions.showProgress) {
      const progressContainer = document.createElement('div');
      progressContainer.className = 'progress-container';
      
      const progressBar = document.createElement('div');
      progressBar.className = 'progress-bar';
      
      const progressFill = document.createElement('div');
      progressFill.className = 'progress-fill';
      progressFill.style.width = '0%';
      
      progressBar.appendChild(progressFill);
      progressContainer.appendChild(progressBar);
      loader.appendChild(progressContainer);
    }
    
    // Create text
    const textElement = document.createElement('div');
    textElement.className = 'loading-text';
    textElement.textContent = text;
    loader.appendChild(textElement);
    
    // Add to container
    container.appendChild(loader);
    
    // Set container position relative if not already
    const containerPosition = window.getComputedStyle(container).position;
    if (containerPosition === 'static') {
      container.style.position = 'relative';
    }
    
    // Store reference
    this.activeLoaders.set(containerId, loader);
    
    return loader;
  }
  
  // Show global loading indicator
  showGlobal(text = 'Processing...') {
    if (this.globalLoader) {
      this.updateGlobalText(text);
      return this.globalLoader;
    }
    
    // Create global loader
    const loader = document.createElement('div');
    loader.className = 'global-loading-indicator';
    
    // Add aria attributes
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-busy', 'true');
    loader.setAttribute('aria-live', 'polite');
    
    // Create spinner container
    const spinnerContainer = document.createElement('div');
    spinnerContainer.className = 'global-spinner-container';
    
    // Create spinner
    const spinner = document.createElement('div');
    spinner.className = 'global-spinner';
    spinnerContainer.appendChild(spinner);
    
    // Create text
    const textElement = document.createElement('div');
    textElement.className = 'global-loading-text';
    textElement.textContent = text;
    
    // Assemble
    loader.appendChild(spinnerContainer);
    loader.appendChild(textElement);
    
    // Add to document
    document.body.appendChild(loader);
    
    // Store reference
    this.globalLoader = loader;
    
    // Add show class to trigger animation
    setTimeout(() => {
      loader.classList.add('show');
    }, 10);
    
    return loader;
  }
  
  // Hide global loading indicator
  hideGlobal() {
    if (!this.globalLoader) return;
    
    this.globalLoader.classList.remove('show');
    
    setTimeout(() => {
      if (this.globalLoader && this.globalLoader.parentNode) {
        this.globalLoader.parentNode.removeChild(this.globalLoader);
      }
      this.globalLoader = null;
    }, 300);
  }
  
  // Update global loading text
  updateGlobalText(text) {
    if (!this.globalLoader) return;
    
    const textElement = this.globalLoader.querySelector('.global-loading-text');
    if (textElement) {
      textElement.textContent = text;
    }
  }
  
  // Update loading text
  updateText(containerId, text) {
    const loader = this.activeLoaders.get(containerId);
    if (!loader) return;
    
    const textElement = loader.querySelector('.loading-text');
    if (textElement) {
      textElement.textContent = text;
    }
  }
  
  // Update progress bar
  updateProgress(containerId, percentage) {
    const loader = this.activeLoaders.get(containerId);
    if (!loader) return;
    
    const progressFill = loader.querySelector('.progress-fill');
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
  }
  
  // Start automatic progress simulation
  startProgressSimulation(containerId, duration = 5000, finalValue = 90) {
    if (this.progressTimers.has(containerId)) {
      clearInterval(this.progressTimers.get(containerId));
    }
    
    // Reset progress
    this.updateProgress(containerId, 0);
    
    // Number of steps
    const steps = 20;
    const interval = duration / steps;
    
    // Use easeInOutQuad for more natural progress
    const easeInOutQuad = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      
      if (currentStep > steps) {
        clearInterval(timer);
        return;
      }
      
      const progress = easeInOutQuad(currentStep / steps) * finalValue;
      this.updateProgress(containerId, progress);
    }, interval);
    
    this.progressTimers.set(containerId, timer);
  }
  
  // Complete progress to 100%
  completeProgress(containerId) {
    if (this.progressTimers.has(containerId)) {
      clearInterval(this.progressTimers.get(containerId));
      this.progressTimers.delete(containerId);
    }
    
    this.updateProgress(containerId, 100);
    
    // Delay hiding to let the user see the completed progress
    setTimeout(() => {
      this.hide(containerId);
    }, 500);
  }
  
  // Hide loading indicator
  hide(containerId) {
    const loader = this.activeLoaders.get(containerId);
    if (!loader || !loader.parentNode) return;
    
    // Stop any active progress simulation
    if (this.progressTimers.has(containerId)) {
      clearInterval(this.progressTimers.get(containerId));
      this.progressTimers.delete(containerId);
    }
    
    // Add fade-out class
    loader.classList.add('fade-out');
    
    // Remove loader after animation
    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
      this.activeLoaders.delete(containerId);
    }, 300);
  }
  
  // Hide all loading indicators
  hideAll() {
    this.activeLoaders.forEach((loader, containerId) => {
      this.hide(containerId);
    });
    
    // Also hide global loader if active
    this.hideGlobal();
  }
}
