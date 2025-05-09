/**
 * Improved TCO Analyzer Fix
 * Fixes wizard, charts, PDF generation and adds industry recommendations
 */
(function() {
  console.log('Applying improved TCO Analyzer fix...');
  
  // =============================================
  // PART 1: Fix Portnox Logo
  // =============================================
  function fixLogoDisplay() {
    console.log('Ensuring Portnox logo display...');
    
    const logoImg = document.querySelector('.logo img');
    if (logoImg) {
      // Use PNG version directly
      logoImg.src = 'img/portnox-logo.png';
      
      // Force size
      logoImg.style.height = '40px';
      logoImg.style.width = 'auto';
      logoImg.style.objectFit = 'contain';
      
      console.log('Logo display fixed');
    }
  }
  
  // =============================================
  // PART 2: Default Calculator Settings
  // =============================================
  function setDefaultCalculatorSettings() {
    console.log('Setting default calculator settings...');
    
    // Set device count to 300
    const deviceCountInput = document.getElementById('device-count');
    if (deviceCountInput) {
      deviceCountInput.value = 300;
    }
    
    // Set organization size to small
    const orgSizeSelect = document.getElementById('organization-size');
    if (orgSizeSelect) {
      orgSizeSelect.value = 'small';
    }
    
    // Set years to project to 1
    const yearsInput = document.getElementById('years-to-project');
    if (yearsInput) {
      yearsInput.value = 1;
    }
    
    console.log('Default calculator settings applied');
  }
  
  // =============================================
  // PART 3: Create Improved Wizard
  // =============================================
  function createImprovedWizard() {
    console.log('Creating improved wizard...');
    
    // First, remove any existing wizard to avoid conflicts
    const existingWizard = document.getElementById('cost-analysis-modal-container');
    if (existingWizard) {
      existingWizard.remove();
    }
    
    // Add wizard modal
    const wizardModal = document.createElement('div');
    wizardModal.id = 'cost-analysis-modal-container';
    wizardModal.className = 'modal-container';
    
    wizardModal.innerHTML = `
      <div class="cost-analysis-modal">
        <div class="cost-modal-header">
          <h2><i class="fas fa-dollar-sign"></i> Advanced Cost Analysis Wizard</h2>
          <button type="button" class="cost-modal-close">&times;</button>
        </div>
        <div class="cost-modal-body">
          <div class="wizard-container">
            <div class="wizard-steps">
              <div class="wizard-step active" data-step="1">
                <span class="wizard-step-number">1</span>
                <span class="wizard-step-title">Industry</span>
              </div>
              <div class="wizard-step" data-step="2">
                <span class="wizard-step-number">2</span>
                <span class="wizard-step-title">Vendor</span>
              </div>
              <div class="wizard-step" data-step="3">
                <span class="wizard-step-number">3</span>
                <span class="wizard-step-title">Compliance</span>
              </div>
              <div class="wizard-step" data-step="4">
                <span class="wizard-step-number">4</span>
                <span class="wizard-step-title">Cost</span>
              </div>
              <div class="wizard-step" data-step="5">
                <span class="wizard-step-number">5</span>
                <span class="wizard-step-title">Advanced</span>
              </div>
            </div>
            
            <div class="wizard-content">
              <!-- Step 1: Industry -->
              <div class="wizard-panel active" data-step="1">
                <h3>Select Your Industry</h3>
                <p>Choose your industry to apply optimized parameters and compliance requirements.</p>
                
                <div class="template-buttons">
                  <button class="template-button" data-template="default">General Enterprise</button>
                  <button class="template-button" data-template="healthcare">Healthcare</button>
                  <button class="template-button" data-template="financial">Financial Services</button>
                  <button class="template-button" data-template="education">Education</button>
                  <button class="template-button" data-template="government">Government</button>
                  <button class="template-button" data-template="manufacturing">Manufacturing</button>
                  <button class="template-button" data-template="retail">Retail</button>
                </div>
                
                <div class="industry-details">
                  <h4>Industry-Specific Considerations</h4>
                  <p id="industry-description">Select an industry to see specific information.</p>
                  
                  <div class="metrics-grid">
                    <div class="metric-card">
                      <div class="metric-label">Average TCO</div>
                      <div class="metric-value" id="industry-tco">$0</div>
                      <div class="metric-description">Typical 3-year TCO for on-premises NAC</div>
                    </div>
                    
                    <div class="metric-card">
                      <div class="metric-label">Implementation</div>
                      <div class="metric-value" id="industry-implementation">0 days</div>
                      <div class="metric-description">Average on-premises deployment time</div>
                    </div>
                    
                    <div class="metric-card">
                      <div class="metric-label">IT Resources</div>
                      <div class="metric-value" id="industry-fte">0 FTE</div>
                      <div class="metric-description">Required personnel for maintenance</div>
                    </div>
                    
                    <div class="metric-card">
                      <div class="metric-label">Cloud Savings</div>
                      <div class="metric-value" id="industry-savings">0%</div>
                      <div class="metric-description">Average TCO reduction with cloud</div>
                    </div>
                  </div>
                  
                  <div id="industry-recommendations" class="industry-recommendations hidden">
                    <h4>Industry Recommendations</h4>
                    <div class="recommendations-content">
                      Select an industry to see specific recommendations.
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Step 2: Vendor -->
              <div class="wizard-panel" data-step="2">
                <h3>Select NAC Vendors to Compare</h3>
                <p>Choose your current or preferred NAC vendor to compare with Portnox Cloud.</p>
                
                <div class="vendor-cards">
                  <div class="vendor-card" data-vendor="cisco">
                    <img src="img/cisco-logo.png" alt="Cisco Logo">
                    <span>Cisco ISE</span>
                  </div>
                  <div class="vendor-card" data-vendor="aruba">
                    <img src="img/aruba-logo.png" alt="Aruba Logo">
                    <span>Aruba ClearPass</span>
                  </div>
                  <div class="vendor-card" data-vendor="forescout">
                    <img src="img/forescout-logo.png" alt="Forescout Logo">
                    <span>Forescout</span>
                  </div>
                  <div class="vendor-card" data-vendor="nps">
                    <img src="img/microsoft-logo.png" alt="Microsoft Logo">
                    <span>Microsoft NPS</span>
                  </div>
                  <div class="vendor-card" data-vendor="fortinac">
                    <img src="img/fortinac-logo.png" alt="FortiNAC Logo">
                    <span>FortiNAC</span>
                  </div>
                  <div class="vendor-card" data-vendor="securew2">
                    <img src="img/securew2-logo.png" alt="SecureW2 Logo">
                    <span>SecureW2</span>
                  </div>
                </div>
                
                <div id="vendor-details">
                  <p>Select a vendor to see detailed information.</p>
                </div>
                
                <div class="checkbox-option">
                  <input type="checkbox" id="compare-all-vendors">
                  <label for="compare-all-vendors">Include all vendors in comparison</label>
                </div>
              </div>
              
              <!-- Step 3: Compliance -->
              <div class="wizard-panel" data-step="3">
                <h3>Compliance Requirements</h3>
                <p>Select the compliance regulations that apply to your organization.</p>
                
                <div class="compliance-options" id="compliance-options">
                  <div class="compliance-option" data-compliance="pci">
                    <h4>PCI DSS</h4>
                    <p>Payment Card Industry Data Security Standard</p>
                    <ul>
                      <li>Enhanced access controls</li>
                      <li>Security monitoring</li>
                      <li>Network segmentation</li>
                    </ul>
                  </div>
                  
                  <div class="compliance-option" data-compliance="hipaa">
                    <h4>HIPAA</h4>
                    <p>Health Insurance Portability and Accountability Act</p>
                    <ul>
                      <li>PHI protection</li>
                      <li>Access controls</li>
                      <li>Audit controls</li>
                    </ul>
                  </div>
                  
                  <div class="compliance-option" data-compliance="gdpr">
                    <h4>GDPR</h4>
                    <p>General Data Protection Regulation</p>
                    <ul>
                      <li>Data protection</li>
                      <li>Privacy by design</li>
                      <li>Access monitoring</li>
                    </ul>
                  </div>
                  
                  <div class="compliance-option" data-compliance="nist">
                    <h4>NIST CSF</h4>
                    <p>Cybersecurity Framework</p>
                    <ul>
                      <li>Identify, Protect, Detect</li>
                      <li>Respond and Recover</li>
                      <li>Security controls</li>
                    </ul>
                  </div>
                </div>
                
                <div id="compliance-details">
                  <p>Select compliance requirements to see how they impact NAC implementation.</p>
                </div>
                
                <div id="compliance-benchmarks" class="compliance-benchmarks hidden">
                  <h4>Compliance Benchmarks</h4>
                  <div class="benchmarks-content">
                    Select compliance requirements to see industry benchmarks.
                  </div>
                </div>
              </div>
              
              <!-- Step 4: Cost -->
              <div class="wizard-panel" data-step="4">
                <h3>Advanced Cost Configuration</h3>
                <p>Customize detailed cost parameters to tailor the analysis to your organization's specific needs.</p>
                
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
                
                <h4 style="margin-top: 20px;">Portnox Pricing Configuration</h4>
                
                <div class="cost-config-grid">
                  <div class="cost-config-item">
                    <label for="portnox-price">Portnox Average Price ($ per device)</label>
                    <input type="number" id="portnox-price" min="1" step="1" value="5">
                    <p class="cost-help">Average price per device for Portnox Cloud</p>
                  </div>
                  
                  <div class="cost-config-item">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                      <label for="portnox-discount">Portnox Discount (%)</label>
                      <span class="discount-badge">Recommended</span>
                    </div>
                    
                    <div class="slider-container">
                      <input type="range" id="portnox-discount" min="0" max="40" step="5" value="25">
                      <div class="slider-value">
                        <span id="portnox-discount-value">25%</span>
                      </div>
                    </div>
                    <p class="cost-help">Apply volume or promotional discount to Portnox subscription</p>
                  </div>
                  
                  <div class="cost-config-item">
                    <label for="competitor-discount">Competitor Discount (%)</label>
                    
                    <div class="slider-container">
                      <input type="range" id="competitor-discount" min="0" max="25" step="5" value="0">
                      <div class="slider-value">
                        <span id="competitor-discount-value">0%</span>
                      </div>
                    </div>
                    <p class="cost-help">Apply potential discount to competitor solutions</p>
                  </div>
                </div>
              </div>
              
              <!-- Step 5: Advanced -->
              <div class="wizard-panel" data-step="5">
                <h3>Advanced Settings</h3>
                <p>Configure additional parameters to fine-tune your TCO analysis.</p>
                
                <div class="input-group">
                  <label for="wizard-device-count">Device Count</label>
                  <input type="number" id="wizard-device-count" name="device-count" value="300" min="1" max="1000000">
                </div>
                
                <div class="input-group">
                  <label for="wizard-years-to-project">Years to Project</label>
                  <input type="number" id="wizard-years-to-project" name="years-to-project" value="1" min="1" max="10">
                </div>
                
                <div class="input-group checkbox-group">
                  <input type="checkbox" id="wizard-multiple-locations" name="multiple-locations">
                  <label for="wizard-multiple-locations">Multiple Locations</label>
                </div>
                
                <div id="wizard-location-count-container" class="input-group hidden">
                  <label for="wizard-location-count">Number of Locations</label>
                  <input type="number" id="wizard-location-count" name="location-count" value="2" min="2" max="1000">
                </div>
                
                <div class="input-group checkbox-group">
                  <input type="checkbox" id="wizard-complex-authentication" name="complex-authentication">
                  <label for="wizard-complex-authentication">Complex Authentication</label>
                </div>
                
                <div class="input-group checkbox-group">
                  <input type="checkbox" id="wizard-legacy-devices" name="legacy-devices">
                  <label for="wizard-legacy-devices">Legacy Devices</label>
                </div>
                
                <div id="wizard-legacy-percentage-container" class="input-group hidden">
                  <label for="wizard-legacy-percentage">Legacy Device Percentage</label>
                  <div class="range-container">
                    <input type="range" id="wizard-legacy-percentage" name="legacy-percentage" min="0" max="100" value="10">
                    <span id="wizard-legacy-percentage-value">10%</span>
                  </div>
                </div>
                
                <div class="input-group checkbox-group">
                  <input type="checkbox" id="wizard-cloud-integration" name="cloud-integration">
                  <label for="wizard-cloud-integration">Cloud Integration</label>
                </div>
                
                <div class="input-group checkbox-group">
                  <input type="checkbox" id="wizard-custom-policies" name="custom-policies">
                  <label for="wizard-custom-policies">Custom Policies</label>
                </div>
                
                <div id="wizard-policy-complexity-container" class="input-group hidden">
                  <label for="wizard-policy-complexity">Policy Complexity</label>
                  <select id="wizard-policy-complexity" name="policy-complexity">
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="cost-modal-footer">
          <button id="wizard-prev-btn" class="btn btn-outline">Previous</button>
          <button id="wizard-next-btn" class="btn btn-primary">Next</button>
          <button id="wizard-apply-btn" class="btn btn-success" style="display: none;">Apply Analysis</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(wizardModal);
    
    // Add wizard styles
    addWizardStyles();
    
    // Setup wizard functionality
    setupWizardFunctionality();
    
    // Create wizard button
    const headerActions = document.querySelector('.header-actions');
    
    if (headerActions) {
      // Check if button already exists
      let costWizardBtn = document.getElementById('cost-wizard-btn');
      
      if (!costWizardBtn) {
        costWizardBtn = document.createElement('button');
        costWizardBtn.id = 'cost-wizard-btn';
        costWizardBtn.className = 'btn btn-modern';
        costWizardBtn.innerHTML = '<i class="fas fa-dollar-sign"></i> Cost Configuration';
        
        costWizardBtn.addEventListener('click', () => {
          wizardModal.classList.add('visible');
        });
        
        headerActions.prepend(costWizardBtn);
      }
    }
    
    console.log('Improved wizard created successfully');
  }
  
  // Add wizard styles
  function addWizardStyles() {
    console.log('Adding wizard styles...');
    
    // Check if styles already exist
    if (document.getElementById('wizard-styles')) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = 'wizard-styles';
    style.textContent = `
      /* Wizard Modal Styles */
      .modal-container {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        justify-content: center;
        align-items: center;
      }
      
      .modal-container.visible {
        display: flex;
      }
      
      .cost-analysis-modal {
        background: white;
        width: 90%;
        max-width: 1000px;
        max-height: 90vh;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      
      .cost-modal-header {
        background: linear-gradient(135deg, #1B67B2, #145192);
        color: white;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .cost-modal-header h2 {
        margin: 0;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .cost-modal-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
      }
      
      .cost-modal-close:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      .cost-modal-body {
        padding: 0;
        overflow-y: auto;
        max-height: calc(90vh - 136px);
      }
      
      .cost-modal-footer {
        padding: 15px 20px;
        background: #f8f9fa;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        border-top: 1px solid #ddd;
      }
      
      /* Wizard Steps */
      .wizard-container {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      
      .wizard-steps {
        display: flex;
        background: #f8f9fa;
        border-bottom: 1px solid #ddd;
      }
      
      .wizard-step {
        flex: 1;
        padding: 15px 10px;
        text-align: center;
        background: #f8f9fa;
        border-bottom: 3px solid #ddd;
        position: relative;
        cursor: pointer;
        font-size: 0.9rem;
      }
      
      .wizard-step.active {
        border-bottom-color: #2BD25B;
      }
      
      .wizard-step.completed {
        border-bottom-color: #1B67B2;
      }
      
      .wizard-step-number {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #ddd;
        color: #505050;
        margin-right: 8px;
        font-size: 0.8rem;
      }
      
      .wizard-step.active .wizard-step-number {
        background: #2BD25B;
        color: white;
      }
      
      .wizard-step.completed .wizard-step-number {
        background: #1B67B2;
        color: white;
      }
      
      .wizard-step-title {
        font-weight: 500;
      }
      
      /* Wizard Content */
      .wizard-content {
        flex: 1;
        padding: 20px;
      }
      
      .wizard-panel {
        display: none;
      }
      
      .wizard-panel.active {
        display: block;
        animation: fadeIn 0.3s ease;
      }
      
      /* Industry Selection */
      .template-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin: 20px 0;
      }
      
      .template-button {
        background: #f8f9fa;
        border: 1px solid #ddd;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .template-button:hover {
        background: #e9ecef;
        transform: translateY(-2px);
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      
      .template-button.active {
        background: #1B67B2;
        color: white;
        border-color: #1B67B2;
      }
      
      .industry-details {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 15px;
        margin-top: 20px;
      }
      
      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
        margin-top: 15px;
      }
      
      .metric-card {
        background: white;
        border-radius: 6px;
        padding: 15px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
      
      .metric-label {
        font-weight: 500;
        font-size: 0.9rem;
        color: #505050;
      }
      
      .metric-value {
        font-size: 1.2rem;
        font-weight: 600;
        color: #1B67B2;
        margin: 5px 0;
      }
      
      .metric-description {
        font-size: 0.8rem;
        color: #707070;
      }
      
      .industry-recommendations {
        margin-top: 20px;
        padding: 15px;
        background: white;
        border-radius: 6px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
      
      /* Vendor Selection */
      .vendor-cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
        margin: 20px 0;
      }
      
      .vendor-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .vendor-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      
      .vendor-card.selected {
        border: 2px solid #2BD25B;
        background-color: rgba(43, 210, 91, 0.05);
      }
      
      .vendor-card img {
        max-width: 100%;
        height: 40px;
        object-fit: contain;
        margin-bottom: 10px;
      }
      
      .vendor-card span {
        display: block;
        font-weight: 500;
      }
      
      .checkbox-option {
        margin-top: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .checkbox-option input {
        width: 18px;
        height: 18px;
      }
      
      /* Compliance Selection */
      .compliance-options {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
        margin: 20px 0;
      }
      
      .compliance-option {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .compliance-option:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      
      .compliance-option.selected {
        border: 2px solid #2BD25B;
        background-color: rgba(43, 210, 91, 0.05);
      }
      
      .compliance-option h4 {
        margin-top: 0;
        margin-bottom: 10px;
        color: #1B67B2;
      }
      
      .compliance-option p {
        font-size: 0.9rem;
        color: #505050;
        margin-bottom: 10px;
      }
      
      .compliance-option ul {
        padding-left: 20px;
        margin-bottom: 0;
        font-size: 0.9rem;
        color: #505050;
      }
      
      .compliance-benchmarks {
        margin-top: 20px;
        padding: 15px;
        background: white;
        border-radius: 6px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
      
      /* Cost Configuration */
      .cost-config-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }
      
      .cost-config-item {
        margin-bottom: 15px;
      }
      
      .cost-config-item label {
        display: block;
        font-weight: 500;
        margin-bottom: 5px;
        color: #303030;
      }
      
      .cost-config-item input[type="number"] {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
      }
      
      .cost-config-item input[type="number"]:focus {
        border-color: #1B67B2;
        outline: none;
        box-shadow: 0 0 0 2px rgba(27, 103, 178, 0.2);
      }
      
      .cost-help {
        font-size: 0.8rem;
        color: #707070;
        margin-top: 5px;
      }
      
      .slider-container {
        position: relative;
        margin-top: 10px;
      }
      
      .slider-value {
        position: absolute;
        top: -25px;
        right: 0;
        background: #1B67B2;
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
      }
      
      .discount-badge {
        background: #2BD25B;
        color: white;
        border-radius: 4px;
        padding: 2px 6px;
        font-size: 11px;
        font-weight: 600;
      }
      
      /* Advanced Settings */
      .input-group {
        margin-bottom: 15px;
      }
      
      .input-group label {
        display: block;
        font-weight: 500;
        margin-bottom: 5px;
        color: #303030;
      }
      
      .input-group input[type="number"],
      .input-group select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
      }
      
      .input-group input[type="number"]:focus,
      .input-group select:focus {
        border-color: #1B67B2;
        outline: none;
        box-shadow: 0 0 0 2px rgba(27, 103, 178, 0.2);
      }
      
      .checkbox-group {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .checkbox-group input[type="checkbox"] {
        width: 18px;
        height: 18px;
      }
      
      .range-container {
        position: relative;
        margin-top: 10px;
      }
      
      .range-container input[type="range"] {
        width: 100%;
        height: 6px;
        -webkit-appearance: none;
        background: #ddd;
        border-radius: 3px;
      }
      
      .range-container input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #1B67B2;
        cursor: pointer;
      }
      
      /* Utility Classes */
      .hidden {
        display: none !important;
      }
      
      /* Button Styles */
      .btn-modern {
        background: linear-gradient(135deg, #1B67B2, #145192);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
      }
      
      .btn-modern:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        background: linear-gradient(135deg, #145192, #0D3B6D);
      }
      
      .btn-outline {
        background: transparent;
        color: #1B67B2;
        border: 1px solid #1B67B2;
        border-radius: 8px;
        padding: 8px 16px;
        font-weight: 500;
        transition: all 0.2s ease;
      }
      
      .btn-outline:hover {
        background: rgba(27, 103, 178, 0.05);
        box-shadow: 0 2px 4px rgba(27, 103, 178, 0.1);
      }
      
      .btn-primary {
        background: #1B67B2;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 8px 16px;
        font-weight: 500;
        transition: all 0.2s ease;
      }
      
      .btn-primary:hover {
        background: #145192;
        box-shadow: 0 4px 8px rgba(27, 103, 178, 0.2);
        transform: translateY(-1px);
      }
      
      .btn-success {
        background: #2BD25B;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 8px 16px;
        font-weight: 500;
        transition: all 0.2s ease;
      }
      
      .btn-success:hover {
        background: #22B74D;
        box-shadow: 0 4px 8px rgba(43, 210, 91, 0.2);
        transform: translateY(-1px);
      }
      
      /* Animations */
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    
    document.head.appendChild(style);
    console.log('Wizard styles added');
  }
  
  // Setup wizard functionality
  function setupWizardFunctionality() {
    console.log('Setting up wizard functionality...');
    
    // Get wizard elements
    const wizardModal = document.getElementById('cost-analysis-modal-container');
    const closeBtn = document.querySelector('.cost-modal-close');
    const prevBtn = document.getElementById('wizard-prev-btn');
    const nextBtn = document.getElementById('wizard-next-btn');
    const applyBtn = document.getElementById('wizard-apply-btn');
    const wizardSteps = document.querySelectorAll('.wizard-step');
    
    let currentStep = 1;
    const totalSteps = wizardSteps.length;
    
    // Modal close button
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        wizardModal.classList.remove('visible');
      });
    }
    
    // Click outside to close
    if (wizardModal) {
      wizardModal.addEventListener('click', (e) => {
        if (e.target === wizardModal) {
          wizardModal.classList.remove('visible');
        }
      });
    }
    
    // Previous button
    if (prevBtn) {
      // Initialize Previous button visibility
      prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
      
      prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
          // Hide current panel
          document.querySelector(`.wizard-panel[data-step="${currentStep}"]`).classList.remove('active');
          
          // Update step indicator
          document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.remove('active');
          
          // Decrement step
          currentStep--;
          
          // Show new panel
          document.querySelector(`.wizard-panel[data-step="${currentStep}"]`).classList.add('active');
          document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.add('active');
          document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.remove('completed');
          
          // Update button visibility
          nextBtn.style.display = 'block';
          applyBtn.style.display = 'none';
          
          if (currentStep === 1) {
            prevBtn.style.display = 'none';
          }
        }
      });
    }
    
    // Next button
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
          // Hide current panel
          document.querySelector(`.wizard-panel[data-step="${currentStep}"]`).classList.remove('active');
          
          // Update step indicator
          document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.remove('active');
          document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.add('completed');
          
          // Increment step
          currentStep++;
          
          // Show new panel
          document.querySelector(`.wizard-panel[data-step="${currentStep}"]`).classList.add('active');
          document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.add('active');
          
          // Update button visibility
          prevBtn.style.display = 'block';
          
          if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            applyBtn.style.display = 'block';
          }
        }
      });
    }
    
    // Apply button
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        applyWizardConfiguration();
        wizardModal.classList.remove('visible');
      });
    }
    
    // Step click navigation
    wizardSteps.forEach(step => {
      step.addEventListener('click', () => {
        const stepNum = parseInt(step.getAttribute('data-step'));
        
        // Only allow navigating to completed steps or the next step
        if (stepNum < currentStep || stepNum === currentStep || stepNum === currentStep + 1) {
          // Hide current panel
          document.querySelector(`.wizard-panel[data-step="${currentStep}"]`).classList.remove('active');
          document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.remove('active');
          
          if (stepNum < currentStep) {
            document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.remove('completed');
          } else if (stepNum > currentStep) {
            document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.add('completed');
          }
          
          // Update current step
          currentStep = stepNum;
          
          // Show new panel
          document.querySelector(`.wizard-panel[data-step="${currentStep}"]`).classList.add('active');
          document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.add('active');
          
          // Update button visibility
          prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
          
          if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            applyBtn.style.display = 'block';
          } else {
            nextBtn.style.display = 'block';
            applyBtn.style.display = 'none';
          }
        }
      });
    });
    
    setupIndustryTemplates();
    setupVendorSelection();
    setupCompliance();
    setupAdvancedSettings();
    setupDiscountSliders();
    
    console.log('Wizard functionality set up');
  }
  
  // Setup industry templates
  function setupIndustryTemplates() {
    console.log('Setting up industry templates...');
    
    const templateButtons = document.querySelectorAll('.template-button');
    const industryDescriptionEl = document.getElementById('industry-description');
    const industryTcoEl = document.getElementById('industry-tco');
    const industryImplementationEl = document.getElementById('industry-implementation');
    const industryFteEl = document.getElementById('industry-fte');
    const industrySavingsEl = document.getElementById('industry-savings');
    const industryRecommendationsEl = document.getElementById('industry-recommendations');
    
    // Industry data
    const industryData = {
      default: {
        description: "Enterprise organizations require secure network access control that balances security with usability while managing diverse device types and user access requirements.",
        tco: "$3,000,000",
        implementation: "80 days",
        fte: "2.0 FTE",
        savings: "35%",
        recommendations: `
          <h5>Key Recommendations</h5>
          <ul>
            <li>Implement a cloud-based NAC solution for centralized management and reduced complexity</li>
            <li>Consider a phased deployment approach, starting with critical segments</li>
            <li>Focus on integration with existing security tools for comprehensive protection</li>
            <li>Establish a baseline of normal device behavior before enforcing policies</li>
          </ul>
          <h5>Industry Benchmarks</h5>
          <p>Leading enterprises are achieving 35-40% TCO reduction by migrating to cloud-based NAC solutions, with implementation times reduced by 60-75%.</p>
        `
      },
      healthcare: {
        description: "Healthcare organizations face unique challenges in securing sensitive patient data while providing flexible access for clinical workflows across diverse device types.",
        tco: "$3,500,000",
        implementation: "90 days",
        fte: "2.5 FTE",
        savings: "38%",
        recommendations: `
          <h5>Key Recommendations</h5>
          <ul>
            <li>Prioritize solutions with strong medical device profiling capabilities</li>
            <li>Ensure granular role-based access controls for clinical staff</li>
            <li>Implement segmentation policies for clinical and IoT networks</li>
            <li>Focus on minimizing disruption to critical care workflows</li>
            <li>Ensure HIPAA compliance through comprehensive audit logging</li>
          </ul>
          <h5>Industry Benchmarks</h5>
          <p>Leading healthcare providers are achieving 38-45% TCO reduction through cloud NAC adoption, with medical device security improved by 65-80%.</p>
        `
      },
      financial: {
        description: "Financial institutions must balance robust security with frictionless customer and employee experiences while meeting stringent regulatory requirements.",
        tco: "$4,200,000",
        implementation: "120 days",
        fte: "2.8 FTE",
        savings: "35%",
        recommendations: `
          <h5>Key Recommendations</h5>
          <ul>
            <li>Implement continuous compliance monitoring for regulatory requirements</li>
            <li>Focus on adaptive authentication based on risk assessment</li>
            <li>Ensure strong integration with SIEM and security analytics</li>
            <li>Deploy micro-segmentation for high-value assets</li>
            <li>Implement automated response workflows for suspicious activities</li>
          </ul>
          <h5>Industry Benchmarks</h5>
          <p>Financial services leaders report 35-42% TCO reduction with cloud NAC adoption, with security incident response times improved by 70%.</p>
        `
      },
      education: {
        description: "Educational institutions face unique security challenges with diverse user populations, high device turnover, and open campus networks.",
        tco: "$2,500,000",
        implementation: "75 days",
        fte: "1.8 FTE",
        savings: "40%",
        recommendations: `
          <h5>Key Recommendations</h5>
          <ul>
            <li>Focus on self-service onboarding for student devices</li>
            <li>Implement guest access management with time-limited credentials</li>
            <li>Develop different policies for academic vs. administrative networks</li>
            <li>Consider seasonal scaling requirements (enrollment periods)</li>
            <li>Prioritize solutions with minimal infrastructure requirements</li>
          </ul>
          <h5>Industry Benchmarks</h5>
          <p>Educational institutions typically see 40-48% TCO reduction with cloud NAC, with notable improvements in IT staff efficiency (65-70%).</p>
        `
      },
      government: {
        description: "Government agencies require robust security controls with strict compliance requirements while supporting both modern and legacy systems.",
        tco: "$4,800,000",
        implementation: "150 days",
        fte: "3.0 FTE",
        savings: "32%",
        recommendations: `
          <h5>Key Recommendations</h5>
          <ul>
            <li>Implement solutions with strong FedRAMP certification</li>
            <li>Focus on legacy system compatibility and support</li>
            <li>Ensure comprehensive audit trails for compliance requirements</li>
            <li>Consider air-gapped network requirements for sensitive environments</li>
            <li>Implement strong certificate-based authentication</li>
          </ul>
          <h5>Industry Benchmarks</h5>
          <p>Government agencies report 32-38% TCO reduction through cloud NAC adoption, with compliance reporting efficiency improved by 55-65%.</p>
        `
      },
      manufacturing: {
        description: "Manufacturing environments must secure both IT and OT (Operational Technology) networks with zero tolerance for production disruption.",
        tco: "$3,100,000",
        implementation: "95 days",
        fte: "2.2 FTE",
        savings: "36%",
        recommendations: `
          <h5>Key Recommendations</h5>
          <ul>
            <li>Focus on OT/ICS device discovery and profiling capabilities</li>
            <li>Implement passive monitoring for sensitive production environments</li>
            <li>Create segmentation between IT and OT networks</li>
            <li>Consider solutions with specialized industrial protocol support</li>
            <li>Prioritize high availability and redundancy</li>
          </ul>
          <h5>Industry Benchmarks</h5>
          <p>Manufacturing leaders achieve 36-42% TCO reduction with cloud NAC, with significant improvements in OT security visibility (70-85% increase).</p>
        `
      },
      retail: {
        description: "Retail organizations face unique security challenges with distributed store locations, seasonal workforce, and PCI compliance requirements.",
        tco: "$2,900,000",
        implementation: "85 days",
        fte: "2.0 FTE",
        savings: "38%",
        recommendations: `
          <h5>Key Recommendations</h5>
          <ul>
            <li>Implement PCI DSS network segmentation and compliance monitoring</li>
            <li>Focus on centralized management for distributed locations</li>
            <li>Deploy POS device profiling and protection</li>
            <li>Consider solutions with minimal on-site hardware requirements</li>
            <li>Implement secure guest WiFi isolation from corporate networks</li>
          </ul>
          <h5>Industry Benchmarks</h5>
          <p>Retail organizations report 38-44% TCO reduction with cloud NAC adoption, with PCI compliance management efficiency improved by 50-60%.</p>
        `
      }
    };
    
    if (templateButtons) {
      templateButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Remove active class from all buttons
          templateButtons.forEach(btn => btn.classList.remove('active'));
          
          // Add active class to clicked button
          button.classList.add('active');
          
          // Update industry description and metrics
          const industryTemplate = button.getAttribute('data-template');
          const industry = industryData[industryTemplate] || industryData.default;
          
          if (industryDescriptionEl) industryDescriptionEl.textContent = industry.description;
          if (industryTcoEl) industryTcoEl.textContent = industry.tco;
          if (industryImplementationEl) industryImplementationEl.textContent = industry.implementation;
          if (industryFteEl) industryFteEl.textContent = industry.fte;
          if (industrySavingsEl) industrySavingsEl.textContent = industry.savings;
          
          // Show and update recommendations
          if (industryRecommendationsEl) {
            industryRecommendationsEl.classList.remove('hidden');
            const recommendationsContent = industryRecommendationsEl.querySelector('.recommendations-content');
            if (recommendationsContent) {
              recommendationsContent.innerHTML = industry.recommendations;
            }
          }
        });
      });
    }
    
    console.log('Industry templates set up');
  }
  
  // Setup vendor selection
  function setupVendorSelection() {
    console.log('Setting up vendor selection...');
    
    const vendorCards = document.querySelectorAll('.vendor-card');
    const vendorDetailsEl = document.getElementById('vendor-details');
    
    if (vendorCards) {
      vendorCards.forEach(card => {
        card.addEventListener('click', () => {
          // Toggle selected class
          card.classList.toggle('selected');
          
          // Update vendor details
          updateVendorDetails();
        });
      });
    }
    
    // Function to update vendor details
    function updateVendorDetails() {
      const selectedVendors = document.querySelectorAll('.vendor-card.selected');
      
      if (!vendorDetailsEl) return;
      
      if (selectedVendors.length === 0) {
        vendorDetailsEl.innerHTML = `<p>Select a vendor to see detailed information.</p>`;
        return;
      }
      
      if (selectedVendors.length === 1) {
        const vendorId = selectedVendors[0].getAttribute('data-vendor');
        const vendorName = selectedVendors[0].querySelector('span').textContent;
        
        // Vendor data (enhanced with more detailed information)
        const vendorData = {
          cisco: {
            implementation: "90-120 days",
            cost: "High",
            complexity: "Complex",
            description: "On-premises appliances with distributed deployment model requiring specialized expertise and significant maintenance overhead.",
            strengths: ["Comprehensive feature set", "Strong integration with Cisco ecosystem", "Mature policy controls"],
            challenges: ["Complex deployment and maintenance", "Significant hardware investment", "High IT resource requirements", "Costly upgrades"]
          },
          aruba: {
            implementation: "60-90 days",
            cost: "High",
            complexity: "Moderate to Complex",
            description: "On-premises virtual or physical appliances with multi-vendor support and complex setup process.",
            strengths: ["Strong multi-vendor support", "Integrated with wireless solutions", "Flexible deployment options"],
            challenges: ["Complex initial setup", "Ongoing maintenance overhead", "Hardware refresh costs", "Limited cloud capabilities"]
          },
          forescout: {
            implementation: "60-120 days",
            cost: "High",
            complexity: "Complex",
            description: "On-premises appliances with agentless approach and strong visibility capabilities.",
            strengths: ["Comprehensive device visibility", "Agentless architecture", "Detailed device profiling"],
            challenges: ["Hardware deployment requirements", "Complex licensing model", "High initial investment", "Significant IT expertise needed"]
          },
          nps: {
            implementation: "30-60 days",
            cost: "Low",
            complexity: "Moderate",
            description: "Windows Server role with limited NAC capabilities requiring significant customization.",
            strengths: ["Low initial cost", "Integrated with Microsoft ecosystem", "Familiar to Windows administrators"],
            challenges: ["Limited feature set", "Requires extensive customization", "Minimal IoT/OT support", "Lacks advanced policy controls"]
          },
          fortinac: {
            implementation: "60-90 days",
            cost: "Moderate to High",
            complexity: "Moderate",
            description: "On-premises appliances integrated with Fortinet ecosystem with strong integration with Fortinet products.",
            strengths: ["Strong Fortinet ecosystem integration", "Unified security management", "Solid network integration"],
            challenges: ["Hardware deployment requirements", "Limited multi-vendor support", "Moderate scaling complexity", "Ongoing maintenance costs"]
          },
          securew2: {
            implementation: "30-60 days",
            cost: "Moderate",
            complexity: "Moderate",
            description: "Cloud-based with focus on certificate management with limited full NAC capabilities.",
            strengths: ["Strong certificate management", "Cloud-based architecture", "Good BYOD support"],
            challenges: ["Limited full NAC capabilities", "Narrow feature focus", "Requires additional solutions for comprehensive NAC"]
          }
        };
        
        const vendor = vendorData[vendorId] || { 
          implementation: "N/A", 
          cost: "N/A", 
          complexity: "N/A", 
          description: "No details available.",
          strengths: [],
          challenges: []
        };
        
        // Create an enhanced vendor details card with strengths and challenges
        vendorDetailsEl.innerHTML = `
          <div class="vendor-details-card">
            <h4>${vendorName}</h4>
            <div class="vendor-metrics">
              <div class="vendor-metric">
                <span class="metric-label">Implementation Time:</span>
                <span class="metric-value">${vendor.implementation}</span>
              </div>
              <div class="vendor-metric">
                <span class="metric-label">Cost Level:</span>
                <span class="metric-value">${vendor.cost}</span>
              </div>
              <div class="vendor-metric">
                <span class="metric-label">Complexity:</span>
                <span class="metric-value">${vendor.complexity}</span>
              </div>
            </div>
            <p class="vendor-description">${vendor.description}</p>
            
            <div class="vendor-comparison">
              <div class="vendor-strengths">
                <h5>Key Strengths</h5>
                <ul>
                  ${vendor.strengths.map(strength => `<li>${strength}</li>`).join('')}
                </ul>
              </div>
              <div class="vendor-challenges">
                <h5>Key Challenges</h5>
                <ul>
                  ${vendor.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                </ul>
              </div>
            </div>
            
            <div class="portnox-advantage">
              <h5>Portnox Cloud Advantage</h5>
              <p>Compared to ${vendorName}, Portnox Cloud offers zero hardware footprint, significantly faster deployment, lower maintenance overhead, and automatic updates with no upgrade costs.</p>
            </div>
          </div>
        `;
      } else {
        vendorDetailsEl.innerHTML = `
          <div class="vendor-multi-select">
            <h4>${selectedVendors.length} vendors selected for comparison</h4>
            <ul>
              ${Array.from(selectedVendors).map(vendor => 
                `<li>${vendor.querySelector('span').textContent}</li>`
              ).join('')}
            </ul>
            <p>All selected vendors will be included in the TCO comparison.</p>
            
            <div class="multi-vendor-comparison">
              <h5>Common Challenges with On-Premises NAC Solutions</h5>
              <ul>
                <li>Hardware deployment and maintenance overhead</li>
                <li>Complex upgrades and patching processes</li>
                <li>Scaling requires additional hardware</li>
                <li>High IT resource requirements</li>
                <li>Significant upfront investment</li>
              </ul>
              
              <h5>Portnox Cloud Advantage</h5>
              <p>Portnox Cloud eliminates hardware costs, simplifies management through a unified cloud interface, and provides automatic updates and scaling without additional hardware. Typical TCO reduction is 35-45% compared to traditional on-premises solutions.</p>
            </div>
          </div>
        `;
      }
    }
    
    console.log('Vendor selection set up');
  }
  
  // Setup compliance options
  function setupCompliance() {
    console.log('Setting up compliance options...');
    
    const complianceOptions = document.querySelectorAll('.compliance-option');
    const complianceDetailsEl = document.getElementById('compliance-details');
    const complianceBenchmarksEl = document.getElementById('compliance-benchmarks');
    
    if (complianceOptions) {
      complianceOptions.forEach(option => {
        option.addEventListener('click', () => {
          option.classList.toggle('selected');
          updateComplianceDetails();
        });
      });
    }
    
    function updateComplianceDetails() {
      const selectedOptions = document.querySelectorAll('.compliance-option.selected');
      
      if (!complianceDetailsEl) return;
      
      if (selectedOptions.length === 0) {
        complianceDetailsEl.innerHTML = `<p>Select compliance requirements to see how they impact NAC implementation.</p>`;
        if (complianceBenchmarksEl) complianceBenchmarksEl.classList.add('hidden');
        return;
      }
      
      // Compliance data with enhanced details
      const complianceData = {
        pci: {
          title: "PCI DSS",
          description: "Payment Card Industry Data Security Standard",
          requirements: [
            "Network segmentation to isolate cardholder data environments",
            "Access control measures for systems with cardholder data",
            "Continuous monitoring and regular testing of security systems",
            "Maintenance of information security policies"
          ],
          portnoxAdvantage: "Built-in network segmentation and continuous compliance monitoring for cardholder data environments.",
          benchmarks: [
            "95% of organizations struggle with maintaining continuous PCI compliance",
            "Organizations with cloud-based NAC solutions report 42% faster PCI audit preparation",
            "Automated compliance reporting reduces audit preparation time by 65%",
            "Cloud NAC reduces PCI compliance management costs by 35-45%"
          ]
        },
        hipaa: {
          title: "HIPAA",
          description: "Health Insurance Portability and Accountability Act",
          requirements: [
            "Access control mechanisms to restrict system access to authorized users only",
            "Audit controls that record and examine activity in systems containing ePHI",
            "Integrity controls to ensure ePHI is not improperly altered or destroyed",
            "Transmission security measures to protect ePHI when transmitted over networks"
          ],
          portnoxAdvantage: "Built-in HIPAA compliance templates with one-click reporting and continuous monitoring to simplify regulatory audits.",
          benchmarks: [
            "Healthcare organizations report 55% faster HIPAA audit preparation with cloud NAC",
            "Automated access controls reduce unauthorized access incidents by 75%",
            "Cloud-based NAC solutions improve medical device security by 65%",
            "Continuous compliance monitoring reduces audit findings by 40%"
          ]
        },
        gdpr: {
          title: "GDPR",
          description: "General Data Protection Regulation",
          requirements: [
            "Lawful basis for processing personal data",
            "Data protection by design and by default",
            "Consumer rights regarding personal data",
            "Security of processing requirements"
          ],
          portnoxAdvantage: "Granular policy controls with comprehensive logging and monitoring to demonstrate compliance with GDPR principles.",
          benchmarks: [
            "Organizations with cloud NAC solutions report 40% faster compliance implementation",
            "Automated data protection controls reduce GDPR violations by 65%",
            "Comprehensive asset visibility improves data mapping accuracy by 70%",
            "Cloud-based access controls reduce unauthorized data access by 80%"
          ]
        },
        nist: {
          title: "NIST CSF",
          description: "Cybersecurity Framework",
          requirements: [
            "Identify: Asset management, business environment understanding",
            "Protect: Access control, awareness training, data security",
            "Detect: Anomalies and events, continuous monitoring",
            "Respond: Response planning, analysis, mitigation",
"Recover: Recovery planning, improvements, communications"
          ],
          portnoxAdvantage: "Aligns with NIST CSF framework across all functions with comprehensive capabilities for each control category.",
          benchmarks: [
            "Organizations implementing cloud NAC report 45% faster NIST CSF framework alignment",
            "Automated controls reduce implementation effort by 60% across framework categories",
            "Cloud-based solutions improve continuous monitoring capabilities by 75%",
            "Integrated reporting reduces compliance documentation time by 55%"
          ]
        }
      };

      // Build the compliance details with impacts and Portnox advantages
      complianceDetailsEl.innerHTML = `
        <div class="compliance-impact">
          <h4>Compliance Impact on NAC Implementation</h4>

          <ul class="compliance-requirements-list">
            ${Array.from(selectedOptions).map(option => {
              const complianceId = option.getAttribute('data-compliance');
              const compliance = complianceData[complianceId] || {
                title: option.querySelector('h4').textContent,
                requirements: ["Access control requirements", "User authentication standards", "Audit and monitoring requirements"],
                portnoxAdvantage: "Built-in compliance templates with continuous monitoring"
              };

              return `
                <li>
                  <strong>${compliance.title}:</strong>
                  <ul>
                    ${compliance.requirements.map(req => `<li>${req}</li>`).join('')}
                  </ul>
                  <div class="compliance-advantage">
                    <strong>Portnox Advantage:</strong> ${compliance.portnoxAdvantage}
                  </div>
                </li>
              `;
            }).join('')}
          </ul>

          <div class="compliance-summary">
            <p><strong>Summary Impact:</strong> The selected compliance requirements add ${selectedOptions.length > 2 ? 'significant' : 'moderate'} complexity to NAC implementation. Cloud-native solutions like Portnox typically reduce compliance overhead by 40-60% compared to traditional on-premises alternatives.</p>
          </div>
        </div>
      `;

      // Show and update compliance benchmarks
      if (complianceBenchmarksEl) {
        complianceBenchmarksEl.classList.remove('hidden');

        // Create benchmarks content
        const benchmarksContent = complianceBenchmarksEl.querySelector('.benchmarks-content');
        if (benchmarksContent) {
          benchmarksContent.innerHTML = `
            <h5>Compliance Benchmarks for Selected Requirements</h5>
            <ul class="benchmarks-list">
              ${Array.from(selectedOptions).map(option => {
                const complianceId = option.getAttribute('data-compliance');
                const compliance = complianceData[complianceId] || {
                  title: option.querySelector('h4').textContent,
                  benchmarks: [
                    "Organizations with cloud NAC solutions report 40% faster compliance implementation",
                    "Automated compliance controls reduce manual effort by 65%"
                  ]
                };

                return `
                  <li>
                    <strong>${compliance.title}:</strong>
                    <ul>
                      ${compliance.benchmarks.map(benchmark => `<li>${benchmark}</li>`).join('')}
                    </ul>
                  </li>
                `;
              }).join('')}
            </ul>

            <h5>Compliance Best Practices</h5>
            <ul>
              <li>Implement continuous compliance monitoring rather than point-in-time assessments</li>
              <li>Integrate compliance controls into regular network operations</li>
              <li>Automate compliance reporting to reduce preparation time and effort</li>
              <li>Focus on demonstrating compliance through comprehensive logging and monitoring</li>
            </ul>
          `;
        }
      }
    }

    console.log('Compliance options set up');
  }

  // Setup advanced settings
  function setupAdvancedSettings() {
    console.log('Setting up advanced settings...');

    // Multiple locations checkbox
    const multipleLocationsCheckbox = document.getElementById('wizard-multiple-locations');
    const locationCountContainer = document.getElementById('wizard-location-count-container');

    if (multipleLocationsCheckbox && locationCountContainer) {
      multipleLocationsCheckbox.addEventListener('change', function() {
        if (this.checked) {
          locationCountContainer.classList.remove('hidden');
        } else {
          locationCountContainer.classList.add('hidden');
        }
      });
    }

    // Legacy devices checkbox
    const legacyDevicesCheckbox = document.getElementById('wizard-legacy-devices');
    const legacyPercentageContainer = document.getElementById('wizard-legacy-percentage-container');
    const legacyPercentageSlider = document.getElementById('wizard-legacy-percentage');
    const legacyPercentageValue = document.getElementById('wizard-legacy-percentage-value');

    if (legacyDevicesCheckbox && legacyPercentageContainer) {
      legacyDevicesCheckbox.addEventListener('change', function() {
        if (this.checked) {
          legacyPercentageContainer.classList.remove('hidden');
        } else {
          legacyPercentageContainer.classList.add('hidden');
        }
      });
    }

    if (legacyPercentageSlider && legacyPercentageValue) {
      legacyPercentageSlider.addEventListener('input', function() {
        legacyPercentageValue.textContent = this.value + '%';
      });
    }

    // Custom policies checkbox
    const customPoliciesCheckbox = document.getElementById('wizard-custom-policies');
    const policyComplexityContainer = document.getElementById('wizard-policy-complexity-container');

    if (customPoliciesCheckbox && policyComplexityContainer) {
      customPoliciesCheckbox.addEventListener('change', function() {
        if (this.checked) {
          policyComplexityContainer.classList.remove('hidden');
        } else {
          policyComplexityContainer.classList.add('hidden');
        }
      });
    }

    console.log('Advanced settings set up');
  }

  // Setup discount sliders
  function setupDiscountSliders() {
    console.log('Setting up discount sliders...');

    const portnoxSlider = document.getElementById('portnox-discount');
    const portnoxValue = document.getElementById('portnox-discount-value');

    if (portnoxSlider && portnoxValue) {
      portnoxSlider.addEventListener('input', function() {
        portnoxValue.textContent = this.value + '%';
      });
    }

    const competitorSlider = document.getElementById('competitor-discount');
    const competitorValue = document.getElementById('competitor-discount-value');

    if (competitorSlider && competitorValue) {
      competitorSlider.addEventListener('input', function() {
        competitorValue.textContent = this.value + '%';
      });
    }

    console.log('Discount sliders set up');
  }

  // Apply wizard configuration to calculator
  function applyWizardConfiguration() {
    console.log('Applying wizard configuration...');

    if (!window.calculator) {
      console.warn('Calculator not found, cannot apply configuration');
      return;
    }

    // Get values from the wizard
    const selectedVendor = document.querySelector('.vendor-card.selected');
    const deviceCount = parseInt(document.getElementById('wizard-device-count')?.value || 300);
    const yearsToProject = parseInt(document.getElementById('wizard-years-to-project')?.value || 1);
    const multipleLocations = document.getElementById('wizard-multiple-locations')?.checked || false;
    const locationCount = parseInt(document.getElementById('wizard-location-count')?.value || 2);
    const complexAuthentication = document.getElementById('wizard-complex-authentication')?.checked || false;
    const legacyDevices = document.getElementById('wizard-legacy-devices')?.checked || false;
    const legacyPercentage = parseInt(document.getElementById('wizard-legacy-percentage')?.value || 10);

    // Get Portnox pricing values
    const portnoxPrice = parseInt(document.getElementById('portnox-price')?.value || 5);
    const portnoxDiscount = parseInt(document.getElementById('portnox-discount')?.value || 25);
    const competitorDiscount = parseInt(document.getElementById('competitor-discount')?.value || 0);

    // Get cost values
    const hardwareCost = parseInt(document.getElementById('cost-hardware')?.value || 10000);
    const licensingCost = parseInt(document.getElementById('cost-licensing')?.value || 25000);
    const maintenanceCost = parseInt(document.getElementById('cost-maintenance')?.value || 15000);
    const implementationCost = parseInt(document.getElementById('cost-implementation')?.value || 30000);
    const personnelCost = parseInt(document.getElementById('cost-personnel')?.value || 100000);

    // Update device count in the main calculator
    const deviceCountInput = document.getElementById('device-count');
    if (deviceCountInput) {
      deviceCountInput.value = deviceCount;
    }

    // Update organization size based on device count
    const orgSizeSelect = document.getElementById('organization-size');
    if (orgSizeSelect) {
      if (deviceCount <= 1000) {
        orgSizeSelect.value = 'small';
      } else if (deviceCount <= 5000) {
        orgSizeSelect.value = 'medium';
      } else {
        orgSizeSelect.value = 'large';
      }
    }

    // Update years to project
    const yearsInput = document.getElementById('years-to-project');
    if (yearsInput) {
      yearsInput.value = yearsToProject;
    }

    // Update multiple locations
    const multipleLocationsCheckbox = document.getElementById('multiple-locations');
    if (multipleLocationsCheckbox) {
      multipleLocationsCheckbox.checked = multipleLocations;

      // Trigger change event
      const event = new Event('change');
      multipleLocationsCheckbox.dispatchEvent(event);

      // Update location count if checkbox is checked
      if (multipleLocations) {
        const locationCountInput = document.getElementById('location-count');
        if (locationCountInput) {
          locationCountInput.value = locationCount;
        }
      }
    }

    // Update complex authentication
    const complexAuthCheckbox = document.getElementById('complex-authentication');
    if (complexAuthCheckbox) {
      complexAuthCheckbox.checked = complexAuthentication;
    }

    // Update legacy devices
    const legacyDevicesCheckbox = document.getElementById('legacy-devices');
    if (legacyDevicesCheckbox) {
      legacyDevicesCheckbox.checked = legacyDevices;

      // Trigger change event
      const event = new Event('change');
      legacyDevicesCheckbox.dispatchEvent(event);

      // Update legacy percentage if checkbox is checked
      if (legacyDevices) {
        const legacyPercentageInput = document.getElementById('legacy-percentage');
        if (legacyPercentageInput) {
          legacyPercentageInput.value = legacyPercentage;
          // Update displayed value
          const legacyValueEl = document.getElementById('legacy-percentage-value');
          if (legacyValueEl) {
            legacyValueEl.textContent = legacyPercentage + '%';
          }
        }
      }
    }

    // Update vendor selection in the main calculator
    if (selectedVendor) {
      const vendorId = selectedVendor.getAttribute('data-vendor');
      const vendorCards = document.querySelectorAll('.vendor-selection-card .vendor-card');
      vendorCards.forEach(card => {
        const vendor = card.getAttribute('data-vendor');
        if (vendor === vendorId) {
          // Check if it's already selected
          if (!card.classList.contains('selected')) {
            card.click();
          }
        }
      });
    }

    // Update cost configuration in calculator
    if (window.calculator.data) {
      // Set Portnox pricing
      window.calculator.data.portnoxPrice = portnoxPrice;
      window.calculator.data.portnoxDiscount = portnoxDiscount;
      window.calculator.data.competitorDiscount = competitorDiscount;

      // Set cost factors
      if (!window.calculator.data.costFactors) {
        window.calculator.data.costFactors = {};
      }

      window.calculator.data.costFactors.hardware = hardwareCost;
      window.calculator.data.costFactors.software = licensingCost;
      window.calculator.data.costFactors.maintenance = maintenanceCost;
      window.calculator.data.costFactors.implementation = implementationCost;
      window.calculator.data.costFactors.personnel = personnelCost;
    }

    // Run calculation
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
      // Trigger click event on calculate button
      calculateBtn.click();
    } else if (typeof window.calculator.calculate === 'function') {
      // Call calculate method directly
      window.calculator.calculate();
    }

    console.log('Wizard configuration applied to calculator');
  }

  // =============================================
  // PART 4: Fix PDF Generation
  // =============================================
  function fixPDFGeneration() {
    console.log('Fixing PDF generation...');

    if (window.PDFReportGenerator) {
      // Patch the generateCompleteReport method
      const originalGenerateCompleteReport = window.PDFReportGenerator.prototype.generateCompleteReport;
      window.PDFReportGenerator.prototype.generateCompleteReport = function() {
        try {
          // Fix missing orgSize property
          if (this.data && !this.data.orgSize) {
            const orgSizeEl = document.getElementById('organization-size');
            this.data.orgSize = orgSizeEl ? orgSizeEl.value : 'Small';
          }

          return originalGenerateCompleteReport.apply(this, arguments);
        } catch (error) {
          console.error('Error in PDF generation:', error);

          // Create a fallback report
          this.createCoverPage('TCO Analysis');

          this.doc.setFontSize(16);
          this.doc.setTextColor(27, 103, 178);
          this.doc.text('Executive Summary', 20, 30);

          this.doc.setFontSize(12);
          this.doc.setTextColor(0, 0, 0);
          this.doc.text('This report provides a cost comparison between Portnox Cloud', 20, 50);
          this.doc.text('and traditional on-premises NAC solutions.', 20, 60);

          if (this.data) {
            let y = 80;

            if (this.data.totalSavings) {
              this.doc.text(`Total savings: $${this.data.totalSavings.toLocaleString()}`, 20, y);
              y += 10;
            }

            if (this.data.savingsPercentage) {
              this.doc.text(`Percentage savings: ${this.data.savingsPercentage}%`, 20, y);
              y += 10;
            }

            if (this.data.deviceCount) {
              this.doc.text(`Device count: ${this.data.deviceCount.toLocaleString()}`, 20, y);
              y += 10;
            }

            if (this.data.yearsToProject) {
              this.doc.text(`Years projected: ${this.data.yearsToProject}`, 20, y);
              y += 10;
            }
          }
        }
      };

      // Add industry and compliance sections to PDF reports
      const originalCreateExecutiveSummary = window.PDFReportGenerator.prototype.createExecutiveSummary;
      window.PDFReportGenerator.prototype.createExecutiveSummary = function() {
        // Call original method
        if (originalCreateExecutiveSummary) {
          originalCreateExecutiveSummary.apply(this, arguments);
        }

        // Add industry insights section
        this.doc.setFontSize(16);
        this.doc.setTextColor(27, 103, 178);
        this.doc.text('Industry Insights', 20, 160);

        this.doc.setFontSize(12);
        this.doc.setTextColor(0, 0, 0);

        let industry = 'Enterprise';
        const industrySelector = document.getElementById('industry-selector');
        if (industrySelector && industrySelector.value && industrySelector.value !== 'none') {
          industry = industrySelector.options[industrySelector.selectedIndex].text;
        }

        let y = 175;

        // Industry insights
        this.doc.text(`Industry: ${industry}`, 20, y);
        y += 10;

        this.doc.text('Key Industry Recommendations:', 20, y);
        y += 10;

        const recommendations = [
          'Implement a cloud-based NAC solution for centralized management',
          'Focus on integration with existing security infrastructure',
          'Consider a phased deployment approach, starting with critical segments',
          'Ensure proper device profiling capabilities for diverse device types'
        ];

        recommendations.forEach(recommendation => {
          this.doc.text(`• ${recommendation}`, 25, y);
          y += 8;
        });

        y += 10;

        // Compliance insights
        this.doc.text('Compliance Considerations:', 20, y);
        y += 10;

        const complianceOptions = document.querySelectorAll('.compliance-option.selected');
        if (complianceOptions && complianceOptions.length > 0) {
          Array.from(complianceOptions).forEach(option => {
            const complianceName = option.querySelector('h4').textContent;
            this.doc.text(`• ${complianceName}: Integrated compliance templates with automated monitoring`, 25, y);
            y += 8;
          });
        } else {
          this.doc.text('• Standard compliance frameworks supported with built-in templates', 25, y);
          y += 8;
          this.doc.text('• Automated compliance reporting and continuous monitoring', 25, y);
          y += 8;
        }

        // Add cloud migration recommendations
        this.doc.addPage();
        this.doc.setFontSize(16);
        this.doc.setTextColor(27, 103, 178);
        this.doc.text('Cloud Migration Recommendations', 20, 20);

        this.doc.setFontSize(12);
        this.doc.setTextColor(0, 0, 0);

        y = 35;

        this.doc.text('Migration Best Practices:', 20, y);
        y += 10;

        const migrationPractices = [
          'Implement a phased migration approach with clearly defined milestones',
          'Start with monitoring mode before enforcing policies',
          'Migrate non-critical segments first to validate configuration',
          'Establish clear success criteria for each migration phase',
          'Conduct thorough testing before moving to production',
          'Maintain the ability to roll back changes if necessary'
        ];

        migrationPractices.forEach(practice => {
          this.doc.text(`• ${practice}`, 25, y);
          y += 8;
        });

        y += 10;

        // Key Portnox advantages
        this.doc.text('Key Portnox Cloud Advantages:', 20, y);
        y += 10;

        const advantages = [
          'Zero hardware footprint - eliminates appliance costs and maintenance',
          'Rapid deployment - typically 75% faster than on-premises solutions',
          'Simplified management through a unified cloud interface',
          'Automatic updates without maintenance windows or downtime',
          'Seamless multi-site management from a single console',
          'Subscription-based pricing with predictable operational expenses'
        ];

        advantages.forEach(advantage => {
          this.doc.text(`• ${advantage}`, 25, y);
          y += 8;
        });
      };

      // Patch the createCoverPage method
      const originalCreateCoverPage = window.PDFReportGenerator.prototype.createCoverPage;
      window.PDFReportGenerator.prototype.createCoverPage = function() {
        try {
          // Properly add Portnox logo
          const logoImg = document.querySelector('.logo img');
          if (logoImg && logoImg.complete && logoImg.naturalHeight !== 0) {
            try {
              this.doc.addImage(logoImg.src, 'PNG', 20, 20, 40, 20);
              console.log('Logo added to PDF cover page');
            } catch (e) {
              console.warn('Error adding logo to PDF:', e);
              // Add text as fallback
              this.doc.setFontSize(16);
              this.doc.setTextColor(27, 103, 178); // #1B67B2
              this.doc.text('Portnox', 20, 30);
            }
          }

          return originalCreateCoverPage.apply(this, arguments);
        } catch (error) {
          console.error('Error in PDF cover page:', error);

          // Create a simple cover page
          this.doc.setFontSize(24);
          this.doc.setTextColor(27, 103, 178);
          this.doc.text('Portnox TCO Analysis', 105, 60, null, null, 'center');

          this.doc.setFontSize(16);
          this.doc.setTextColor(0, 0, 0);
          this.doc.text('Generated on ' + new Date().toLocaleDateString(), 105, 80, null, null, 'center');

          this.doc.addPage();
        }
      };

      // Patch UIController.exportToPDF
      if (window.UIController && typeof window.UIController.exportToPDF === 'function') {
        const originalExportToPDF = window.UIController.exportToPDF;

        window.UIController.exportToPDF = function(type) {
          // Ensure calculator has valid data
          if (window.calculator) {
            if (!window.calculator.data) {
              window.calculator.data = {};
            }

            // Add required fields to prevent errors
            if (!window.calculator.data.orgSize) {
              const orgSizeEl = document.getElementById('organization-size');
              window.calculator.data.orgSize = orgSizeEl ? orgSizeEl.value : 'Small';
            }
          }

          // Call original method with try/catch
          try {
            return originalExportToPDF.apply(this, arguments);
          } catch (error) {
            console.error('Error in PDF export:', error);
            alert('Could not generate PDF: ' + error.message);
          }
        };
      }

      console.log('PDF generation fixed');
    } else {
      console.warn('PDFReportGenerator not found, skipping fix');
    }
  }

  // =============================================
  // PART 5: Fix Chart Rendering
  // =============================================
  function fixChartRendering() {
    console.log('Fixing chart rendering...');

    // Create chart registry if not exists
    window.chartRegistry = window.chartRegistry || {};

    // Apply chart rendering fixes
    if (window.ChartManager) {
      console.log('ChartManager found, skipping chart fix');
      return;
    }

    // Create chart manager if it doesn't exist
    window.ChartManager = {
      charts: {},

      // Safely destroy a chart before creating a new one
      destroyChart: function(canvasId) {
        if (this.charts[canvasId]) {
          this.charts[canvasId].destroy();
          delete this.charts[canvasId];
          console.log(`Chart destroyed: ${canvasId}`);
        }
      },

      // Create a new chart after destroying any existing one
      createChart: function(canvasId, config) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
          console.warn(`Canvas element not found: ${canvasId}`);
          return null;
        }

        // Destroy existing chart
        this.destroyChart(canvasId);

        // Create new chart
        try {
          const ctx = canvas.getContext('2d');
          const chart = new Chart(ctx, config);
          this.charts[canvasId] = chart;
          console.log(`Chart created: ${canvasId}`);
          return chart;
        } catch (error) {
          console.error(`Error creating chart ${canvasId}:`, error);
          return null;
        }
      },

      // Initialize all charts
      initializeCharts: function(data) {
        if (!data) {
          console.warn('No calculator data provided for chart initialization');
          return;
        }

        // Fix canvas sizing
        this.fixCanvasSizing();

        // Initialize all charts
        this.createTCOComparisonChart(data);
        this.createCumulativeCostChart(data);
        this.createROIChart(data);
        this.createCostBreakdownCharts(data);
        this.createFeatureComparisonChart(data);
        this.createImplementationComparisonChart(data);

        console.log('All charts initialized');
      },

      // Fix canvas sizing
      fixCanvasSizing: function() {
        document.querySelectorAll('.chart-container').forEach(container => {
          container.style.height = '300px';
          container.style.display = 'block';
          container.style.position = 'relative';
          container.style.width = '100%';

          const canvas = container.querySelector('canvas');
          if (canvas) {
            canvas.style.display = 'block';
          }
        });
      },

      // Create TCO comparison chart
      createTCOComparisonChart: function(data) {
        const config = {
          type: 'bar',
          data: {
            labels: ['Portnox Cloud', data.currentVendor || 'Current Vendor'],
            datasets: [
              {
                label: 'Hardware',
                backgroundColor: '#1B67B2',
                data: [0, data.competitorHardwareCost || 40000]
              },
              {
                label: 'Software',
                backgroundColor: '#65BD44',
                data: [data.portnoxSoftwareCost || 25000, data.competitorSoftwareCost || 35000]
              },
              {
                label: 'Implementation',
                backgroundColor: '#FF9F40',
                data: [data.portnoxImplementationCost || 15000, data.competitorImplementationCost || 40000]
              },
              {
                label: 'Maintenance',
                backgroundColor: '#FF6384',
                data: [data.portnoxMaintenanceCost || 10000, data.competitorMaintenanceCost || 25000]
              },
              {
                label: 'Support',
                backgroundColor: '#36A2EB',
                data: [data.portnoxSupportCost || 5000, data.competitorSupportCost || 15000]
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                stacked: true
              },
              y: {
                stacked: true,
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || '';
                    const value = context.raw || 0;
                    return label + ': $' + value.toLocaleString();
                  }
                }
              }
            }
          }
        };

        return this.createChart('tco-comparison-chart', config);
      },

      // Create cumulative cost chart
      createCumulativeCostChart: function(data) {
        const yearsToProject = data.yearsToProject || 1;
        const years = Array.from({length: yearsToProject + 1}, (_, i) => `Year ${i}`);

        const portnoxCosts = Array.from({length: yearsToProject + 1}, (_, i) => {
          return i === 0 ? (data.portnoxInitialCost || 15000) :
            (data.portnoxInitialCost || 15000) + (data.portnoxAnnualCost || 35000) * i;
        });

        const competitorCosts = Array.from({length: yearsToProject + 1}, (_, i) => {
          return i === 0 ? (data.competitorInitialCost || 40000) :
            (data.competitorInitialCost || 40000) + (data.competitorAnnualCost || 60000) * i;
        });

        const config = {
          type: 'line',
          data: {
            labels: years,
            datasets: [
              {
                label: data.currentVendor || 'Current Vendor',
                data: competitorCosts,
                borderColor: '#1B67B2',
                backgroundColor: 'rgba(27, 103, 178, 0.1)',
                fill: true
              },
              {
                label: 'Portnox Cloud',
                data: portnoxCosts,
                borderColor: '#65BD44',
                backgroundColor: 'rgba(101, 189, 68, 0.1)',
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || '';
                    const value = context.raw || 0;
                    return label + ': $' + value.toLocaleString();
                  }
                }
              }
            }
          }
        };

        return this.createChart('cumulative-cost-chart', config);
      },

      // Create ROI chart
      createROIChart: function(data) {
        const yearsToProject = data.yearsToProject || 1;
        const months = Array.from({length: yearsToProject * 12}, (_, i) => `Month ${i + 1}`);

        // Monthly costs
        const monthlySavings = (data.totalSavings || 100000) / (yearsToProject * 12);
        const cumulativeSavings = Array.from({length: yearsToProject * 12}, (_, i) => monthlySavings * (i + 1));
        const initialInvestment = (data.portnoxInitialCost || 15000) - (data.competitorInitialCost || 40000);
        const breakEvenPoint = initialInvestment > 0 ? Math.ceil(initialInvestment / monthlySavings) : 0;

        // Investment line showing initial investment and then flat
        const investmentLine = Array.from({length: yearsToProject * 12}, (_, i) => {
          return initialInvestment > 0 ? initialInvestment : 0;
        });

        // Find ROI point - where cumulative savings line crosses investment line
        const roiPoint = cumulativeSavings.findIndex(savings => savings >= initialInvestment);

        const config = {
          type: 'line',
          data: {
            labels: months,
            datasets: [
              {
                label: 'Cumulative Savings',
                data: cumulativeSavings,
                borderColor: '#65BD44',
                backgroundColor: 'rgba(101, 189, 68, 0.1)',
                fill: true
              },
              {
                label: 'Initial Investment',
                data: investmentLine,
                borderColor: '#1B67B2',
                borderDash: [5, 5],
                backgroundColor: 'rgba(27, 103, 178, 0)',
                fill: false
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || '';
                    const value = context.raw || 0;
                    return label + ': $' + value.toLocaleString();
                  }
                }
              },
              annotation: {
                annotations: {
                  breakEven: {
                    type: 'line',
                    xMin: roiPoint,
                    xMax: roiPoint,
                    borderColor: '#FF9F40',
                    borderWidth: 2,
                    label: {
                      content: 'Break-Even Point',
                      enabled: true,
                      position: 'top'
                    }
                  }
                }
              }
            }
          }
        };

        return this.createChart('roi-timeline-chart', config);
      },

      // Create cost breakdown charts
      createCostBreakdownCharts: function(data) {
        // Current vendor cost breakdown
        const competitorConfig = {
          type: 'doughnut',
          data: {
            labels: ['Hardware', 'Software', 'Implementation', 'Maintenance', 'Support', 'Personnel'],
            datasets: [{
              data: [
                data.competitorHardwareCost || 40000,
                data.competitorSoftwareCost || 35000,
                data.competitorImplementationCost || 40000,
                data.competitorMaintenanceCost || 25000,
                data.competitorSupportCost || 15000,
                data.competitorPersonnelCost || 100000
              ],
              backgroundColor: [
                '#1B67B2',
                '#65BD44',
                '#FF9F40',
                '#FF6384',
                '#36A2EB',
                '#9966FF'
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return label + ': $' + value.toLocaleString() + ' (' + percentage + '%)';
                  }
                }
              }
            }
          }
        };

        // Portnox cost breakdown
        const portnoxConfig = {
          type: 'doughnut',
          data: {
            labels: ['Software', 'Implementation', 'Maintenance', 'Support', 'Personnel'],
            datasets: [{
              data: [
                data.portnoxSoftwareCost || 25000,
                data.portnoxImplementationCost || 15000,
                data.portnoxMaintenanceCost || 10000,
                data.portnoxSupportCost || 5000,
                data.portnoxPersonnelCost || 50000
              ],
              backgroundColor: [
                '#65BD44',
                '#FF9F40',
                '#FF6384',
                '#36A2EB',
                '#9966FF'
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return label + ': $' + value.toLocaleString() + ' (' + percentage + '%)';
                  }
                }
              }
            }
          }
        };

        this.createChart('current-breakdown-chart', competitorConfig);
        return this.createChart('alternative-breakdown-chart', portnoxConfig);
      },

      // Create feature comparison chart
      createFeatureComparisonChart: function(data) {
        const config = {
          type: 'radar',
          data: {
            labels: ['Deployment Ease', 'Scalability', 'Integration', 'Maintenance', 'Cloud Readiness', 'Security'],
            datasets: [
              {
                label: 'Portnox Cloud',
                backgroundColor: 'rgba(101, 189, 68, 0.2)',
                borderColor: '#65BD44',
                pointBackgroundColor: '#65BD44',
                pointBorderColor: '#fff',
                data: [9, 9, 8, 9, 10, 9]
              },
              {
                label: data.currentVendor || 'Current Vendor',
                backgroundColor: 'rgba(27, 103, 178, 0.2)',
                borderColor: '#1B67B2',
                pointBackgroundColor: '#1B67B2',
                pointBorderColor: '#fff',
                data: [6, 7, 5, 6, 5, 7]
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                min: 0,
                max: 10,
                ticks: {
                  stepSize: 2
                }
              }
            }
          }
        };

        return this.createChart('feature-comparison-chart', config);
      },

      // Create implementation comparison chart
      createImplementationComparisonChart: function(data) {
        const config = {
          type: 'bar',
          data: {
            labels: ['Planning', 'Deployment', 'Configuration', 'Testing', 'Training', 'Go-Live'],
            datasets: [
              {
                label: 'Portnox Cloud',
                backgroundColor: '#65BD44',
                data: [2, 1, 2, 3, 2, 1]
              },
              {
                label: data.currentVendor || 'Current Vendor',
                backgroundColor: '#1B67B2',
                data: [5, 10, 15, 20, 10, 5]
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Days'
                }
              }
            }
          }
        };

        return this.createChart('implementation-comparison-chart', config);
      }
    };

    // Patch calculator's calculate method
    if (window.calculator && typeof window.calculator.calculate === 'function') {
      const originalCalculate = window.calculator.calculate;

      window.calculator.calculate = function() {
        console.log('Running patched calculate method...');

        // Call original method
        const result = originalCalculate.apply(this, arguments);

        // After calculation, initialize charts
        if (window.ChartManager && window.ChartManager.initializeCharts) {
          window.ChartManager.initializeCharts(this.data);
        }

        return result;
      };

      console.log('Calculator calculate method patched');
    }

    // Initialize charts with current data
    if (window.calculator && window.calculator.data && window.ChartManager && window.ChartManager.initializeCharts) {
      window.ChartManager.initializeCharts(window.calculator.data);
    }

    console.log('Chart rendering fixed');
  }

  // =============================================
  // PART 6: Initialize and Apply All Fixes
  // =============================================
  function init() {
    console.log('Initializing improved TCO Analyzer fix...');

    // Fix Portnox logo display
    fixLogoDisplay();

    // Set default calculator settings
    setDefaultCalculatorSettings();

    // Create improved wizard
    createImprovedWizard();

    // Fix PDF generation
    fixPDFGeneration();

    // Fix chart rendering
    fixChartRendering();

    // Remove "Load" and "Save Scenario" buttons
    const loadButton = document.getElementById('load-scenario-btn');
    const saveButton = document.getElementById('save-scenario-btn');

    if (loadButton) {
      loadButton.parentNode.removeChild(loadButton);
      console.log('Removed Load Scenario button');
    }

    if (saveButton) {
      saveButton.parentNode.removeChild(saveButton);
      console.log('Removed Save Scenario button');
    }

    // Move sensitivity analysis button to the calculator tab
    const sensitivityButton = document.getElementById('sensitivity-analysis-btn');
    const calculateButton = document.getElementById('calculate-btn');

    if (sensitivityButton && calculateButton) {
      const parentElement = calculateButton.parentElement;

      // Create a button container
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'calculator-buttons';
      buttonContainer.style.display = 'flex';
      buttonContainer.style.gap = '10px';
      buttonContainer.style.marginTop = '10px';

      // Move the calculate button to the container
      calculateButton.parentNode.removeChild(calculateButton);
      buttonContainer.appendChild(calculateButton);

      // Move the sensitivity analysis button to the container
      sensitivityButton.parentNode.removeChild(sensitivityButton);
      buttonContainer.appendChild(sensitivityButton);

      // Add the container to the parent
      parentElement.appendChild(buttonContainer);

      console.log('Moved sensitivity analysis button to calculator tab');
    }

    // Run initial calculation to update charts
    if (window.calculator && typeof window.calculator.calculate === 'function') {
      window.calculator.calculate();
    }

    console.log('Improved TCO Analyzer fix applied successfully');
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
