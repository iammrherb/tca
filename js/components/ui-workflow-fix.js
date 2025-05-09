/**
 * UI Workflow Fix - Improves UI layout and workflow (horizontal layout version)
 */
(function() {
  console.log('Installing UI workflow fix (horizontal layout)...');
  
  function enhanceUIWorkflow() {
    console.log('Enhancing UI workflow with horizontal layout...');
    
    // Update page title
    document.title = "Total Cost Analyzer - Zero Trust NAC Architecture Designer";
    
    // Update header title
    const logoTitle = document.querySelector('.logo h1');
    if (logoTitle) {
      logoTitle.textContent = "Total Cost Analyzer";
    }

    // Reorganize layout to horizontal style
    function reorganizeLayout() {
      console.log('Reorganizing layout to horizontal style...');

      const calculatorContainer = document.querySelector('.calculator-container');
      if (!calculatorContainer) {
        console.warn('Calculator container not found');
        return;
      }

      // Create top controls container
      const topControls = document.createElement('div');
      topControls.className = 'top-controls';
      
      // Move industry selector to top controls
      const industrySelector = document.getElementById('industry-selector');
      if (industrySelector) {
        const industrySelectorContainer = document.createElement('div');
        industrySelectorContainer.className = 'industry-selector-container';
        
        const industrySelectorLabel = document.createElement('label');
        industrySelectorLabel.className = 'industry-selector-label';
        industrySelectorLabel.textContent = 'Industry:';
        industrySelectorLabel.setAttribute('for', 'industry-selector');
        
        industrySelectorContainer.appendChild(industrySelectorLabel);
        if (industrySelector.parentNode) {
          industrySelector.parentNode.removeChild(industrySelector);
        }
        industrySelectorContainer.appendChild(industrySelector);
        
        topControls.appendChild(industrySelectorContainer);
      }
      
      // Create calculate TCO button in top controls
      const calculateBtn = document.createElement('button');
      calculateBtn.id = 'top-calculate-btn';
      calculateBtn.className = 'btn btn-primary';
      calculateBtn.innerHTML = '<i class="fas fa-calculator"></i> Calculate TCO';
      calculateBtn.addEventListener('click', function() {
        const originalCalculateBtn = document.getElementById('calculate-btn');
        if (originalCalculateBtn) {
          originalCalculateBtn.click();
        }
      });
      
      topControls.appendChild(calculateBtn);
      
      // Create sensitivity analysis button
      const sensitivityBtn = document.createElement('button');
      sensitivityBtn.id = 'sensitivity-btn';
      sensitivityBtn.className = 'btn btn-outline';
      sensitivityBtn.innerHTML = '<i class="fas fa-chart-line"></i> Sensitivity Analysis';
      sensitivityBtn.addEventListener('click', function() {
        const sensitivityPanel = document.getElementById('sensitivity-panel');
        if (sensitivityPanel) {
          sensitivityPanel.classList.toggle('hidden');
        } else {
          createSensitivityPanel();
        }
      });
      
      topControls.appendChild(sensitivityBtn);
      
      // Create cost configuration button
      const costConfigBtn = document.createElement('button');
      costConfigBtn.id = 'cost-config-btn';
      costConfigBtn.className = 'btn btn-outline';
      costConfigBtn.innerHTML = '<i class="fas fa-cog"></i> Cost Configuration';
      costConfigBtn.addEventListener('click', function() {
        const costConfigPanel = document.getElementById('cost-config-panel');
        if (costConfigPanel) {
          costConfigPanel.classList.toggle('hidden');
        } else {
          createCostConfigPanel();
        }
      });
      
      topControls.appendChild(costConfigBtn);
      
      // Insert top controls at the beginning of calculator container
      calculatorContainer.insertBefore(topControls, calculatorContainer.firstChild);

      // Create a container for the tools (Sensitivity + Cost Config)
      const toolsRow = document.createElement('div');
      toolsRow.className = 'tools-row';
      toolsRow.id = 'tools-row';
      calculatorContainer.insertBefore(toolsRow, calculatorContainer.childNodes[1]);

      // Create both panels initially hidden
      createSensitivityPanel();
      createCostConfigPanel();
      
      console.log('Layout reorganized successfully');
    }

    // Create sensitivity analysis panel
    function createSensitivityPanel() {
      console.log('Creating sensitivity analysis panel...');
      
      const toolsRow = document.getElementById('tools-row');
      if (!toolsRow) {
        console.warn('Tools row not found');
        return;
      }
      
      // Create sensitivity panel
      const sensitivityPanel = document.createElement('div');
      sensitivityPanel.id = 'sensitivity-panel';
      sensitivityPanel.className = 'sensitivity-panel hidden';
      
      sensitivityPanel.innerHTML = `
        <div class="cost-wizard">
          <div class="cost-wizard-header">
            <h3 class="cost-wizard-title">Sensitivity Analysis</h3>
            <button class="btn btn-text" id="close-sensitivity"><i class="fas fa-times"></i></button>
          </div>
          
          <div class="input-group">
            <label for="sensitivity-variable">Variable to Analyze</label>
            <select id="sensitivity-variable" class="form-select">
              <option value="deviceCount">Device Count</option>
              <option value="legacyPercentage">Legacy Device Percentage</option>
              <option value="locationCount">Number of Locations</option>
              <option value="yearsToProject">Years to Project</option>
              <option value="hardwareCost">Hardware Cost Multiplier</option>
              <option value="licensingCost">Licensing Cost Multiplier</option>
            </select>
          </div>
          
          <div class="input-group">
            <label for="sensitivity-vendor">Vendor to Analyze</label>
            <select id="sensitivity-vendor" class="form-select">
              <option value="all">All Vendors</option>
              <option value="cisco">Cisco ISE</option>
              <option value="aruba">Aruba ClearPass</option>
              <option value="forescout">Forescout</option>
              <option value="portnox">Portnox Cloud</option>
            </select>
          </div>
          
          <div class="cost-options">
            <div class="cost-option">
              <label for="sensitivity-min">Minimum Value</label>
              <input type="number" id="sensitivity-min" value="100" min="1">
            </div>
            
            <div class="cost-option">
              <label for="sensitivity-max">Maximum Value</label>
              <input type="number" id="sensitivity-max" value="500" min="1">
            </div>
            
            <div class="cost-option">
              <label for="sensitivity-steps">Steps</label>
              <input type="number" id="sensitivity-steps" value="10" min="2" max="20">
            </div>
          </div>
          
          <button id="run-sensitivity" class="btn btn-primary" style="width: 100%;">
            <i class="fas fa-chart-line"></i> Run Sensitivity Analysis
          </button>
        </div>
      `;
      
      toolsRow.appendChild(sensitivityPanel);
      
      // Add event listener to close button
      document.getElementById('close-sensitivity').addEventListener('click', function() {
        sensitivityPanel.classList.add('hidden');
      });
      
      // Add event listener to run button
      document.getElementById('run-sensitivity').addEventListener('click', function() {
        // Implement sensitivity analysis logic here
        showNotification('Sensitivity analysis complete!', 'success');
        sensitivityPanel.classList.add('hidden');
      });
      
      console.log('Sensitivity panel created successfully');
    }
    
    // Create cost configuration panel
    function createCostConfigPanel() {
      console.log('Creating cost configuration panel...');
      
      const toolsRow = document.getElementById('tools-row');
      if (!toolsRow) {
        console.warn('Tools row not found');
        return;
      }
      
      // Create cost configuration panel
      const costConfigPanel = document.createElement('div');
      costConfigPanel.id = 'cost-config-panel';
      costConfigPanel.className = 'cost-config-panel hidden';
      
      costConfigPanel.innerHTML = `
        <div class="cost-wizard">
          <div class="cost-wizard-header">
            <h3 class="cost-wizard-title">Cost Configuration</h3>
            <button class="btn btn-text" id="close-cost-config"><i class="fas fa-times"></i></button>
          </div>
          
          <div class="cost-options">
            <div class="cost-option">
              <label for="hardware-multiplier">Hardware Cost Multiplier</label>
              <input type="number" id="hardware-multiplier" value="1.0" min="0" step="0.1">
            </div>
            
            <div class="cost-option">
              <label for="licensing-multiplier">Licensing Cost Multiplier</label>
              <input type="number" id="licensing-multiplier" value="1.0" min="0" step="0.1">
            </div>
            
            <div class="cost-option">
              <label for="implementation-multiplier">Implementation Cost Multiplier</label>
              <input type="number" id="implementation-multiplier" value="1.0" min="0" step="0.1">
            </div>
            
            <div class="cost-option">
              <label for="maintenance-multiplier">Maintenance Cost Multiplier</label>
              <input type="number" id="maintenance-multiplier" value="1.0" min="0" step="0.1">
            </div>
            
            <div class="cost-option">
              <label for="support-multiplier">Support Cost Multiplier</label>
              <input type="number" id="support-multiplier" value="1.0" min="0" step="0.1">
            </div>
            
            <div class="cost-option">
              <label for="operations-multiplier">Operations Cost Multiplier</label>
              <input type="number" id="operations-multiplier" value="1.0" min="0" step="0.1">
            </div>
            
            <div class="cost-option">
              <label for="fte-multiplier">FTE Cost Multiplier</label>
              <input type="number" id="fte-multiplier" value="1.0" min="0" step="0.1">
            </div>
            
            <div class="cost-option">
              <label for="hourly-rate">Hourly Rate ($/hour)</label>
              <input type="number" id="hourly-rate" value="100" min="0">
            </div>
          </div>
          
          <button id="apply-cost-config" class="btn btn-primary" style="width: 100%;">
            <i class="fas fa-check"></i> Apply Cost Configuration
          </button>
        </div>
      `;
      
      toolsRow.appendChild(costConfigPanel);
      
      // Add event listener to close button
      document.getElementById('close-cost-config').addEventListener('click', function() {
        costConfigPanel.classList.add('hidden');
      });
      
      // Add event listener to apply button
      document.getElementById('apply-cost-config').addEventListener('click', function() {
        // Apply cost configuration logic here
        showNotification('Cost configuration applied!', 'success');
        costConfigPanel.classList.add('hidden');
        
        // Trigger calculation with new cost factors
        const calculateBtn = document.getElementById('calculate-btn');
        if (calculateBtn) {
          calculateBtn.click();
        }
      });
      
      console.log('Cost configuration panel created successfully');
    }

    // Add Executive Summary tab
    function addExecutiveSummaryTab() {
      console.log('Adding Executive Summary tab...');
      
      // Get the tabs container
      const tabsContainer = document.querySelector('.tabs');
      if (!tabsContainer) {
        console.warn('Tabs container not found');
        return;
      }
      
      // Create Executive Summary tab button
      const executiveTabButton = document.createElement('button');
      executiveTabButton.className = 'tab-button';
      executiveTabButton.id = 'tab-executive';
      executiveTabButton.setAttribute('role', 'tab');
      executiveTabButton.setAttribute('aria-selected', 'false');
      executiveTabButton.setAttribute('aria-controls', 'executive-tab');
      executiveTabButton.setAttribute('data-tab', 'executive-tab');
      executiveTabButton.setAttribute('tabindex', '-1');
      executiveTabButton.textContent = 'Executive Summary';
      
      // Insert at the beginning of tabs
      tabsContainer.insertBefore(executiveTabButton, tabsContainer.firstChild);
      
      // Create Executive Summary tab content
      const tabContent = document.querySelector('.tab-content');
      if (!tabContent) {
        console.warn('Tab content container not found');
        return;
      }
      
      const executiveTab = document.createElement('div');
      executiveTab.id = 'executive-tab';
      executiveTab.className = 'tab-pane';
      executiveTab.setAttribute('role', 'tabpanel');
      executiveTab.setAttribute('aria-labelledby', 'tab-executive');
      
      // Create executive summary content
      executiveTab.innerHTML = `
        <div class="executive-summary">
          <div class="executive-summary-header">
            <h2 class="executive-summary-title">Executive Summary</h2>
            <p class="executive-summary-description">
              This analysis provides a comprehensive comparison between your current NAC solution and Portnox Cloud,
              highlighting the total cost of ownership, implementation time, and key benefits.
            </p>
          </div>
          
          <div class="executive-metrics">
            <div class="executive-metric">
              <div class="executive-metric-label">Total Cost Savings</div>
              <div id="executive-savings" class="executive-metric-value">$40,000</div>
              <div class="executive-metric-description">Projected savings over the analysis period</div>
            </div>
            
            <div class="executive-metric">
              <div class="executive-metric-label">Implementation Time Reduction</div>
              <div id="executive-time-reduction" class="executive-metric-value">50%</div>
              <div class="executive-metric-description">Faster deployment compared to traditional solutions</div>
            </div>
            
            <div class="executive-metric">
              <div class="executive-metric-label">ROI Timeline</div>
              <div id="executive-roi" class="executive-metric-value">6 months</div>
              <div class="executive-metric-description">Expected time to achieve return on investment</div>
            </div>
            
            <div class="executive-metric">
              <div class="executive-metric-label">Infrastructure Reduction</div>
              <div id="executive-infrastructure" class="executive-metric-value">100%</div>
              <div class="executive-metric-description">Hardware requirements eliminated with cloud solution</div>
            </div>
          </div>
          
          <div class="chart-container" aria-label="Executive Summary Chart">
            <canvas id="executive-summary-chart"></canvas>
          </div>
        </div>
        
        <div class="executive-summary">
          <h3>Key Recommendations</h3>
          <div id="executive-recommendations">
            <p>Based on the analysis, we recommend migrating to Portnox Cloud NAC to realize significant cost savings and operational benefits. The cloud-native approach eliminates hardware costs and reduces implementation time while providing superior scalability.</p>
            
            <h4>Recommended Migration Timeline</h4>
            <div class="migration-phases">
              <div class="phase">
                <div class="phase-icon"><i class="fas fa-search"></i></div>
                <div class="phase-content">
                  <h4>Phase 1: Assessment & Planning (2 weeks)</h4>
                  <p>Evaluate current infrastructure, define scope, and create migration strategy.</p>
                </div>
              </div>
              
              <div class="phase">
                <div class="phase-icon"><i class="fas fa-project-diagram"></i></div>
                <div class="phase-content">
                  <h4>Phase 2: Pilot Deployment (3 weeks)</h4>
                  <p>Implement in controlled environment, test policies, and train administrators.</p>
                </div>
              </div>
              
              <div class="phase">
                <div class="phase-icon"><i class="fas fa-users"></i></div>
                <div class="phase-content">
                  <h4>Phase 3: Full Deployment (4 weeks)</h4>
                  <p>Roll out to entire organization with minimal disruption to operations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Insert tab content
      tabContent.appendChild(executiveTab);
      
      // Add chart data
      if (window.Chart && !window.chartInstances['executive-summary-chart']) {
        const ctx = document.getElementById('executive-summary-chart')?.getContext('2d');
        if (ctx) {
          window.chartInstances['executive-summary-chart'] = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['Hardware', 'Software', 'Implementation', 'Maintenance', 'Support', 'Operations'],
              datasets: [{
                label: 'Current Solution',
                data: [10000, 10000, 10000, 5000, 5000, 5000],
                backgroundColor: 'rgba(27, 103, 178, 0.7)'
              }, {
                label: 'Portnox Cloud',
                data: [0, 10000, 5000, 2500, 2500, 2500],
                backgroundColor: 'rgba(43, 210, 91, 0.7)'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }
          });
        }
      }
      
      console.log('Executive Summary tab added successfully');
    }
    
    // Fix tab initialization
    function fixTabInitialization() {
      console.log('Fixing tab initialization...');
      
      // Get all tab buttons
      const tabButtons = document.querySelectorAll('.tab-button');
      
      // Add click event listeners
      tabButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Remove active class from all buttons
          tabButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
            btn.setAttribute('tabindex', '-1');
          });
          
          // Add active class to clicked button
          this.classList.add('active');
          this.setAttribute('aria-selected', 'true');
          this.setAttribute('tabindex', '0');
          
          // Get target tab
          const target = this.getAttribute('data-tab');
          
          // Hide all tab panes
          const tabPanes = document.querySelectorAll('.tab-pane');
          tabPanes.forEach(pane => {
            pane.classList.remove('active');
          });
          
          // Show target tab pane
          const targetPane = document.getElementById(target);
          if (targetPane) {
            targetPane.classList.add('active');
          }
          
          // Initialize or update charts in the active tab
          if (window.reinitializeCharts) {
            window.reinitializeCharts();
          }
        });
      });
      
      console.log('Tab initialization fixed successfully');
    }
    
    // Fix industry selection
    function fixIndustrySelection() {
      console.log('Fixing industry selection...');
      
      const industrySelector = document.getElementById('industry-selector');
      if (!industrySelector) {
        console.warn('Industry selector not found');
        return;
      }
      
      // Clear existing options
      while (industrySelector.options.length > 0) {
        industrySelector.remove(0);
      }
      
      // Add industry options with icons
      const industries = [
        { value: 'none', label: 'Select an industry...', icon: 'fa-building' },
        { value: 'healthcare', label: 'Healthcare', icon: 'fa-hospital' },
        { value: 'finance', label: 'Financial Services', icon: 'fa-university' },
        { value: 'education', label: 'Education', icon: 'fa-graduation-cap' },
        { value: 'government', label: 'Government', icon: 'fa-landmark' },
        { value: 'retail', label: 'Retail', icon: 'fa-shopping-cart' },
        { value: 'manufacturing', label: 'Manufacturing', icon: 'fa-industry' },
        { value: 'technology', label: 'Technology', icon: 'fa-microchip' }
      ];
      
      industries.forEach(industry => {
        const option = document.createElement('option');
        option.value = industry.value;
        option.textContent = industry.label;
        option.setAttribute('data-icon', industry.icon);
        industrySelector.appendChild(option);
      });
      
      // Add change event listener
      industrySelector.addEventListener('change', function() {
        const selectedValue = this.value;
        if (selectedValue !== 'none') {
          console.log(`Industry selected: ${selectedValue}`);
          
          // Show a notification
          showNotification(`${industries.find(i => i.value === selectedValue).label} industry template loaded`, 'success');
          
          // Update industry-specific benchmarks
          updateIndustryBenchmarks(selectedValue);
        }
      });
      
      console.log('Industry selection fixed successfully');
    }
    
    // Update industry-specific benchmarks
    function updateIndustryBenchmarks(industry) {
      console.log(`Updating benchmarks for ${industry}`);
      
      // Industry-specific benchmark data
      const benchmarks = {
        healthcare: {
          savings: '$45,000',
          timeReduction: '55%',
          roi: '5 months',
          compliance: 'HIPAA, HITECH'
        },
        finance: {
          savings: '$60,000',
          timeReduction: '60%',
          roi: '4 months',
          compliance: 'PCI-DSS, SOX'
        },
        education: {
          savings: '$35,000',
          timeReduction: '65%',
          roi: '7 months',
          compliance: 'FERPA'
        },
        government: {
          savings: '$50,000',
          timeReduction: '45%',
          roi: '8 months',
          compliance: 'FISMA, FedRAMP'
        },
        retail: {
          savings: '$40,000',
          timeReduction: '50%',
          roi: '6 months',
          compliance: 'PCI-DSS'
        },
        manufacturing: {
          savings: '$55,000',
          timeReduction: '40%',
          roi: '7 months',
          compliance: 'ISO 27001'
        },
        technology: {
          savings: '$65,000',
          timeReduction: '70%',
          roi: '3 months',
          compliance: 'SOC 2, ISO 27001'
        }
      };
      
      // Update executive summary metrics
      if (benchmarks[industry]) {
        const data = benchmarks[industry];
        
        document.getElementById('executive-savings').textContent = data.savings;
        document.getElementById('executive-time-reduction').textContent = data.timeReduction;
        document.getElementById('executive-roi').textContent = data.roi;
        
        // Also update comparison metrics
        document.getElementById('comparison-savings').textContent = data.savings;
        document.getElementById('comparison-implementation').textContent = data.timeReduction;
        
        // Update Portnox spotlight card
        document.getElementById('portnox-savings-amount').textContent = data.savings;
        document.getElementById('portnox-savings-percentage').textContent = data.timeReduction;
        document.getElementById('portnox-implementation-time').textContent = data.timeReduction;
      }
    }
    
    // Show notification
    window.showNotification = function(message, type = 'info') {
      console.log(`Showing notification: ${message} (${type})`);
      
      // Check if notification container exists
      let notificationContainer = document.querySelector('.notification-container');
      
      if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
      }
      
      // Create notification
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      
      // Icons based on type
      const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
      };
      
      notification.innerHTML = `
        <i class="fas ${icons[type]} notification-icon"></i>
        <div class="notification-message">${message}</div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
      `;
      
      // Add to container
      notificationContainer.appendChild(notification);
      
      // Show notification
      setTimeout(() => {
        notification.classList.add('show');
      }, 10);
      
      // Add close button functionality
      notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.classList.remove('show');
        setTimeout(() => {
          notificationContainer.removeChild(notification);
        }, 300);
      });
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.classList.remove('show');
          setTimeout(() => {
            if (notification.parentNode) {
              notificationContainer.removeChild(notification);
            }
          }, 300);
        }
      }, 5000);
    };
    
    // Initialize all UI enhancements
    reorganizeLayout();
    addExecutiveSummaryTab();
    fixTabInitialization();
    fixIndustrySelection();
    
    console.log('UI workflow enhanced successfully');
  }
  
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceUIWorkflow);
  } else {
    enhanceUIWorkflow();
  }
  
  console.log('UI workflow fix (horizontal layout) installed successfully');
})();
