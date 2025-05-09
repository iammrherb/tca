/**
 * TCO Wizard Fix
 * Restores full functionality to the TCO Wizard
 */
(function() {
  console.log("Initializing TCO Wizard Fix");
  
  // Execute when DOM is loaded
  document.addEventListener('DOMContentLoaded', initWizard);
  
  // Wait for wizard button to be available
  function initWizard() {
    const wizardButton = document.querySelector('.header-actions [data-target="#wizard-modal"], .header-actions button:contains("TCO Wizard")');
    
    if (!wizardButton) {
      console.log("TCO Wizard button not found, waiting...");
      setTimeout(initWizard, 500);
      return;
    }
    
    console.log("TCO Wizard button found, setting up wizard...");
    
    // Replace or update event listener
    const newButton = wizardButton.cloneNode(true);
    wizardButton.parentNode.replaceChild(newButton, wizardButton);
    
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      openTcoWizard();
    });
    
    // Ensure button is visible
    newButton.style.display = 'flex';
    if (newButton.textContent.trim() === "") {
      newButton.innerHTML = '<i class="fas fa-magic"></i> TCO Wizard';
    }
    
    console.log("TCO Wizard button initialized");
  }
  
  // Function to open TCO Wizard
  function openTcoWizard() {
    console.log("Opening TCO Wizard");
    
    // Check if wizard modal already exists
    let wizardModal = document.getElementById('tco-wizard-modal');
    
    if (!wizardModal) {
      // Create wizard modal
      wizardModal = document.createElement('div');
      wizardModal.id = 'tco-wizard-modal';
      wizardModal.className = 'modal';
      
      // Create wizard content
      wizardModal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>TCO Wizard</h2>
            <span class="close-button">&times;</span>
          </div>
          <div class="modal-body">
            <div class="wizard-container">
              <div class="wizard-steps">
                <div class="wizard-step active" data-step="1">
                  <div class="step-number">1</div>
                  <div class="step-label">Vendor Selection</div>
                </div>
                <div class="wizard-step" data-step="2">
                  <div class="step-number">2</div>
                  <div class="step-label">Industry & Compliance</div>
                </div>
                <div class="wizard-step" data-step="3">
                  <div class="step-number">3</div>
                  <div class="step-label">Organization Details</div>
                </div>
                <div class="wizard-step" data-step="4">
                  <div class="step-number">4</div>
                  <div class="step-label">Cost Configuration</div>
                </div>
                <div class="wizard-step" data-step="5">
                  <div class="step-number">5</div>
                  <div class="step-label">Results</div>
                </div>
              </div>
              
              <div class="wizard-step-content active" data-step="1">
                <h3>Select Your NAC Solution</h3>
                <p>Choose your current NAC vendor or select "No NAC" if you don't have a solution in place.</p>
                
                <div class="wizard-vendor-grid">
                  <!-- Vendor cards will be added here -->
                </div>
              </div>
              
              <div class="wizard-step-content" data-step="2">
                <h3>Industry & Compliance</h3>
                <p>Select your industry to see relevant compliance frameworks.</p>
                
                <div class="form-group">
                  <label for="wizard-industry">Industry</label>
                  <select id="wizard-industry" class="form-select">
                    <option value="">Select Industry...</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="financial">Financial Services</option>
                    <option value="retail">Retail</option>
                    <option value="education">Education</option>
                    <option value="government">Government</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="technology">Technology</option>
                    <option value="hospitality">Hospitality</option>
                  </select>
                </div>
                
                <div class="industry-details" style="display: none;">
                  <h4>Industry Profile</h4>
                  <p id="industry-description"></p>
                  
                  <h4>Compliance Requirements</h4>
                  <div class="compliance-badges" id="compliance-badges">
                    <!-- Compliance badges will be added here -->
                  </div>
                </div>
              </div>
              
              <div class="wizard-step-content" data-step="3">
                <h3>Organization Details</h3>
                <p>Provide details about your organization and environment.</p>
                
                <div class="form-grid">
                  <div class="form-group">
                    <label for="wizard-device-count">Total Devices</label>
                    <input type="number" id="wizard-device-count" value="1000" min="10">
                  </div>
                  
                  <div class="form-group">
                    <label for="wizard-location-count">Number of Locations</label>
                    <input type="number" id="wizard-location-count" value="1" min="1">
                  </div>
                  
                  <div class="form-group">
                    <label for="wizard-years">Years to Project</label>
                    <select id="wizard-years" class="form-select">
                      <option value="1">1 Year</option>
                      <option value="3" selected>3 Years</option>
                      <option value="5">5 Years</option>
                    </select>
                  </div>
                  
                  <div class="form-group">
                    <label for="wizard-legacy">Legacy Devices (%)</label>
                    <input type="number" id="wizard-legacy" value="30" min="0" max="100">
                  </div>
                </div>
              </div>
              
              <div class="wizard-step-content" data-step="4">
                <h3>Cost Configuration</h3>
                <p>Adjust cost parameters to match your environment.</p>
                
                <div class="form-grid">
                  <div class="form-group">
                    <label for="wizard-hardware-cost">Hardware Cost Multiplier</label>
                    <input type="number" id="wizard-hardware-cost" value="1.0" min="0.1" max="5.0" step="0.1">
                  </div>
                  
                  <div class="form-group">
                    <label for="wizard-license-cost">License Cost Multiplier</label>
                    <input type="number" id="wizard-license-cost" value="1.0" min="0.1" max="5.0" step="0.1">
                  </div>
                  
                  <div class="form-group">
                    <label for="wizard-implementation-cost">Implementation Cost Multiplier</label>
                    <input type="number" id="wizard-implementation-cost" value="1.0" min="0.1" max="5.0" step="0.1">
                  </div>
                  
                  <div class="form-group">
                    <label for="wizard-maintenance-cost">Maintenance Cost Multiplier</label>
                    <input type="number" id="wizard-maintenance-cost" value="1.0" min="0.1" max="5.0" step="0.1">
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="wizard-downtime-cost">Downtime Cost ($/hour)</label>
                  <input type="number" id="wizard-downtime-cost" value="5000" min="100">
                </div>
              </div>
              
              <div class="wizard-step-content" data-step="5">
                <h3>Results Preview</h3>
                <p>Here's a preview of your TCO analysis.</p>
                
                <div class="preview-card">
                  <div class="preview-grid">
                    <div class="preview-metric">
                      <div class="metric-label">Current Solution Cost</div>
                      <div class="metric-value" id="preview-current-cost">$350,000</div>
                    </div>
                    <div class="preview-metric">
                      <div class="metric-label">Portnox Cloud Cost</div>
                      <div class="metric-value" id="preview-portnox-cost">$220,000</div>
                    </div>
                    <div class="preview-metric highlight">
                      <div class="metric-label">Potential Savings</div>
                      <div class="metric-value" id="preview-savings">$130,000</div>
                      <div class="metric-secondary" id="preview-savings-percentage">37% savings</div>
                    </div>
                  </div>
                  
                  <div class="preview-chart-container">
                    <canvas id="preview-chart"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button id="wizard-prev-btn" class="btn btn-outline" disabled>Previous</button>
            <button id="wizard-next-btn" class="btn btn-primary">Next</button>
            <button id="wizard-finish-btn" class="btn btn-primary" style="display: none;">Apply Configuration</button>
          </div>
        </div>
      `;
      
      // Add modal to body
      document.body.appendChild(wizardModal);
      
      // Initialize wizard
      initializeWizardFunctionality(wizardModal);
    }
    
    // Show the modal
    wizardModal.style.display = 'block';
  }
  
  // Initialize wizard functionality
  function initializeWizardFunctionality(modal) {
    console.log("Initializing wizard functionality");
    
    // Get wizard elements
    const closeButton = modal.querySelector('.close-button');
    const nextButton = modal.querySelector('#wizard-next-btn');
    const prevButton = modal.querySelector('#wizard-prev-btn');
    const finishButton = modal.querySelector('#wizard-finish-btn');
    const steps = modal.querySelectorAll('.wizard-step');
    const contents = modal.querySelectorAll('.wizard-step-content');
    
    // Current step
    let currentStep = 1;
    const totalSteps = steps.length;
    
    // Close modal
    closeButton.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    
    // Close when clicking outside
    window.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
    
    // Next button
    nextButton.addEventListener('click', function() {
      if (currentStep < totalSteps) {
        goToStep(currentStep + 1);
      }
    });
    
    // Previous button
    prevButton.addEventListener('click', function() {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });
    
    // Finish button
    finishButton.addEventListener('click', function() {
      applyWizardConfiguration();
      modal.style.display = 'none';
    });
    
    // Step clicks
    steps.forEach(step => {
      step.addEventListener('click', function() {
        const stepNumber = parseInt(this.getAttribute('data-step'));
        if (stepNumber <= currentStep) {
          goToStep(stepNumber);
        }
      });
    });
    
    // Go to step
    function goToStep(step) {
      // Update current step
      currentStep = step;
      
      // Update step indicators
      steps.forEach(s => {
        const stepNumber = parseInt(s.getAttribute('data-step'));
        if (stepNumber < currentStep) {
          s.classList.remove('active');
          s.classList.add('completed');
        } else if (stepNumber === currentStep) {
          s.classList.add('active');
          s.classList.remove('completed');
        } else {
          s.classList.remove('active', 'completed');
        }
      });
      
      // Update content visibility
      contents.forEach(content => {
        const contentStep = parseInt(content.getAttribute('data-step'));
        if (contentStep === currentStep) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
      
      // Update buttons
      prevButton.disabled = currentStep === 1;
      
      if (currentStep === totalSteps) {
        nextButton.style.display = 'none';
        finishButton.style.display = 'inline-flex';
        updateResultsPreview();
      } else {
        nextButton.style.display = 'inline-flex';
        finishButton.style.display = 'none';
      }
      
      // Special step handling
      handleSpecialSteps();
    }
    
    // Handle special steps
    function handleSpecialSteps() {
      if (currentStep === 1) {
        populateVendorGrid();
      } else if (currentStep === 2) {
        setupIndustrySelector();
      } else if (currentStep === 5) {
        updateResultsPreview();
      }
    }
    
    // Populate vendor grid
    function populateVendorGrid() {
      const vendorGrid = modal.querySelector('.wizard-vendor-grid');
      if (!vendorGrid || vendorGrid.children.length > 0) return;
      
      const vendors = [
        { id: 'cisco', name: 'Cisco ISE', logo: 'img/vendors/cisco-logo.png' },
        { id: 'aruba', name: 'Aruba ClearPass', logo: 'img/vendors/aruba-logo.png' },
        { id: 'forescout', name: 'Forescout', logo: 'img/vendors/forescout-logo.png' },
        { id: 'fortinac', name: 'FortiNAC', logo: 'img/vendors/fortinac-logo.png' },
        { id: 'nps', name: 'Microsoft NPS', logo: 'img/vendors/microsoft-logo.png' },
        { id: 'securew2', name: 'SecureW2', logo: 'img/vendors/securew2-logo.png' },
        { id: 'portnox', name: 'Portnox Cloud', logo: 'img/vendors/portnox-logo.png' },
        { id: 'noNac', name: 'No NAC Solution', logo: 'img/icons/no-nac-icon.svg' }
      ];
      
      vendors.forEach(vendor => {
        const card = document.createElement('div');
        card.className = 'wizard-vendor-card';
        card.setAttribute('data-vendor', vendor.id);
        
        card.innerHTML = `
          <img src="${vendor.logo}" alt="${vendor.name}">
          <span>${vendor.name}</span>
        `;
        
        card.addEventListener('click', function() {
          // Remove active class from all cards
          modal.querySelectorAll('.wizard-vendor-card').forEach(c => {
            c.classList.remove('active');
          });
          
          // Add active class to clicked card
          this.classList.add('active');
        });
        
        vendorGrid.appendChild(card);
      });
      
      // Select first vendor by default
      vendorGrid.firstChild.click();
    }
    
    // Setup industry selector
    function setupIndustrySelector() {
      const industrySelector = modal.querySelector('#wizard-industry');
      const industryDetails = modal.querySelector('.industry-details');
      const industryDescription = modal.querySelector('#industry-description');
      const complianceBadges = modal.querySelector('#compliance-badges');
      
      if (!industrySelector || industrySelector._initialized) return;
      
      // Industry data
      const industryData = {
        healthcare: {
          description: "Healthcare organizations face unique challenges in securing medical devices, patient data, and maintaining compliance with strict regulations like HIPAA while ensuring easy access for clinical staff.",
          compliance: [
            { id: 'hipaa', name: 'HIPAA', color: '#4285F4' },
            { id: 'hitech', name: 'HITECH', color: '#34A853' },
            { id: 'pci', name: 'PCI DSS', color: '#FBBC05' }
          ]
        },
        financial: {
          description: "Financial institutions require robust security to protect sensitive financial data, customer information, and maintain compliance with regulations such as PCI DSS, SOX, and GLBA.",
          compliance: [
            { id: 'pci', name: 'PCI DSS', color: '#FBBC05' },
            { id: 'sox', name: 'SOX', color: '#4285F4' },
            { id: 'glba', name: 'GLBA', color: '#EA4335' },
            { id: 'finra', name: 'FINRA', color: '#34A853' }
          ]
        },
        retail: {
          description: "Retail environments need to secure both customer data and point-of-sale systems while maintaining smooth operations and excellent customer experience across physical and digital channels.",
          compliance: [
            { id: 'pci', name: 'PCI DSS', color: '#FBBC05' },
            { id: 'gdpr', name: 'GDPR', color: '#4285F4' },
            { id: 'ccpa', name: 'CCPA', color: '#EA4335' }
          ]
        },
        education: {
          description: "Educational institutions must balance open access with data protection, managing diverse devices across faculty, staff, and students while complying with FERPA and other education-specific regulations.",
          compliance: [
            { id: 'ferpa', name: 'FERPA', color: '#4285F4' },
            { id: 'coppa', name: 'COPPA', color: '#34A853' },
            { id: 'gdpr', name: 'GDPR', color: '#FBBC05' }
          ]
        },
        government: {
          description: "Government agencies require strict security controls to protect classified information and citizen data, with compliance needs spanning FISMA, NIST frameworks, and agency-specific requirements.",
          compliance: [
            { id: 'fisma', name: 'FISMA', color: '#EA4335' },
            { id: 'nist800-53', name: 'NIST 800-53', color: '#4285F4' },
            { id: 'fedramp', name: 'FedRAMP', color: '#34A853' },
            { id: 'cmmc', name: 'CMMC', color: '#FBBC05' }
          ]
        },
        manufacturing: {
          description: "Manufacturing environments must secure operational technology (OT) and IT systems, protecting intellectual property and ensuring production continuity while meeting industry-specific compliance standards.",
          compliance: [
            { id: 'nerc-cip', name: 'NERC CIP', color: '#EA4335' },
            { id: 'iec62443', name: 'IEC 62443', color: '#4285F4' },
            { id: 'nist-csf', name: 'NIST CSF', color: '#34A853' }
          ]
        },
        technology: {
          description: "Technology companies need to protect intellectual property and customer data while enabling innovation and maintaining compliance with global data protection regulations.",
          compliance: [
            { id: 'iso27001', name: 'ISO 27001', color: '#4285F4' },
            { id: 'gdpr', name: 'GDPR', color: '#EA4335' },
            { id: 'ccpa', name: 'CCPA', color: '#FBBC05' },
            { id: 'soc2', name: 'SOC 2', color: '#34A853' }
          ]
        },
        hospitality: {
          description: "Hospitality businesses must secure guest data and payment information across multiple locations and systems while maintaining a seamless guest experience and PCI DSS compliance.",
          compliance: [
            { id: 'pci', name: 'PCI DSS', color: '#FBBC05' },
            { id: 'gdpr', name: 'GDPR', color: '#4285F4' },
            { id: 'iso27001', name: 'ISO 27001', color: '#EA4335' }
          ]
        }
      };
      
      // Industry change event
      industrySelector.addEventListener('change', function() {
        const selectedIndustry = this.value;
        
        if (selectedIndustry && industryData[selectedIndustry]) {
          const industry = industryData[selectedIndustry];
          
          // Update description
          industryDescription.textContent = industry.description;
          
          // Update compliance badges
          complianceBadges.innerHTML = '';
          
          industry.compliance.forEach(compliance => {
            const badge = document.createElement('div');
            badge.className = 'compliance-badge';
            badge.style.backgroundColor = compliance.color;
            badge.textContent = compliance.name;
            complianceBadges.appendChild(badge);
          });
          
          // Show industry details
          industryDetails.style.display = 'block';
        } else {
          // Hide industry details
          industryDetails.style.display = 'none';
        }
      });
      
      industrySelector._initialized = true;
    }
    
    // Update results preview
    function updateResultsPreview() {
      // Get values from wizard
      const selectedVendor = modal.querySelector('.wizard-vendor-card.active')?.getAttribute('data-vendor') || 'cisco';
      const deviceCount = parseInt(modal.querySelector('#wizard-device-count').value) || 1000;
      const years = parseInt(modal.querySelector('#wizard-years').value) || 3;
      const hardwareCost = parseFloat(modal.querySelector('#wizard-hardware-cost').value) || 1.0;
      const licenseCost = parseFloat(modal.querySelector('#wizard-license-cost').value) || 1.0;
      
      // Calculate costs based on vendor and parameters
      let currentCost = 0;
      const portnoxCost = deviceCount * 48 * years * licenseCost; // $48 per device per year
      
      // Vendor-specific costs
      switch(selectedVendor) {
        case 'cisco':
          currentCost = deviceCount * 120 * years * licenseCost + deviceCount * 50 * hardwareCost;
          break;
        case 'aruba':
          currentCost = deviceCount * 90 * years * licenseCost + deviceCount * 40 * hardwareCost;
          break;
        case 'forescout':
          currentCost = deviceCount * 100 * years * licenseCost + deviceCount * 45 * hardwareCost;
          break;
        case 'fortinac':
          currentCost = deviceCount * 80 * years * licenseCost + deviceCount * 35 * hardwareCost;
          break;
        case 'nps':
          currentCost = deviceCount * 20 * years * licenseCost + deviceCount * 20 * hardwareCost;
          break;
        case 'securew2':
          currentCost = deviceCount * 70 * years * licenseCost;
          break;
        case 'noNac':
          currentCost = deviceCount * 10 * years; // Administrative overhead only
          break;
        default:
          currentCost = deviceCount * 100 * years * licenseCost + deviceCount * 40 * hardwareCost;
      }
      
      // Calculate savings
      const savings = currentCost - portnoxCost;
      const savingsPercentage = currentCost > 0 ? (savings / currentCost * 100).toFixed(0) : 0;
      
      // Update preview elements
      document.getElementById('preview-current-cost').textContent = '$' + currentCost.toLocaleString();
      document.getElementById('preview-portnox-cost').textContent = '$' + portnoxCost.toLocaleString();
      document.getElementById('preview-savings').textContent = '$' + savings.toLocaleString();
      document.getElementById('preview-savings-percentage').textContent = savingsPercentage + '% savings';
      
      // Update chart
      const chartCanvas = document.getElementById('preview-chart');
      if (chartCanvas && typeof Chart !== 'undefined') {
        // Destroy existing chart if any
        const existingChart = Chart.getChart(chartCanvas);
        if (existingChart) {
          existingChart.destroy();
        }
        
        // Create new chart
        new Chart(chartCanvas, {
          type: 'bar',
          data: {
            labels: ['Current Solution', 'Portnox Cloud'],
            datasets: [{
              label: 'Total Cost of Ownership',
              data: [currentCost, portnoxCost],
              backgroundColor: ['#05547C', '#65BD44']
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
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
    }
    
    // Apply wizard configuration
    function applyWizardConfiguration() {
      console.log("Applying wizard configuration");
      
      // Get configuration from wizard
      const selectedVendor = modal.querySelector('.wizard-vendor-card.active')?.getAttribute('data-vendor');
      const deviceCount = parseInt(modal.querySelector('#wizard-device-count').value);
      const locationCount = parseInt(modal.querySelector('#wizard-location-count').value);
      const years = parseInt(modal.querySelector('#wizard-years').value);
      const legacyPercentage = parseInt(modal.querySelector('#wizard-legacy').value);
      const hardwareCost = parseFloat(modal.querySelector('#wizard-hardware-cost').value);
      const licenseCost = parseFloat(modal.querySelector('#wizard-license-cost').value);
      const implementationCost = parseFloat(modal.querySelector('#wizard-implementation-cost').value);
      const maintenanceCost = parseFloat(modal.querySelector('#wizard-maintenance-cost').value);
      const downtimeCost = parseFloat(modal.querySelector('#wizard-downtime-cost').value);
      const industry = modal.querySelector('#wizard-industry').value;
      
      // Dispatch a custom event with the configuration
      const event = new CustomEvent('tcoWizardComplete', {
        detail: {
          vendor: selectedVendor,
          deviceCount,
          locationCount,
          years,
          legacyPercentage,
          hardwareCost,
          licenseCost,
          implementationCost,
          maintenanceCost,
          downtimeCost,
          industry
        }
      });
      
      document.dispatchEvent(event);
      
      // Update the UI to reflect the new configuration
      // This assumes your application has a way to update the main UI based on these parameters
      if (selectedVendor) {
        // Click the corresponding vendor card in the main UI
        const mainVendorCard = document.querySelector(`.vendor-card[data-vendor="${selectedVendor}"]`);
        if (mainVendorCard) {
          mainVendorCard.click();
        }
      }
      
      console.log("Wizard configuration applied");
    }
    
    // Initialize first step
    goToStep(1);
  }
  
  // Add CSS for wizard
  function addWizardStyles() {
    // Check if styles already exist
    if (document.getElementById('tco-wizard-styles')) return;
    
    // Create style element
    const style = document.createElement('style');
    style.id = 'tco-wizard-styles';
    
    // Add CSS
    style.textContent = `
      /* TCO Wizard Modal */
      .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }
      
      .modal-content {
        background-color: #fff;
        margin: 5% auto;
        width: 80%;
        max-width: 900px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        animation: modalFadeIn 0.3s;
      }
      
      @keyframes modalFadeIn {
        from {opacity: 0; transform: translateY(-20px);}
        to {opacity: 1; transform: translateY(0);}
      }
      
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        border-bottom: 1px solid #e0e0e0;
      }
      
      .modal-header h2 {
        margin: 0;
        color: #05547C;
        font-size: 1.5rem;
      }
      
      .close-button {
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;
        color: #666;
      }
      
      .close-button:hover {
        color: #333;
      }
      
      .modal-body {
        padding: 20px;
        max-height: 70vh;
        overflow-y: auto;
      }
      
      .modal-footer {
        padding: 15px 20px;
        border-top: 1px solid #e0e0e0;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
      
      /* Wizard Steps */
      .wizard-steps {
        display: flex;
        margin-bottom: 20px;
        overflow-x: auto;
        padding-bottom: 5px;
      }
      
      .wizard-step {
        display: flex;
        align-items: center;
        padding: 5px 15px;
        position: relative;
        cursor: pointer;
      }
      
      .wizard-step:not(:last-child)::after {
        content: '';
        position: absolute;
        top: 50%;
        right: -15px;
        width: 30px;
        height: 2px;
        background-color: #e0e0e0;
        z-index: 1;
      }
      
      .wizard-step.active:not(:last-child)::after,
      .wizard-step.completed:not(:last-child)::after {
        background-color: #65BD44;
      }
      
      .step-number {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #e0e0e0;
        color: #666;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        margin-right: 10px;
        z-index: 2;
      }
      
      .wizard-step.active .step-number {
        background-color: #65BD44;
        color: white;
      }
      
      .wizard-step.completed .step-number {
        background-color: #65BD44;
        color: white;
      }
      
      .step-label {
        color: #666;
        font-weight: 500;
      }
      
      .wizard-step.active .step-label {
        color: #05547C;
        font-weight: 600;
      }
      
      .wizard-step.completed .step-label {
        color: #05547C;
      }
      
      /* Wizard Content */
      .wizard-step-content {
        display: none;
        animation: fadeIn 0.3s;
      }
      
      .wizard-step-content.active {
        display: block;
      }
      
      .wizard-step-content h3 {
        color: #05547C;
        margin-top: 0;
        margin-bottom: 10px;
      }
      
      /* Form Elements */
      .form-group {
        margin-bottom: 15px;
      }
      
      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 5px;
        color: #666;
        font-weight: 500;
      }
      
      .form-select, .form-group input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        font-size: 1rem;
      }
      
      .form-select:focus, .form-group input:focus {
        border-color: #05547C;
        outline: none;
      }
      
      /* Vendor Grid */
      .wizard-vendor-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        gap: 15px;
        margin-top: 20px;
      }
      
      .wizard-vendor-card {
        background-color: white;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        padding: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .wizard-vendor-card:hover {
        border-color: #05547C;
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }
      
      .wizard-vendor-card.active {
        border-color: #65BD44;
        background-color: rgba(101, 189, 68, 0.05);
      }
      
      .wizard-vendor-card img {
        height: 40px;
        margin-bottom: 10px;
        object-fit: contain;
      }
      
      .wizard-vendor-card span {
        text-align: center;
        font-size: 0.9rem;
        font-weight: 500;
      }
      
      /* Industry Details */
      .industry-details {
        margin-top: 20px;
        padding: 15px;
        background-color: #f8f9fa;
        border-radius: 8px;
      }
      
      .industry-details h4 {
        margin-top: 0;
        margin-bottom: 10px;
        color: #05547C;
        font-size: 1.1rem;
      }
      
      .compliance-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 10px;
      }
      
      .compliance-badge {
        padding: 5px 10px;
        border-radius: 20px;
        color: white;
        font-size: 0.8rem;
        font-weight: 600;
      }
      
      /* Preview Card */
      .preview-card {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 20px;
      }
      
      .preview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
      }
      
      .preview-metric {
        background-color: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      }
      
      .preview-metric.highlight {
        background-color: rgba(101, 189, 68, 0.1);
      }
      
      .metric-label {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 5px;
      }
      
      .metric-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: #05547C;
      }
      
      .metric-secondary {
        font-size: 0.9rem;
        color: #65BD44;
        font-weight: 500;
        margin-top: 5px;
      }
      
      .preview-chart-container {
        height: 250px;
        margin-top: 20px;
      }
      
      /* Responsive */
      @media (max-width: 768px) {
        .modal-content {
          width: 95%;
          margin: 5% auto;
        }
        
        .wizard-steps {
          flex-wrap: wrap;
        }
        
        .wizard-step {
          margin-bottom: 10px;
        }
        
        .preview-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
    
    // Add to document
    document.head.appendChild(style);
  }
  
  // Add wizard styles
  addWizardStyles();
})();
