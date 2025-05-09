/**
 * Cost Analysis Wizard
 * Creates a comprehensive wizard for cost analysis
 */
(function() {
  console.log('Installing Cost Analysis Wizard...');
  
  // Add wizard button to header
  function addWizardButton() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) {
      console.warn('Header actions container not found, cannot add wizard button');
      return false;
    }
    
    // Check if button already exists
    if (document.getElementById('cost-wizard-btn')) {
      return true;
    }
    
    const wizardButton = document.createElement('button');
    wizardButton.id = 'cost-wizard-btn';
    wizardButton.className = 'btn btn-primary btn-sm';
    wizardButton.innerHTML = '<i class="fas fa-magic"></i> Cost Analysis Wizard';
    wizardButton.addEventListener('click', openWizard);
    
    // Insert after save button
    const saveButton = document.getElementById('save-scenario-btn');
    if (saveButton) {
      saveButton.parentNode.insertBefore(wizardButton, saveButton.nextSibling);
    } else {
      headerActions.appendChild(wizardButton);
    }
    
    return true;
  }
  
  // Create wizard modal
  function createWizardModal() {
    // Check if modal already exists
    if (document.getElementById('cost-wizard-modal')) {
      return;
    }
    
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'cost-wizard-modal';
    modal.className = 'modal fade';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'cost-wizard-title');
    modal.setAttribute('aria-hidden', 'true');
    
    // Modal content
    modal.innerHTML = `
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="cost-wizard-title">
              <i class="fas fa-magic"></i> Cost Analysis Wizard
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="wizard-container">
              <!-- Wizard Steps -->
              <div class="wizard-steps">
                <div class="wizard-step active" data-step="1">
                  <div class="step-number">1</div>
                  <div class="step-text">Vendor Selection</div>
                </div>
                <div class="wizard-step" data-step="2">
                  <div class="step-number">2</div>
                  <div class="step-text">Industry & Compliance</div>
                </div>
                <div class="wizard-step" data-step="3">
                  <div class="step-number">3</div>
                  <div class="step-text">Organization Details</div>
                </div>
                <div class="wizard-step" data-step="4">
                  <div class="step-number">4</div>
                  <div class="step-text">Cost Configuration</div>
                </div>
                <div class="wizard-step" data-step="5">
                  <div class="step-number">5</div>
                  <div class="step-text">Results & Analysis</div>
                </div>
              </div>
              
              <!-- Step Content -->
              <div class="wizard-content">
                <!-- Step 1: Vendor Selection -->
                <div class="wizard-step-content active" data-step="1">
                  <h3>Select Your Current NAC Vendor</h3>
                  <p>Choose the vendor you're currently using or evaluating against Portnox Cloud.</p>
                  
                  <div class="wizard-vendor-grid">
                    <div class="wizard-vendor-card" data-vendor="cisco">
                      <img src="img/cisco-logo.png" alt="Cisco Logo">
                      <span>Cisco ISE</span>
                    </div>
                    <div class="wizard-vendor-card" data-vendor="aruba">
                      <img src="img/aruba-logo.png" alt="Aruba Logo">
                      <span>Aruba ClearPass</span>
                    </div>
                    <div class="wizard-vendor-card" data-vendor="forescout">
                      <img src="img/forescout-logo.png" alt="Forescout Logo">
                      <span>Forescout</span>
                    </div>
                    <div class="wizard-vendor-card" data-vendor="nps">
                      <img src="img/microsoft-logo.png" alt="Microsoft Logo">
                      <span>Microsoft NPS</span>
                    </div>
                    <div class="wizard-vendor-card" data-vendor="fortinac">
                      <img src="img/fortinac-logo.png" alt="FortiNAC Logo">
                      <span>FortiNAC</span>
                    </div>
                    <div class="wizard-vendor-card" data-vendor="securew2">
                      <img src="img/securew2-logo.png" alt="SecureW2 Logo">
                      <span>SecureW2</span>
                    </div>
                  </div>
                </div>
                
                <!-- Step 2: Industry & Compliance -->
                <div class="wizard-step-content" data-step="2">
                  <h3>Select Your Industry</h3>
                  <p>Choose your industry to apply industry-specific insights and compliance requirements.</p>
                  
                  <div class="wizard-industry-select">
                    <select id="wizard-industry-selector" class="form-select">
                      <option value="none">Select an industry...</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="financial">Financial Services</option>
                      <option value="education">Education</option>
                      <option value="government">Government</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="retail">Retail</option>
                    </select>
                  </div>
                  
                  <div id="wizard-compliance-preview" class="wizard-compliance-preview hidden">
                    <h4>Compliance Requirements</h4>
                    <div class="compliance-content"></div>
                  </div>
                </div>
                
                <!-- Step 3: Organization Details -->
                <div class="wizard-step-content" data-step="3">
                  <h3>Organization Details</h3>
                  <p>Provide details about your organization to customize the cost analysis.</p>
                  
                  <div class="wizard-form-grid">
                    <div class="wizard-form-group">
                      <label for="wizard-device-count">Device Count</label>
                      <input type="number" id="wizard-device-count" class="form-control" value="1000" min="1" max="1000000">
                      <div class="form-text">Total number of devices requiring network access control</div>
                    </div>
                    
                    <div class="wizard-form-group">
                      <label for="wizard-organization-size">Organization Size</label>
                      <select id="wizard-organization-size" class="form-select">
                        <option value="small">Small (Up to 1,000 devices)</option>
                        <option value="medium" selected>Medium (1,000 - 5,000 devices)</option>
                        <option value="large">Large (5,000+ devices)</option>
                      </select>
                      <div class="form-text">Size of your organization</div>
                    </div>
                    
                    <div class="wizard-form-group">
                      <label for="wizard-years-to-project">Years to Project</label>
                      <input type="number" id="wizard-years-to-project" class="form-control" value="3" min="1" max="10">
                      <div class="form-text">Number of years to project costs and savings</div>
                    </div>
                    
                    <div class="wizard-form-group">
                      <div class="form-check">
                        <input type="checkbox" id="wizard-multiple-locations" class="form-check-input">
                        <label for="wizard-multiple-locations" class="form-check-label">Multiple Locations</label>
                      </div>
                      <div id="wizard-location-count-container" class="hidden">
                        <label for="wizard-location-count">Number of Locations</label>
                        <input type="number" id="wizard-location-count" class="form-control" value="2" min="2" max="1000">
                      </div>
                    </div>
                    
                    <div class="wizard-form-group">
                      <div class="form-check">
                        <input type="checkbox" id="wizard-complex-authentication" class="form-check-input">
                        <label for="wizard-complex-authentication" class="form-check-label">Complex Authentication</label>
                      </div>
                      <div class="form-text">Using advanced authentication methods or multiple authentication factors</div>
                    </div>
                    
                    <div class="wizard-form-group">
                      <div class="form-check">
                        <input type="checkbox" id="wizard-legacy-devices" class="form-check-input">
                        <label for="wizard-legacy-devices" class="form-check-label">Legacy Devices</label>
                      </div>
                      <div id="wizard-legacy-percentage-container" class="hidden">
                        <label for="wizard-legacy-percentage">Legacy Device Percentage</label>
                        <input type="range" id="wizard-legacy-percentage" class="form-range" min="0" max="100" value="10">
                        <span id="wizard-legacy-percentage-value">10%</span>
                      </div>
                    </div>
                    
                    <div class="wizard-form-group">
                      <div class="form-check">
                        <input type="checkbox" id="wizard-cloud-integration" class="form-check-input">
                        <label for="wizard-cloud-integration" class="form-check-label">Cloud Integration</label>
                      </div>
                      <div class="form-text">Integration with cloud services or identity providers</div>
                    </div>
                  </div>
                </div>
                
                <!-- Step 4: Cost Configuration -->
                <div class="wizard-step-content" data-step="4">
                  <h3>Enhanced Cost Configuration</h3>
                  <p>Configure detailed cost parameters to customize the TCO analysis with dollar values specific to your organization.</p>
                  
                  <div class="wizard-template-buttons">
                    <button class="template-button active" data-template="default">Default</button>
                    <button class="template-button" data-template="healthcare">Healthcare</button>
                    <button class="template-button" data-template="financial">Financial</button>
                    <button class="template-button" data-template="education">Education</button>
                    <button class="template-button" data-template="government">Government</button>
                    <button class="template-button" data-template="manufacturing">Manufacturing</button>
                  </div>
                  
                  <div class="wizard-tabs">
                    <button class="wizard-tab active" data-tab="general-costs">General Costs</button>
                    <button class="wizard-tab" data-tab="vendor-specific">Vendor-Specific</button>
                  </div>
                  
                  <div class="wizard-tab-content active" id="wizard-general-costs">
                    <div class="wizard-cost-grid">
                      <div class="wizard-cost-item">
                        <label for="wizard-cost-hardware">Hardware Costs ($)</label>
                        <input type="number" id="wizard-cost-hardware" min="0" step="1000" value="10000" class="form-control">
                        <p class="wizard-cost-help">Base hardware cost for on-premises deployment</p>
                        <button type="button" class="wizard-cost-details-toggle" data-cost="hardwareCost">
                          <i class="fas fa-info-circle"></i> Show more details
                        </button>
                        <div class="wizard-cost-details" id="wizard-details-hardwareCost">
                          <p>On-premises NAC solutions typically require dedicated hardware appliances and servers. Cloud solutions eliminate most hardware requirements.</p>
                          <div class="wizard-cost-impact">Impact: High for on-prem, Low for cloud</div>
                          <ul class="wizard-cost-examples">
                            <li>Cisco ISE: Dedicated appliances at each major network site</li>
                            <li>Aruba ClearPass: Physical or virtual appliances</li>
                            <li>Portnox Cloud: No hardware required except for optional on-prem connectors</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div class="wizard-cost-item">
                        <label for="wizard-cost-licensing">Licensing Costs ($)</label>
                        <input type="number" id="wizard-cost-licensing" min="0" step="1000" value="25000" class="form-control">
                        <p class="wizard-cost-help">Annual licensing fees per vendor</p>
                        <button type="button" class="wizard-cost-details-toggle" data-cost="licensingCost">
                          <i class="fas fa-info-circle"></i> Show more details
                        </button>
                        <div class="wizard-cost-details" id="wizard-details-licensingCost">
                          <p>Traditional NAC has perpetual licenses plus maintenance, while cloud solutions use subscription model.</p>
                          <div class="wizard-cost-impact">Impact: High</div>
                          <ul class="wizard-cost-examples">
                            <li>Per-device licensing: $20-50 per device annually</li>
                            <li>Per-user licensing: $5-15 per user monthly</li>
                            <li>Enterprise tiers based on total device count</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div class="wizard-cost-item">
                        <label for="wizard-cost-maintenance">Maintenance Costs ($)</label>
                        <input type="number" id="wizard-cost-maintenance" min="0" step="1000" value="15000" class="form-control">
                        <p class="wizard-cost-help">Annual maintenance and support costs</p>
                        <button type="button" class="wizard-cost-details-toggle" data-cost="maintenanceCost">
                          <i class="fas fa-info-circle"></i> Show more details
                        </button>
                        <div class="wizard-cost-details" id="wizard-details-maintenanceCost">
                          <p>On-premises solutions require dedicated IT staff time for patching, updates, and troubleshooting. Cloud solutions include maintenance in subscription fee.</p>
                          <div class="wizard-cost-impact">Impact: Medium-High for on-prem, Low for cloud</div>
                          <ul class="wizard-cost-examples">
                            <li>Support contracts: 15-25% of initial license cost annually</li>
                            <li>System updates and patches: IT staff time</li>
                            <li>Hardware replacement/upgrades: Every 3-5 years</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div class="wizard-cost-item">
                        <label for="wizard-cost-implementation">Implementation ($)</label>
                        <input type="number" id="wizard-cost-implementation" min="0" step="5000" value="30000" class="form-control">
                        <p class="wizard-cost-help">Base implementation and professional services costs</p>
                        <button type="button" class="wizard-cost-details-toggle" data-cost="implementationCost">
                          <i class="fas fa-info-circle"></i> Show more details
                        </button>
                        <div class="wizard-cost-details" id="wizard-details-implementationCost">
                          <p>Traditional NAC deployments often require professional services and can take months. Cloud solutions have simpler deployment models.</p>
                          <div class="wizard-cost-impact">Impact: High for initial deployment</div>
                          <ul class="wizard-cost-examples">
                            <li>Professional services: $150-250/hour</li>
                            <li>Project timeline: 30-120 days depending on complexity</li>
                            <li>Implementation costs typically 1-2x licensing costs for on-prem solutions</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div class="wizard-cost-item">
                        <label for="wizard-cost-personnel">Personnel Costs ($)</label>
                        <input type="number" id="wizard-cost-personnel" min="0" step="10000" value="100000" class="form-control">
                        <p class="wizard-cost-help">Annual cost per full-time equivalent (FTE)</p>
                        <button type="button" class="wizard-cost-details-toggle" data-cost="personnelCost">
                          <i class="fas fa-info-circle"></i> Show more details
                        </button>
                        <div class="wizard-cost-details" id="wizard-details-personnelCost">
                          <p>On-premises solutions require dedicated personnel for daily operations, while cloud solutions reduce this burden significantly.</p>
                          <div class="wizard-cost-impact">Impact: Very High for on-prem, Low-Medium for cloud</div>
                          <ul class="wizard-cost-examples">
                            <li>Dedicated NAC administrator: 0.5-2 FTEs depending on organization size</li>
                            <li>Average FTE cost: $80,000-120,000 annually plus benefits</li>
                            <li>Cloud solutions typically reduce personnel requirements by 50-70%</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div class="wizard-cost-item">
                        <label for="wizard-cost-downtime">Downtime Cost ($/hour)</label>
                        <input type="number" id="wizard-cost-downtime" min="0" step="1000" value="5000" class="form-control">
                        <p class="wizard-cost-help">Cost per hour of system downtime</p>
                        <button type="button" class="wizard-cost-details-toggle" data-cost="downtimeCost">
                          <i class="fas fa-info-circle"></i> Show more details
                        </button>
                        <div class="wizard-cost-details" id="wizard-details-downtimeCost">
                          <p>Includes lost productivity, potential security incidents, and business impact during outages.</p>
                          <div class="wizard-cost-impact">Impact: High for critical environments</div>
                          <ul class="wizard-cost-examples">
                            <li>Healthcare: $5,000-15,000/hour</li>
                            <li>Financial services: $7,500-25,000/hour</li>
                            <li>Manufacturing: $5,000-10,000/hour</li>
                            <li>Education: $2,500-5,000/hour</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="wizard-tab-content" id="wizard-vendor-specific">
                    <div class="wizard-vendor-cost-selector">
                      <label for="wizard-vendor-cost-select">Select Vendor:</label>
                      <select id="wizard-vendor-cost-select" class="form-select">
                        <option value="cisco">Cisco ISE</option>
                        <option value="aruba">Aruba ClearPass</option>
                        <option value="forescout">Forescout</option>
                        <option value="nps">Microsoft NPS</option>
                        <option value="fortinac">FortiNAC</option>
                        <option value="securew2">SecureW2</option>
                        <option value="portnox" selected>Portnox Cloud</option>
                      </select>
                    </div>
                    
                    <div class="wizard-vendor-cost-content active" id="wizard-vendor-cost-portnox">
                      <div class="wizard-cost-grid">
                        <div class="wizard-cost-item">
                          <div class="wizard-discount-label">
                            <label for="wizard-portnox-solution-cost">Solution Cost ($)</label>
                            <span class="wizard-discount-badge">25% Discount</span>
                          </div>
                          <input type="number" id="wizard-portnox-solution-cost" min="0" step="1000" value="20000" class="form-control">
                          <p class="wizard-cost-help">Annual subscription cost for Portnox Cloud</p>
                        </div>
                        
                        <div class="wizard-cost-item">
                          <label for="wizard-portnox-implementation">Implementation ($)</label>
                          <input type="number" id="wizard-portnox-implementation" min="0" step="1000" value="15000" class="form-control">
                          <p class="wizard-cost-help">Implementation and setup costs</p>
                        </div>
                        
                        <div class="wizard-cost-item">
                          <label for="wizard-portnox-training">Training ($)</label>
                          <input type="number" id="wizard-portnox-training" min="0" step="500" value="3500" class="form-control">
                          <p class="wizard-cost-help">Training and onboarding costs</p>
                        </div>
                        
                        <div class="wizard-cost-item">
                          <label for="wizard-portnox-fte">Required FTEs</label>
                          <input type="number" id="wizard-portnox-fte" min="0" step="0.1" value="0.5" class="form-control">
                          <p class="wizard-cost-help">FTE resources required for administration</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Step 5: Results & Analysis -->
                <div class="wizard-step-content" data-step="5">
                  <h3>Cost Analysis Results</h3>
                  <div class="wizard-results-summary">
                    <div class="wizard-results-metrics">
                      <div class="wizard-metric-card">
                        <div class="wizard-metric-label">Total Cost Savings</div>
                        <div class="wizard-metric-value" id="wizard-savings-value">$0</div>
                        <div class="wizard-metric-percentage" id="wizard-savings-percentage">0%</div>
                      </div>
                      
                      <div class="wizard-metric-card">
                        <div class="wizard-metric-label">ROI Period</div>
                        <div class="wizard-metric-value" id="wizard-roi-period">0 months</div>
                      </div>
                      
                      <div class="wizard-metric-card">
                        <div class="wizard-metric-label">Implementation Time Saved</div>
                        <div class="wizard-metric-value" id="wizard-time-saved">0 days</div>
                        <div class="wizard-metric-percentage" id="wizard-time-saved-percentage">0%</div>
                      </div>
                      
                      <div class="wizard-metric-card">
                        <div class="wizard-metric-label">3-Year TCO</div>
                        <div class="wizard-metric-value" id="wizard-tco-value">$0</div>
                        <div class="wizard-metric-percentage" id="wizard-tco-percentage">0%</div>
                      </div>
                    </div>
                    
                    <div class="wizard-chart-container">
                      <h4>TCO Comparison</h4>
                      <canvas id="wizard-tco-chart"></canvas>
                    </div>
                    
                    <div class="wizard-results-buttons">
                      <button id="wizard-apply-btn" class="btn btn-primary">
                        <i class="fas fa-check"></i> Apply These Settings
                      </button>
                      <button id="wizard-export-btn" class="btn btn-outline-primary">
                        <i class="fas fa-file-export"></i> Export Results
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Wizard Navigation -->
              <div class="wizard-navigation">
                <button id="wizard-prev-btn" class="btn btn-outline-primary" disabled>
                  <i class="fas fa-chevron-left"></i> Previous
                </button>
                <div class="wizard-step-indicator">
                  Step <span id="wizard-current-step">1</span> of 5
                </div>
                <button id="wizard-next-btn" class="btn btn-primary">
                  Next <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    setupWizardEventListeners();
  }
  
  // Open wizard modal
  function openWizard() {
    // Create modal if it doesn't exist
    if (!document.getElementById('cost-wizard-modal')) {
      createWizardModal();
    }
    
    // Show modal using Bootstrap
    const modal = document.getElementById('cost-wizard-modal');
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // Initialize wizard with current calculator values
    initializeWizardValues();
  }
  
  // Set up event listeners for wizard
  function setupWizardEventListeners() {
    // Navigation buttons
    const prevBtn = document.getElementById('wizard-prev-btn');
    const nextBtn = document.getElementById('wizard-next-btn');
    const currentStepDisplay = document.getElementById('wizard-current-step');
    
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', navigateWizard.bind(null, 'prev'));
      nextBtn.addEventListener('click', navigateWizard.bind(null, 'next'));
    }
    
    // Vendor selection
    const vendorCards = document.querySelectorAll('.wizard-vendor-card');
    vendorCards.forEach(card => {
      card.addEventListener('click', function() {
        vendorCards.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        
        const vendor = this.getAttribute('data-vendor');
        document.getElementById('wizard-vendor-cost-select').value = vendor;
        updateVendorCostContent(vendor);
      });
    });
    
    // Industry selector
    const industrySelector = document.getElementById('wizard-industry-selector');
    if (industrySelector) {
      industrySelector.addEventListener('change', updateCompliancePreview);
    }
    
    // Multiple locations checkbox
    const multipleLocations = document.getElementById('wizard-multiple-locations');
    if (multipleLocations) {
      multipleLocations.addEventListener('change', function() {
        const locationCountContainer = document.getElementById('wizard-location-count-container');
        if (locationCountContainer) {
          locationCountContainer.classList.toggle('hidden', !this.checked);
        }
      });
    }
    
    // Legacy devices checkbox
    const legacyDevices = document.getElementById('wizard-legacy-devices');
    if (legacyDevices) {
      legacyDevices.addEventListener('change', function() {
        const legacyPercentageContainer = document.getElementById('wizard-legacy-percentage-container');
        if (legacyPercentageContainer) {
          legacyPercentageContainer.classList.toggle('hidden', !this.checked);
        }
      });
    }
    
    // Legacy percentage slider
    const legacyPercentage = document.getElementById('wizard-legacy-percentage');
    const legacyPercentageValue = document.getElementById('wizard-legacy-percentage-value');
    if (legacyPercentage && legacyPercentageValue) {
      legacyPercentage.addEventListener('input', function() {
        legacyPercentageValue.textContent = this.value + '%';
      });
    }
    
    // Cost tabs
    const costTabs = document.querySelectorAll('.wizard-tab');
    costTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        costTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const tabId = this.getAttribute('data-tab');
        document.querySelectorAll('.wizard-tab-content').forEach(content => {
          content.classList.toggle('active', content.id === 'wizard-' + tabId);
        });
      });
    });
    
    // Cost detail toggles
    const costDetailToggles = document.querySelectorAll('.wizard-cost-details-toggle');
    costDetailToggles.forEach(toggle => {
      toggle.addEventListener('click', function() {
        const costType = this.getAttribute('data-cost');
        const detailsElement = document.getElementById('wizard-details-' + costType);
        
        if (detailsElement) {
          detailsElement.classList.toggle('visible');
          
          if (detailsElement.classList.contains('visible')) {
            this.innerHTML = '<i class="fas fa-info-circle"></i> Hide details';
          } else {
            this.innerHTML = '<i class="fas fa-info-circle"></i> Show more details';
          }
        }
      });
    });
    
    // Vendor cost selector
    const vendorCostSelect = document.getElementById('wizard-vendor-cost-select');
    if (vendorCostSelect) {
      vendorCostSelect.addEventListener('change', function() {
        updateVendorCostContent(this.value);
      });
    }
    
    // Template buttons
    const templateButtons = document.querySelectorAll('.template-button');
    templateButtons.forEach(button => {
      button.addEventListener('click', function() {
        templateButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const template = this.getAttribute('data-template');
        applyTemplate(template);
      });
    });
    
    // Apply button
    const applyBtn = document.getElementById('wizard-apply-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', applyWizardValues);
    }
    
    // Export button
    const exportBtn = document.getElementById('wizard-export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportWizardResults);
    }
  }
  
  // Navigate between wizard steps
  function navigateWizard(direction) {
    const steps = document.querySelectorAll('.wizard-step');
    const contents = document.querySelectorAll('.wizard-step-content');
    const prevBtn = document.getElementById('wizard-prev-btn');
    const nextBtn = document.getElementById('wizard-next-btn');
    const currentStepDisplay = document.getElementById('wizard-current-step');
    
    // Find current step
    let currentStep = 1;
    steps.forEach((step, index) => {
      if (step.classList.contains('active')) {
        currentStep = parseInt(step.getAttribute('data-step'));
      }
    });
    
    // Calculate new step
    let newStep = currentStep;
    if (direction === 'next' && currentStep < steps.length) {
      newStep = currentStep + 1;
    } else if (direction === 'prev' && currentStep > 1) {
      newStep = currentStep - 1;
    }
    
    // Update step UI
    steps.forEach(step => {
      const stepNum = parseInt(step.getAttribute('data-step'));
      step.classList.toggle('active', stepNum === newStep);
      step.classList.toggle('completed', stepNum < newStep);
    });
    
    contents.forEach(content => {
      const contentStep = parseInt(content.getAttribute('data-step'));
      content.classList.toggle('active', contentStep === newStep);
    });
    
    // Update navigation buttons
    prevBtn.disabled = newStep === 1;
    nextBtn.textContent = newStep === steps.length ? 'Finish' : 'Next ';
    if (newStep === steps.length) {
      nextBtn.innerHTML = 'Finish <i class="fas fa-check"></i>';
    } else {
      nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
    }
    
    // Update step indicator
    if (currentStepDisplay) {
      currentStepDisplay.textContent = newStep;
    }
    
    // If navigating to results step, calculate and update results
    if (newStep === 5) {
      calculateWizardResults();
    }
  }
  
  // Update compliance preview based on selected industry
  function updateCompliancePreview() {
    const industry = document.getElementById('wizard-industry-selector').value;
    const compliancePreview = document.getElementById('wizard-compliance-preview');
    const complianceContent = compliancePreview.querySelector('.compliance-content');
    
    if (industry === 'none' || !window.industryTemplates || !window.industryTemplates[industry]) {
      compliancePreview.classList.add('hidden');
      return;
    }
    
    const industryData = window.industryTemplates[industry];
    const complianceInfo = industryData.complianceInfo;
    
    if (!complianceInfo) {
      compliancePreview.classList.add('hidden');
      return;
    }
    
    complianceContent.innerHTML = `
      <p>${complianceInfo.details}</p>
      <h5>Key Requirements</h5>
      <ul class="compliance-requirements">
        ${(complianceInfo.keyRequirements || []).map(req => `<li>${req}</li>`).join('')}
      </ul>
    `;
    
    compliancePreview.classList.remove('hidden');
  }
  
  // Update vendor-specific cost content
  function updateVendorCostContent(vendor) {
    // Hide all vendor content
    document.querySelectorAll('.wizard-vendor-cost-content').forEach(content => {
      content.classList.remove('active');
    });
    
    // Show selected vendor content
    const vendorContent = document.getElementById(`wizard-vendor-cost-${vendor}`);
    if (vendorContent) {
      vendorContent.classList.add('active');
    } else {
      // Create vendor-specific content if it doesn't exist
      createVendorCostContent(vendor);
    }
  }
  
  // Create vendor-specific cost content
  function createVendorCostContent(vendor) {
    const vendorContainer = document.getElementById('wizard-vendor-specific');
    if (!vendorContainer) return;
    
    // Vendor-specific default costs
    const vendorDefaults = {
      cisco: {
        solutionCost: 40000,
        implementationCost: 35000,
        trainingCost: 7500,
        fteCost: 1.2,
        discount: 0
      },
      aruba: {
        solutionCost: 38000,
        implementationCost: 32000,
        trainingCost: 7000,
        fteCost: 1.1,
        discount: 0
      },
      forescout: {
        solutionCost: 42000,
        implementationCost: 34000,
        trainingCost: 8000,
        fteCost: 1.2,
        discount: 0
      },
      nps: {
        solutionCost: 15000,
        implementationCost: 25000,
        trainingCost: 6000,
        fteCost: 0.9,
        discount: 0
      },
      fortinac: {
        solutionCost: 36000,
        implementationCost: 30000,
        trainingCost: 7000,
        fteCost: 1.0,
        discount: 0
      },
      securew2: {
        solutionCost: 28000,
        implementationCost: 20000,
        trainingCost: 5000,
        fteCost: 0.8,
        discount: 0
      },
      portnox: {
        solutionCost: 20000,
        implementationCost: 15000,
        trainingCost: 3500,
        fteCost: 0.5,
        discount: 25
      }
    };
    
    // Get vendor defaults
    const defaults = vendorDefaults[vendor] || {
      solutionCost: 30000,
      implementationCost: 25000,
      trainingCost: 5000,
      fteCost: 1.0,
      discount: 0
    };
    
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
    newContent.id = `wizard-vendor-cost-${vendor}`;
    newContent.className = 'wizard-vendor-cost-content active';
    
    // Create discount badge if applicable
    const discountBadge = defaults.discount > 0 ? 
      `<span class="wizard-discount-badge">${defaults.discount}% Discount</span>` : '';
    
    newContent.innerHTML = `
      <div class="wizard-cost-grid">
        <div class="wizard-cost-item">
          <div class="wizard-discount-label">
            <label for="wizard-${vendor}-solution-cost">Solution Cost ($)</label>
            ${discountBadge}
          </div>
          <input type="number" id="wizard-${vendor}-solution-cost" min="0" step="1000" value="${defaults.solutionCost}" class="form-control">
          <p class="wizard-cost-help">Annual costs for ${vendorName}</p>
        </div>
        
        <div class="wizard-cost-item">
          <label for="wizard-${vendor}-implementation">Implementation ($)</label>
          <input type="number" id="wizard-${vendor}-implementation" min="0" step="1000" value="${defaults.implementationCost}" class="form-control">
          <p class="wizard-cost-help">Implementation and setup costs</p>
        </div>
        
        <div class="wizard-cost-item">
          <label for="wizard-${vendor}-training">Training ($)</label>
          <input type="number" id="wizard-${vendor}-training" min="0" step="500" value="${defaults.trainingCost}" class="form-control">
          <p class="wizard-cost-help">Training and onboarding costs</p>
        </div>
        
        <div class="wizard-cost-item">
          <label for="wizard-${vendor}-fte">Required FTEs</label>
          <input type="number" id="wizard-${vendor}-fte" min="0" step="0.1" value="${defaults.fteCost}" class="form-control">
          <p class="wizard-cost-help">FTE resources required for administration</p>
        </div>
      </div>
    `;
    
    // Hide all vendor content
    document.querySelectorAll('.wizard-vendor-cost-content').forEach(content => {
      content.classList.remove('active');
    });
    
    // Add to container
    vendorContainer.appendChild(newContent);
  }
  
  // Apply template to cost inputs
  function applyTemplate(template) {
    // Industry-specific default costs
    const industryDefaults = {
      healthcare: {
        hardwareCost: 12000,
        licensingCost: 30000,
        maintenanceCost: 18000,
        implementationCost: 35000,
        downtimeCost: 7500,
        personnelCost: 120000
      },
      financial: {
        hardwareCost: 15000,
        licensingCost: 40000,
        maintenanceCost: 25000,
        implementationCost: 45000,
        downtimeCost: 9000,
        personnelCost: 135000
      },
      education: {
        hardwareCost: 8000,
        licensingCost: 22000,
        maintenanceCost: 12000,
        implementationCost: 25000,
        downtimeCost: 3500,
        personnelCost: 90000
      },
      government: {
        hardwareCost: 10000,
        licensingCost: 35000,
        maintenanceCost: 20000,
        implementationCost: 40000,
        downtimeCost: 6000,
        personnelCost: 110000
      },
      manufacturing: {
        hardwareCost: 14000,
        licensingCost: 28000,
        maintenanceCost: 16000,
        implementationCost: 32000,
        downtimeCost: 8000,
        personnelCost: 105000
      },
      default: {
        hardwareCost: 10000,
        licensingCost: 25000,
        maintenanceCost: 15000,
        implementationCost: 30000,
        downtimeCost: 5000,
        personnelCost: 100000
      }
    };
    
    // Get template defaults
    const defaults = industryDefaults[template] || industryDefaults.default;
    
    // Apply to form inputs
    document.getElementById('wizard-cost-hardware').value = defaults.hardwareCost;
    document.getElementById('wizard-cost-licensing').value = defaults.licensingCost;
    document.getElementById('wizard-cost-maintenance').value = defaults.maintenanceCost;
    document.getElementById('wizard-cost-implementation').value = defaults.implementationCost;
    document.getElementById('wizard-cost-personnel').value = defaults.personnelCost;
    document.getElementById('wizard-cost-downtime').value = defaults.downtimeCost;
    
    // Update industry selector if template is industry-specific
    if (template !== 'default' && document.getElementById('wizard-industry-selector')) {
      document.getElementById('wizard-industry-selector').value = template;
      updateCompliancePreview();
    }
  }
  
  // Initialize wizard with current calculator values
  function initializeWizardValues() {
    // Get active vendor
    const activeVendor = window.calculator && window.calculator.activeVendor ? 
      window.calculator.activeVendor.toLowerCase() : 'cisco';
    
    // Set active vendor card
    document.querySelectorAll('.wizard-vendor-card').forEach(card => {
      card.classList.toggle('active', card.getAttribute('data-vendor') === activeVendor);
    });
    
    // Set vendor cost selector
    if (document.getElementById('wizard-vendor-cost-select')) {
      document.getElementById('wizard-vendor-cost-select').value = activeVendor;
      updateVendorCostContent(activeVendor);
    }
    
    // Set organization details
    if (window.calculator && window.calculator.data) {
      const data = window.calculator.data;
      
      // Device count
      if (document.getElementById('wizard-device-count') && data.deviceCount) {
        document.getElementById('wizard-device-count').value = data.deviceCount;
      }
      
      // Organization size
      if (document.getElementById('wizard-organization-size') && data.organizationSize) {
        document.getElementById('wizard-organization-size').value = data.organizationSize;
      }
      
      // Years to project
      if (document.getElementById('wizard-years-to-project') && data.yearsToProject) {
        document.getElementById('wizard-years-to-project').value = data.yearsToProject;
      }
      
      // Multiple locations
      if (document.getElementById('wizard-multiple-locations') && data.multipleLocations) {
        document.getElementById('wizard-multiple-locations').checked = data.multipleLocations;
        
        if (document.getElementById('wizard-location-count-container')) {
          document.getElementById('wizard-location-count-container').classList.toggle('hidden', !data.multipleLocations);
        }
        
        if (document.getElementById('wizard-location-count') && data.locationCount) {
          document.getElementById('wizard-location-count').value = data.locationCount;
        }
      }
      
      // Complex authentication
      if (document.getElementById('wizard-complex-authentication') && data.complexAuthentication) {
        document.getElementById('wizard-complex-authentication').checked = data.complexAuthentication;
      }
      
      // Legacy devices
      if (document.getElementById('wizard-legacy-devices') && data.legacyDevices) {
        document.getElementById('wizard-legacy-devices').checked = data.legacyDevices;
        
        if (document.getElementById('wizard-legacy-percentage-container')) {
          document.getElementById('wizard-legacy-percentage-container').classList.toggle('hidden', !data.legacyDevices);
        }
        
        if (document.getElementById('wizard-legacy-percentage') && data.legacyPercentage) {
          document.getElementById('wizard-legacy-percentage').value = data.legacyPercentage;
          
          if (document.getElementById('wizard-legacy-percentage-value')) {
            document.getElementById('wizard-legacy-percentage-value').textContent = data.legacyPercentage + '%';
          }
        }
      }
      
      // Cloud integration
      if (document.getElementById('wizard-cloud-integration') && data.cloudIntegration) {
        document.getElementById('wizard-cloud-integration').checked = data.cloudIntegration;
      }
      
      // Cost configuration
      if (data.costConfig) {
        if (document.getElementById('wizard-cost-hardware') && data.costConfig.hardwareCost) {
          document.getElementById('wizard-cost-hardware').value = data.costConfig.hardwareCost;
        }
        
        if (document.getElementById('wizard-cost-licensing') && data.costConfig.licensingCost) {
          document.getElementById('wizard-cost-licensing').value = data.costConfig.licensingCost;
        }
        
        if (document.getElementById('wizard-cost-maintenance') && data.costConfig.maintenanceCost) {
          document.getElementById('wizard-cost-maintenance').value = data.costConfig.maintenanceCost;
        }
        
        if (document.getElementById('wizard-cost-implementation') && data.costConfig.implementationCost) {
          document.getElementById('wizard-cost-implementation').value = data.costConfig.implementationCost;
        }
        
        if (document.getElementById('wizard-cost-personnel') && data.costConfig.personnelCost) {
          document.getElementById('wizard-cost-personnel').value = data.costConfig.personnelCost;
        }
        
        if (document.getElementById('wizard-cost-downtime') && data.costConfig.downtimeCost) {
          document.getElementById('wizard-cost-downtime').value = data.costConfig.downtimeCost;
        }
      }
    }
  }
  
  // Calculate wizard results
  function calculateWizardResults() {
    // Get values from wizard inputs
    const values = getWizardValues();
    
    // Calculate TCO for selected vendor vs Portnox
    const yearsToProject = parseInt(values.yearsToProject) || 3;
    
    // Selected vendor costs
    const vendorInitialCosts = values.competitorHardwareCost + values.competitorImplementationCost + values.competitorTrainingCost;
    const vendorAnnualCosts = values.competitorSoftwareCost + values.competitorMaintenanceCost + (values.competitorFteCost * values.personnelCost);
    const vendorTotalCost = vendorInitialCosts + (vendorAnnualCosts * yearsToProject);
    
    // Portnox costs
    const portnoxInitialCosts = values.portnoxImplementationCost + values.portnoxTrainingCost;
    const portnoxAnnualCosts = values.portnoxSolutionCost + (values.portnoxFteCost * values.personnelCost);
    const portnoxTotalCost = portnoxInitialCosts + (portnoxAnnualCosts * yearsToProject);
    
    // Calculate savings
    const totalSavings = vendorTotalCost - portnoxTotalCost;
    const savingsPercentage = (totalSavings / vendorTotalCost) * 100;
    
    // Calculate ROI period (in months)
    const monthlySavings = (vendorAnnualCosts - portnoxAnnualCosts) / 12;
    const roiPeriod = monthlySavings > 0 ? 
      Math.ceil((portnoxInitialCosts - vendorInitialCosts) / monthlySavings) : 0;
    
    // Calculate implementation time saved
    const vendorImplementationTime = getVendorImplementationTime(values.vendor);
    const portnoxImplementationTime = 14; // Portnox average implementation time in days
    const implementationTimeSaved = vendorImplementationTime - portnoxImplementationTime;
    const implementationTimePercentage = (implementationTimeSaved / vendorImplementationTime) * 100;
    
    // Update result displays
    if (document.getElementById('wizard-savings-value')) {
      document.getElementById('wizard-savings-value').textContent = '$' + totalSavings.toLocaleString();
    }
    
    if (document.getElementById('wizard-savings-percentage')) {
      document.getElementById('wizard-savings-percentage').textContent = Math.round(savingsPercentage) + '% less';
    }
    
    if (document.getElementById('wizard-roi-period')) {
      document.getElementById('wizard-roi-period').textContent = 
        roiPeriod <= 0 ? 'Immediate' : 
        roiPeriod + ' month' + (roiPeriod !== 1 ? 's' : '');
    }
    
    if (document.getElementById('wizard-time-saved')) {
      document.getElementById('wizard-time-saved').textContent = implementationTimeSaved + ' days';
    }
    
    if (document.getElementById('wizard-time-saved-percentage')) {
      document.getElementById('wizard-time-saved-percentage').textContent = Math.round(implementationTimePercentage) + '% faster';
    }
    
    if (document.getElementById('wizard-tco-value')) {
      document.getElementById('wizard-tco-value').textContent = '$' + portnoxTotalCost.toLocaleString();
    }
    
    if (document.getElementById('wizard-tco-percentage')) {
      document.getElementById('wizard-tco-percentage').textContent = 'vs $' + vendorTotalCost.toLocaleString();
    }
    
    // Create TCO chart
    createTCOChart(values.vendor, portnoxTotalCost, vendorTotalCost, yearsToProject);
  }
  
  // Create TCO comparison chart
  function createTCOChart(vendor, portnoxTotalCost, vendorTotalCost, yearsToProject) {
    const canvas = document.getElementById('wizard-tco-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
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
    
    // Clear existing chart
    if (window.wizardTCOChart) {
      window.wizardTCOChart.destroy();
    }
    
    // Create new chart
    window.wizardTCOChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Portnox Cloud', vendorName],
        datasets: [{
          label: `${yearsToProject}-Year TCO`,
          data: [portnoxTotalCost, vendorTotalCost],
          backgroundColor: ['#65BD44', '#1B67B2'],
          borderColor: ['#65BD44', '#1B67B2'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return '$' + context.raw.toLocaleString();
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
  }
  
  // Get all values from wizard inputs
  function getWizardValues() {
    // Get selected vendor
    const vendorCards = document.querySelectorAll('.wizard-vendor-card');
    let selectedVendor = 'cisco';
    vendorCards.forEach(card => {
      if (card.classList.contains('active')) {
        selectedVendor = card.getAttribute('data-vendor');
      }
    });
    
    // Base costs
    const hardwareCost = parseInt(document.getElementById('wizard-cost-hardware').value) || 10000;
    const licensingCost = parseInt(document.getElementById('wizard-cost-licensing').value) || 25000;
    const maintenanceCost = parseInt(document.getElementById('wizard-cost-maintenance').value) || 15000;
    const implementationCost = parseInt(document.getElementById('wizard-cost-implementation').value) || 30000;
    const personnelCost = parseInt(document.getElementById('wizard-cost-personnel').value) || 100000;
    const downtimeCost = parseInt(document.getElementById('wizard-cost-downtime').value) || 5000;
    
    // Organization details
    const deviceCount = parseInt(document.getElementById('wizard-device-count').value) || 1000;
    const organizationSize = document.getElementById('wizard-organization-size').value || 'medium';
    const yearsToProject = parseInt(document.getElementById('wizard-years-to-project').value) || 3;
    const multipleLocations = document.getElementById('wizard-multiple-locations').checked;
    const locationCount = parseInt(document.getElementById('wizard-location-count').value) || 2;
    const complexAuthentication = document.getElementById('wizard-complex-authentication').checked;
    const legacyDevices = document.getElementById('wizard-legacy-devices').checked;
    const legacyPercentage = parseInt(document.getElementById('wizard-legacy-percentage').value) || 10;
    const cloudIntegration = document.getElementById('wizard-cloud-integration').checked;
    
    // Get vendor-specific costs
    const competitorCostInputs = {
      solutionCost: document.getElementById(`wizard-${selectedVendor}-solution-cost`),
      implementationCost: document.getElementById(`wizard-${selectedVendor}-implementation`),
      trainingCost: document.getElementById(`wizard-${selectedVendor}-training`),
      fteCost: document.getElementById(`wizard-${selectedVendor}-fte`)
    };
    
    const competitorSolutionCost = competitorCostInputs.solutionCost ? 
      parseInt(competitorCostInputs.solutionCost.value) || 0 : 
      getDefaultVendorCost(selectedVendor, 'solutionCost');
    
    const competitorImplementationCost = competitorCostInputs.implementationCost ? 
      parseInt(competitorCostInputs.implementationCost.value) || 0 : 
      getDefaultVendorCost(selectedVendor, 'implementationCost');
    
    const competitorTrainingCost = competitorCostInputs.trainingCost ? 
      parseInt(competitorCostInputs.trainingCost.value) || 0 : 
      getDefaultVendorCost(selectedVendor, 'trainingCost');
    
    const competitorFteCost = competitorCostInputs.fteCost ? 
      parseFloat(competitorCostInputs.fteCost.value) || 0 : 
      getDefaultVendorCost(selectedVendor, 'fteCost');
    
    // Get Portnox costs
    const portnoxCostInputs = {
      solutionCost: document.getElementById('wizard-portnox-solution-cost'),
      implementationCost: document.getElementById('wizard-portnox-implementation'),
      trainingCost: document.getElementById('wizard-portnox-training'),
      fteCost: document.getElementById('wizard-portnox-fte')
    };
    
    const portnoxSolutionCost = portnoxCostInputs.solutionCost ? 
      parseInt(portnoxCostInputs.solutionCost.value) || 0 : 20000;
    
    const portnoxImplementationCost = portnoxCostInputs.implementationCost ? 
      parseInt(portnoxCostInputs.implementationCost.value) || 0 : 15000;
    
    const portnoxTrainingCost = portnoxCostInputs.trainingCost ? 
      parseInt(portnoxCostInputs.trainingCost.value) || 0 : 3500;
    
    const portnoxFteCost = portnoxCostInputs.fteCost ? 
      parseFloat(portnoxCostInputs.fteCost.value) || 0 : 0.5;
    
    // Calculate competitor hardware cost based on organization details
    let competitorHardwareCost = hardwareCost;
    if (multipleLocations) {
      competitorHardwareCost = hardwareCost * locationCount * 0.75; // Discount for scale
    }
    
    // Scale hardware cost by device count
    const deviceScale = deviceCount / 1000;
    competitorHardwareCost = Math.round(competitorHardwareCost * Math.sqrt(deviceScale));
    
    // Return all values
    return {
      vendor: selectedVendor,
      hardwareCost,
      licensingCost,
      maintenanceCost,
      implementationCost,
      personnelCost,
      downtimeCost,
      deviceCount,
      organizationSize,
      yearsToProject,
      multipleLocations,
      locationCount,
      complexAuthentication,
      legacyDevices,
      legacyPercentage,
      cloudIntegration,
      competitorHardwareCost,
      competitorSoftwareCost: competitorSolutionCost,
      competitorImplementationCost,
      competitorMaintenanceCost: maintenanceCost,
      competitorTrainingCost,
      competitorFteCost,
      portnoxSolutionCost,
      portnoxImplementationCost,
      portnoxTrainingCost,
      portnoxFteCost
    };
  }
  
  // Get default vendor cost value
  function getDefaultVendorCost(vendor, costType) {
    const vendorDefaults = {
      cisco: {
        solutionCost: 40000,
        implementationCost: 35000,
        trainingCost: 7500,
        fteCost: 1.2
      },
      aruba: {
        solutionCost: 38000,
        implementationCost: 32000,
        trainingCost: 7000,
        fteCost: 1.1
      },
      forescout: {
        solutionCost: 42000,
        implementationCost: 34000,
        trainingCost: 8000,
        fteCost: 1.2
      },
      nps: {
        solutionCost: 15000,
        implementationCost: 25000,
        trainingCost: 6000,
        fteCost: 0.9
      },
      fortinac: {
        solutionCost: 36000,
        implementationCost: 30000,
        trainingCost: 7000,
        fteCost: 1.0
      },
      securew2: {
        solutionCost: 28000,
        implementationCost: 20000,
        trainingCost: 5000,
        fteCost: 0.8
      },
      portnox: {
        solutionCost: 20000,
        implementationCost: 15000,
        trainingCost: 3500,
        fteCost: 0.5
      }
    };
    
    return (vendorDefaults[vendor] && vendorDefaults[vendor][costType]) || 0;
  }
  
  // Get vendor implementation time in days
  function getVendorImplementationTime(vendor) {
    const implementationTimes = {
      cisco: 90,
      aruba: 75,
      forescout: 80,
      nps: 60,
      fortinac: 70,
      securew2: 30,
      portnox: 14
    };
    
    return implementationTimes[vendor] || 60;
  }
  
  // Apply wizard values to calculator and run calculation
  function applyWizardValues() {
    const values = getWizardValues();
    
    // Update calculator settings
    if (window.calculator) {
      // Set active vendor
      if (window.calculator.setVendor && values.vendor) {
        window.calculator.setVendor(values.vendor);
      }
      
      // Update organization details
      if (window.calculator.data) {
        window.calculator.data.deviceCount = values.deviceCount;
        window.calculator.data.organizationSize = values.organizationSize;
        window.calculator.data.yearsToProject = values.yearsToProject;
        window.calculator.data.multipleLocations = values.multipleLocations;
        window.calculator.data.locationCount = values.locationCount;
        window.calculator.data.complexAuthentication = values.complexAuthentication;
        window.calculator.data.legacyDevices = values.legacyDevices;
        window.calculator.data.legacyPercentage = values.legacyPercentage;
        window.calculator.data.cloudIntegration = values.cloudIntegration;
        
        // Update cost configuration
        if (!window.calculator.data.costConfig) {
          window.calculator.data.costConfig = {};
        }
        
        window.calculator.data.costConfig.hardwareCost = values.hardwareCost;
        window.calculator.data.costConfig.licensingCost = values.licensingCost;
        window.calculator.data.costConfig.maintenanceCost = values.maintenanceCost;
        window.calculator.data.costConfig.implementationCost = values.implementationCost;
        window.calculator.data.costConfig.personnelCost = values.personnelCost;
        window.calculator.data.costConfig.downtimeCost = values.downtimeCost;
        
        // Update UI elements to match
        if (document.getElementById('device-count')) {
          document.getElementById('device-count').value = values.deviceCount;
        }
        
        if (document.getElementById('organization-size')) {
          document.getElementById('organization-size').value = values.organizationSize;
        }
        
        if (document.getElementById('years-to-project')) {
          document.getElementById('years-to-project').value = values.yearsToProject;
        }
        
        if (document.getElementById('multiple-locations')) {
          document.getElementById('multiple-locations').checked = values.multipleLocations;
        }
        
        if (document.getElementById('location-count')) {
          document.getElementById('location-count').value = values.locationCount;
        }
        
        if (document.getElementById('complex-authentication')) {
          document.getElementById('complex-authentication').checked = values.complexAuthentication;
        }
        
        if (document.getElementById('legacy-devices')) {
          document.getElementById('legacy-devices').checked = values.legacyDevices;
        }
        
        if (document.getElementById('legacy-percentage')) {
          document.getElementById('legacy-percentage').value = values.legacyPercentage;
        }
        
        if (document.getElementById('cloud-integration')) {
          document.getElementById('cloud-integration').checked = values.cloudIntegration;
        }
        
        // Run calculation
        window.calculator.calculate();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('cost-wizard-modal'));
        if (modal) {
          modal.hide();
        }
      }
    }
  }
  
  // Export wizard results
  function exportWizardResults() {
    // Redirect to built-in export functionality
    if (document.getElementById('export-pdf-btn')) {
      document.getElementById('export-pdf-btn').click();
    }
  }
  
  // Add CSS for wizard
  function addWizardStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #cost-wizard-btn {
        margin-right: 10px;
      }
      
      .wizard-container {
        display: flex;
        flex-direction: column;
      }
      
      .wizard-steps {
        display: flex;
        margin-bottom: 20px;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 15px;
      }
      
      .wizard-step {
        flex: 1;
        text-align: center;
        position: relative;
        padding: 0 10px;
        opacity: 0.6;
      }
      
      .wizard-step.active {
        opacity: 1;
      }
      
      .wizard-step.completed {
        opacity: 0.8;
      }
      
      .wizard-step.completed .step-number {
        background-color: #65BD44;
      }
      
      .wizard-step:not(:last-child)::after {
        content: '';
        position: absolute;
        top: 15px;
        right: 0;
        width: calc(100% - 60px);
        height: 2px;
        background-color: #e0e0e0;
        z-index: 0;
      }
      
      .step-number {
        background-color: #1B67B2;
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 10px;
        font-weight: bold;
        position: relative;
        z-index: 1;
      }
      
      .step-text {
        font-size: 14px;
        font-weight: 500;
      }
      
      .wizard-content {
        margin-bottom: 20px;
        min-height: 400px;
      }
      
      .wizard-step-content {
        display: none;
      }
      
      .wizard-step-content.active {
        display: block;
        animation: fadeIn 0.3s ease-in-out;
      }
      
      .wizard-navigation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #e0e0e0;
      }
      
      .wizard-step-indicator {
        font-size: 14px;
        color: #505050;
      }
      
      .wizard-vendor-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      
      .wizard-vendor-card {
        background-color: #f8f9fa;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 15px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .wizard-vendor-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      
      .wizard-vendor-card.active {
        border-color: #1B67B2;
        background-color: rgba(27, 103, 178, 0.05);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      
      .wizard-vendor-card img {
        height: 40px;
        object-fit: contain;
        margin-bottom: 10px;
      }
      
      .wizard-industry-select {
        margin-top: 20px;
        max-width: 400px;
      }
      
      .wizard-compliance-preview {
        margin-top: 20px;
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 15px;
        border-left: 4px solid #1B67B2;
      }
      
      .wizard-compliance-preview.hidden {
        display: none;
      }
      
      .wizard-form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      
      .wizard-form-group {
        margin-bottom: 15px;
      }
      
      .wizard-template-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
      }
      
      .template-button {
        background: #f8f9fa;
        border: 1px solid #ddd;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s ease;
      }
      
      .template-button:hover {
        background: #e9ecef;
      }
      
      .template-button.active {
        background: #1B67B2;
        color: white;
        border-color: #1B67B2;
      }
      
      .wizard-tabs {
        display: flex;
        border-bottom: 1px solid #ddd;
        margin-bottom: 20px;
      }
      
      .wizard-tab {
        padding: 8px 15px;
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        cursor: pointer;
        font-weight: 500;
        color: #505050;
      }
      
      .wizard-tab.active {
        border-bottom-color: #1B67B2;
        color: #1B67B2;
      }
      
      .wizard-tab-content {
        display: none;
      }
      
      .wizard-tab-content.active {
        display: block;
      }
      
      .wizard-cost-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }
      
      .wizard-cost-item {
        margin-bottom: 20px;
      }
      
      .wizard-cost-help {
        font-size: 12px;
        color: #707070;
        margin-top: 5px;
        margin-bottom: 0;
      }
      
      .wizard-cost-details-toggle {
        background: none;
        border: none;
        color: #1B67B2;
        cursor: pointer;
        font-size: 12px;
        padding: 0;
        margin-top: 5px;
        display: block;
        text-align: left;
      }
      
      .wizard-cost-details {
        display: none;
        background: #f8f9fa;
        border-radius: 4px;
        padding: 10px;
        margin-top: 10px;
        font-size: 12px;
      }
      
      .wizard-cost-details.visible {
        display: block;
        animation: fadeIn 0.3s ease-out;
      }
      
      .wizard-cost-impact {
        font-weight: 600;
        margin-top: 5px;
        color: #303030;
      }
      
      .wizard-cost-examples {
        margin-top: 10px;
        padding-left: 15px;
      }
      
      .wizard-cost-examples li {
        margin-bottom: 3px;
      }
      
      .wizard-vendor-cost-selector {
        margin-bottom: 20px;
      }
      
      .wizard-vendor-cost-content {
        display: none;
      }
      
      .wizard-vendor-cost-content.active {
        display: block;
      }
      
      .wizard-discount-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .wizard-discount-badge {
        background: #2BD25B;
        color: white;
        border-radius: 4px;
        padding: 2px 6px;
        font-size: 11px;
        font-weight: 600;
      }
      
      .wizard-results-summary {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      
      .wizard-results-metrics {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
        margin-bottom: 10px;
      }
      
      .wizard-metric-card {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 15px;
        text-align: center;
      }
      
      .wizard-metric-label {
        font-size: 14px;
        color: #505050;
        margin-bottom: 5px;
      }
      
      .wizard-metric-value {
        font-size: 24px;
        font-weight: 600;
        color: #1B67B2;
      }
      
      .wizard-metric-percentage {
        font-size: 14px;
        color: #65BD44;
        font-weight: 500;
      }
      
      .wizard-chart-container {
        background-color: white;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        height: 300px;
      }
      
      .wizard-results-buttons {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 10px;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .hidden {
        display: none !important;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Initialize wizard
  function init() {
    console.log('Initializing Cost Analysis Wizard...');
    
    // Add wizard button to header
    if (!addWizardButton()) {
      console.warn('Could not add wizard button, will try again when DOM is ready');
      
      // Try again when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
      }
    }
    
    // Add wizard styles
    addWizardStyles();
    
    console.log('Cost Analysis Wizard initialized successfully');
  }
  
  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
