/**
 * Simple DOM cache to improve performance
 */
class DOMCache {
  constructor() {
    this.elements = {};
    this.initialized = false;
  }
  
  init() {
    if (this.initialized) return;
    
    // Set initialized flag FIRST to prevent recursion
    this.initialized = true;
    
    // Cache frequently accessed elements
    this.cacheElement('device-count');
    this.cacheElement('organization-size');
    this.cacheElement('years-to-project');
    this.cacheElement('multiple-locations');
    this.cacheElement('location-count');
    this.cacheElement('complex-authentication');
    this.cacheElement('legacy-devices');
    this.cacheElement('legacy-percentage');
    this.cacheElement('cloud-integration');
    this.cacheElement('custom-policies');
    this.cacheElement('policy-complexity');
    this.cacheElement('calculate-btn');
    this.cacheElement('results-container');
    this.cacheElement('tco-summary-table-body');
    this.cacheElement('annual-costs-table-body');
    this.cacheElement('implementation-table-body');
    this.cacheElement('portnox-savings-amount');
    this.cacheElement('portnox-savings-percentage');
    this.cacheElement('portnox-implementation-time');
    this.cacheElement('comparison-savings');
    this.cacheElement('comparison-implementation');
    this.cacheElement('legacy-percentage-value');
    
    // Cache vendor cards
    document.querySelectorAll('.vendor-card').forEach(card => {
      const vendor = card.getAttribute('data-vendor');
      if (vendor) {
        this.elements[`vendor-card-${vendor}`] = card;
      }
    });
    
    // Setup range input display AFTER all elements are cached
    this.setupRangeValueDisplay();
  }
  
  // Separated the setup function from init to avoid recursion
  setupRangeValueDisplay() {
    const rangeInput = document.getElementById('legacy-percentage');
    const valueDisplay = document.getElementById('legacy-percentage-value');
    
    if (rangeInput && valueDisplay) {
      // Set initial value
      valueDisplay.textContent = rangeInput.value + '%';
      
      // Update value on input
      rangeInput.addEventListener('input', () => {
        valueDisplay.textContent = rangeInput.value + '%';
      });
    }
  }
  
  cacheElement(id) {
    const element = document.getElementById(id);
    if (element) {
      this.elements[id] = element;
    }
  }
  
  get(id) {
    // If not initialized, initialize first
    if (!this.initialized) {
      this.init();
    }
    
    // Return cached element if available
    if (this.elements[id]) {
      return this.elements[id];
    }
    
    // If not cached, try to get and cache it
    this.cacheElement(id);
    return this.elements[id];
  }
  
  // Helper methods for common operations
  getInputValue(id) {
    const element = this.get(id);
    if (!element) return null;
    
    if (element.type === 'checkbox') {
      return element.checked;
    } else if (element.type === 'number') {
      return parseFloat(element.value) || 0;
    } else {
      return element.value;
    }
  }
  
  setInputValue(id, value) {
    const element = this.get(id);
    if (!element) return;
    
    if (element.type === 'checkbox') {
      element.checked = Boolean(value);
    } else {
      element.value = value;
    }
  }
}
