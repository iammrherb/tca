/**
 * Enhanced Cost Configuration
 * Provides detailed dollar-value inputs, vendor-specific configurations, and enables real-time updating
 */
(function() {
  console.log('Installing Enhanced Cost Configuration...');
  
  // Fix PDF generator error for orgSize
  function fixPDFGeneratorError() {
    // Override generateCompleteReport function if it exists
    if (window.PDFReportGenerator && window.PDFReportGenerator.prototype.generateCompleteReport) {
      const originalGenerateCompleteReport = window.PDFReportGenerator.prototype.generateCompleteReport;
      
      window.PDFReportGenerator.prototype.generateCompleteReport = function(data) {
        // Make sure orgSize is defined if not in data
        if (!data.orgSize && this.organizationData) {
          data.orgSize = this.organizationData.size || 'medium';
        }
        
        // Also make sure it's applied to the PDF generator itself
        this.orgSize = data.orgSize || 'medium';
        
        return originalGenerateCompleteReport.call(this, data);
      };
      
      console.log('PDF Generator orgSize error fixed');
    }
  }
  
  // Create enhanced cost configuration
  function createEnhancedCostConfig() {
    // Find the advanced options panel
    const advancedPanel = document.getElementById('advanced-options-panel');
    if (!advancedPanel) {
      console.warn('Advanced options panel not found, will try again later');
      return false;
    }
    
    // Remove existing cost configuration if present
    const existingSection = document.getElementById('cost-config-section');
    if (existingSection) {
      existingSection.parentNode.removeChild(existingSection);
    }
    
    // Create enhanced cost configuration section
    const costConfigSection = document.createElement('div');
    costConfigSection.id = 'cost-config-section';
    costConfigSection.className = 'enhanced-cost-configuration';
    
    // Create content
    costConfigSection.innerHTML = `
      <div class="cost-config-header">
        <h5><i class="fas fa-dollar-sign"></i> Enhanced Cost Configuration</h5>
        <button type="button" class="cost-config-toggle" aria-expanded="false" aria-controls="cost-config-content">
          <i class="fas fa-angle-down"></i>
        </button>
      </div>
      
      <div id="cost-config-content" class="cost-config-content">
        <p class="cost-config-description">
          Configure detailed cost parameters to customize the TCO analysis with dollar values specific to your organization. All changes automatically update the calculations.
        </p>
        
        <div class="cost-config-tabs">
          <button class="cost-tab active" data-tab="general-costs">General Costs</button>
          <button class="cost-tab" data-tab="vendor-specific">Vendor-Specific</button>
        </div>
        
        <div class="cost-tab-content active" id="general-costs">
          <div class="cost-config-grid">
            <div class="cost-config-item">
              <label for="cost-hardware">Hardware Costs ($)</label>
              <input type="number" id="cost-hardware" min="0" step="1000" value="10000">
              <p class="cost-help">Base hardware cost for on-premises deployment</p>
            </div>
            
            <div class="cost-config-item">
              <label for="cost-licensing">Licensing Costs ($)</label>
              <input type="number" id="cost-licensing" min="0" step="1000" value="25000">
              <p class="cost-help">Annual licensing fees per vendor</p>
            </div>
            
            <div class="cost-config-item">
              <label for="cost-maintenance">Maintenance Costs ($)</label>
              <input type="number" id="cost-maintenance" min="0" step="1000" value="15000">
              <p class="cost-help">Annual maintenance and support costs</p>
            </div>
            
            <div class="cost-config-item">
              <label for="cost-implementation">Implementation ($)</label>
              <input type="number" id="cost-implementation" min="0" step="5000" value="30000">
              <p class="cost-help">Base implementation and professional services costs</p>
            </div>
            
            <div class="cost-config-item">
              <label for="cost-personnel">Personnel Costs ($)</label>
              <input type="number" id="cost-personnel" min="0" step="10000" value="100000">
              <p class="cost-help">Annual cost per full-time equivalent (FTE)</p>
            </div>
            
            <div class="cost-config-item">
              <label for="cost-downtime">Downtime Cost ($/hour)</label>
              <input type="number" id="cost-downtime" min="0" step="1000" value="5000">
              <p class="cost-help">Cost per hour of system downtime</p>
            </div>
          </div>
        </div>
        
        <div class="cost-tab-content" id="vendor-specific">
          <div class="vendor-cost-selector">
            <label for="vendor-cost-select">Select Vendor:</label>
            <select id="vendor-cost-select" class="form-select">
              <option value="portnox" selected>Portnox Cloud</option>
              <option value="cisco">Cisco ISE</option>
              <option value="aruba">Aruba ClearPass</option>
              <option value="forescout">Forescout</option>
              <option value="securew2">SecureW2</option>
            </select>
          </div>
          
          <div class="vendor-cost-content active" id="vendor-cost-portnox">
            <div class="cost-config-grid">
              <div class="cost-config-item">
                <div class="discount-label">
                  <label for="portnox-solution-cost">Solution Cost ($)</label>
                  <span class="discount-badge">25% Discount</span>
                </div>
                <input type="number" id="portnox-solution-cost" min="0" step="1000" value="20000">
                <p class="cost-help">Annual subscription cost for Portnox Cloud</p>
              </div>
              
              <div class="cost-config-item">
                <label for="portnox-implementation">Implementation ($)</label>
                <input type="number" id="portnox-implementation" min="0" step="1000" value="15000">
                <p class="cost-help">Implementation and setup costs</p>
              </div>
              
              <div class="cost-config-item">
                <label for="portnox-training">Training ($)</label>
                <input type="number" id="portnox-training" min="0" step="500" value="3500">
                <p class="cost-help">Training and onboarding costs</p>
              </div>
              
              <div class="cost-config-item">
                <label for="portnox-fte">Required FTEs</label>
                <input type="number" id="portnox-fte" min="0" step="0.1" value="0.5">
                <p class="cost-help">FTE resources required for administration</p>
              </div>
              
              <div class="cost-config-item">
                <label for="portnox-discount">Discount (%)</label>
                <input type="range" id="portnox-discount" min="0" max="40" step="5" value="25">
                <output for="portnox-discount" id="portnox-discount-value">25%</output>
                <p class="cost-help">Adjust Portnox discount percentage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add to advanced options panel
    advancedPanel.appendChild(costConfigSection);
    
    // Set up event listeners
    const toggleBtn = costConfigSection.querySelector('.cost-config-toggle');
    const content = document.getElementById('cost-config-content');
    
    toggleBtn.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      
      if (expanded) {
        // Collapse
        content.classList.remove('expanded');
        this.querySelector('i').className = 'fas fa-angle-down';
      } else {
        // Expand
        content.classList.add('expanded');
        this.querySelector('i').className = 'fas fa-angle-up';
      }
    });
    
    // Set up tab switching
    const tabs = costConfigSection.querySelectorAll('.cost-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Deactivate all tabs
        tabs.forEach(t => t.classList.remove('active'));
        
        // Activate clicked tab
        this.classList.add('active');
        
        // Hide all tab content
        const tabContents = costConfigSection.querySelectorAll('.cost-tab-content');
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Show selected tab content
        const selectedTab = this.getAttribute('data-tab');
        document.getElementById(selectedTab).classList.add('active');
      });
    });
    
    // Set up vendor selector
    const vendorSelect = document.getElementById('vendor-cost-select');
    if (vendorSelect) {
      vendorSelect.addEventListener('change', function() {
        // Hide all vendor cost content
        const vendorContents = document.querySelectorAll('.vendor-cost-content');
        vendorContents.forEach(content => content.classList.remove('active'));
        
        // Show selected vendor cost content
        const selectedVendor = this.value;
        const vendorContent = document.getElementById(`vendor-cost-${selectedVendor}`);
        
        if (vendorContent) {
          vendorContent.classList.add('active');
        } else {
          // Create vendor-specific content if it doesn't exist
          createVendorCostContent(selectedVendor);
        }
      });
    }
    
    // Set up discount slider
    const portnoxDiscountSlider = document.getElementById('portnox-discount');
    const portnoxDiscountValue = document.getElementById('portnox-discount-value');
    
    if (portnoxDiscountSlider && portnoxDiscountValue) {
      portnoxDiscountSlider.addEventListener('input', function() {
        portnoxDiscountValue.textContent = this.value + '%';
        // Trigger calculation update
        triggerCalculation();
      });
    }
    
    // Add event listeners to all inputs to update calculator
    const allInputs = costConfigSection.querySelectorAll('input');
    allInputs.forEach(input => {
      input.addEventListener('change', function() {
        triggerCalculation();
      });
      
      // For range inputs, also update on input event
      if (input.type === 'range') {
        input.addEventListener('input', function() {
          // This will be triggered more frequently during sliding
          // so we can update just the display value
          const outputId = input.getAttribute('id') + '-value';
          const output = document.getElementById(outputId);
          if (output) {
            output.textContent = input.value + '%';
          }
        });
      }
    });
    
    return true;
  }
  
  // Create vendor-specific cost content
  function createVendorCostContent(vendor) {
    const vendorContainer = document.getElementById('vendor-specific');
    if (!vendorContainer) return;
    
    // Get vendor defaults
    const defaults = {
      cisco: {
        solution: 40000,
        implementation: 35000,
        training: 7500,
        fte: 1.2,
        maxDiscount: 15
      },
      aruba: {
        solution: 38000,
        implementation: 32000,
        training: 7000,
        fte: 1.1,
        maxDiscount: 15
      },
      forescout: {
        solution: 42000,
        implementation: 34000,
        training: 8000,
        fte: 1.2,
        maxDiscount: 10
      },
      securew2: {
        solution: 28000,
        implementation: 20000,
        training: 5000,
        fte: 0.7,
        maxDiscount: 15
      },
      default: {
        solution: 30000,
        implementation: 25000,
        training: 6000,
        fte: 1.0,
        maxDiscount: 10
      }
    };
    
    const vendorDefaults = defaults[vendor] || defaults.default;
    
    // Get vendor name
    const vendorNames = {
      cisco: 'Cisco ISE',
      aruba: 'Aruba ClearPass',
      forescout: 'Forescout',
      nps: 'Microsoft NPS',
      fortinac: 'FortiNAC',
      securew2: 'SecureW2',
      portnox: 'Portnox Cloud'
    };
    
    const vendorName = vendorNames[vendor] || vendor;
    
    // Create new content
    const newContent = document.createElement('div');
    newContent.id = `vendor-cost-${vendor}`;
    newContent.className = 'vendor-cost-content active';
    
    newContent.innerHTML = `
      <div class="cost-config-grid">
        <div class="cost-config-item">
          <label for="${vendor}-solution-cost">Solution Cost ($)</label>
          <input type="number" id="${vendor}-solution-cost" min="0" step="1000" value="${vendorDefaults.solution}">
          <p class="cost-help">Annual costs for ${vendorName}</p>
        </div>
        
        <div class="cost-config-item">
          <label for="${vendor}-implementation">Implementation ($)</label>
          <input type="number" id="${vendor}-implementation" min="0" step="1000" value="${vendorDefaults.implementation}">
          <p class="cost-help">Implementation and setup costs</p>
        </div>
        
        <div class="cost-config-item">
          <label for="${vendor}-training">Training ($)</label>
          <input type="number" id="${vendor}-training" min="0" step="500" value="${vendorDefaults.training}">
          <p class="cost-help">Training and onboarding costs</p>
        </div>
        
        <div class="cost-config-item">
          <label for="${vendor}-fte">Required FTEs</label>
          <input type="number" id="${vendor}-fte" min="0" step="0.1" value="${vendorDefaults.fte}">
          <p class="cost-help">FTE resources required for administration</p>
        </div>
        
        <div class="cost-config-item">
          <label for="${vendor}-discount">Discount (%)</label>
          <input type="range" id="${vendor}-discount" min="0" max="${vendorDefaults.maxDiscount}" step="5" value="0">
          <output for="${vendor}-discount" id="${vendor}-discount-value">0%</output>
          <p class="cost-help">Adjust ${vendorName} discount percentage</p>
        </div>
      </div>
    `;
    
    // Hide all other vendor content
    const vendorContents = document.querySelectorAll('.vendor-cost-content');
    vendorContents.forEach(content => content.classList.remove('active'));
    
    // Add to container
    vendorContainer.appendChild(newContent);
    
    // Add event listeners
    const inputs = newContent.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('change', function() {
        triggerCalculation();
      });
      
      // For range inputs, also update on input event
      if (input.type === 'range') {
        input.addEventListener('input', function() {
          // This will be triggered more frequently during sliding
          // so we can update just the display value
          const outputId = input.getAttribute('id') + '-value';
          const output = document.getElementById(outputId);
          if (output) {
            output.textContent = input.value + '%';
          }
        });
      }
    });
    
    // Set up discount slider
    const discountSlider = document.getElementById(`${vendor}-discount`);
    const discountValue = document.getElementById(`${vendor}-discount-value`);
    
    if (discountSlider && discountValue) {
      discountSlider.addEventListener('input', function() {
        discountValue.textContent = this.value + '%';
      });
    }
  }
  
  // Trigger calculator to update
  function triggerCalculation() {
    // Check if calculator exists
    if (window.calculator && typeof window.calculator.calculate === 'function') {
      setTimeout(() => {
        console.log('Triggering calculation update from cost configuration');
        window.calculator.calculate();
      }, 100);
    }
  }
  
  // Initialize
  function init() {
    console.log('Initializing Enhanced Cost Configuration...');
    
    // Fix PDF error first
    fixPDFGeneratorError();
    
    // Check if we're on the main calculator page
    const advancedPanel = document.getElementById('advanced-options-panel');
    if (!advancedPanel) {
      console.log('Not on calculator page, skipping cost configuration enhancement');
      return;
    }
    
    // If advanced panel is already visible, create cost config now
    if (!advancedPanel.classList.contains('hidden')) {
      createEnhancedCostConfig();
    }
    
    // Setup monitoring for advanced panel display
    const advancedToggle = document.querySelector('.advanced-options-toggle button');
    if (advancedToggle) {
      advancedToggle.addEventListener('click', function() {
        // Wait for panel to open
        setTimeout(function() {
          const advancedPanel = document.getElementById('advanced-options-panel');
          if (advancedPanel && !advancedPanel.classList.contains('hidden')) {
            createEnhancedCostConfig();
          }
        }, 100);
      });
    }
    
    console.log('Enhanced Cost Configuration initialized');
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  console.log('Enhanced Cost Configuration setup complete');
})();
