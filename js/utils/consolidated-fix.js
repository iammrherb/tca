/**
 * Consolidated Fix for TCO Analyzer
 * Fixes chart rendering, script loading, PDF generation, and UI issues
 */
(function() {
  console.log('Applying consolidated TCO Analyzer fix...');
  
  // =============================================
  // PART 1: Fix Logo Display
  // =============================================
  function fixLogoDisplay() {
    console.log('Fixing Portnox logo display...');
    
    const logoImg = document.querySelector('.logo img');
    if (logoImg) {
      // First try using the SVG version
      logoImg.src = 'img/portnox-logo.svg';
      
      // If that fails, fall back to PNG
      logoImg.onerror = function() {
        console.log('SVG logo failed to load, falling back to PNG');
        this.onerror = null; // Prevent infinite error loop
        this.src = 'img/portnox-logo.png';
      };
      
      console.log('Logo display fixed');
    } else {
      console.warn('Logo element not found');
    }
  }
  
  // =============================================
  // PART 2: Fix Cost Configuration Wizard
  // =============================================
  function fixCostConfigurationWizard() {
    console.log('Fixing Cost Configuration Wizard...');
    
    // Check if the wizard modal exists
    let wizardModal = document.getElementById('cost-analysis-modal-container');
    
    // If it doesn't exist, create it
    if (!wizardModal) {
      wizardModal = document.createElement('div');
      wizardModal.id = 'cost-analysis-modal-container';
      wizardModal.className = 'modal-container';
      
      // Create basic modal structure
      wizardModal.innerHTML = `
        <div class="cost-analysis-modal">
          <div class="cost-modal-header">
            <h2><i class="fas fa-dollar-sign"></i> Advanced Cost Analysis Wizard</h2>
            <button type="button" class="cost-modal-close">&times;</button>
          </div>
          <div class="cost-modal-body">
            <div class="wizard-content">
              <h3>Cost Configuration</h3>
              <p>Customize your cost parameters to tailor the TCO analysis to your organization.</p>
              
              <div class="cost-config-grid">
                <div class="cost-config-item">
                  <label for="device-count">Device Count</label>
                  <input type="number" id="device-count-wizard" min="1" max="100000" value="1000">
                </div>
                
                <div class="cost-config-item">
                  <label for="years-to-project">Years to Project</label>
                  <input type="number" id="years-to-project-wizard" min="1" max="10" value="3">
                </div>
                
                <div class="cost-config-item">
                  <label for="hardware-cost">Hardware Cost ($)</label>
                  <input type="number" id="hardware-cost" min="0" step="1000" value="10000">
                </div>
                
                <div class="cost-config-item">
                  <label for="software-cost">Software Cost ($)</label>
                  <input type="number" id="software-cost" min="0" step="1000" value="25000">
                </div>
                
                <div class="cost-config-item">
                  <label for="maintenance-cost">Maintenance Cost ($)</label>
                  <input type="number" id="maintenance-cost" min="0" step="1000" value="15000">
                </div>
                
                <div class="cost-config-item">
                  <label for="implementation-cost">Implementation Cost ($)</label>
                  <input type="number" id="implementation-cost" min="0" step="5000" value="30000">
                </div>
                
                <div class="cost-config-item">
                  <label for="personnel-cost">Personnel Cost ($)</label>
                  <input type="number" id="personnel-cost" min="0" step="10000" value="100000">
                </div>
                
                <div class="cost-config-item">
                  <label for="portnox-discount">Portnox Discount (%)</label>
                  <input type="range" id="portnox-discount" min="0" max="40" step="5" value="25">
                  <span id="portnox-discount-value">25%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="cost-modal-footer">
            <button id="wizard-cancel-btn" class="btn btn-outline">Cancel</button>
            <button id="wizard-apply-btn" class="btn btn-primary">Apply Configuration</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(wizardModal);
      
      // Add event listeners for the new modal
      const closeBtn = wizardModal.querySelector('.cost-modal-close');
      const cancelBtn = document.getElementById('wizard-cancel-btn');
      const applyBtn = document.getElementById('wizard-apply-btn');
      
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          wizardModal.classList.remove('visible');
        });
      }
      
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          wizardModal.classList.remove('visible');
        });
      }
      
      if (applyBtn) {
        applyBtn.addEventListener('click', () => {
          applyWizardConfiguration();
          wizardModal.classList.remove('visible');
        });
      }
      
      // Click outside to close
      wizardModal.addEventListener('click', (e) => {
        if (e.target === wizardModal) {
          wizardModal.classList.remove('visible');
        }
      });
      
      // Update discount value display
      const discountSlider = document.getElementById('portnox-discount');
      const discountValue = document.getElementById('portnox-discount-value');
      
      if (discountSlider && discountValue) {
        discountSlider.addEventListener('input', function() {
          discountValue.textContent = this.value + '%';
        });
      }
      
      console.log('Cost Configuration Wizard created');
    }
    
    // Create Cost Configuration button if it doesn't exist
    let costButton = document.getElementById('cost-wizard-btn');
    if (!costButton) {
      costButton = document.createElement('button');
      costButton.id = 'cost-wizard-btn';
      costButton.className = 'btn btn-modern';
      costButton.innerHTML = '<i class="fas fa-dollar-sign"></i> Cost Configuration';
      
      // Add click event
      costButton.addEventListener('click', function() {
        // Show cost configuration modal
        wizardModal.classList.add('visible');
        
        // Set initial values based on current calculator settings
        syncWizardWithCalculator();
      });
      
      // Add the button to the header actions
      const headerActions = document.querySelector('.header-actions');
      if (headerActions) {
        headerActions.prepend(costButton);
        console.log('Cost Configuration button added');
      }
    }
    
    console.log('Cost Configuration Wizard fixed');
  }
  
  // Sync wizard values with calculator settings
  function syncWizardWithCalculator() {
    if (window.calculator) {
      const data = window.calculator.data || {};
      
      // Set wizard values based on calculator data
      const deviceCountInput = document.getElementById('device-count-wizard');
      if (deviceCountInput && data.deviceCount) {
        deviceCountInput.value = data.deviceCount;
      }
      
      const yearsInput = document.getElementById('years-to-project-wizard');
      if (yearsInput && data.yearsToProject) {
        yearsInput.value = data.yearsToProject;
      }
      
      // Set cost values if available
      if (data.costFactors) {
        const hardwareCost = document.getElementById('hardware-cost');
        if (hardwareCost) hardwareCost.value = data.costFactors.hardware || 10000;
        
        const softwareCost = document.getElementById('software-cost');
        if (softwareCost) softwareCost.value = data.costFactors.software || 25000;
        
        const maintenanceCost = document.getElementById('maintenance-cost');
        if (maintenanceCost) maintenanceCost.value = data.costFactors.maintenance || 15000;
        
        const implementationCost = document.getElementById('implementation-cost');
        if (implementationCost) implementationCost.value = data.costFactors.implementation || 30000;
        
        const personnelCost = document.getElementById('personnel-cost');
        if (personnelCost) personnelCost.value = data.costFactors.personnel || 100000;
      }
    }
  }
  
  // Apply wizard configuration to calculator
  function applyWizardConfiguration() {
    if (window.calculator) {
      // Get values from wizard
      const deviceCount = parseInt(document.getElementById('device-count-wizard')?.value || 1000);
      const yearsToProject = parseInt(document.getElementById('years-to-project-wizard')?.value || 3);
      const hardwareCost = parseInt(document.getElementById('hardware-cost')?.value || 10000);
      const softwareCost = parseInt(document.getElementById('software-cost')?.value || 25000);
      const maintenanceCost = parseInt(document.getElementById('maintenance-cost')?.value || 15000);
      const implementationCost = parseInt(document.getElementById('implementation-cost')?.value || 30000);
      const personnelCost = parseInt(document.getElementById('personnel-cost')?.value || 100000);
      const portnoxDiscount = parseInt(document.getElementById('portnox-discount')?.value || 0);
      
      // Update calculator inputs
      const calculatorDeviceCount = document.getElementById('device-count');
      if (calculatorDeviceCount) calculatorDeviceCount.value = deviceCount;
      
      const calculatorYearsToProject = document.getElementById('years-to-project');
      if (calculatorYearsToProject) calculatorYearsToProject.value = yearsToProject;
      
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
      
      // Set custom cost factors if calculator supports it
      if (typeof window.calculator.setCustomCostFactors === 'function') {
        window.calculator.setCustomCostFactors({
          hardware: hardwareCost,
          software: softwareCost,
          maintenance: maintenanceCost,
          implementation: implementationCost,
          personnel: personnelCost,
          portnoxDiscount: portnoxDiscount
        });
      } else {
        // Store in calculator data directly
        if (!window.calculator.data) window.calculator.data = {};
        if (!window.calculator.data.costFactors) window.calculator.data.costFactors = {};
        
        window.calculator.data.costFactors.hardware = hardwareCost;
        window.calculator.data.costFactors.software = softwareCost;
        window.calculator.data.costFactors.maintenance = maintenanceCost;
        window.calculator.data.costFactors.implementation = implementationCost;
        window.calculator.data.costFactors.personnel = personnelCost;
        window.calculator.data.portnoxDiscount = portnoxDiscount;
      }
      
      // Run calculation
      if (typeof window.calculator.calculate === 'function') {
        window.calculator.calculate();
        console.log('Calculation updated with new configuration');
      }
    }
  }
  
  // =============================================
  // PART 3: Update Button Styles
  // =============================================
  function updateButtonStyles() {
    console.log('Updating button styles...');
    
    // Add modern button styles
    const style = document.createElement('style');
    style.textContent = `
      /* Modern button styles */
      .btn {
        border-radius: 8px;
        padding: 8px 16px;
        font-weight: 500;
        transition: all 0.2s ease;
        border: 1px solid transparent;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 14px;
      }
      
      .btn i {
        font-size: 16px;
      }
      
      .btn-primary {
        background: #1B67B2;
        color: white;
        border-color: #1B67B2;
      }
      
      .btn-primary:hover {
        background: #145192;
        box-shadow: 0 4px 8px rgba(27, 103, 178, 0.2);
        transform: translateY(-1px);
      }
      
      .btn-secondary {
        background: #65BD44;
        color: white;
        border-color: #65BD44;
      }
      
      .btn-secondary:hover {
        background: #54A336;
        box-shadow: 0 4px 8px rgba(101, 189, 68, 0.2);
        transform: translateY(-1px);
      }
      
      .btn-outline {
        background: transparent;
        color: #1B67B2;
        border-color: #1B67B2;
      }
      
      .btn-outline:hover {
        background: rgba(27, 103, 178, 0.05);
        box-shadow: 0 2px 4px rgba(27, 103, 178, 0.1);
      }
      
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
      
      .btn-sm {
        padding: 6px 12px;
        font-size: 12px;
      }
      
      .btn-lg {
        padding: 10px 20px;
        font-size: 16px;
      }
      
      /* Cost Configuration Wizard Styles */
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
        max-width: 800px;
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
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
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
        padding: 20px;
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
      
      .cost-config-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      
      .cost-config-item {
        margin-bottom: 10px;
      }
      
      .cost-config-item label {
        display: block;
        font-weight: 500;
        margin-bottom: 8px;
        color: #333;
      }
      
      .cost-config-item input[type="number"] {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 14px;
        transition: border-color 0.2s ease;
      }
      
      .cost-config-item input[type="number"]:focus {
        border-color: #1B67B2;
        outline: none;
        box-shadow: 0 0 0 2px rgba(27, 103, 178, 0.2);
      }
      
      .cost-config-item input[type="range"] {
        width: 100%;
        height: 6px;
        -webkit-appearance: none;
        background: #ddd;
        border-radius: 3px;
        margin-top: 10px;
      }
      
      .cost-config-item input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #1B67B2;
        cursor: pointer;
      }
    `;
    
    document.head.appendChild(style);
    
    // Update existing buttons to modern styles
    document.querySelectorAll('.btn-primary').forEach(button => {
      button.classList.add('btn-modern');
    });
    
    document.querySelectorAll('.calculate-btn').forEach(button => {
      button.classList.add('btn-modern');
    });
    
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('mousedown', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        
        ripple.classList.add('active');
        
        setTimeout(() => {
          ripple.remove();
        }, 500);
      });
    });
    
    console.log('Button styles updated');
  }
  
  // =============================================
  // PART 4: Fix ComplianceInsights Errors
  // =============================================
  function fixComplianceInsights() {
    console.log('Fixing ComplianceInsights errors...');
    
    // Remove any existing ComplianceInsights class/instances
    if (window.ComplianceInsights) {
      console.log('Found existing ComplianceInsights, removing...');
      delete window.ComplianceInsights;
      delete window.complianceInsights;
    }
    
    // Remove any existing script tags for compliance-insights.js
    document.querySelectorAll('script[src*="compliance-insights.js"]').forEach(script => {
      script.remove();
      console.log('Removed compliance-insights.js script tag');
    });
    
    // Create a single definitive implementation of ComplianceInsights
    window.ComplianceInsights = class {
      constructor() {
        this.industryData = {};
        this.currentIndustry = null;
        
        // Initialize once the DOM is ready
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => this._init());
        } else {
          this._init();
        }
        
        console.log('ComplianceInsights initialized correctly');
      }
      
      _init() {
        // Load industry data if available
        if (window.industryTemplates) {
          this.industryData = window.industryTemplates;
        } else if (window.enhancedIndustryTemplates) {
          this.industryData = window.enhancedIndustryTemplates;
        }
        
        // Setup event listener for industry selector
        const industrySelector = document.getElementById('industry-selector');
        if (industrySelector) {
          industrySelector.addEventListener('change', () => {
            this.currentIndustry = industrySelector.value;
            this.updateComplianceInsights();
          });
          
          // If industry already selected, update insights
          if (industrySelector.value && industrySelector.value !== 'none') {
            this.currentIndustry = industrySelector.value;
            this.updateComplianceInsights();
          }
        }
      }
      
      updateComplianceInsights() {
        if (!this.currentIndustry || this.currentIndustry === 'none' || !this.industryData[this.currentIndustry]) {
          this.clearComplianceInsights();
          return;
        }
        
        const industry = this.industryData[this.currentIndustry];
        const complianceInfo = industry.complianceInfo;
        
        if (!complianceInfo) {
          this.clearComplianceInsights();
          return;
        }
        
        // Update compliance container
        const container = document.getElementById('compliance-info-container');
        if (!container) return;
        
        container.innerHTML = '';
        const card = document.createElement('div');
        card.className = 'compliance-info-card';
        
        card.innerHTML = `
          <h3>${complianceInfo.title || industry.name + ' Compliance Requirements'}</h3>
          <p>${complianceInfo.details}</p>
          <h4>Key Requirements</h4>
          <ul class="compliance-requirements">
            ${(complianceInfo.keyRequirements || []).map(req => `<li>${req}</li>`).join('')}
          </ul>
          <button class="btn btn-outline btn-sm view-details-btn" id="view-compliance-details-btn">
            <i class="fas fa-external-link-alt"></i> View Detailed Analysis
          </button>
        `;
        
        container.appendChild(card);
        container.classList.remove('hidden');
        
        // Add event listener to the details button
        const detailsBtn = document.getElementById('view-compliance-details-btn');
        if (detailsBtn) {
          detailsBtn.addEventListener('click', () => {
            // Try to activate industry tab if it exists
            const industryTab = document.querySelector('[data-tab="industry-tab"]');
            if (industryTab) {
              industryTab.click();
            }
          });
        }
      }
      
      clearComplianceInsights() {
        const container = document.getElementById('compliance-info-container');
        if (container) {
          container.innerHTML = '';
          container.classList.add('hidden');
        }
      }
      
      refreshComplianceInsights() {
        this.updateComplianceInsights();
      }
    };
    
    // Create singleton instance
    if (!window.complianceInsights) {
      window.complianceInsights = new window.ComplianceInsights();
      console.log('Created new ComplianceInsights instance');
    }
    
    console.log('ComplianceInsights fixed');
  }
  
  // =============================================
  // PART 5: Fix PDF Generation Errors
  // =============================================
  function fixPDFGeneration() {
    console.log('Fixing PDF generation errors...');
    
    // Check if jspdf is available
    if (!window.jspdf || !window.jspdf.jsPDF) {
      console.warn('jsPDF library not available - skipping PDF fix');
      return;
    }
    
    // Patch the PDF generator
    if (window.PDFReportGenerator) {
      console.log('Patching PDFReportGenerator...');
      
      // Patch the generateCompleteReport method
      const originalGenerateCompleteReport = window.PDFReportGenerator.prototype.generateCompleteReport;
      window.PDFReportGenerator.prototype.generateCompleteReport = function() {
        try {
          // Skip references to undefined orgSize
          if (this.data && !this.data.orgSize) {
            this.data.orgSize = 'Medium';
          }
          
          return originalGenerateCompleteReport.apply(this, arguments);
        } catch (error) {
          console.error('Error in original PDF generation:', error);
          
          // Fallback to a simplified report
          this.doc.setFontSize(18);
          this.doc.setTextColor(27, 103, 178);
          this.doc.text('TCO Analysis Report', 20, 20);
          
          this.doc.setFontSize(12);
          this.doc.setTextColor(0, 0, 0);
          this.doc.text('Generated on ' + new Date().toLocaleDateString(), 20, 30);
          
          if (this.data) {
            this.doc.setFontSize(14);
            this.doc.text('Summary', 20, 50);
            
            let y = 60;
            
            if (this.data.currentVendor) {
              this.doc.text(`Current Vendor: ${this.data.currentVendor}`, 20, y);
              y += 10;
            }
            
            if (this.data.deviceCount) {
              this.doc.text(`Device Count: ${this.data.deviceCount}`, 20, y);
              y += 10;
            }
            
            if (this.data.yearsToProject) {
              this.doc.text(`Years Projected: ${this.data.yearsToProject}`, 20, y);
              y += 10;
            }
            
            if (this.data.portnoxTotalCost && this.data.competitorTotalCost) {
              this.doc.text(`Portnox Cloud TCO: $${this.data.portnoxTotalCost.toLocaleString()}`, 20, y);
              y += 10;
              
              this.doc.text(`${this.data.currentVendor} TCO: $${this.data.competitorTotalCost.toLocaleString()}`, 20, y);
              y += 10;
              
              if (this.data.totalSavings) {
                this.doc.setTextColor(101, 189, 68);
                this.doc.text(`Total Savings: $${this.data.totalSavings.toLocaleString()}`, 20, y);
                this.doc.setTextColor(0, 0, 0);
                y += 20;
              }
            }
            
            this.doc.text('For a complete analysis, please run the Total Cost Analyzer with all required parameters.', 20, y);
          }
        }
      };
      
      // Patch the generateTechnicalReport method
      const originalGenerateTechnicalReport = window.PDFReportGenerator.prototype.generateTechnicalReport;
      window.PDFReportGenerator.prototype.generateTechnicalReport = function() {
        try {
          // Skip references to undefined orgSize
          if (this.data && !this.data.orgSize) {
            this.data.orgSize = 'Medium';
          }
          
          return originalGenerateTechnicalReport.apply(this, arguments);
        } catch (error) {
          console.error('Error in original technical PDF generation:', error);
          
          // Fallback to a simplified technical report
          this.doc.setFontSize(18);
          this.doc.setTextColor(27, 103, 178);
          this.doc.text('Technical Analysis Report', 20, 20);
          
          this.doc.setFontSize(12);
          this.doc.setTextColor(0, 0, 0);
          this.doc.text('Generated on ' + new Date().toLocaleDateString(), 20, 30);
          
          this.doc.setFontSize(14);
          this.doc.text('Technical Comparison Summary', 20, 50);
          
          this.doc.text('For a complete technical analysis, please run the Total Cost Analyzer with all required parameters.', 20, 60);
        }
      };
      
      // Patch the createCoverPage method
      const originalCreateCoverPage = window.PDFReportGenerator.prototype.createCoverPage;
      window.PDFReportGenerator.prototype.createCoverPage = function() {
        try {
          // Skip references to undefined orgSize
          if (this.data && !this.data.orgSize) {
            this.data.orgSize = 'Medium';
          }
          
          return originalCreateCoverPage.apply(this, arguments);
        } catch (error) {
          console.error('Error in original cover page generation:', error);
          
          // Fallback to a simplified cover page
          this.doc.setFontSize(24);
          this.doc.setTextColor(27, 103, 178);
          this.doc.text('Portnox TCO Analysis', 105, 60, null, null, 'center');
          
          this.doc.setFontSize(16);
          this.doc.setTextColor(0, 0, 0);
          this.doc.text('Generated on ' + new Date().toLocaleDateString(), 105, 80, null, null, 'center');
          
          this.doc.addPage();
        }
      };
      
      console.log('PDF Generator patched');
    } else {
      console.warn('PDFReportGenerator not found, skipping PDF fix');
    }
  }
  
  // =============================================
  // PART 6: Fix UI Controller Errors
  // =============================================
  function fixUIController() {
    console.log('Fixing UI Controller errors...');
    
    if (window.UIController) {
      // Patch the updateChartVisibility method
      if (typeof window.UIController.updateChartVisibility === 'function') {
        const originalUpdateChartVisibility = window.UIController.updateChartVisibility;
        
        window.UIController.updateChartVisibility = function(view) {
          try {
            // Add null checks for each element
            const allCharts = document.querySelectorAll('.chart-container');
            allCharts.forEach(chart => {
              if (chart) {
                if (chart.style) {
                  chart.style.display = 'none';
                }
              }
            });
            
            // Show charts for the current view
            const viewCharts = document.querySelectorAll(`.${view}-chart`);
            viewCharts.forEach(chart => {
              if (chart) {
                if (chart.style) {
                  chart.style.display = 'block';
                }
              }
            });
          } catch (error) {
            console.error('Error in chart visibility update:', error);
          }
        };
        
        console.log('UIController.updateChartVisibility patched');
      }
      
      // Patch the exportToPDF method
      if (typeof window.UIController.exportToPDF === 'function') {
        const originalExportToPDF = window.UIController.exportToPDF;
        
        window.UIController.exportToPDF = function(type) {
          try {
            // Ensure calculator has valid data
            if (window.calculator && !window.calculator.data) {
              window.calculator.data = {
                currentVendor: 'Current Vendor',
                deviceCount: 1000,
                yearsToProject: 3,
                orgSize: 'Medium'
              };
            }
            
            return originalExportToPDF.apply(this, arguments);
          } catch (error) {
            console.error('Error in PDF export:', error);
            alert('Could not generate PDF. Please ensure calculator data is complete.');
          }
        };
        
        console.log('UIController.exportToPDF patched');
      }
      
      console.log('UI Controller fixed');
    } else {
      console.warn('UIController not found, skipping UI fix');
    }
  }
  
  // =============================================
  // PART 7: Initialize and Apply All Fixes
  // =============================================
  function init() {
    console.log('Initializing consolidated fix...');
    
    // Fix logo display
    fixLogoDisplay();
    
    // Fix Cost Configuration Wizard
    fixCostConfigurationWizard();
    
    // Update button styles
    updateButtonStyles();
    
    // Fix ComplianceInsights
    fixComplianceInsights();
    
    // Fix PDF generation
    fixPDFGeneration();
    
    // Fix UI Controller
    fixUIController();
    
    console.log('All fixes applied successfully');
  }
  
  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
