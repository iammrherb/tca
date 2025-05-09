/**
 * Improved cost configuration with detailed descriptions and dollar values
 */
(function() {
  console.log('Installing improved cost configuration...');
  
  // Function to create or update cost configuration section
  function setupCostConfiguration() {
    console.log('Setting up improved cost configuration...');
    
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
    
    // Create collapsible cost configuration section
    const costConfigSection = document.createElement('div');
    costConfigSection.id = 'cost-config-section';
    costConfigSection.className = 'cost-configuration-section';
    
    // Create content
    costConfigSection.innerHTML = `
      <div class="cost-config-header">
        <h5>Cost Configuration</h5>
        <button type="button" class="cost-config-toggle" aria-expanded="true" aria-controls="cost-config-content">
          <i class="fas fa-angle-up"></i>
        </button>
      </div>
      
      <div id="cost-config-content" class="cost-config-content">
        <p class="cost-config-description">
          Adjust cost multipliers and values to reflect your organization's specific circumstances.
          These settings affect all vendors proportionally unless otherwise specified.
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
              <option value="cisco">Cisco ISE</option>
              <option value="aruba">Aruba ClearPass</option>
              <option value="forescout">Forescout</option>
              <option value="nps">Microsoft NPS</option>
              <option value="fortinac">FortiNAC</option>
              <option value="securew2">SecureW2</option>
              <option value="portnox" selected>Portnox Cloud</option>
            </select>
          </div>
          
          <div class="vendor-cost-content" id="vendor-cost-portnox">
            <div class="cost-config-grid">
              <div class="cost-config-item">
                <label for="portnox-solution-cost">Solution Cost ($)</label>
                <input type="number" id="portnox-solution-cost" min="0" step="1000" value="20000">
                <p class="cost-help">Annual subscription cost for Portnox Cloud</p>
              </div>
              
              <div class="cost-config-item">
                <label for="portnox-implementation">Implementation ($)</label>
                <input type="number" id="portnox-implementation" min="0" step="1000" value="10000">
                <p class="cost-help">Implementation and setup costs</p>
              </div>
              
              <div class="cost-config-item">
                <label for="portnox-training">Training ($)</label>
                <input type="number" id="portnox-training" min="0" step="500" value="2500">
                <p class="cost-help">Training and onboarding costs</p>
              </div>
              
              <div class="cost-config-item">
                <label for="portnox-fte">Required FTEs</label>
                <input type="number" id="portnox-fte" min="0" step="0.1" value="0.5">
                <p class="cost-help">FTE resources required for administration</p>
              </div>
            </div>
          </div>
          
          <!-- Other vendor-specific sections would be dynamically shown/hidden -->
        </div>
      </div>
    `;
    
    // Add to advanced options panel
    advancedPanel.appendChild(costConfigSection);
    
    // Set up event listeners for collapse functionality
    const toggleBtn = costConfigSection.querySelector('.cost-config-toggle');
    const content = document.getElementById('cost-config-content');
    
    toggleBtn.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      
      if (expanded) {
        // Collapse
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
        this.querySelector('i').className = 'fas fa-angle-down';
      } else {
        // Expand
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
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
        
        // Update content height for animation
        content.style.maxHeight = content.scrollHeight + 'px';
      });
    });
    
    // Set up vendor selector for vendor-specific costs
    const vendorSelect = document.getElementById('vendor-cost-select');
    vendorSelect.addEventListener('change', function() {
      // Hide all vendor cost content
      const vendorContents = document.querySelectorAll('.vendor-cost-content');
      vendorContents.forEach(content => content.style.display = 'none');
      
      // Show selected vendor cost content
      const selectedVendor = this.value;
      const vendorContent = document.getElementById(`vendor-cost-${selectedVendor}`);
      
      if (vendorContent) {
        vendorContent.style.display = 'block';
      } else {
        // Create vendor-specific content if it doesn't exist
        const vendorContainer = document.getElementById('vendor-specific');
        const newVendorContent = document.createElement('div');
        newVendorContent.id = `vendor-cost-${selectedVendor}`;
        newVendorContent.className = 'vendor-cost-content';
        
        newVendorContent.innerHTML = `
          <div class="cost-config-grid">
            <div class="cost-config-item">
              <label for="${selectedVendor}-solution-cost">Solution Cost ($)</label>
              <input type="number" id="${selectedVendor}-solution-cost" min="0" step="1000" value="30000">
              <p class="cost-help">Annual costs for ${getVendorName(selectedVendor)}</p>
            </div>
            
            <div class="cost-config-item">
              <label for="${selectedVendor}-implementation">Implementation ($)</label>
              <input type="number" id="${selectedVendor}-implementation" min="0" step="1000" value="25000">
              <p class="cost-help">Implementation and setup costs</p>
            </div>
            
            <div class="cost-config-item">
              <label for="${selectedVendor}-training">Training ($)</label>
              <input type="number" id="${selectedVendor}-training" min="0" step="500" value="5000">
              <p class="cost-help">Training and onboarding costs</p>
            </div>
            
            <div class="cost-config-item">
              <label for="${selectedVendor}-fte">Required FTEs</label>
              <input type="number" id="${selectedVendor}-fte" min="0" step="0.1" value="1.0">
              <p class="cost-help">FTE resources required for administration</p>
            </div>
          </div>
        `;
        
        vendorContainer.appendChild(newVendorContent);
      }
      
      // Update content height for animation
      content.style.maxHeight = content.scrollHeight + 'px';
    });
    
    // Add event listeners to update calculator
    const allInputs = costConfigSection.querySelectorAll('input');
    allInputs.forEach(input => {
      input.addEventListener('change', function() {
        // Trigger calculator update if available
        if (window.calculator && typeof window.calculator.calculate === 'function') {
          window.calculator.calculate();
        }
      });
    });
    
    // Add styling
    addCostConfigStyles();
    
    console.log('Improved cost configuration set up successfully');
    return true;
  }
  
  // Add styles for cost configuration
  function addCostConfigStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .cost-configuration-section {
        margin-top: 15px;
        border-top: 1px solid #e0e0e0;
        padding-top: 15px;
      }
      
      .cost-config-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .cost-config-header h5 {
        margin: 0;
        color: #1B67B2;
        font-weight: 600;
      }
      
      .cost-config-toggle {
        background: none;
        border: none;
        color: #505050;
        cursor: pointer;
        font-size: 16px;
        padding: 5px;
      }
      
      .cost-config-content {
        overflow: hidden;
        max-height: 1000px;
        opacity: 1;
        transition: max-height 0.3s ease, opacity 0.3s ease;
      }
      
      .cost-config-description {
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 15px;
      }
      
      .cost-config-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
      }
      
      .cost-config-item label {
        display: block;
        font-weight: 500;
        margin-bottom: 5px;
      }
      
      .cost-config-item input {
        width: 100%;
        padding: 6px 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      
      .cost-help {
        font-size: 0.8rem;
        color: #777;
        margin-top: 5px;
        margin-bottom: 0;
      }
      
      .cost-config-tabs {
        display: flex;
        border-bottom: 1px solid #ddd;
        margin-bottom: 15px;
      }
      
      .cost-tab {
        padding: 8px 15px;
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        cursor: pointer;
        font-weight: 500;
      }
      
      .cost-tab.active {
        border-bottom-color: #1B67B2;
        color: #1B67B2;
      }
      
      .cost-tab-content {
        display: none;
      }
      
      .cost-tab-content.active {
        display: block;
      }
      
      .vendor-cost-selector {
        margin-bottom: 15px;
      }
      
      .vendor-cost-content {
        display: none;
      }
      
      #vendor-cost-portnox {
        display: block;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Helper function to get vendor name
  function getVendorName(vendorId) {
    const vendorNames = {
      cisco: 'Cisco ISE',
      aruba: 'Aruba ClearPass',
      forescout: 'Forescout',
      nps: 'Microsoft NPS',
      fortinac: 'FortiNAC',
      securew2: 'SecureW2',
      portnox: 'Portnox Cloud'
    };
    
    return vendorNames[vendorId] || vendorId;
  }
  
  // Initialize the cost configuration when the page loads and advanced options are toggled
  let initialized = false;
  
  function initialize() {
    if (!initialized) {
      const advancedPanel = document.getElementById('advanced-options-panel');
      if (advancedPanel && !advancedPanel.classList.contains('hidden')) {
        initialized = setupCostConfiguration();
      }
    }
  }
  
  // Set up event listener for advanced options toggle
  function setupAdvancedToggleListener() {
    const advancedToggle = document.querySelector('.advanced-options-toggle button');
    if (advancedToggle) {
      advancedToggle.addEventListener('click', function() {
        // Give the panel time to open
        setTimeout(initialize, 100);
      });
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initialize();
      setupAdvancedToggleListener();
    });
  } else {
    initialize();
    setupAdvancedToggleListener();
  }
  
  // Check periodically in case the app loads asynchronously
  const initInterval = setInterval(function() {
    initialize();
    
    // Add event listener to advanced toggle if not already done
    if (!document.querySelector('.advanced-options-toggle button._hasListener')) {
      setupAdvancedToggleListener();
    }
    
    // Stop checking if initialized
    if (initialized) {
      clearInterval(initInterval);
    }
  }, 1000);
  
  console.log('Cost configuration improvement module loaded');
})();
