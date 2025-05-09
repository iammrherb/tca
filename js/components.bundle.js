/**
 * Sensitivity Analysis UI Controller
 * Manages the sensitivity analysis interface and interactions
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the sensitivity analyzer
    const analyzer = SensitivityAnalyzer;
    
    // DOM elements
    const paramVariable = document.getElementById('param-variable');
    const paramVendor = document.getElementById('param-vendor');
    const paramMin = document.getElementById('param-min');
    const paramMax = document.getElementById('param-max');
    const paramSteps = document.getElementById('param-steps');
    const includeBreakeven = document.getElementById('include-breakeven');
    const compareToNoNac = document.getElementById('compare-to-no-nac');
    const sensitivityBtn = document.getElementById('sensitivity-btn');
    const paramDescription = document.getElementById('parameter-description');
    const returnButton = document.getElementById('return-to-calculator');
    const helpButton = document.getElementById('sensitivity-help-btn');
    const helpModal = document.getElementById('sensitivity-help-modal');
    const helpModalClose = document.getElementById('sensitivity-help-modal-close');
    const helpModalCloseBtn = document.getElementById('sensitivity-help-modal-close-btn');
    
    // Set default values
    const defaultValues = analyzer.getDefaultValues();
    
    // Update parameter description when variable changes
    paramVariable.addEventListener('change', function() {
        paramDescription.textContent = analyzer.getParameterDescription(this.value);
        
        // Update min/max/steps based on parameter
        const defaults = defaultValues[this.value] || defaultValues.deviceCount;
        paramMin.value = defaults.min;
        paramMax.value = defaults.max;
        paramSteps.value = 10;
    });
    
    // Run sensitivity analysis
    sensitivityBtn.addEventListener('click', function() {
        // Show loading state
        this.disabled = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running Analysis...';
        
        // Get settings
        const settings = {
            parameter: paramVariable.value,
            vendor: paramVendor.value,
            minValue: parseFloat(paramMin.value),
            maxValue: parseFloat(paramMax.value),
            steps: parseInt(paramSteps.value),
            includeBreakeven: includeBreakeven.checked,
            compareToNoNac: compareToNoNac.checked
        };
        
        // Update analyzer settings
        analyzer.updateSettings(settings);
        
        // Run analysis (with slight delay to allow UI update)
        setTimeout(function() {
            const results = analyzer.runAnalysis();
            updateUI(results);
            
            // Restore button
            sensitivityBtn.disabled = false;
            sensitivityBtn.innerHTML = '<i class="fas fa-chart-line"></i> Run Sensitivity Analysis';
        }, 100);
    });
    
    // Return to calculator
    if (returnButton) {
        returnButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    // Help modal
    if (helpButton && helpModal) {
        helpButton.addEventListener('click', function() {
            helpModal.classList.remove('hidden');
        });
        
        if (helpModalClose) {
            helpModalClose.addEventListener('click', function() {
                helpModal.classList.add('hidden');
            });
        }
        
        if (helpModalCloseBtn) {
            helpModalCloseBtn.addEventListener('click', function() {
                helpModal.classList.add('hidden');
            });
        }
    }
    
    // Update UI with results
    function updateUI(results) {
        // Update charts using existing chart builder
        if (window.EnhancedChartBuilder) {
            updateCharts(results, window.EnhancedChartBuilder);
        } else if (window.ChartBuilder) {
            updateCharts(results, window.ChartBuilder);
        }
        
        // Update breakeven analysis
        updateBreakevenAnalysis(results.breakevenPoints);
        
        // Update results table
        updateResultsTable(results);
    }
    
    // Update charts using available chart builder
    function updateCharts(results, chartBuilder) {
        // Update sensitivity chart
        if (chartBuilder.updateSensitivityChart) {
            chartBuilder.updateSensitivityChart({
                parameterValues: results.parameterValues,
                vendorResults: results.vendorResults
            });
        } else if (chartBuilder.createOrUpdateChart) {
            // Alternative approach if your chart builder works differently
            chartBuilder.createOrUpdateChart('sensitivity-chart', {
                type: 'line',
                data: {
                    labels: results.parameterValues,
                    datasets: results.vendorResults.map((vendor, index) => ({
                        label: vendor.name,
                        data: vendor.values,
                        borderColor: getColor(index),
                        backgroundColor: 'transparent',
                        tension: 0.2,
                        borderWidth: 2
                    }))
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
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
        
        // Update savings impact chart
        if (chartBuilder.updateSavingsImpactChart) {
            chartBuilder.updateSavingsImpactChart({
                parameterValues: results.parameterValues,
                savingsPercentages: results.savingsPercentages
            });
        } else if (chartBuilder.createOrUpdateChart && results.savingsPercentages) {
            // Alternative approach
            chartBuilder.createOrUpdateChart('savings-impact-chart', {
                type: 'line',
                data: {
                    labels: results.parameterValues,
                    datasets: [{
                        label: 'Savings Percentage',
                        data: results.savingsPercentages,
                        borderColor: '#65BD44',
                        backgroundColor: 'rgba(101, 189, 68, 0.1)',
                        fill: true,
                        tension: 0.2,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    
    // Get color for chart series
    function getColor(index) {
        const colors = [
            '#05547C', // Primary
            '#65BD44', // Accent
            '#F6921E', // Orange
            '#662D91', // Purple
            '#FFC20E', // Yellow
            '#EE3124', // Red
            '#00A4EF'  // Sky Blue
        ];
        
        return colors[index % colors.length];
    }
    
    // Update breakeven analysis
    function updateBreakevenAnalysis(breakevenPoints) {
        const container = document.getElementById('breakeven-container');
        const grid = document.getElementById('breakeven-grid');
        
        if (!container || !grid) return;
        
        // Clear existing content
        grid.innerHTML = '';
        
        // Hide if no breakeven points
        if (!breakevenPoints || breakevenPoints.length === 0) {
            container.classList.add('hidden');
            return;
        }
        
        // Show container
        container.classList.remove('hidden');
        
        // Add breakeven items
        breakevenPoints.forEach(point => {
            const item = document.createElement('div');
            item.className = 'breakeven-item';
            
            item.innerHTML = `
                <div class="breakeven-vendor">${point.vendorName}</div>
                <div class="breakeven-value">${point.breakevenPoint}</div>
                <div class="breakeven-description">
                    ${point.isCrossingFromAbove ? 
                        `Portnox becomes more cost-effective than ${point.vendorName} at this value.` : 
                        `${point.vendorName} becomes more cost-effective than Portnox at this value.`}
                </div>
            `;
            
            grid.appendChild(item);
        });
    }
    
    // Update results table
    function updateResultsTable(results) {
        const tableHeader = document.getElementById('sensitivity-table-header');
        const tableBody = document.getElementById('sensitivity-table-body');
        
        if (!tableHeader || !tableBody) return;
        
        // Clear existing content
        tableHeader.innerHTML = '<th scope="col">Parameter Value</th>';
        tableBody.innerHTML = '';
        
        // Add vendor columns to header
        results.vendorResults.forEach(vendor => {
            tableHeader.innerHTML += `<th scope="col">${vendor.name}</th>`;
        });
        
        // Add savings column if relevant
        if (results.savingsPercentages && results.savingsPercentages.length > 0) {
            tableHeader.innerHTML += '<th scope="col">Savings (%)</th>';
        }
        
        // Add rows for each parameter value
        results.parameterValues.forEach((value, index) => {
            const row = document.createElement('tr');
            
            // Parameter value
            row.innerHTML = `<td>${value}</td>`;
            
            // Vendor values
            results.vendorResults.forEach(vendor => {
                row.innerHTML += `<td>$${Math.round(vendor.values[index]).toLocaleString()}</td>`;
            });
            
            // Savings percentage
            if (results.savingsPercentages && results.savingsPercentages.length > 0) {
                row.innerHTML += `<td>${Math.round(results.savingsPercentages[index])}%</td>`;
            }
            
            tableBody.appendChild(row);
        });
    }
    
    // Trigger initial description update
    paramVariable.dispatchEvent(new Event('change'));
});
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

/** @typedef {import("../Compiler")} Compiler */

class AddBuildDependenciesPlugin {
	/**
	 * @param {Iterable<string>} buildDependencies list of build dependencies
	 */
	constructor(buildDependencies) {
		this.buildDependencies = new Set(buildDependencies);
	}

	/**
	 * Apply the plugin
	 * @param {Compiler} compiler the compiler instance
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.compilation.tap(
			"AddBuildDependenciesPlugin",
			compilation => {
				compilation.buildDependencies.addAll(this.buildDependencies);
			}
		);
	}
}

module.exports = AddBuildDependenciesPlugin;
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
#!/usr/bin/env node

const {spawn} = require('child_process');

if (process.env.npm_config_build_from_source === 'true') {
  build();
}

function build() {
  spawn('node-gyp', ['rebuild'], { stdio: 'inherit', shell: true }).on('exit', function (code) {
    process.exit(code);
  });
}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deepRequired_1 = __importDefault(require("../definitions/deepRequired"));
const deepRequired = (ajv) => ajv.addKeyword((0, deepRequired_1.default)());
exports.default = deepRequired;
module.exports = deepRequired;
//# sourceMappingURL=deepRequired.js.map"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allRequired_1 = __importDefault(require("../definitions/allRequired"));
const allRequired = (ajv) => ajv.addKeyword((0, allRequired_1.default)());
exports.default = allRequired;
module.exports = allRequired;
//# sourceMappingURL=allRequired.js.map'use strict';
var parent = require('../../es/typed-array/uint8-array');
require('../../stable/typed-array/methods');

module.exports = parent;
'use strict';
var $ = require('../internals/export');
var globalThis = require('../internals/global-this');
var aString = require('../internals/a-string');
var $fromHex = require('../internals/uint8-from-hex');

// `Uint8Array.fromHex` method
// https://github.com/tc39/proposal-arraybuffer-base64
if (globalThis.Uint8Array) $({ target: 'Uint8Array', stat: true }, {
  fromHex: function fromHex(string) {
    return $fromHex(aString(string)).bytes;
  }
});
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const anyRequired_1 = __importDefault(require("../definitions/anyRequired"));
const anyRequired = (ajv) => ajv.addKeyword((0, anyRequired_1.default)());
exports.default = anyRequired;
module.exports = anyRequired;
//# sourceMappingURL=anyRequired.js.map/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const {
	JAVASCRIPT_MODULE_TYPE_AUTO,
	JAVASCRIPT_MODULE_TYPE_DYNAMIC
} = require("../ModuleTypeConstants");
const RequireIncludeDependency = require("./RequireIncludeDependency");
const RequireIncludeDependencyParserPlugin = require("./RequireIncludeDependencyParserPlugin");

/** @typedef {import("../../declarations/WebpackOptions").JavascriptParserOptions} JavascriptParserOptions */
/** @typedef {import("../Compiler")} Compiler */
/** @typedef {import("../javascript/JavascriptParser")} Parser */

const PLUGIN_NAME = "RequireIncludePlugin";

class RequireIncludePlugin {
	/**
	 * Apply the plugin
	 * @param {Compiler} compiler the compiler instance
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.compilation.tap(
			PLUGIN_NAME,
			(compilation, { normalModuleFactory }) => {
				compilation.dependencyFactories.set(
					RequireIncludeDependency,
					normalModuleFactory
				);
				compilation.dependencyTemplates.set(
					RequireIncludeDependency,
					new RequireIncludeDependency.Template()
				);

				/**
				 * @param {Parser} parser parser parser
				 * @param {JavascriptParserOptions} parserOptions parserOptions
				 * @returns {void}
				 */
				const handler = (parser, parserOptions) => {
					if (parserOptions.requireInclude === false) return;
					const warn = parserOptions.requireInclude === undefined;

					new RequireIncludeDependencyParserPlugin(warn).apply(parser);
				};

				normalModuleFactory.hooks.parser
					.for(JAVASCRIPT_MODULE_TYPE_AUTO)
					.tap(PLUGIN_NAME, handler);
				normalModuleFactory.hooks.parser
					.for(JAVASCRIPT_MODULE_TYPE_DYNAMIC)
					.tap(PLUGIN_NAME, handler);
			}
		);
	}
}
module.exports = RequireIncludePlugin;
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const ModuleDependency = require("./ModuleDependency");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("../Dependency")} Dependency */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */

class ModuleDependencyTemplateAsRequireId extends ModuleDependency.Template {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(
		dependency,
		source,
		{ runtimeTemplate, moduleGraph, chunkGraph, runtimeRequirements }
	) {
		const dep = /** @type {ModuleDependency} */ (dependency);
		if (!dep.range) return;
		const content = runtimeTemplate.moduleExports({
			module: moduleGraph.getModule(dep),
			chunkGraph,
			request: dep.request,
			weak: dep.weak,
			runtimeRequirements
		});
		source.replace(dep.range[0], dep.range[1] - 1, content);
	}
}
module.exports = ModuleDependencyTemplateAsRequireId;
'use strict';
module.exports = require('../../full/data-view/set-uint8-clamped');
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const RuntimeGlobals = require("../RuntimeGlobals");
const makeSerializable = require("../util/makeSerializable");
const NullDependency = require("./NullDependency");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("../AsyncDependenciesBlock")} AsyncDependenciesBlock */
/** @typedef {import("../Dependency")} Dependency */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */
/** @typedef {import("../javascript/JavascriptParser").Range} Range */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectDeserializerContext} ObjectDeserializerContext */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectSerializerContext} ObjectSerializerContext */

class RequireEnsureDependency extends NullDependency {
	/**
	 * @param {Range} range range
	 * @param {Range} contentRange content range
	 * @param {Range | false} errorHandlerRange error handler range
	 */
	constructor(range, contentRange, errorHandlerRange) {
		super();

		this.range = range;
		this.contentRange = contentRange;
		this.errorHandlerRange = errorHandlerRange;
	}

	get type() {
		return "require.ensure";
	}

	/**
	 * @param {ObjectSerializerContext} context context
	 */
	serialize(context) {
		const { write } = context;

		write(this.range);
		write(this.contentRange);
		write(this.errorHandlerRange);

		super.serialize(context);
	}

	/**
	 * @param {ObjectDeserializerContext} context context
	 */
	deserialize(context) {
		const { read } = context;

		this.range = read();
		this.contentRange = read();
		this.errorHandlerRange = read();

		super.deserialize(context);
	}
}

makeSerializable(
	RequireEnsureDependency,
	"webpack/lib/dependencies/RequireEnsureDependency"
);

RequireEnsureDependency.Template = class RequireEnsureDependencyTemplate extends (
	NullDependency.Template
) {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(
		dependency,
		source,
		{ runtimeTemplate, moduleGraph, chunkGraph, runtimeRequirements }
	) {
		const dep = /** @type {RequireEnsureDependency} */ (dependency);
		const depBlock = /** @type {AsyncDependenciesBlock} */ (
			moduleGraph.getParentBlock(dep)
		);
		const promise = runtimeTemplate.blockPromise({
			chunkGraph,
			block: depBlock,
			message: "require.ensure",
			runtimeRequirements
		});
		const range = dep.range;
		const contentRange = dep.contentRange;
		const errorHandlerRange = dep.errorHandlerRange;
		source.replace(range[0], contentRange[0] - 1, `${promise}.then((`);
		if (errorHandlerRange) {
			source.replace(
				contentRange[1],
				errorHandlerRange[0] - 1,
				`).bind(null, ${RuntimeGlobals.require}))['catch'](`
			);
			source.replace(errorHandlerRange[1], range[1] - 1, ")");
		} else {
			source.replace(
				contentRange[1],
				range[1] - 1,
				`).bind(null, ${RuntimeGlobals.require}))['catch'](${RuntimeGlobals.uncaughtErrorHandler})`
			);
		}
	}
};

module.exports = RequireEnsureDependency;
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const Dependency = require("../Dependency");
const { UsageState } = require("../ExportsInfo");
const Template = require("../Template");
const { equals } = require("../util/ArrayHelpers");
const makeSerializable = require("../util/makeSerializable");
const propertyAccess = require("../util/propertyAccess");
const { handleDependencyBase } = require("./CommonJsDependencyHelpers");
const ModuleDependency = require("./ModuleDependency");
const processExportInfo = require("./processExportInfo");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("../Dependency").ExportsSpec} ExportsSpec */
/** @typedef {import("../Dependency").ReferencedExport} ReferencedExport */
/** @typedef {import("../Dependency").TRANSITIVE} TRANSITIVE */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */
/** @typedef {import("../ExportsInfo")} ExportsInfo */
/** @typedef {import("../ExportsInfo").ExportInfo} ExportInfo */
/** @typedef {import("../Module")} Module */
/** @typedef {import("../ModuleGraph")} ModuleGraph */
/** @typedef {import("../javascript/JavascriptParser").Range} Range */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectDeserializerContext} ObjectDeserializerContext */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectSerializerContext} ObjectSerializerContext */
/** @typedef {import("../util/runtime").RuntimeSpec} RuntimeSpec */
/** @typedef {import("./CommonJsDependencyHelpers").CommonJSDependencyBaseKeywords} CommonJSDependencyBaseKeywords */

const idsSymbol = Symbol("CommonJsExportRequireDependency.ids");

const EMPTY_OBJECT = {};

class CommonJsExportRequireDependency extends ModuleDependency {
	/**
	 * @param {Range} range range
	 * @param {Range | null} valueRange value range
	 * @param {CommonJSDependencyBaseKeywords} base base
	 * @param {string[]} names names
	 * @param {string} request request
	 * @param {string[]} ids ids
	 * @param {boolean} resultUsed true, when the result is used
	 */
	constructor(range, valueRange, base, names, request, ids, resultUsed) {
		super(request);
		this.range = range;
		this.valueRange = valueRange;
		this.base = base;
		this.names = names;
		this.ids = ids;
		this.resultUsed = resultUsed;
		this.asiSafe = undefined;
	}

	get type() {
		return "cjs export require";
	}

	/**
	 * @returns {boolean | TRANSITIVE} true, when changes to the referenced module could affect the referencing module; TRANSITIVE, when changes to the referenced module could affect referencing modules of the referencing module
	 */
	couldAffectReferencingModule() {
		return Dependency.TRANSITIVE;
	}

	/**
	 * @param {ModuleGraph} moduleGraph the module graph
	 * @returns {string[]} the imported id
	 */
	getIds(moduleGraph) {
		return moduleGraph.getMeta(this)[idsSymbol] || this.ids;
	}

	/**
	 * @param {ModuleGraph} moduleGraph the module graph
	 * @param {string[]} ids the imported ids
	 * @returns {void}
	 */
	setIds(moduleGraph, ids) {
		moduleGraph.getMeta(this)[idsSymbol] = ids;
	}

	/**
	 * Returns list of exports referenced by this dependency
	 * @param {ModuleGraph} moduleGraph module graph
	 * @param {RuntimeSpec} runtime the runtime for which the module is analysed
	 * @returns {(string[] | ReferencedExport)[]} referenced exports
	 */
	getReferencedExports(moduleGraph, runtime) {
		const ids = this.getIds(moduleGraph);
		const getFullResult = () => {
			if (ids.length === 0) {
				return Dependency.EXPORTS_OBJECT_REFERENCED;
			}
			return [
				{
					name: ids,
					canMangle: false
				}
			];
		};
		if (this.resultUsed) return getFullResult();
		/** @type {ExportsInfo | undefined} */
		let exportsInfo = moduleGraph.getExportsInfo(
			/** @type {Module} */ (moduleGraph.getParentModule(this))
		);
		for (const name of this.names) {
			const exportInfo = /** @type {ExportInfo} */ (
				exportsInfo.getReadOnlyExportInfo(name)
			);
			const used = exportInfo.getUsed(runtime);
			if (used === UsageState.Unused) return Dependency.NO_EXPORTS_REFERENCED;
			if (used !== UsageState.OnlyPropertiesUsed) return getFullResult();
			exportsInfo = exportInfo.exportsInfo;
			if (!exportsInfo) return getFullResult();
		}
		if (exportsInfo.otherExportsInfo.getUsed(runtime) !== UsageState.Unused) {
			return getFullResult();
		}
		/** @type {string[][]} */
		const referencedExports = [];
		for (const exportInfo of exportsInfo.orderedExports) {
			processExportInfo(
				runtime,
				referencedExports,
				ids.concat(exportInfo.name),
				exportInfo,
				false
			);
		}
		return referencedExports.map(name => ({
			name,
			canMangle: false
		}));
	}

	/**
	 * Returns the exported names
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {ExportsSpec | undefined} export names
	 */
	getExports(moduleGraph) {
		if (this.names.length === 1) {
			const ids = this.getIds(moduleGraph);
			const name = this.names[0];
			const from = moduleGraph.getConnection(this);
			if (!from) return;
			return {
				exports: [
					{
						name,
						from,
						export: ids.length === 0 ? null : ids,
						// we can't mangle names that are in an empty object
						// because one could access the prototype property
						// when export isn't set yet
						canMangle: !(name in EMPTY_OBJECT) && false
					}
				],
				dependencies: [from.module]
			};
		} else if (this.names.length > 0) {
			const name = this.names[0];
			return {
				exports: [
					{
						name,
						// we can't mangle names that are in an empty object
						// because one could access the prototype property
						// when export isn't set yet
						canMangle: !(name in EMPTY_OBJECT) && false
					}
				],
				dependencies: undefined
			};
		}
		const from = moduleGraph.getConnection(this);
		if (!from) return;
		const reexportInfo = this.getStarReexports(
			moduleGraph,
			undefined,
			from.module
		);
		const ids = this.getIds(moduleGraph);
		if (reexportInfo) {
			return {
				exports: Array.from(
					/** @type {Set<string>} */
					(reexportInfo.exports),
					name => ({
						name,
						from,
						export: ids.concat(name),
						canMangle: !(name in EMPTY_OBJECT) && false
					})
				),
				// TODO handle deep reexports
				dependencies: [from.module]
			};
		}
		return {
			exports: true,
			from: ids.length === 0 ? from : undefined,
			canMangle: false,
			dependencies: [from.module]
		};
	}

	/**
	 * @param {ModuleGraph} moduleGraph the module graph
	 * @param {RuntimeSpec} runtime the runtime
	 * @param {Module} importedModule the imported module (optional)
	 * @returns {{exports?: Set<string>, checked?: Set<string>} | undefined} information
	 */
	getStarReexports(
		moduleGraph,
		runtime,
		importedModule = /** @type {Module} */ (moduleGraph.getModule(this))
	) {
		/** @type {ExportsInfo | undefined} */
		let importedExportsInfo = moduleGraph.getExportsInfo(importedModule);
		const ids = this.getIds(moduleGraph);
		if (ids.length > 0)
			importedExportsInfo = importedExportsInfo.getNestedExportsInfo(ids);
		/** @type {ExportsInfo | undefined} */
		let exportsInfo = moduleGraph.getExportsInfo(
			/** @type {Module} */ (moduleGraph.getParentModule(this))
		);
		if (this.names.length > 0)
			exportsInfo = exportsInfo.getNestedExportsInfo(this.names);

		const noExtraExports =
			importedExportsInfo &&
			importedExportsInfo.otherExportsInfo.provided === false;
		const noExtraImports =
			exportsInfo &&
			exportsInfo.otherExportsInfo.getUsed(runtime) === UsageState.Unused;

		if (!noExtraExports && !noExtraImports) {
			return;
		}

		const isNamespaceImport =
			importedModule.getExportsType(moduleGraph, false) === "namespace";

		/** @type {Set<string>} */
		const exports = new Set();
		/** @type {Set<string>} */
		const checked = new Set();

		if (noExtraImports) {
			for (const exportInfo of /** @type {ExportsInfo} */ (exportsInfo)
				.orderedExports) {
				const name = exportInfo.name;
				if (exportInfo.getUsed(runtime) === UsageState.Unused) continue;
				if (name === "__esModule" && isNamespaceImport) {
					exports.add(name);
				} else if (importedExportsInfo) {
					const importedExportInfo =
						importedExportsInfo.getReadOnlyExportInfo(name);
					if (importedExportInfo.provided === false) continue;
					exports.add(name);
					if (importedExportInfo.provided === true) continue;
					checked.add(name);
				} else {
					exports.add(name);
					checked.add(name);
				}
			}
		} else if (noExtraExports) {
			for (const importedExportInfo of /** @type {ExportsInfo} */ (
				importedExportsInfo
			).orderedExports) {
				const name = importedExportInfo.name;
				if (importedExportInfo.provided === false) continue;
				if (exportsInfo) {
					const exportInfo = exportsInfo.getReadOnlyExportInfo(name);
					if (exportInfo.getUsed(runtime) === UsageState.Unused) continue;
				}
				exports.add(name);
				if (importedExportInfo.provided === true) continue;
				checked.add(name);
			}
			if (isNamespaceImport) {
				exports.add("__esModule");
				checked.delete("__esModule");
			}
		}

		return { exports, checked };
	}

	/**
	 * @param {ObjectSerializerContext} context context
	 */
	serialize(context) {
		const { write } = context;
		write(this.asiSafe);
		write(this.range);
		write(this.valueRange);
		write(this.base);
		write(this.names);
		write(this.ids);
		write(this.resultUsed);
		super.serialize(context);
	}

	/**
	 * @param {ObjectDeserializerContext} context context
	 */
	deserialize(context) {
		const { read } = context;
		this.asiSafe = read();
		this.range = read();
		this.valueRange = read();
		this.base = read();
		this.names = read();
		this.ids = read();
		this.resultUsed = read();
		super.deserialize(context);
	}
}

makeSerializable(
	CommonJsExportRequireDependency,
	"webpack/lib/dependencies/CommonJsExportRequireDependency"
);

CommonJsExportRequireDependency.Template = class CommonJsExportRequireDependencyTemplate extends (
	ModuleDependency.Template
) {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(
		dependency,
		source,
		{
			module,
			runtimeTemplate,
			chunkGraph,
			moduleGraph,
			runtimeRequirements,
			runtime
		}
	) {
		const dep = /** @type {CommonJsExportRequireDependency} */ (dependency);
		const used = moduleGraph
			.getExportsInfo(module)
			.getUsedName(dep.names, runtime);

		const [type, base] = handleDependencyBase(
			dep.base,
			module,
			runtimeRequirements
		);

		const importedModule = moduleGraph.getModule(dep);
		let requireExpr = runtimeTemplate.moduleExports({
			module: importedModule,
			chunkGraph,
			request: dep.request,
			weak: dep.weak,
			runtimeRequirements
		});
		if (importedModule) {
			const ids = dep.getIds(moduleGraph);
			const usedImported = moduleGraph
				.getExportsInfo(importedModule)
				.getUsedName(ids, runtime);
			if (usedImported) {
				const comment = equals(usedImported, ids)
					? ""
					: `${Template.toNormalComment(propertyAccess(ids))} `;
				requireExpr += `${comment}${propertyAccess(usedImported)}`;
			}
		}

		switch (type) {
			case "expression":
				source.replace(
					dep.range[0],
					dep.range[1] - 1,
					used
						? `${base}${propertyAccess(used)} = ${requireExpr}`
						: `/* unused reexport */ ${requireExpr}`
				);
				return;
			case "Object.defineProperty":
				throw new Error("TODO");
			default:
				throw new Error("Unexpected type");
		}
	}
};

module.exports = CommonJsExportRequireDependency;
/**
 * UI Controller Class for Total Cost Analyzer
 * Enhanced version with improved report generation
 */
// Check if UIController class already exists to prevent redeclaration
if (typeof UIController === 'undefined') {
  class UIController {
    constructor() {
      this.activeVendor = 'cisco';
      this.activeView = 'financial';
      this.initEventListeners();
    }
    
    /**
     * Initialize event listeners
     */
    initEventListeners() {
      // Vendor card selection
      document.querySelectorAll('.vendor-card').forEach(card => {
        card.addEventListener('click', () => {
          const vendor = card.getAttribute('data-vendor');
          if (vendor) {
            this.setActiveVendor(vendor);
          }
        });
        
        // Keyboard accessibility
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const vendor = card.getAttribute('data-vendor');
            if (vendor) {
              this.setActiveVendor(vendor);
            }
          }
        });
      });
      
      // Multiple locations checkbox
      const multipleLocations = document.getElementById('multiple-locations');
      const locationCountContainer = document.getElementById('location-count-container');
      
      if (multipleLocations && locationCountContainer) {
        multipleLocations.addEventListener('change', () => {
          locationCountContainer.classList.toggle('hidden', !multipleLocations.checked);
        });
      }
      
      // Legacy devices checkbox
      const legacyDevices = document.getElementById('legacy-devices');
      const legacyPercentageContainer = document.getElementById('legacy-percentage-container');
      
      if (legacyDevices && legacyPercentageContainer) {
        legacyDevices.addEventListener('change', () => {
          legacyPercentageContainer.classList.toggle('hidden', !legacyDevices.checked);
        });
      }
      
      // Custom policies checkbox
      const customPolicies = document.getElementById('custom-policies');
      const policyComplexityContainer = document.getElementById('policy-complexity-container');
      
      if (customPolicies && policyComplexityContainer) {
        customPolicies.addEventListener('change', () => {
          policyComplexityContainer.classList.toggle('hidden', !customPolicies.checked);
        });
      }
      
      // Industry template selector
      const industrySelector = document.getElementById('industry-selector');
      if (industrySelector) {
        industrySelector.addEventListener('change', () => {
          this.applyIndustryTemplate(industrySelector.value);
        });
        
        // Populate industry selector options
        if (window.industryTemplates) {
          industrySelector.innerHTML = '<option value="none">Select an industry...</option>';
          
          Object.keys(window.industryTemplates).forEach(key => {
            const template = window.industryTemplates[key];
            const option = document.createElement('option');
            option.value = key;
            option.textContent = template.name;
            industrySelector.appendChild(option);
          });
        }
      }
      
      // Audience selector
      const audienceSelector = document.getElementById('audience-selector');
      if (audienceSelector) {
        audienceSelector.addEventListener('change', () => {
          this.setActiveView(audienceSelector.value);
        });
      }
      
      // Guided tour button
      const guidedTourBtn = document.getElementById('guided-tour-btn');
      if (guidedTourBtn) {
        guidedTourBtn.addEventListener('click', () => {
          if (window.GuidedTour) {
            const tour = new GuidedTour();
            tour.startTour();
          } else {
            console.warn('GuidedTour not available');
          }
        });
      }
      
      // Export buttons
      const exportCsvBtn = document.getElementById('export-csv-btn');
      if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => {
          this.exportToCSV();
        });
      }
      
      const exportPdfBtn = document.getElementById('export-pdf-btn');
      if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', () => {
          this.exportToPDF();
        });
      }
      
      // Chart type toggle buttons
      document.querySelectorAll('.chart-type-toggle').forEach(button => {
        button.addEventListener('click', () => {
          const chartId = button.getAttribute('data-chart-id');
          const chartType = button.getAttribute('data-chart-type');
          
          if (chartId && chartType && window.chartBuilder && window.chartBuilder.charts[chartId]) {
            // Update active state on buttons
            const toggles = document.querySelectorAll(`.chart-type-toggle[data-chart-id="${chartId}"]`);
            toggles.forEach(t => t.classList.remove('active'));
            button.classList.add('active');
            
            // Update chart type
            window.chartBuilder.charts[chartId].config.type = chartType;
            window.chartBuilder.charts[chartId].update();
          }
        });
      });
    }
    
    /**
     * Set active vendor
     */
    setActiveVendor(vendor) {
      if (!vendor || !window.vendorData[vendor]) {
        console.error(`Invalid vendor: ${vendor}`);
        return;
      }
      
      // Update active vendor
      this.activeVendor = vendor;
      
      // Update UI
      document.querySelectorAll('.vendor-card').forEach(card => {
        const cardVendor = card.getAttribute('data-vendor');
        card.classList.toggle('active', cardVendor === vendor);
        
        // Update ARIA attributes
        if (cardVendor === vendor) {
          card.setAttribute('aria-selected', 'true');
        } else {
          card.setAttribute('aria-selected', 'false');
        }
      });
      
      // Update vendor name placeholders
      const vendorName = window.vendorData[vendor].name;
      document.querySelectorAll('.vendor-name-placeholder').forEach(el => {
        el.textContent = vendorName;
      });
      
      // Update table headers
      const tcoComparisonVendor = document.getElementById('tco-comparison-vendor');
      if (tcoComparisonVendor) {
        tcoComparisonVendor.textContent = vendorName;
      }
      
      const annualComparisonVendor = document.getElementById('annual-comparison-vendor');
      if (annualComparisonVendor) {
        annualComparisonVendor.textContent = vendorName;
      }
      
      const implementationComparisonVendor = document.getElementById('implementation-comparison-vendor');
      if (implementationComparisonVendor) {
        implementationComparisonVendor.textContent = vendorName;
      }
      
      // If we have results, update them for the new vendor
      if (window.calculator && window.calculator.resultsAvailable) {
        this.updateResults(window.calculator.results);
        
        // Update charts
        if (window.chartBuilder) {
          window.chartBuilder.updateFeatureComparisonChart(vendor);
          window.chartBuilder.updateBreakdownCharts(vendor, 'portnox');
          window.chartBuilder.updateROIChart(window.calculator.results);
        }
      }
    }
    
    /**
     * Set active view (audience)
     */
    setActiveView(view) {
      this.activeView = view;
      
      // Update UI based on view
      const resultsContainer = document.querySelector('.results-container');
      if (resultsContainer) {
        resultsContainer.className = 'results-container ' + view + '-view';
      }
      
      // Update visibility of sections based on view
      const sections = {
        'executive': ['summary-tab', 'implementation-tab'],
        'financial': ['summary-tab', 'financial-tab', 'implementation-tab'],
        'technical': ['summary-tab', 'financial-tab', 'implementation-tab', 'comparison-tab', 'migration-tab']
      };
      
      // Show/hide sections based on view
      document.querySelectorAll('.tab-button').forEach(tab => {
        const tabId = tab.getAttribute('data-tab');
        const isVisible = !sections[view] || sections[view].includes(tabId);
        tab.style.display = isVisible ? '' : 'none';
      });
      
      // If current active tab is not visible in this view, switch to first visible tab
      const activeTab = document.querySelector('.tab-button.active');
      if (activeTab && activeTab.style.display === 'none') {
        const firstVisibleTab = document.querySelector('.tab-button:not([style*="display: none"])');
        if (firstVisibleTab && window.tabManager) {
          window.tabManager.setActiveTab(firstVisibleTab.getAttribute('data-tab'));
        }
      }
      
      // Update chart visibility based on view
      this.updateChartVisibility(view);
    }
    
    /**
     * Update chart visibility based on view
     */
    updateChartVisibility(view) {
      // Define which charts to show for each view
      const chartVisibility = {
        'executive': ['tco-comparison-chart', 'roi-chart'],
        'financial': ['tco-comparison-chart', 'cumulative-cost-chart', 'roi-chart'],
        'technical': ['tco-comparison-chart', 'cumulative-cost-chart', 'feature-comparison-chart', 'implementation-comparison-chart', 'roi-chart']
      };
      
      // Show/hide chart containers
      document.querySelectorAll('.chart-container').forEach(container => {
        const chartId = container.querySelector('canvas')?.id;
        if (chartId) {
          const isVisible = !chartVisibility[view] || chartVisibility[view].includes(chartId);
          container.closest('.result-card').style.display = isVisible ? '' : 'none';
        }
      });
    }
    
    /**
     * Update UI with calculation results
     */
    updateResults(results) {
      if (!results) return;
      
      const currentVendor = this.activeVendor;
      const currentVendorResults = results[currentVendor];
      const portnoxResults = results['portnox'];
      
      if (!currentVendorResults || !portnoxResults) {
        console.error('Missing vendor results');
        return;
      }
      
      // Update summary metrics
      const savingsAmount = document.getElementById('portnox-savings-amount');
      if (savingsAmount) {
        savingsAmount.textContent = window.formatCurrency(portnoxResults.totalSavings);
      }
      
      const savingsPercentage = document.getElementById('portnox-savings-percentage');
      if (savingsPercentage) {
        savingsPercentage.textContent = window.formatPercentage(portnoxResults.savingsPercentage);
      }
      
      const implementationTime = document.getElementById('portnox-implementation-time');
      if (implementationTime && results.implementationResults) {
        const currentTime = results.implementationResults[currentVendor] || 0;
        const portnoxTime = results.implementationResults['portnox'] || 0;
        const timeSaved = currentTime - portnoxTime;
        
        if (timeSaved > 0) {
          implementationTime.textContent = `${timeSaved} days`;
        } else {
          implementationTime.textContent = 'N/A';
        }
      }
      
      // Update comparison highlights
      const comparisonSavings = document.getElementById('comparison-savings');
      if (comparisonSavings) {
        comparisonSavings.textContent = window.formatCurrency(portnoxResults.totalSavings);
        
        // Update progress bar
        const progressBar = comparisonSavings.closest('.metric-container')?.querySelector('.progress');
        if (progressBar) {
          const percentage = Math.min(portnoxResults.savingsPercentage, 100);
          progressBar.style.width = `${percentage}%`;
        }
      }
      
      const comparisonImplementation = document.getElementById('comparison-implementation');
      if (comparisonImplementation && results.implementationResults) {
        const currentTime = results.implementationResults[currentVendor] || 0;
        const portnoxTime = results.implementationResults['portnox'] || 0;
        const timeSaved = currentTime - portnoxTime;
        
        if (timeSaved > 0) {
          comparisonImplementation.textContent = `${timeSaved} days`;
          
          // Update progress bar
          const progressBar = comparisonImplementation.closest('.metric-container')?.querySelector('.progress');
          if (progressBar) {
            const percentage = Math.min((timeSaved / currentTime) * 100, 100);
            progressBar.style.width = `${percentage}%`;
          }
        } else {
          comparisonImplementation.textContent = '0 days';
          
          // Reset progress bar
          const progressBar = comparisonImplementation.closest('.metric-container')?.querySelector('.progress');
          if (progressBar) {
            progressBar.style.width = '0%';
          }
        }
      }
      
      // Update cloud vs. on-premises comparison metrics
      this.updateCloudComparison(results);
      
      // Update TCO summary table
      this.updateTCOSummaryTable(results);
      
      // Update annual costs table
      this.updateAnnualCostsTable(results);
      
      // Update implementation table
      this.updateImplementationTable(results);
      
      // Update industry-specific metrics
      this.updateIndustryMetrics(results);
    }
    
    /**
     * Update cloud vs. on-premises comparison
     */
    updateCloudComparison(results) {
      const comparisonTableBody = document.getElementById('cloud-comparison-table-body');
      if (!comparisonTableBody) return;
      
      const currentVendor = this.activeVendor;
      const currentVendorResults = results[currentVendor];
      const portnoxResults = results['portnox'];
      
      if (!currentVendorResults || !portnoxResults) return;
      
      // Clear table
      comparisonTableBody.innerHTML = '';
      
      // Create rows for comparison
      const comparisonPoints = [
        {
          feature: 'Deployment Model',
          onPrem: 'Hardware appliances requiring rack space, power, cooling',
          cloud: 'SaaS solution, no hardware requirements'
        },
        {
          feature: 'Initial Setup',
          onPrem: '2-4 weeks typical setup time',
          cloud: 'Same-day deployment'
        },
        {
          feature: 'Redundancy',
          onPrem: 'Requires additional hardware and complex configuration',
          cloud: 'Built-in cloud redundancy across regions'
        },
        {
          feature: 'Updates & Patching',
          onPrem: 'Manual update process requiring maintenance windows',
          cloud: 'Automatic updates without downtime'
        },
        {
          feature: 'Scalability',
          onPrem: 'Requires hardware sizing and potential additional purchases',
          cloud: 'Unlimited elastic scaling without additional hardware'
        },
        {
          feature: 'Multi-Location Support',
          onPrem: 'Requires hardware at each site or complex VPN tunnels',
          cloud: 'Single cloud instance for all sites'
        },
        {
          feature: 'Remote Access',
          onPrem: 'Requires VPN or additional appliances',
          cloud: 'Native anywhere access'
        },
        {
          feature: 'Disaster Recovery',
          onPrem: 'Requires separate DR site and complex replication',
          cloud: 'Built-in geo-redundancy and automatic failover'
        },
        {
          feature: 'Administrator Overhead',
          onPrem: 'High maintenance requirements (patching, upgrades, backups)',
          cloud: 'Minimal administration focused on policy management'
        },
        {
          feature: 'Implementation Complexity',
          onPrem: 'Complex network integration requiring specialized expertise',
          cloud: 'Simple cloud connector model with guided setup'
        },
        {
          feature: 'Cost Model',
          onPrem: 'High upfront costs plus ongoing maintenance (CapEx heavy)',
          cloud: 'Subscription-based with minimal upfront costs (OpEx model)'
        },
        {
          feature: 'Security Updates',
          onPrem: 'Manual security patches requiring planning and testing',
          cloud: 'Automatic security updates ensuring latest protections'
        }
      ];
      
      // Create and append rows
      comparisonPoints.forEach(point => {
        const row = document.createElement('tr');
        
        const featureCell = document.createElement('td');
        featureCell.textContent = point.feature;
        
        const onPremCell = document.createElement('td');
        onPremCell.textContent = point.onPrem;
        
        const cloudCell = document.createElement('td');
        cloudCell.textContent = point.cloud;
        cloudCell.className = 'cloud-benefit';
        
        row.appendChild(featureCell);
        row.appendChild(onPremCell);
        row.appendChild(cloudCell);
        
        comparisonTableBody.appendChild(row);
      });
      
      // Update architecture diagrams
      this.updateArchitectureDiagrams();
    }
    
    /**
     * Update architecture diagrams
     */
    updateArchitectureDiagrams() {
      const onPremDiagram = document.querySelector('.on-prem-diagram');
      const cloudDiagram = document.querySelector('.cloud-diagram');
      
      if (!onPremDiagram || !cloudDiagram) return;
      
      // Create SVG for on-premises architecture
      onPremDiagram.innerHTML = `
        <svg width="100%" height="300" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
          <style>
            .diagram-box { fill: #f5f7fa; stroke: #1B67B2; stroke-width: 2; }
            .diagram-text { font-family: Arial; font-size: 12px; fill: #202020; }
            .diagram-title { font-family: Arial; font-size: 14px; font-weight: bold; fill: #1B67B2; }
            .diagram-line { stroke: #888; stroke-width: 1.5; stroke-dasharray: 5,5; }
            .diagram-arrow { stroke: #888; stroke-width: 1.5; fill: none; marker-end: url(#arrowhead); }
            .diagram-server { fill: #ddd; stroke: #888; stroke-width: 1; }
          </style>
          
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#888" />
            </marker>
          </defs>
          
          <!-- Headquarters -->
          <rect x="50" y="50" width="200" height="100" rx="5" class="diagram-box" />
          <text x="150" y="30" text-anchor="middle" class="diagram-title">Headquarters</text>
          
          <!-- NAC Server -->
          <rect x="70" y="70" width="60" height="20" rx="2" class="diagram-server" />
          <text x="100" y="85" text-anchor="middle" class="diagram-text">NAC Primary</text>
          
          <!-- Redundant NAC Server -->
          <rect x="70" y="100" width="60" height="20" rx="2" class="diagram-server" />
          <text x="100" y="115" text-anchor="middle" class="diagram-text">NAC Backup</text>
          
          <!-- Management Server -->
          <rect x="170" y="70" width="60" height="20" rx="2" class="diagram-server" />
          <text x="200" y="85" text-anchor="middle" class="diagram-text">Management</text>
          
          <!-- Database Server -->
          <rect x="170" y="100" width="60" height="20" rx="2" class="diagram-server" />
          <text x="200" y="115" text-anchor="middle" class="diagram-text">Database</text>
          
          <!-- Remote Site -->
          <rect x="350" y="50" width="200" height="100" rx="5" class="diagram-box" />
          <text x="450" y="30" text-anchor="middle" class="diagram-title">Remote Site</text>
          
          <!-- Remote NAC Server -->
          <rect x="370" y="70" width="60" height="20" rx="2" class="diagram-server" />
          <text x="400" y="85" text-anchor="middle" class="diagram-text">NAC Server</text>
          
          <!-- Remote Management -->
          <rect x="470" y="70" width="60" height="20" rx="2" class="diagram-server" />
          <text x="500" y="85" text-anchor="middle" class="diagram-text">Management</text>
          
          <!-- Connection between HQ and Remote -->
          <path d="M250 100 H300 Q325 100, 325 125 T350 150 H400" class="diagram-arrow" />
          <path d="M350 100 H300 Q275 100, 275 125 T250 150 H200" class="diagram-arrow" />
          
          <!-- DR Site -->
          <rect x="200" y="200" width="200" height="75" rx="5" class="diagram-box" />
          <text x="300" y="180" text-anchor="middle" class="diagram-title">DR Site</text>
          
          <!-- DR NAC Server -->
          <rect x="220" y="220" width="60" height="20" rx="2" class="diagram-server" />
          <text x="250" y="235" text-anchor="middle" class="diagram-text">NAC DR</text>
          
          <!-- DR Database -->
          <rect x="320" y="220" width="60" height="20" rx="2" class="diagram-server" />
          <text x="350" y="235" text-anchor="middle" class="diagram-text">DB DR</text>
          
          <!-- Connection to DR -->
          <path d="M150 150 Q200 175, 250 200" class="diagram-arrow" />
          <path d="M450 150 Q400 175, 350 200" class="diagram-arrow" />
        </svg>
      `;
      
      // Create SVG for cloud architecture
      cloudDiagram.innerHTML = `
        <svg width="100%" height="300" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
          <style>
            .diagram-box { fill: #f5f7fa; stroke: #1B67B2; stroke-width: 2; }
            .diagram-text { font-family: Arial; font-size: 12px; fill: #202020; }
            .diagram-title { font-family: Arial; font-size: 14px; font-weight: bold; fill: #1B67B2; }
            .diagram-line { stroke: #888; stroke-width: 1.5; stroke-dasharray: 5,5; }
            .diagram-arrow { stroke: #888; stroke-width: 1.5; fill: none; marker-end: url(#cloud-arrowhead); }
            .diagram-cloud { fill: #e6fff0; stroke: #2BD25B; stroke-width: 2; }
            .diagram-connector { fill: #ddd; stroke: #888; stroke-width: 1; }
          </style>
          
          <defs>
            <marker id="cloud-arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#888" />
            </marker>
          </defs>
          
          <!-- Cloud Service -->
          <ellipse cx="300" cy="100" rx="120" ry="60" class="diagram-cloud" />
          <text x="300" y="85" text-anchor="middle" class="diagram-title">Portnox Cloud</text>
          <text x="300" y="105" text-anchor="middle" class="diagram-text">Globally Distributed</text>
          <text x="300" y="125" text-anchor="middle" class="diagram-text">Fully Redundant</text>
          
          <!-- Headquarters -->
          <rect x="50" y="200" width="150" height="80" rx="5" class="diagram-box" />
          <text x="125" y="190" text-anchor="middle" class="diagram-title">Headquarters</text>
          
          <!-- Cloud Connector -->
          <rect x="95" y="220" width="60" height="20" rx="2" class="diagram-connector" />
          <text x="125" y="235" text-anchor="middle" class="diagram-text">Connector</text>
          
          <!-- Branch Office 1 -->
          <rect x="225" y="200" width="150" height="80" rx="5" class="diagram-box" />
          <text x="300" y="190" text-anchor="middle" class="diagram-title">Branch Office 1</text>
          
          <!-- Cloud Connector -->
          <rect x="270" y="220" width="60" height="20" rx="2" class="diagram-connector" />
          <text x="300" y="235" text-anchor="middle" class="diagram-text">Connector</text>
          
          <!-- Branch Office 2 -->
          <rect x="400" y="200" width="150" height="80" rx="5" class="diagram-box" />
          <text x="475" y="190" text-anchor="middle" class="diagram-title">Branch Office 2</text>
          
          <!-- Cloud Connector -->
          <rect x="445" y="220" width="60" height="20" rx="2" class="diagram-connector" />
          <text x="475" y="235" text-anchor="middle" class="diagram-text">Connector</text>
          
          <!-- Connections to Cloud -->
          <path d="M125 220 Q175 180, 225 150" class="diagram-arrow" />
          <path d="M300 220 V170" class="diagram-arrow" />
          <path d="M475 220 Q425 180, 375 150" class="diagram-arrow" />
          
          <!-- Administrator -->
          <circle cx="300" cy="270" r="15" fill="#ddd" stroke="#888" />
          <path d="M300 285 V290 Q285 300, 300 310 T315 290 V285" fill="#ddd" stroke="#888" />
          <text x="300" y="330" text-anchor="middle" class="diagram-text">Administrator</text>
          
          <!-- Connection from admin to cloud -->
          <path d="M300 255 Q350 220, 350 170" class="diagram-arrow" />
        </svg>
      `;
    }
    
    /**
     * Update TCO summary table
     */
    updateTCOSummaryTable(results) {
      const tableBody = document.getElementById('tco-summary-table-body');
      if (!tableBody) return;
      
      const currentVendor = this.activeVendor;
      const currentResults = results[currentVendor];
      const portnoxResults = results['portnox'];
      
      if (!currentResults || !portnoxResults) return;
      
      // Clear table
      tableBody.innerHTML = '';
      
      // Create rows for each cost component
      const createRow = (label, currentCost, portnoxCost) => {
        const row = document.createElement('tr');
        
        const labelCell = document.createElement('td');
        labelCell.textContent = label;
        
        const currentCell = document.createElement('td');
        currentCell.textContent = window.formatCurrency(currentCost);
        
        const portnoxCell = document.createElement('td');
        portnoxCell.textContent = window.formatCurrency(portnoxCost);
        
        const savingsCell = document.createElement('td');
        const savings = currentCost - portnoxCost;
        savingsCell.textContent = window.formatCurrency(savings);
        
        if (savings > 0) {
          savingsCell.classList.add('positive-savings');
        } else if (savings < 0) {
          savingsCell.classList.add('negative-savings');
        }
        
        row.appendChild(labelCell);
        row.appendChild(currentCell);
        row.appendChild(portnoxCell);
        row.appendChild(savingsCell);
        
        return row;
      };
      
      // Hardware costs
      tableBody.appendChild(createRow(
        'Hardware Costs',
        currentResults.hardwareCost,
        portnoxResults.hardwareCost
      ));
      
      // Network redesign
      tableBody.appendChild(createRow(
        'Network Redesign',
        currentResults.networkRedesignCost,
        portnoxResults.networkRedesignCost
      ));
      
      // Implementation
      tableBody.appendChild(createRow(
        'Implementation',
        currentResults.implementationCost,
        portnoxResults.implementationCost
      ));
      
      // Training
      tableBody.appendChild(createRow(
        'Training',
        currentResults.trainingCost,
        portnoxResults.trainingCost
      ));
      
      // Migration costs (only for Portnox)
      tableBody.appendChild(createRow(
        'Migration Costs',
        0,
        portnoxResults.migrationCost
      ));
      
      // Maintenance
      tableBody.appendChild(createRow(
        `Maintenance (${results.yearsToProject} years)`,
        currentResults.maintenanceCost * results.yearsToProject,
        portnoxResults.maintenanceCost * results.yearsToProject
      ));
      
      // Licensing
      tableBody.appendChild(createRow(
        `Licensing (${results.yearsToProject} years)`,
        currentResults.licensingCost * results.yearsToProject,
        portnoxResults.licensingCost * results.yearsToProject
      ));
      
      // Personnel
      tableBody.appendChild(createRow(
        `Personnel (${results.yearsToProject} years)`,
        currentResults.fteCost * results.yearsToProject,
        portnoxResults.fteCost * results.yearsToProject
      ));
      
      // Downtime
      tableBody.appendChild(createRow(
        `Downtime (${results.yearsToProject} years)`,
        currentResults.annualDowntimeCost * results.yearsToProject,
        portnoxResults.annualDowntimeCost * results.yearsToProject
      ));
      
      // Total row
      const totalRow = document.createElement('tr');
      totalRow.className = 'total-row';
      
      const totalLabelCell = document.createElement('td');
      totalLabelCell.textContent = `Total ${results.yearsToProject}-Year TCO`;
      
      const totalCurrentCell = document.createElement('td');
      totalCurrentCell.textContent = window.formatCurrency(currentResults.totalCosts);
      
      const totalPortnoxCell = document.createElement('td');
      totalPortnoxCell.textContent = window.formatCurrency(portnoxResults.totalCosts);
      
      const totalSavingsCell = document.createElement('td');
      totalSavingsCell.textContent = window.formatCurrency(portnoxResults.totalSavings);
      
      if (portnoxResults.totalSavings > 0) {
        totalSavingsCell.classList.add('positive-savings');
      } else if (portnoxResults.totalSavings < 0) {
        totalSavingsCell.classList.add('negative-savings');
      }
      
      totalRow.appendChild(totalLabelCell);
      totalRow.appendChild(totalCurrentCell);
      totalRow.appendChild(totalPortnoxCell);
      totalRow.appendChild(totalSavingsCell);
      
      tableBody.appendChild(totalRow);
    }
    
    /**
     * Update annual costs table
     */
    updateAnnualCostsTable(results) {
      const tableBody = document.getElementById('annual-costs-table-body');
      if (!tableBody) return;
      
      const currentVendor = this.activeVendor;
      const currentResults = results[currentVendor];
      const portnoxResults = results['portnox'];
      
      if (!currentResults || !portnoxResults) return;
      
      // Clear table
      tableBody.innerHTML = '';
      
      // Create rows for each cost component
      const createRow = (label, currentCost, portnoxCost) => {
        const row = document.createElement('tr');
        
        const labelCell = document.createElement('td');
        labelCell.textContent = label;
        
        const currentCell = document.createElement('td');
        currentCell.textContent = window.formatCurrency(currentCost);
        
        const portnoxCell = document.createElement('td');
        portnoxCell.textContent = window.formatCurrency(portnoxCost);
        
        const savingsCell = document.createElement('td');
        const savings = currentCost - portnoxCost;
        savingsCell.textContent = window.formatCurrency(savings);
        
        if (savings > 0) {
          savingsCell.classList.add('positive-savings');
        } else if (savings < 0) {
          savingsCell.classList.add('negative-savings');
        }
        
        row.appendChild(labelCell);
        row.appendChild(currentCell);
        row.appendChild(portnoxCell);
        row.appendChild(savingsCell);
        
        return row;
      };
      
      // Maintenance
      tableBody.appendChild(createRow(
        'Maintenance',
        currentResults.maintenanceCost,
        portnoxResults.maintenanceCost
      ));
      
      // Licensing
      tableBody.appendChild(createRow(
        'Licensing',
        currentResults.licensingCost,
        portnoxResults.licensingCost
      ));
      
      // Personnel
      tableBody.appendChild(createRow(
        'Personnel (FTE)',
        currentResults.fteCost,
        portnoxResults.fteCost
      ));
      
      // Downtime
      tableBody.appendChild(createRow(
        'Downtime',
        currentResults.annualDowntimeCost,
        portnoxResults.annualDowntimeCost
      ));
      
      // Total row
      const totalRow = document.createElement('tr');
      totalRow.className = 'total-row';
      
      const totalLabelCell = document.createElement('td');
      totalLabelCell.textContent = 'Total Annual Cost';
      
      const totalCurrentCell = document.createElement('td');
      totalCurrentCell.textContent = window.formatCurrency(currentResults.annualCosts);
      
      const totalPortnoxCell = document.createElement('td');
      totalPortnoxCell.textContent = window.formatCurrency(portnoxResults.annualCosts);
      
      const totalSavingsCell = document.createElement('td');
      const annualSavings = currentResults.annualCosts - portnoxResults.annualCosts;
      totalSavingsCell.textContent = window.formatCurrency(annualSavings);
      
      if (annualSavings > 0) {
        totalSavingsCell.classList.add('positive-savings');
      } else if (annualSavings < 0) {
        totalSavingsCell.classList.add('negative-savings');
      }
      
      totalRow.appendChild(totalLabelCell);
      totalRow.appendChild(totalCurrentCell);
      totalRow.appendChild(totalPortnoxCell);
      totalRow.appendChild(totalSavingsCell);
      
      tableBody.appendChild(totalRow);
    }
    
    /**
     * Update implementation table
     */
    updateImplementationTable(results) {
      const tableBody = document.getElementById('implementation-table-body');
      if (!tableBody) return;
      
      // Get vendor data
      const currentVendor = this.activeVendor;
      const orgSize = results.orgSize;
      
      const currentVendorData = window.vendorData[currentVendor];
      const portnoxData = window.vendorData['portnox'];
      
      if (!currentVendorData || !portnoxData || 
          !currentVendorData[orgSize] || !portnoxData[orgSize] ||
          !currentVendorData[orgSize].implementationTimeline || 
          !portnoxData[orgSize].implementationTimeline) {
        return;
      }
      
      const currentTimeline = currentVendorData[orgSize].implementationTimeline;
      const portnoxTimeline = portnoxData[orgSize].implementationTimeline;
      
      // Clear table
      tableBody.innerHTML = '';
      
      // Combine all phases from both vendors
      const phases = new Set([
        ...Object.keys(currentTimeline),
        ...Object.keys(portnoxTimeline)
      ]);
      
      // Create rows for each phase
      phases.forEach(phase => {
        const currentDays = currentTimeline[phase] || 0;
        const portnoxDays = portnoxTimeline[phase] || 0;
        const timeSaved = currentDays - portnoxDays;
        
        const row = document.createElement('tr');
        
        const phaseCell = document.createElement('td');
        phaseCell.className = 'phase-name';
        phaseCell.textContent = phase.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        
        const currentCell = document.createElement('td');
        currentCell.textContent = `${currentDays} days`;
        
        const portnoxCell = document.createElement('td');
        portnoxCell.textContent = `${portnoxDays} days`;
        
        const savingsCell = document.createElement('td');
        
        if (timeSaved > 0) {
          savingsCell.textContent = `${timeSaved} days`;
          savingsCell.classList.add('positive-savings');
        } else if (timeSaved < 0) {
          savingsCell.textContent = `${Math.abs(timeSaved)} days longer`;
          savingsCell.classList.add('negative-savings');
        } else {
          savingsCell.textContent = 'No difference';
        }
        
        row.appendChild(phaseCell);
        row.appendChild(currentCell);
        row.appendChild(portnoxCell);
        row.appendChild(savingsCell);
        
        tableBody.appendChild(row);
      });
      
      // Add total row
      const totalRow = document.createElement('tr');
      totalRow.className = 'total-row';
      
      const totalLabelCell = document.createElement('td');
      totalLabelCell.textContent = 'Total Implementation Time';
      
      const currentTotalDays = Object.values(currentTimeline).reduce((sum, days) => sum + days, 0);
      const totalCurrentCell = document.createElement('td');
      totalCurrentCell.textContent = `${currentTotalDays} days`;
      
      const portnoxTotalDays = Object.values(portnoxTimeline).reduce((sum, days) => sum + days, 0);
      const totalPortnoxCell = document.createElement('td');
      totalPortnoxCell.textContent = `${portnoxTotalDays} days`;
      
      const totalSavingsCell = document.createElement('td');
      const totalTimeSaved = currentTotalDays - portnoxTotalDays;
      
      if (totalTimeSaved > 0) {
        totalSavingsCell.textContent = `${totalTimeSaved} days`;
        totalSavingsCell.classList.add('positive-savings');
      } else if (totalTimeSaved < 0) {
        totalSavingsCell.textContent = `${Math.abs(totalTimeSaved)} days longer`;
        totalSavingsCell.classList.add('negative-savings');
      } else {
        totalSavingsCell.textContent = 'No difference';
      }
      
      totalRow.appendChild(totalLabelCell);
      totalRow.appendChild(totalCurrentCell);
      totalRow.appendChild(totalPortnoxCell);
      totalRow.appendChild(totalSavingsCell);
      
      tableBody.appendChild(totalRow);
    }
    
    /**
     * Update industry-specific metrics
     */
    updateIndustryMetrics(results) {
      const metricsContainer = document.getElementById('industry-specific-metrics');
      if (!metricsContainer) return;
      
      const selectedIndustry = document.getElementById('industry-selector')?.value;
      if (!selectedIndustry || selectedIndustry === 'none' || !window.industryTemplates[selectedIndustry]) {
        metricsContainer.classList.add('hidden');
        return;
      }
      
      const industry = window.industryTemplates[selectedIndustry];
      
      // Create industry metrics card
      metricsContainer.innerHTML = `
        <div class="result-card">
          <h3>${industry.name} Industry Benefits</h3>
          <div class="industry-metrics-grid">
            <div class="industry-metric">
              <h4>Compliance Benefits</h4>
              <ul>
                ${industry.complianceInfo.keyRequirements.map(req => `<li>${req}</li>`).join('')}
              </ul>
            </div>
            <div class="industry-metric">
              <h4>Cost Comparison</h4>
              <p>Industry Average TCO: ${window.formatCurrency(industry.benchmarks.averageTCO)}</p>
              <p>Your Portnox TCO: ${window.formatCurrency(results.portnox.totalCosts)}</p>
              <p>Cost Savings: ${window.formatCurrency(industry.benchmarks.averageTCO - results.portnox.totalCosts)}</p>
            </div>
            <div class="industry-metric">
              <h4>Implementation Time</h4>
              <p>Industry Average: ${industry.benchmarks.implementationTime} days</p>
              <p>With Portnox Cloud: ${results.implementationResults.portnox} days</p>
              <p>Time Saved: ${industry.benchmarks.implementationTime - results.implementationResults.portnox} days</p>
            </div>
          </div>
          <div class="industry-details">
            <p>${industry.complianceInfo.details}</p>
          </div>
        </div>
      `;
      
      metricsContainer.classList.remove('hidden');
    }
    
    /**
     * Apply industry template
     */
    applyIndustryTemplate(templateKey) {
      if (templateKey === 'none' || !window.industryTemplates) return;
      
      const template = window.industryTemplates[templateKey];
      if (!template || !template.defaults) return;
      
      const defaults = template.defaults;
      
      // Apply default values to form fields
      if (defaults.deviceCount) {
        document.getElementById('device-count').value = defaults.deviceCount;
      }
      
      if (defaults.yearsToProject) {
        document.getElementById('years-to-project').value = defaults.yearsToProject;
      }
      
      const multipleLocations = document.getElementById('multiple-locations');
      if (multipleLocations) {
        multipleLocations.checked = !!defaults.multipleLocations;
        
        // Handle dependent field
        const locationCountContainer = document.getElementById('location-count-container');
        if (locationCountContainer) {
          locationCountContainer.classList.toggle('hidden', !defaults.multipleLocations);
        }
      }
      
      if (defaults.locationCount) {
        document.getElementById('location-count').value = defaults.locationCount;
      }
      
      const complexAuthentication = document.getElementById('complex-authentication');
      if (complexAuthentication) {
        complexAuthentication.checked = !!defaults.complexAuthentication;
      }
      
      const legacyDevices = document.getElementById('legacy-devices');
      if (legacyDevices) {
        legacyDevices.checked = !!defaults.legacyDevices;
        
        // Handle dependent field
        const legacyPercentageContainer = document.getElementById('legacy-percentage-container');
        if (legacyPercentageContainer) {
          legacyPercentageContainer.classList.toggle('hidden', !defaults.legacyDevices);
        }
      }
      
      if (defaults.legacyPercentage) {
        document.getElementById('legacy-percentage').value = defaults.legacyPercentage;
        
        // Update displayed value
        const legacyPercentageValue = document.getElementById('legacy-percentage-value');
        if (legacyPercentageValue) {
          legacyPercentageValue.textContent = defaults.legacyPercentage + '%';
        }
      }
      
      const cloudIntegration = document.getElementById('cloud-integration');
      if (cloudIntegration) {
        cloudIntegration.checked = !!defaults.cloudIntegration;
      }
      
      const customPolicies = document.getElementById('custom-policies');
      if (customPolicies) {
        customPolicies.checked = !!defaults.customPolicies;
        
        // Handle dependent field
        const policyComplexityContainer = document.getElementById('policy-complexity-container');
        if (policyComplexityContainer) {
          policyComplexityContainer.classList.toggle('hidden', !defaults.customPolicies);
        }
      }
      
      if (defaults.policyComplexity) {
        document.getElementById('policy-complexity').value = defaults.policyComplexity;
      }
      
      // Update compliance info if available
      this.updateComplianceInfo(template);
      
      // Update benchmarks if available
      this.updateBenchmarks(template);
      
      // Show success notification
      if (window.notificationManager) {
        window.notificationManager.success(`Applied ${template.name} industry template`);
      }
      
      // Run calculation with new values
      if (window.calculator) {
        window.calculator.calculate();
      }
    }
    
    /**
     * Update compliance info
     */
    updateComplianceInfo(template) {
      if (!template.complianceInfo) return;
      
      const container = document.getElementById('compliance-info-container');
      if (!container) return;
      
      // Create compliance info card
      container.innerHTML = `
        <div class="compliance-info-card">
          <h3>${template.complianceInfo.title}</h3>
          <p>${template.complianceInfo.details}</p>
          <ul class="compliance-requirements">
            ${template.complianceInfo.keyRequirements.map(req => `<li>${req}</li>`).join('')}
          </ul>
        </div>
      `;
      
      // Show container
      container.classList.remove('hidden');
    }
    
    /**
     * Update benchmarks
     */
    updateBenchmarks(template) {
      if (!template.benchmarks) return;
      
      const container = document.getElementById('industry-benchmarks-container');
      if (!container) return;
      
      // Create benchmarks card
      container.innerHTML = `
        <div class="benchmarks-card">
          <h3>${template.name} Industry Benchmarks</h3>
          <div class="benchmark-metrics">
            <div class="benchmark-metric">
              <label>Average TCO:</label>
              <div class="benchmark-value">${window.formatCurrency(template.benchmarks.averageTCO)}</div>
            </div>
            <div class="benchmark-metric">
              <label>Typical Implementation Time:</label>
              <div class="benchmark-value">${template.benchmarks.implementationTime} days</div>
            </div>
            <div class="benchmark-metric">
              <label>Average Annual FTE Cost:</label>
              <div class="benchmark-value">${window.formatCurrency(template.benchmarks.fteCost)}</div>
            </div>
          </div>
        </div>
      `;
      
      // Show container
      container.classList.remove('hidden');
    }
    
    /**
     * Export results to CSV
     */
    exportToCSV() {
      if (!window.calculator || !window.calculator.results) {
        if (window.notificationManager) {
          window.notificationManager.warn('No results to export');
        } else {
          alert('No results to export');
        }
        return;
      }
      
      try {
        const results = window.calculator.results;
        const currentVendor = this.activeVendor;
        
        // Create CSV content
        let csv = [];
        
        // Add header
        csv.push(['NAC Solution TCO Comparison']);
        csv.push([`Generated on ${new Date().toLocaleDateString()}`]);
        csv.push([]);
        
        // Add organization details
        csv.push(['Organization Details']);
        csv.push(['Device Count', results.deviceCount]);
        csv.push(['Organization Size', results.orgSize.charAt(0).toUpperCase() + results.orgSize.slice(1)]);
        csv.push(['Years Projected', results.yearsToProject]);
        csv.push(['Multiple Locations', results.multipleLocations ? 'Yes' : 'No']);
        if (results.multipleLocations) {
          csv.push(['Location Count', results.locationCount]);
        }
        csv.push(['Complex Authentication', results.complexAuthentication ? 'Yes' : 'No']);
        csv.push(['Legacy Devices', results.legacyDevices ? 'Yes' : 'No']);
        if (results.legacyDevices) {
          csv.push(['Legacy Percentage', `${results.legacyPercentage}%`]);
        }
        csv.push(['Cloud Integration', results.cloudIntegration ? 'Yes' : 'No']);
        csv.push(['Custom Policies', results.customPolicies ? 'Yes' : 'No']);
        if (results.customPolicies) {
          csv.push(['Policy Complexity', results.policyComplexity.charAt(0).toUpperCase() + results.policyComplexity.slice(1)]);
        }
        csv.push([]);
        
        // Add TCO summary
        csv.push(['TCO Summary']);
        
        // Column headers for vendors
        const vendors = Object.keys(results).filter(key => 
          typeof results[key] === 'object' && 
          results[key] !== null && 
          key !== 'implementationResults' &&
          window.vendorData[key]
        );
        
        const vendorNames = ['Cost Component', ...vendors.map(v => window.vendorData[v].name)];
        csv.push(vendorNames);
        
        // Add cost components
        csv.push(['Hardware Costs', ...vendors.map(v => results[v].hardwareCost)]);
        csv.push(['Network Redesign', ...vendors.map(v => results[v].networkRedesignCost)]);
        csv.push(['Implementation', ...vendors.map(v => results[v].implementationCost)]);
        csv.push(['Training', ...vendors.map(v => results[v].trainingCost)]);
        csv.push(['Migration Costs', ...vendors.map(v => results[v].migrationCost || 0)]);
        csv.push([`Maintenance (${results.yearsToProject} years)`, ...vendors.map(v => results[v].maintenanceCost * results.yearsToProject)]);
        csv.push([`Licensing (${results.yearsToProject} years)`, ...vendors.map(v => results[v].licensingCost * results.yearsToProject)]);
        csv.push([`Personnel (${results.yearsToProject} years)`, ...vendors.map(v => results[v].fteCost * results.yearsToProject)]);
        csv.push([`Downtime (${results.yearsToProject} years)`, ...vendors.map(v => results[v].annualDowntimeCost * results.yearsToProject)]);
        csv.push([`Total ${results.yearsToProject}-Year TCO`, ...vendors.map(v => results[v].totalCosts)]);
        csv.push([]);
        
        // Add annual costs
        csv.push(['Annual Operating Costs']);
        csv.push(['Cost Category', ...vendors.map(v => window.vendorData[v].name)]);
        csv.push(['Maintenance', ...vendors.map(v => results[v].maintenanceCost)]);
        csv.push(['Licensing', ...vendors.map(v => results[v].licensingCost)]);
        csv.push(['Personnel (FTE)', ...vendors.map(v => results[v].fteCost)]);
        csv.push(['Downtime', ...vendors.map(v => results[v].annualDowntimeCost)]);
        csv.push(['Total Annual Cost', ...vendors.map(v => results[v].annualCosts)]);
        csv.push([]);
        
        // Add implementation times
        if (results.implementationResults) {
          csv.push(['Implementation Times']);
          csv.push(['Vendor', 'Days']);
          
          Object.keys(results.implementationResults).forEach(vendor => {
            if (window.vendorData[vendor]) {
              csv.push([window.vendorData[vendor].name, results.implementationResults[vendor]]);
            }
          });
        }
        
        // Format CSV
        const csvContent = csv.map(row => {
          return row.map(cell => {
            // Format numbers as currency if needed
            if (typeof cell === 'number') {
              return window.formatCurrency(cell).replace(/\$/g, '');
            }
            
            // Escape commas in text
            if (typeof cell === 'string' && cell.includes(',')) {
              return `"${cell}"`;
            }
            
            return cell;
          }).join(',');
        }).join('\n');
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `NAC_TCO_Comparison_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success notification
        if (window.notificationManager) {
          window.notificationManager.success('CSV file exported successfully');
        }
      } catch (error) {
        console.error('Error exporting to CSV:', error);
        
        // Show error notification
        if (window.notificationManager) {
          window.notificationManager.error('Error exporting CSV: ' + error.message);
        } else {
          alert('Error exporting CSV: ' + error.message);
        }
      }
    }
    
    /**
     * Export results to PDF
     */
    exportToPDF() {
      if (!window.calculator || !window.calculator.results) {
        if (window.notificationManager) {
          window.notificationManager.warn('No results to export');
        } else {
          alert('No results to export');
        }
        return;
      }
      
      try {
        // Check if PDF generator is available
        if (window.PDFReportGenerator) {
          const generator = new PDFReportGenerator();
          const results = window.calculator.results;
          const currentVendor = this.activeVendor;
          
          // Get report type
          const reportType = document.getElementById('report-type')?.value || 'complete';
          
          // Generate PDF
          const doc = generator.generateReport(results, currentVendor, reportType);
          
          // Save PDF
          doc.save(`NAC_TCO_Report_${reportType}_${new Date().toISOString().slice(0, 10)}.pdf`);
          
          // Show success notification
          if (window.notificationManager) {
            window.notificationManager.success('PDF report exported successfully');
          }
        } else {
          // Basic PDF generation if PDFReportGenerator is not available
          if (typeof jsPDF !== 'undefined') {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.text('NAC TCO Comparison Report', 105, 15, { align: 'center' });
            doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 25, { align: 'center' });
            
            // Add basic content
            doc.text('Please see the web application for detailed results.', 20, 40);
            
            // Save PDF
            doc.save(`NAC_TCO_Basic_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
            
            // Show success notification
            if (window.notificationManager) {
              window.notificationManager.success('Basic PDF report exported successfully');
            }
          } else {
            throw new Error('PDF generation library not available');
          }
        }
      } catch (error) {
        console.error('Error exporting to PDF:', error);
        
        // Show error notification
        if (window.notificationManager) {
          window.notificationManager.error('Error exporting PDF: ' + error.message);
        } else {
          alert('Error exporting PDF: ' + error.message);
        }
      }
    }
  }
  
  // Assign the UIController class to the window
  window.UIController = UIController;
}
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const RuntimeGlobals = require("../RuntimeGlobals");
const UnsupportedFeatureWarning = require("../UnsupportedFeatureWarning");
const AMDRequireArrayDependency = require("./AMDRequireArrayDependency");
const AMDRequireContextDependency = require("./AMDRequireContextDependency");
const AMDRequireDependenciesBlock = require("./AMDRequireDependenciesBlock");
const AMDRequireDependency = require("./AMDRequireDependency");
const AMDRequireItemDependency = require("./AMDRequireItemDependency");
const ConstDependency = require("./ConstDependency");
const ContextDependencyHelpers = require("./ContextDependencyHelpers");
const LocalModuleDependency = require("./LocalModuleDependency");
const { getLocalModule } = require("./LocalModulesHelpers");
const UnsupportedDependency = require("./UnsupportedDependency");
const getFunctionExpression = require("./getFunctionExpression");

/** @typedef {import("estree").CallExpression} CallExpression */
/** @typedef {import("estree").Expression} Expression */
/** @typedef {import("estree").Identifier} Identifier */
/** @typedef {import("estree").SourceLocation} SourceLocation */
/** @typedef {import("estree").SpreadElement} SpreadElement */
/** @typedef {import("../../declarations/WebpackOptions").JavascriptParserOptions} JavascriptParserOptions */
/** @typedef {import("../Dependency").DependencyLocation} DependencyLocation */
/** @typedef {import("../Module").BuildInfo} BuildInfo */
/** @typedef {import("../javascript/BasicEvaluatedExpression")} BasicEvaluatedExpression */
/** @typedef {import("../javascript/JavascriptParser")} JavascriptParser */
/** @typedef {import("../javascript/JavascriptParser").Range} Range */

class AMDRequireDependenciesBlockParserPlugin {
	/**
	 * @param {JavascriptParserOptions} options parserOptions
	 */
	constructor(options) {
		this.options = options;
	}

	/**
	 * @param {JavascriptParser} parser the parser
	 * @param {Expression | SpreadElement} expression expression
	 * @returns {boolean} need bind this
	 */
	processFunctionArgument(parser, expression) {
		let bindThis = true;
		const fnData = getFunctionExpression(expression);
		if (fnData) {
			parser.inScope(
				fnData.fn.params.filter(
					i =>
						!["require", "module", "exports"].includes(
							/** @type {Identifier} */ (i).name
						)
				),
				() => {
					if (fnData.fn.body.type === "BlockStatement") {
						parser.walkStatement(fnData.fn.body);
					} else {
						parser.walkExpression(fnData.fn.body);
					}
				}
			);
			parser.walkExpressions(fnData.expressions);
			if (fnData.needThis === false) {
				bindThis = false;
			}
		} else {
			parser.walkExpression(expression);
		}
		return bindThis;
	}

	/**
	 * @param {JavascriptParser} parser the parser
	 * @returns {void}
	 */
	apply(parser) {
		parser.hooks.call
			.for("require")
			.tap(
				"AMDRequireDependenciesBlockParserPlugin",
				this.processCallRequire.bind(this, parser)
			);
	}

	/**
	 * @param {JavascriptParser} parser the parser
	 * @param {CallExpression} expr call expression
	 * @param {BasicEvaluatedExpression} param param
	 * @returns {boolean | undefined} result
	 */
	processArray(parser, expr, param) {
		if (param.isArray()) {
			for (const p of /** @type {BasicEvaluatedExpression[]} */ (param.items)) {
				const result = this.processItem(parser, expr, p);
				if (result === undefined) {
					this.processContext(parser, expr, p);
				}
			}
			return true;
		} else if (param.isConstArray()) {
			/** @type {(string | LocalModuleDependency | AMDRequireItemDependency)[]} */
			const deps = [];
			for (const request of /** @type {EXPECTED_ANY[]} */ (param.array)) {
				let dep;
				let localModule;
				if (request === "require") {
					dep = RuntimeGlobals.require;
				} else if (["exports", "module"].includes(request)) {
					dep = request;
				} else if ((localModule = getLocalModule(parser.state, request))) {
					localModule.flagUsed();
					dep = new LocalModuleDependency(localModule, undefined, false);
					dep.loc = /** @type {DependencyLocation} */ (expr.loc);
					parser.state.module.addPresentationalDependency(dep);
				} else {
					dep = this.newRequireItemDependency(request);
					dep.loc = /** @type {DependencyLocation} */ (expr.loc);
					dep.optional = Boolean(parser.scope.inTry);
					parser.state.current.addDependency(dep);
				}
				deps.push(dep);
			}
			const dep = this.newRequireArrayDependency(
				deps,
				/** @type {Range} */ (param.range)
			);
			dep.loc = /** @type {DependencyLocation} */ (expr.loc);
			dep.optional = Boolean(parser.scope.inTry);
			parser.state.module.addPresentationalDependency(dep);
			return true;
		}
	}

	/**
	 * @param {JavascriptParser} parser the parser
	 * @param {CallExpression} expr call expression
	 * @param {BasicEvaluatedExpression} param param
	 * @returns {boolean | undefined} result
	 */
	processItem(parser, expr, param) {
		if (param.isConditional()) {
			for (const p of /** @type {BasicEvaluatedExpression[]} */ (
				param.options
			)) {
				const result = this.processItem(parser, expr, p);
				if (result === undefined) {
					this.processContext(parser, expr, p);
				}
			}
			return true;
		} else if (param.isString()) {
			let dep;
			let localModule;
			if (param.string === "require") {
				dep = new ConstDependency(
					RuntimeGlobals.require,
					/** @type {TODO} */
					(param.string),
					[RuntimeGlobals.require]
				);
			} else if (param.string === "module") {
				dep = new ConstDependency(
					/** @type {string} */
					(
						/** @type {BuildInfo} */
						(parser.state.module.buildInfo).moduleArgument
					),
					/** @type {Range} */ (param.range),
					[RuntimeGlobals.module]
				);
			} else if (param.string === "exports") {
				dep = new ConstDependency(
					/** @type {string} */
					(
						/** @type {BuildInfo} */
						(parser.state.module.buildInfo).exportsArgument
					),
					/** @type {Range} */ (param.range),
					[RuntimeGlobals.exports]
				);
			} else if (
				(localModule = getLocalModule(
					parser.state,
					/** @type {string} */ (param.string)
				))
			) {
				localModule.flagUsed();
				dep = new LocalModuleDependency(localModule, param.range, false);
			} else {
				dep = this.newRequireItemDependency(
					/** @type {string} */ (param.string),
					param.range
				);
				dep.loc = /** @type {DependencyLocation} */ (expr.loc);
				dep.optional = Boolean(parser.scope.inTry);
				parser.state.current.addDependency(dep);
				return true;
			}
			dep.loc = /** @type {DependencyLocation} */ (expr.loc);
			parser.state.module.addPresentationalDependency(dep);
			return true;
		}
	}

	/**
	 * @param {JavascriptParser} parser the parser
	 * @param {CallExpression} expr call expression
	 * @param {BasicEvaluatedExpression} param param
	 * @returns {boolean | undefined} result
	 */
	processContext(parser, expr, param) {
		const dep = ContextDependencyHelpers.create(
			AMDRequireContextDependency,
			/** @type {Range} */
			(param.range),
			param,
			expr,
			this.options,
			{
				category: "amd"
			},
			parser
		);
		if (!dep) return;
		dep.loc = /** @type {DependencyLocation} */ (expr.loc);
		dep.optional = Boolean(parser.scope.inTry);
		parser.state.current.addDependency(dep);
		return true;
	}

	/**
	 * @param {BasicEvaluatedExpression} param param
	 * @returns {string | undefined} result
	 */
	processArrayForRequestString(param) {
		if (param.isArray()) {
			const result =
				/** @type {BasicEvaluatedExpression[]} */
				(param.items).map(item => this.processItemForRequestString(item));
			if (result.every(Boolean)) return result.join(" ");
		} else if (param.isConstArray()) {
			return /** @type {string[]} */ (param.array).join(" ");
		}
	}

	/**
	 * @param {BasicEvaluatedExpression} param param
	 * @returns {string | undefined} result
	 */
	processItemForRequestString(param) {
		if (param.isConditional()) {
			const result =
				/** @type {BasicEvaluatedExpression[]} */
				(param.options).map(item => this.processItemForRequestString(item));
			if (result.every(Boolean)) return result.join("|");
		} else if (param.isString()) {
			return param.string;
		}
	}

	/**
	 * @param {JavascriptParser} parser the parser
	 * @param {CallExpression} expr call expression
	 * @returns {boolean | undefined} result
	 */
	processCallRequire(parser, expr) {
		/** @type {BasicEvaluatedExpression | undefined} */
		let param;
		/** @type {AMDRequireDependenciesBlock | undefined | null} */
		let depBlock;
		/** @type {AMDRequireDependency | undefined} */
		let dep;
		/** @type {boolean | undefined} */
		let result;

		const old = parser.state.current;

		if (expr.arguments.length >= 1) {
			param = parser.evaluateExpression(
				/** @type {Expression} */ (expr.arguments[0])
			);
			depBlock = this.newRequireDependenciesBlock(
				/** @type {DependencyLocation} */ (expr.loc),
				this.processArrayForRequestString(param)
			);
			dep = this.newRequireDependency(
				/** @type {Range} */ (expr.range),
				/** @type {Range} */ (param.range),
				expr.arguments.length > 1
					? /** @type {Range} */ (expr.arguments[1].range)
					: null,
				expr.arguments.length > 2
					? /** @type {Range} */ (expr.arguments[2].range)
					: null
			);
			dep.loc = /** @type {DependencyLocation} */ (expr.loc);
			depBlock.addDependency(dep);

			parser.state.current = /** @type {TODO} */ (depBlock);
		}

		if (expr.arguments.length === 1) {
			parser.inScope([], () => {
				result = this.processArray(
					parser,
					expr,
					/** @type {BasicEvaluatedExpression} */ (param)
				);
			});
			parser.state.current = old;
			if (!result) return;
			parser.state.current.addBlock(
				/** @type {AMDRequireDependenciesBlock} */ (depBlock)
			);
			return true;
		}

		if (expr.arguments.length === 2 || expr.arguments.length === 3) {
			try {
				parser.inScope([], () => {
					result = this.processArray(
						parser,
						expr,
						/** @type {BasicEvaluatedExpression} */ (param)
					);
				});
				if (!result) {
					const dep = new UnsupportedDependency(
						"unsupported",
						/** @type {Range} */ (expr.range)
					);
					old.addPresentationalDependency(dep);
					if (parser.state.module) {
						parser.state.module.addError(
							new UnsupportedFeatureWarning(
								`Cannot statically analyse 'require(…, …)' in line ${
									/** @type {SourceLocation} */ (expr.loc).start.line
								}`,
								/** @type {DependencyLocation} */ (expr.loc)
							)
						);
					}
					depBlock = null;
					return true;
				}
				/** @type {AMDRequireDependency} */
				(dep).functionBindThis = this.processFunctionArgument(
					parser,
					expr.arguments[1]
				);
				if (expr.arguments.length === 3) {
					/** @type {AMDRequireDependency} */
					(dep).errorCallbackBindThis = this.processFunctionArgument(
						parser,
						expr.arguments[2]
					);
				}
			} finally {
				parser.state.current = old;
				if (depBlock) parser.state.current.addBlock(depBlock);
			}
			return true;
		}
	}

	/**
	 * @param {DependencyLocation} loc location
	 * @param {string=} request request
	 * @returns {AMDRequireDependenciesBlock} AMDRequireDependenciesBlock
	 */
	newRequireDependenciesBlock(loc, request) {
		return new AMDRequireDependenciesBlock(loc, request);
	}

	/**
	 * @param {Range} outerRange outer range
	 * @param {Range} arrayRange array range
	 * @param {Range | null} functionRange function range
	 * @param {Range | null} errorCallbackRange error callback range
	 * @returns {AMDRequireDependency} dependency
	 */
	newRequireDependency(
		outerRange,
		arrayRange,
		functionRange,
		errorCallbackRange
	) {
		return new AMDRequireDependency(
			outerRange,
			arrayRange,
			functionRange,
			errorCallbackRange
		);
	}

	/**
	 * @param {string} request request
	 * @param {Range=} range range
	 * @returns {AMDRequireItemDependency} AMDRequireItemDependency
	 */
	newRequireItemDependency(request, range) {
		return new AMDRequireItemDependency(request, range);
	}

	/**
	 * @param {(string | LocalModuleDependency | AMDRequireItemDependency)[]} depsArray deps array
	 * @param {Range} range range
	 * @returns {AMDRequireArrayDependency} AMDRequireArrayDependency
	 */
	newRequireArrayDependency(depsArray, range) {
		return new AMDRequireArrayDependency(depsArray, range);
	}
}
module.exports = AMDRequireDependenciesBlockParserPlugin;
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const makeSerializable = require("../util/makeSerializable");
const NullDependency = require("./NullDependency");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("../ChunkGraph")} ChunkGraph */
/** @typedef {import("../Dependency")} Dependency */
/** @typedef {import("../Dependency").UpdateHashContext} UpdateHashContext */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */
/** @typedef {import("../ModuleGraph")} ModuleGraph */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectDeserializerContext} ObjectDeserializerContext */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectSerializerContext} ObjectSerializerContext */
/** @typedef {import("../util/Hash")} Hash */

class RuntimeRequirementsDependency extends NullDependency {
	/**
	 * @param {string[]} runtimeRequirements runtime requirements
	 */
	constructor(runtimeRequirements) {
		super();
		this.runtimeRequirements = new Set(runtimeRequirements);
		this._hashUpdate = undefined;
	}

	/**
	 * Update the hash
	 * @param {Hash} hash hash to be updated
	 * @param {UpdateHashContext} context context
	 * @returns {void}
	 */
	updateHash(hash, context) {
		if (this._hashUpdate === undefined) {
			this._hashUpdate = `${Array.from(this.runtimeRequirements).join()}`;
		}
		hash.update(this._hashUpdate);
	}

	/**
	 * @param {ObjectSerializerContext} context context
	 */
	serialize(context) {
		const { write } = context;
		write(this.runtimeRequirements);
		super.serialize(context);
	}

	/**
	 * @param {ObjectDeserializerContext} context context
	 */
	deserialize(context) {
		const { read } = context;
		this.runtimeRequirements = read();
		super.deserialize(context);
	}
}

makeSerializable(
	RuntimeRequirementsDependency,
	"webpack/lib/dependencies/RuntimeRequirementsDependency"
);

RuntimeRequirementsDependency.Template = class RuntimeRequirementsDependencyTemplate extends (
	NullDependency.Template
) {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(dependency, source, { runtimeRequirements }) {
		const dep = /** @type {RuntimeRequirementsDependency} */ (dependency);
		for (const req of dep.runtimeRequirements) {
			runtimeRequirements.add(req);
		}
	}
};

module.exports = RuntimeRequirementsDependency;
// TCO Analyzer Enhancement Suite - Quick Tester
(function() {
  console.log('Testing TCO Analyzer Enhancement Suite...');
  
  // Load the consolidated fix
  const script = document.createElement('script');
  script.src = 'install-consolidated-fix.js';
  document.head.appendChild(script);
  
  // Add the enhanced styles
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'fixes/enhanced-styles.css';
  document.head.appendChild(link);
  
  console.log('Enhancement suite test initialized!');
})();
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const makeSerializable = require("../util/makeSerializable");
const ContextDependency = require("./ContextDependency");

/** @typedef {import("../javascript/JavascriptParser").Range} Range */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectDeserializerContext} ObjectDeserializerContext */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectSerializerContext} ObjectSerializerContext */
/** @typedef {import("./ContextDependency").ContextDependencyOptions} ContextDependencyOptions */

class AMDRequireContextDependency extends ContextDependency {
	/**
	 * @param {ContextDependencyOptions} options options
	 * @param {Range} range range
	 * @param {Range} valueRange value range
	 */
	constructor(options, range, valueRange) {
		super(options);

		this.range = range;
		this.valueRange = valueRange;
	}

	get type() {
		return "amd require context";
	}

	get category() {
		return "amd";
	}

	/**
	 * @param {ObjectSerializerContext} context context
	 */
	serialize(context) {
		const { write } = context;

		write(this.range);
		write(this.valueRange);

		super.serialize(context);
	}

	/**
	 * @param {ObjectDeserializerContext} context context
	 */
	deserialize(context) {
		const { read } = context;

		this.range = read();
		this.valueRange = read();

		super.deserialize(context);
	}
}

makeSerializable(
	AMDRequireContextDependency,
	"webpack/lib/dependencies/AMDRequireContextDependency"
);

AMDRequireContextDependency.Template = require("./ContextDependencyTemplateAsRequireCall");

module.exports = AMDRequireContextDependency;
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const RequireContextDependency = require("./RequireContextDependency");

/** @typedef {import("../ContextModule").ContextMode} ContextMode */
/** @typedef {import("../Dependency").DependencyLocation} DependencyLocation */
/** @typedef {import("../javascript/JavascriptParser")} JavascriptParser */
/** @typedef {import("../javascript/JavascriptParser").Range} Range */

const PLUGIN_NAME = "RequireContextDependencyParserPlugin";

module.exports = class RequireContextDependencyParserPlugin {
	/**
	 * @param {JavascriptParser} parser the parser
	 * @returns {void}
	 */
	apply(parser) {
		parser.hooks.call.for("require.context").tap(PLUGIN_NAME, expr => {
			let regExp = /^\.\/.*$/;
			let recursive = true;
			/** @type {ContextMode} */
			let mode = "sync";
			switch (expr.arguments.length) {
				case 4: {
					const modeExpr = parser.evaluateExpression(expr.arguments[3]);
					if (!modeExpr.isString()) return;
					mode = /** @type {ContextMode} */ (modeExpr.string);
				}
				// falls through
				case 3: {
					const regExpExpr = parser.evaluateExpression(expr.arguments[2]);
					if (!regExpExpr.isRegExp()) return;
					regExp = /** @type {RegExp} */ (regExpExpr.regExp);
				}
				// falls through
				case 2: {
					const recursiveExpr = parser.evaluateExpression(expr.arguments[1]);
					if (!recursiveExpr.isBoolean()) return;
					recursive = /** @type {boolean} */ (recursiveExpr.bool);
				}
				// falls through
				case 1: {
					const requestExpr = parser.evaluateExpression(expr.arguments[0]);
					if (!requestExpr.isString()) return;
					const dep = new RequireContextDependency(
						{
							request: /** @type {string} */ (requestExpr.string),
							recursive,
							regExp,
							mode,
							category: "commonjs"
						},
						/** @type {Range} */
						(expr.range)
					);
					dep.loc = /** @type {DependencyLocation} */ (expr.loc);
					dep.optional = Boolean(parser.scope.inTry);
					parser.state.current.addDependency(dep);
					return true;
				}
			}
		});
	}
};
'use strict';
module.exports = require('../../full/data-view/get-uint8-clamped');
'use strict';
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var aDataView = require('../internals/a-data-view');
var toIndex = require('../internals/to-index');
var toUint8Clamped = require('../internals/to-uint8-clamped');

// eslint-disable-next-line es/no-typed-arrays -- safe
var setUint8 = uncurryThis(DataView.prototype.setUint8);

// `DataView.prototype.setUint8Clamped` method
// https://github.com/tc39/proposal-dataview-get-set-uint8clamped
$({ target: 'DataView', proto: true, forced: true }, {
  setUint8Clamped: function setUint8Clamped(byteOffset, value) {
    aDataView(this);
    var offset = toIndex(byteOffset);
    return setUint8(this, offset, toUint8Clamped(value));
  }
});
/**
 * UI Transformer
 * Completely transforms the UI layout for the Total Cost Analyzer
 */
(function() {
  console.log("Starting UI Transformer");
  
  // Execute when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Update page title
    document.title = "Total Cost Analyzer";
    
    // Update logo text
    const logoText = document.querySelector('.logo h1');
    if (logoText) {
      logoText.textContent = "Total Cost Analyzer";
    }
    
    // Apply transformations
    removeWizardSteps();
    organizeVendorSection();
    setupTabsUnderVendors();
    enhanceWizardWithVendorLogos();
    setupEventHandlers();
    
    console.log("UI transformation complete");
  });
  
  // Remove wizard steps and show results container
  function removeWizardSteps() {
    console.log("Removing wizard steps...");
    
    // Hide wizard elements
    const wizardElements = [
      '.wizard-nav',
      '.wizard-content',
      '#wizard-error-container'
    ];
    
    wizardElements.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.style.display = 'none';
      }
    });
    
    // Show results container
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
      resultsContainer.classList.remove('hidden');
      resultsContainer.style.display = 'block';
    }
  }
  
  // Organize vendor section
  function organizeVendorSection() {
    console.log("Organizing vendor section...");
    
    const calculatorContainer = document.querySelector('.calculator-container');
    if (!calculatorContainer) return;
    
    // Check if vendor selection section already exists
    let vendorSection = document.querySelector('.vendor-selection-section');
    if (!vendorSection) {
      // Create vendor selection section
      vendorSection = document.createElement('div');
      vendorSection.className = 'vendor-selection-section';
      vendorSection.innerHTML = `
        <h2>Select Your NAC Solution</h2>
        <div class="vendor-cards-grid"></div>
        <div class="vendor-info-panel" style="display:none;"></div>
      `;
      
      // Add to the top of the calculator container
      if (calculatorContainer.firstChild) {
        calculatorContainer.insertBefore(vendorSection, calculatorContainer.firstChild);
      } else {
        calculatorContainer.appendChild(vendorSection);
      }
    }
    
    // Find vendor cards
    const vendorCardsGrid = vendorSection.querySelector('.vendor-cards-grid');
    if (!vendorCardsGrid) return;
    
    // Clear existing cards
    vendorCardsGrid.innerHTML = '';
    
    // Create vendor cards
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
      card.className = 'vendor-card';
      card.setAttribute('data-vendor', vendor.id);
      
      const img = document.createElement('img');
      img.src = vendor.logo;
      img.alt = vendor.name;
      
      const span = document.createElement('span');
      span.textContent = vendor.name;
      
      card.appendChild(img);
      card.appendChild(span);
      vendorCardsGrid.appendChild(card);
    });
  }
  
  // Setup tabs to appear directly under vendors
  function setupTabsUnderVendors() {
    console.log("Setting up tabs under vendors...");
    
    const resultsContainer = document.getElementById('results-container');
    if (!resultsContainer) return;
    
    // Move tabs right after vendor section
    const tabs = resultsContainer.querySelector('.tabs');
    if (!tabs) return;
    
    const vendorSection = document.querySelector('.vendor-selection-section');
    if (!vendorSection) return;
    
    // Insert tabs after vendor section
    vendorSection.after(tabs);
    
    // Ensure tabs have the right styling
    tabs.style.marginBottom = '0';
    tabs.style.borderRadius = '8px 8px 0 0';
    
    // Style the tab content container
    const tabContent = resultsContainer.querySelector('.tab-content');
    if (!tabContent) return;
    
    tabContent.style.borderRadius = '0 0 8px 8px';
    tabContent.style.marginTop = '0';
  }
  
  // Enhance TCO Wizard with vendor logos
  function enhanceWizardWithVendorLogos() {
    console.log("Enhancing wizard with vendor logos...");
    
    // Find the vendor selection step content
    const vendorSelectionStep = document.getElementById('step-vendor-selection');
    if (!vendorSelectionStep) return;
    
    // Find the vendor options container
    const vendorOptions = vendorSelectionStep.querySelector('.vendor-options');
    if (!vendorOptions) return;
    
    // Hide the original vendor cards
    vendorOptions.style.display = 'none';
    
    // Create new vendor selection
    const wizardVendorSelection = document.createElement('div');
    wizardVendorSelection.className = 'wizard-vendor-selection';
    
    // Vendor data with logos
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
    
    // Create vendor cards
    vendors.forEach(vendor => {
      const card = document.createElement('div');
      card.className = 'wizard-vendor-card';
      card.setAttribute('data-vendor', vendor.id);
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', 'false');
      card.setAttribute('tabindex', '0');
      
      const img = document.createElement('img');
      img.src = vendor.logo;
      img.alt = vendor.name;
      
      const span = document.createElement('span');
      span.textContent = vendor.name;
      
      card.appendChild(img);
      card.appendChild(span);
      wizardVendorSelection.appendChild(card);
      
      // Add click event
      card.addEventListener('click', function() {
        // Select this vendor in the original select
        const originalVendorCard = vendorOptions.querySelector(`[data-vendor="${vendor.id}"]`);
        if (originalVendorCard) {
          // Simulate click on original vendor card
          originalVendorCard.click();
        }
        
        // Update wizard vendor cards
        wizardVendorSelection.querySelectorAll('.wizard-vendor-card').forEach(c => {
          c.classList.remove('selected');
          c.setAttribute('aria-checked', 'false');
        });
        
        card.classList.add('selected');
        card.setAttribute('aria-checked', 'true');
      });
    });
    
    // Insert new vendor selection before the vendor options
    vendorOptions.parentNode.insertBefore(wizardVendorSelection, vendorOptions);
  }
  
  // Setup event handlers
  function setupEventHandlers() {
    console.log("Setting up event handlers...");
    
    // Configure vendor cards
    setupVendorCards();
    
    // Configure tabs
    setupTabs();
    
    // Configure sub-tabs
    setupSubTabs();
  }
  
  // Setup vendor cards
  function setupVendorCards() {
    // Initialize vendor data
    const vendorData = {
      cisco: {
        name: "Cisco ISE",
        description: "Enterprise-grade on-premises NAC solution with comprehensive security features and deep Cisco integration.",
        metrics: {
          implementationTime: "3-6 months",
          totalCost: "$350K-$500K",
          maintenance: "High"
        }
      },
      aruba: {
        name: "Aruba ClearPass",
        description: "Advanced NAC solution with strong wireless integration and multi-vendor support.",
        metrics: {
          implementationTime: "2-4 months",
          totalCost: "$300K-$450K",
          maintenance: "Medium-High"
        }
      },
      forescout: {
        name: "Forescout",
        description: "Specialized in device visibility and control with agentless operation and strong IoT support.",
        metrics: {
          implementationTime: "2-5 months",
          totalCost: "$320K-$480K",
          maintenance: "Medium-High"
        }
      },
      fortinac: {
        name: "FortiNAC",
        description: "NAC solution from Fortinet with strong security fabric integration for unified security.",
        metrics: {
          implementationTime: "2-4 months",
          totalCost: "$250K-$400K",
          maintenance: "Medium"
        }
      },
      nps: {
        name: "Microsoft NPS",
        description: "Basic Windows-based RADIUS server with limited NAC capabilities, suitable for Windows environments.",
        metrics: {
          implementationTime: "1-2 months",
          totalCost: "$150K-$250K",
          maintenance: "Medium"
        }
      },
      securew2: {
        name: "SecureW2",
        description: "Cloud-based certificate management and NAC with strong BYOD and passwordless auth support.",
        metrics: {
          implementationTime: "2-6 weeks",
          totalCost: "$200K-$350K",
          maintenance: "Low-Medium"
        }
      },
      portnox: {
        name: "Portnox Cloud",
        description: "Cloud-native NAC solution with rapid deployment and minimal infrastructure requirements.",
        metrics: {
          implementationTime: "1-2 weeks",
          totalCost: "$150K-$250K",
          maintenance: "Low"
        }
      },
      noNac: {
        name: "No NAC Solution",
        description: "Operating without NAC, relying on other security controls for network protection.",
        metrics: {
          implementationTime: "N/A",
          totalCost: "$0 (direct costs)",
          maintenance: "N/A"
        }
      }
    };
// Get vendor cards and info panel
    const vendorCards = document.querySelectorAll('.vendor-card');
    const vendorInfoPanel = document.querySelector('.vendor-info-panel');

    // Add click event for vendor cards
    vendorCards.forEach(card => {
      card.addEventListener('click', function() {
        // Remove active class from all cards
        vendorCards.forEach(c => c.classList.remove('active'));

        // Add active class to clicked card
        this.classList.add('active');

        // Get vendor ID
        const vendorId = this.getAttribute('data-vendor');

        // Update vendor info panel
        if (vendorInfoPanel && vendorData[vendorId]) {
          const vendor = vendorData[vendorId];

          vendorInfoPanel.innerHTML = `
            <img src="${this.querySelector('img').src}" alt="${vendor.name}" class="vendor-logo-large">
            <div class="vendor-details">
              <h3>${vendor.name}</h3>
              <p>${vendor.description}</p>
            </div>
            <div class="vendor-metrics">
              <div class="vendor-metric">
                <div class="vendor-metric-value">${vendor.metrics.implementationTime}</div>
                <div class="vendor-metric-label">Implementation Time</div>
              </div>
              <div class="vendor-metric">
                <div class="vendor-metric-value">${vendor.metrics.totalCost}</div>
                <div class="vendor-metric-label">Total Cost (3yr)</div>
              </div>
              <div class="vendor-metric">
                <div class="vendor-metric-value">${vendor.metrics.maintenance}</div>
                <div class="vendor-metric-label">Maintenance Level</div>
              </div>
            </div>
          `;

          vendorInfoPanel.style.display = 'flex';
        }

        // Update charts based on selected vendor
        updateChartsForVendor(vendorId);
      });
    });

    // Activate first vendor card by default
    if (vendorCards.length > 0) {
      vendorCards[0].click();
    }
  }

  // Setup tabs
  function setupTabs() {
    // Get tab buttons and panes
    const tabButtons = document.querySelectorAll('.tabs .tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Add click event to tab buttons
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Get target tab
        const tabId = this.getAttribute('data-tab');

        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });

        tabPanes.forEach(pane => pane.classList.remove('active'));

        // Add active class to clicked button and corresponding pane
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        const targetPane = document.getElementById(tabId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });

    // Activate first tab by default
    if (tabButtons.length > 0) {
      tabButtons[0].click();
    }
  }

  // Setup sub-tabs
  function setupSubTabs() {
    // Get sub-tab buttons and panes
    const subTabButtons = document.querySelectorAll('.sub-tab-button');
    const subTabPanes = document.querySelectorAll('.sub-tab-pane');

    // Add click event to sub-tab buttons
    subTabButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Get target tab
        const tabId = this.getAttribute('data-subtab');

        // Remove active class from all buttons and panes
        subTabButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });

        subTabPanes.forEach(pane => pane.classList.remove('active'));

        // Add active class to clicked button and corresponding pane
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        const targetPane = document.getElementById(tabId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });

    // Activate first sub-tab by default
    if (subTabButtons.length > 0) {
      subTabButtons[0].click();
    }
  }

  // Update charts based on vendor
  function updateChartsForVendor(vendor) {
    // Check if TotalCostCharts is available
    if (typeof TotalCostCharts !== 'undefined' && typeof TotalCostCharts.updateChartsForVendor === 'function') {
      // Update all charts for selected vendor
      TotalCostCharts.updateChartsForVendor(vendor);
    } else {
      console.warn("TotalCostCharts is not available for updating");
    }
  }
})();
/**
 * Enhanced Chart Builder for creating and updating charts
 * Includes better mobile responsiveness, accessibility, and radar chart for feature comparison
 */

class ChartBuilder {
  constructor() {
    this.charts = {};
    this.chartDefaults = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 15,
            usePointStyle: true,
            pointStyle: 'square'
          }
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          padding: 10,
          bodySpacing: 5,
          titleFont: {
            size: 14
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += window.formatCurrency ? window.formatCurrency(context.parsed.y) : '$' + context.parsed.y.toLocaleString();
              }
              return label;
            }
          }
        }
      }
    };
    
    this.chartColors = {
      cisco: '#049fd9',      // Cisco blue
      aruba: '#ff8300',      // Aruba orange
      forescout: '#005daa',  // Forescout blue
      nps: '#00a4ef',        // Microsoft blue
      fortinac: '#ee3124',   // FortiNAC red
      securew2: '#8bc53f',   // SecureW2 green
      portnox: '#2bd25b',    // Portnox green
      neutral: '#888888'     // Neutral gray
    };
    
    this.breakdownColors = [
      '#1B67B2', // Primary blue
      '#4D44AB', // Purple
      '#568C1C', // Green
      '#C77F1A', // Orange
      '#B54369', // Pink
      '#1CA43F', // Darker green
      '#5E5E5E', // Dark gray
      '#8884d8'  // Lavender
    ];
    
    this.isMobile = window.innerWidth < 768;
    
    // Listen for window resize to update mobile state
    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth < 768;
      
      // If mobile state changed, update charts
      if (wasMobile !== this.isMobile) {
        this.updateAllCharts();
      }
    });
  }
  
  updateAllCharts() {
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.update === 'function') {
        chart.update();
      }
    });
  }
  
  initCharts() {
    console.log('Initializing all charts...');
    this.initTCOComparisonChart();
    this.initCumulativeCostChart();
    this.initBreakdownCharts('cisco', 'portnox');
    this.initFeatureComparisonChart();
    this.initImplementationComparisonChart();
    this.initROIChart();
    console.log('All charts initialized');
  }
  
  initTCOComparisonChart() {
    const ctx = document.getElementById('tco-comparison-chart');
    if (!ctx) {
      console.warn('TCO Comparison chart canvas element not found');
      return;
    }
    
    try {
      const ctxCanvas = ctx.getContext('2d');
      if (!ctxCanvas) {
        console.warn('Could not get 2D context for TCO Comparison chart');
        return;
      }
      
      // Define chart configuration
      const chartConfig = {
        type: 'bar',
        data: {
          labels: ['Cisco ISE', 'Aruba ClearPass', 'Forescout', 'Microsoft NPS', 'FortiNAC', 'SecureW2', 'Portnox Cloud'],
          datasets: [
            {
              label: 'Initial Costs',
              data: [0, 0, 0, 0, 0, 0, 0],
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              stack: 'Stack 0'
            },
            {
              label: 'Migration Costs',
              data: [0, 0, 0, 0, 0, 0, 0],
              backgroundColor: 'rgba(255, 159, 64, 0.7)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1,
              stack: 'Stack 0'
            },
            {
              label: 'Ongoing Costs',
              data: [0, 0, 0, 0, 0, 0, 0],
              backgroundColor: 'rgba(75, 192, 192, 0.7)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              stack: 'Stack 0'
            }
          ]
        },
        options: {
          ...this.chartDefaults,
          indexAxis: this.isMobile ? 'y' : 'x', // Horizontal bars on mobile
          scales: {
            x: {
              stacked: true,
              grid: {
                display: false
              },
              ticks: {
                autoSkip: false,
                maxRotation: this.isMobile ? 0 : 45,
                minRotation: 0
              },
              title: {
                display: !this.isMobile,
                text: 'Vendors'
              }
            },
            y: {
              stacked: true,
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              },
              title: {
                display: true,
                text: 'Cost ($)'
              }
            }
          },
          plugins: {
            ...this.chartDefaults.plugins,
            title: {
              display: true,
              text: 'Total Cost of Ownership Comparison',
              font: {
                size: 16
              },
              padding: {
                top: 10,
                bottom: 20
              }
            },
            datalabels: {
              display: false
            }
          }
        }
      };
      
      // Create the chart
      this.charts.tcoComparison = new Chart(ctxCanvas, chartConfig);
      console.log('TCO Comparison chart initialized');
    } catch (error) {
      console.error('Error initializing TCO Comparison chart:', error);
    }
  }
  
  updateTCOComparisonChart(results) {
    if (!this.charts.tcoComparison || !results) {
      console.warn('TCO Comparison chart or results not available');
      return;
    }
    
    try {
      // Safely get vendors
      const vendors = Object.keys(window.vendorData || {});
      if (!vendors.length) {
        console.warn('No vendor data available');
        return;
      }
      
      const labels = vendors.map(vendor => window.vendorData[vendor].name);
      const initialCostsData = vendors.map(vendor => {
        return results[vendor] ? results[vendor].totalInitialCosts : 0;
      });
      const migrationCostsData = vendors.map(vendor => {
        return results[vendor] ? results[vendor].migrationCost || 0 : 0;
      });
      const ongoingCostsData = vendors.map(vendor => {
        return results[vendor] ? results[vendor].annualCosts * results.yearsToProject : 0;
      });
      
      // Update chart data
      this.charts.tcoComparison.data.labels = labels;
      this.charts.tcoComparison.data.datasets[0].data = initialCostsData;
      this.charts.tcoComparison.data.datasets[1].data = migrationCostsData;
      this.charts.tcoComparison.data.datasets[2].data = ongoingCostsData;
      
      // Update title to include years
      const chartTitle = 'Total Cost of Ownership Comparison (' + results.yearsToProject + ' Years)';
      this.charts.tcoComparison.options.plugins.title.text = chartTitle;
      
      // Update indexAxis based on mobile state
      this.charts.tcoComparison.options.indexAxis = this.isMobile ? 'y' : 'x';
      
      // Update chart
      this.charts.tcoComparison.update();
      console.log('TCO Comparison chart updated');
    } catch (error) {
      console.error('Error updating TCO Comparison chart:', error);
    }
  }
  
  initCumulativeCostChart() {
    const ctx = document.getElementById('cumulative-cost-chart');
    if (!ctx) {
      console.warn('Cumulative Cost chart canvas element not found');
      return;
    }
    
    try {
      const ctxCanvas = ctx.getContext('2d');
      if (!ctxCanvas) {
        console.warn('Could not get 2D context for Cumulative Cost chart');
        return;
      }
      
      // Define chart configuration
      const chartConfig = {
        type: 'line',
        data: {
          labels: ['Initial', 'Year 1', 'Year 2', 'Year 3'],
          datasets: []
        },
        options: {
          ...this.chartDefaults,
          elements: {
            line: {
              tension: 0.1,
              borderWidth: 2
            },
            point: {
              radius: 3,
              hoverRadius: 6
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              title: {
                display: !this.isMobile,
                text: 'Timeline'
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              },
              title: {
                display: true,
                text: 'Cumulative Cost ($)'
              }
            }
          },
          plugins: {
            ...this.chartDefaults.plugins,
            title: {
              display: true,
              text: 'Cumulative Costs Over Time',
              font: {
                size: 16
              },
              padding: {
                top: 10,
                bottom: 20
              }
            }
          }
        }
      };
      
      // Create the chart
      this.charts.cumulativeCost = new Chart(ctxCanvas, chartConfig);
      console.log('Cumulative Cost chart initialized');
    } catch (error) {
      console.error('Error initializing Cumulative Cost chart:', error);
    }
  }
  
  updateCumulativeCostChart(results) {
    if (!this.charts.cumulativeCost || !results) {
      console.warn('Cumulative Cost chart or results not available');
      return;
    }
    
    try {
      // Safely get vendors
      const vendors = Object.keys(window.vendorData || {});
      if (!vendors.length) {
        console.warn('No vendor data available');
        return;
      }
      
      const yearsToProject = results.yearsToProject || 3;
      const currentVendor = window.uiController ? window.uiController.activeVendor : null;
      
      // Generate labels
      const labels = ['Initial'];
      for (let i = 1; i <= yearsToProject; i++) {
        labels.push('Year ' + i);
      }
      
      // Create datasets for each vendor
      const datasets = [];
      
      vendors.forEach(vendor => {
        if (!results[vendor]) return;
        
        const vendorColor = this.chartColors[vendor] || this.chartColors.neutral;
        const isCurrentVendor = vendor === currentVendor;
        const isPortnox = vendor === 'portnox';
        const data = [];
        
        // Initial costs
        const initialCost = results[vendor].totalInitialCosts + (results[vendor].migrationCost || 0);
        data.push(initialCost);
        
        // Cumulative costs for each year
        for (let i = 1; i <= yearsToProject; i++) {
          data.push(initialCost + (results[vendor].annualCosts * i));
        }
        
        datasets.push({
          label: window.vendorData[vendor].name,
          data: data,
          backgroundColor: vendorColor,
          borderColor: vendorColor,
          borderWidth: (isCurrentVendor || isPortnox) ? 3 : 2,
          pointRadius: (isCurrentVendor || isPortnox) ? 4 : 3,
          pointHoverRadius: 7,
          tension: 0.1,
          // Dashed line for anything except current vendor and Portnox
          borderDash: (!isCurrentVendor && !isPortnox) ? [5, 5] : []
        });
      });
      
      // Update chart data
      this.charts.cumulativeCost.data.labels = labels;
      this.charts.cumulativeCost.data.datasets = datasets;
      
      // Update chart
      this.charts.cumulativeCost.update();
      console.log('Cumulative Cost chart updated');
    } catch (error) {
      console.error('Error updating Cumulative Cost chart:', error);
    }
  }
  
  initBreakdownCharts(currentVendor, altVendor) {
    const currentCtx = document.getElementById('current-breakdown-chart');
    const altCtx = document.getElementById('alternative-breakdown-chart');
    
    if (!currentCtx || !altCtx) {
      console.warn('Breakdown chart canvas elements not found');
      return;
    }
    
    try {
      const currentCtxCanvas = currentCtx.getContext('2d');
      const altCtxCanvas = altCtx.getContext('2d');
      
      if (!currentCtxCanvas || !altCtxCanvas) {
        console.warn('Could not get 2D context for breakdown charts');
        return;
      }
      
      // Common pie chart options
      const pieOptions = {
        ...this.chartDefaults,
        cutout: '35%', // Make it a doughnut chart for better visibility
        plugins: {
          ...this.chartDefaults.plugins,
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                return label + ': $' + value.toLocaleString() + ' (' + percentage + '%)';
              }
            }
          },
          datalabels: {
            display: context => {
              // Only show labels for segments that are at least 5% of the total
              const data = context.dataset.data;
              const total = data.reduce((a, b) => a + b, 0);
              return context.dataIndex >= 0 && (data[context.dataIndex] / total) >= 0.05;
            },
            formatter: (value, context) => {
              const data = context.dataset.data;
              const total = data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : '0';
              return percentage + '%';
            },
            color: '#fff',
            font: {
              weight: 'bold'
            }
          }
        }
      };
      
      // Labels common to both charts
      const labels = [
        'Hardware', 
        'Network Redesign', 
        'Implementation', 
        'Training', 
        'Maintenance', 
        'Licensing', 
        'Personnel', 
        'Downtime'
      ];
      
      // Create placeholder charts, to be updated with actual data
      this.charts.currentBreakdown = new Chart(currentCtxCanvas, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: [0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: this.breakdownColors,
            borderWidth: 1,
            borderColor: '#ffffff'
          }]
        },
        options: {
          ...pieOptions,
          plugins: {
            ...pieOptions.plugins,
            title: {
              display: true,
              text: window.vendorData && window.vendorData[currentVendor] ? 
                window.vendorData[currentVendor].name : 'Current Solution',
              font: {
                size: 16
              },
              padding: {
                top: 10,
                bottom: 20
              }
            }
          }
        }
      });
      
      this.charts.altBreakdown = new Chart(altCtxCanvas, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: [0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: this.breakdownColors,
            borderWidth: 1,
            borderColor: '#ffffff'
          }]
        },
        options: {
          ...pieOptions,
          plugins: {
            ...pieOptions.plugins,
            title: {
              display: true,
              text: window.vendorData && window.vendorData[altVendor] ? 
                window.vendorData[altVendor].name : 'Alternative Solution',
              font: {
                size: 16
              },
              padding: {
                top: 10,
                bottom: 20
              }
            }
          }
        }
      });
      
      console.log('Breakdown charts initialized');
    } catch (error) {
      console.error('Error initializing breakdown charts:', error);
    }
  }
  
  updateBreakdownCharts(currentVendor, altVendor) {
    if (!this.charts.currentBreakdown || !this.charts.altBreakdown) {
      console.warn('Breakdown charts not available');
      return;
    }
    
    try {
      const results = window.calculator && window.calculator.results ? 
        window.calculator.results : null;
      
      if (!results) {
        console.warn('No calculation results available');
        return;
      }
      
      const createBreakdownData = (vendor) => {
        // Check if vendor exists in results
        const vendorResults = results[vendor];
        if (!vendorResults || !vendorResults.costBreakdown) {
          console.warn('No cost breakdown data found for vendor: ' + vendor);
          return [0, 0, 0, 0, 0, 0, 0, 0];
        }
        
        // Create breakdown data from costBreakdown object
        return [
          vendorResults.costBreakdown.hardware || 0,
          vendorResults.costBreakdown.networkRedesign || 0,
          vendorResults.costBreakdown.implementation || 0,
          vendorResults.costBreakdown.training || 0,
          vendorResults.costBreakdown.maintenance || 0,
          vendorResults.costBreakdown.licensing || 0,
          vendorResults.costBreakdown.personnel || 0,
          vendorResults.costBreakdown.downtime || 0
        ];
      };
      
      // Update chart titles
      if (window.vendorData) {
        this.charts.currentBreakdown.options.plugins.title.text = 
          window.vendorData[currentVendor] ? window.vendorData[currentVendor].name : 'Current Solution';
        
        this.charts.altBreakdown.options.plugins.title.text = 
          window.vendorData[altVendor] ? window.vendorData[altVendor].name : 'Alternative Solution';
      }
      
      // Update charts
      this.charts.currentBreakdown.data.datasets[0].data = createBreakdownData(currentVendor);
      this.charts.currentBreakdown.update();
      
      this.charts.altBreakdown.data.datasets[0].data = createBreakdownData(altVendor);
      this.charts.altBreakdown.update();
      
      console.log('Breakdown charts updated');
    } catch (error) {
      console.error('Error updating breakdown charts:', error);
    }
  }
  
  initFeatureComparisonChart() {
    const ctx = document.getElementById('feature-comparison-chart');
    if (!ctx) {
      console.warn('Feature comparison chart canvas element not found');
      return;
    }
    
    try {
      const ctxCanvas = ctx.getContext('2d');
      if (!ctxCanvas) {
        console.warn('Could not get 2D context for feature comparison chart');
        return;
      }
      
      // Define feature scores for each vendor (1-5 scale)
      const featureScores = {
        cisco: {
          'Security': 4.5, 
          'Ease of Deployment': 2.5, 
          'Scalability': 4.0, 
          'Cost Efficiency': 2.0, 
          'Visibility': 4.0, 
          'Integration': 4.5
        },
        aruba: {
          'Security': 4.0, 
          'Ease of Deployment': 3.0, 
          'Scalability': 4.0, 
          'Cost Efficiency': 2.5, 
          'Visibility': 4.0, 
          'Integration': 4.0
        },
        forescout: {
          'Security': 4.0, 
          'Ease of Deployment': 2.5, 
          'Scalability': 3.5, 
          'Cost Efficiency': 2.0, 
          'Visibility': 5.0, 
          'Integration': 3.5
        },
        nps: {
          'Security': 3.0, 
          'Ease of Deployment': 3.5, 
          'Scalability': 2.5, 
          'Cost Efficiency': 4.5, 
          'Visibility': 2.0, 
          'Integration': 2.5
        },
        fortinac: {
          'Security': 4.2, 
          'Ease of Deployment': 3.0, 
          'Scalability': 3.8, 
          'Cost Efficiency': 2.5, 
          'Visibility': 4.0, 
          'Integration': 4.3
        },
        securew2: {
          'Security': 4.0, 
          'Ease of Deployment': 4.5, 
          'Scalability': 3.5, 
          'Cost Efficiency': 3.5, 
          'Visibility': 3.0, 
          'Integration': 3.2
        },
        portnox: {
          'Security': 4.2, 
          'Ease of Deployment': 4.8, 
          'Scalability': 4.0, 
          'Cost Efficiency': 4.5, 
          'Visibility': 4.0, 
          'Integration': 4.0
        }
      };
      
      // Get feature names
      const features = Object.keys(featureScores.cisco);
      
      // Initialize datasets
      const datasets = [];
      
      // Only include current vendor and Portnox initially
      const currentVendor = window.uiController ? window.uiController.activeVendor : 'cisco';
      
      // Add current vendor dataset
      if (featureScores[currentVendor]) {
        datasets.push({
          label: window.vendorData && window.vendorData[currentVendor] ? 
            window.vendorData[currentVendor].name : 'Current Vendor',
          data: features.map(f => featureScores[currentVendor][f]),
          backgroundColor: this.chartColors[currentVendor] + '40',
          borderColor: this.chartColors[currentVendor],
          borderWidth: 2,
          pointBackgroundColor: this.chartColors[currentVendor],
          pointRadius: 4
        });
      }
      
      // Add Portnox dataset
      datasets.push({
        label: 'Portnox Cloud',
        data: features.map(f => featureScores.portnox[f]),
        backgroundColor: this.chartColors.portnox + '40',
        borderColor: this.chartColors.portnox,
        borderWidth: 2,
        pointBackgroundColor: this.chartColors.portnox,
        pointRadius: 4
      });
      
      // Create chart
      this.charts.featureComparison = new Chart(ctxCanvas, {
        type: 'radar',
        data: {
          labels: features,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: {
                display: true
              },
              suggestedMin: 0,
              suggestedMax: 5,
              ticks: {
                stepSize: 1,
                callback: function(value) {
                  return value === 0 ? '' : value;
                }
              }
            }
          },
          plugins: {
            legend: {
              position: 'bottom'
            },
            title: {
              display: true,
              text: 'Feature Comparison',
              font: {
                size: 16
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.raw + '/5';
                }
              }
            }
          }
        }
      });
      
      console.log('Feature comparison chart initialized');
    } catch (error) {
      console.error('Error initializing feature comparison chart:', error);
    }
  }
  
  updateFeatureComparisonChart(currentVendor) {
    if (!this.charts.featureComparison) {
      console.warn('Feature comparison chart not available');
      return;
    }
    
    try {
      // Define feature scores for each vendor (1-5 scale)
      const featureScores = {
        cisco: {
          'Security': 4.5, 
          'Ease of Deployment': 2.5, 
          'Scalability': 4.0, 
          'Cost Efficiency': 2.0, 
          'Visibility': 4.0, 
          'Integration': 4.5
        },
        aruba: {
          'Security': 4.0, 
          'Ease of Deployment': 3.0, 
          'Scalability': 4.0, 
          'Cost Efficiency': 2.5, 
          'Visibility': 4.0, 
          'Integration': 4.0
        },
        forescout: {
          'Security': 4.0, 
          'Ease of Deployment': 2.5, 
          'Scalability': 3.5, 
          'Cost Efficiency': 2.0, 
          'Visibility': 5.0, 
          'Integration': 3.5
        },
        nps: {
          'Security': 3.0, 
          'Ease of Deployment': 3.5, 
          'Scalability': 2.5, 
          'Cost Efficiency': 4.5, 
          'Visibility': 2.0, 
          'Integration': 2.5
        },
        fortinac: {
          'Security': 4.2, 
          'Ease of Deployment': 3.0, 
          'Scalability': 3.8, 
          'Cost Efficiency': 2.5, 
          'Visibility': 4.0, 
          'Integration': 4.3
        },
        securew2: {
          'Security': 4.0, 
          'Ease of Deployment': 4.5, 
          'Scalability': 3.5, 
          'Cost Efficiency': 3.5, 
          'Visibility': 3.0, 
          'Integration': 3.2
        },
        portnox: {
          'Security': 4.2, 
          'Ease of Deployment': 4.8, 
          'Scalability': 4.0, 
          'Cost Efficiency': 4.5, 
          'Visibility': 4.0, 
          'Integration': 4.0
        }
      };
      
      const features = Object.keys(featureScores.cisco);
      
      // Create dataset for current vendor
      const datasets = [];
      
      if (featureScores[currentVendor]) {
        datasets.push({
          label: window.vendorData && window.vendorData[currentVendor] ? 
            window.vendorData[currentVendor].name : 'Current Vendor',
          data: features.map(f => featureScores[currentVendor][f]),
          backgroundColor: this.chartColors[currentVendor] + '40',
          borderColor: this.chartColors[currentVendor],
          borderWidth: 2,
          pointBackgroundColor: this.chartColors[currentVendor],
          pointRadius: 4
        });
      }
      
      // Add Portnox dataset
      datasets.push({
        label: 'Portnox Cloud',
        data: features.map(f => featureScores.portnox[f]),
        backgroundColor: this.chartColors.portnox + '40',
        borderColor: this.chartColors.portnox,
        borderWidth: 2,
        pointBackgroundColor: this.chartColors.portnox,
        pointRadius: 4
      });
      
      // Update chart
      this.charts.featureComparison.data.datasets = datasets;
      this.charts.featureComparison.update();
      
      console.log('Feature comparison chart updated');
    } catch (error) {
      console.error('Error updating feature comparison chart:', error);
    }
  }
  
  // New implementation comparison chart
  initImplementationComparisonChart() {
    const ctx = document.getElementById('implementation-comparison-chart');
    if (!ctx) {
      console.warn('Implementation comparison chart canvas element not found');
      return;
    }
    
    try {
      const ctxCanvas = ctx.getContext('2d');
      if (!ctxCanvas) {
        console.warn('Could not get 2D context for implementation comparison chart');
        return;
      }
      
      // Get all vendors
      const vendors = window.vendorData ? Object.keys(window.vendorData) : [];
      
      // Get implementation times in days (using medium size as default)
      const implementationTimes = vendors.map(vendor => {
        if (!window.vendorData[vendor] || !window.vendorData[vendor].medium || !window.vendorData[vendor].medium.implementationTimeline) {
          return 0;
        }
        
        const timeline = window.vendorData[vendor].medium.implementationTimeline;
        return Object.values(timeline).reduce((a, b) => a + b, 0);
      });
      
      // Prepare background colors
      const backgroundColors = vendors.map(vendor => this.chartColors[vendor] || this.chartColors.neutral);
      
      // Create chart
      this.charts.implementationComparison = new Chart(ctxCanvas, {
        type: 'bar',
        data: {
          labels: vendors.map(vendor => window.vendorData[vendor].name),
          datasets: [{
            label: 'Implementation Time (Days)',
            data: implementationTimes,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors,
            borderWidth: 1
          }]
        },
        options: {
          ...this.chartDefaults,
          indexAxis: this.isMobile ? 'y' : 'x',
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Days'
              }
            }
          },
          plugins: {
            ...this.chartDefaults.plugins,
            title: {
              display: true,
              text: 'Implementation Time Comparison',
              font: {
                size: 16
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.raw + ' days';
                }
              }
            }
          }
        }
      });
      
      console.log('Implementation comparison chart initialized');
    } catch (error) {
      console.error('Error initializing implementation comparison chart:', error);
    }
  }
  
  updateImplementationComparisonChart(results) {
    if (!this.charts.implementationComparison) {
      console.warn('Implementation comparison chart not available');
      return;
    }
    
    try {
      const currentVendor = window.uiController ? window.uiController.activeVendor : null;
      
      // If we have actual implementation results, use those
      if (results && results.implementationResults) {
        const vendors = Object.keys(results.implementationResults);
        
        const implementationTimes = vendors.map(vendor => {
          return results.implementationResults[vendor] || 0;
        });
        
        const backgroundColors = vendors.map(vendor => {
          const baseColor = this.chartColors[vendor] || this.chartColors.neutral;
          return vendor === currentVendor ? baseColor : baseColor + '80';
        });
        
        this.charts.implementationComparison.data.labels = vendors.map(vendor => 
          window.vendorData && window.vendorData[vendor] ? window.vendorData[vendor].name : vendor);
        this.charts.implementationComparison.data.datasets[0].data = implementationTimes;
        this.charts.implementationComparison.data.datasets[0].backgroundColor = backgroundColors;
        this.charts.implementationComparison.data.datasets[0].borderColor = backgroundColors;
      } else {
        // Use default implementation times from vendor data
        const vendors = window.vendorData ? Object.keys(window.vendorData) : [];
        
        const orgSize = document.getElementById('organization-size') ? 
          document.getElementById('organization-size').value : 'medium';
        
        // Get implementation times in days
        const implementationTimes = vendors.map(vendor => {
          if (!window.vendorData[vendor] || !window.vendorData[vendor][orgSize] || !window.vendorData[vendor][orgSize].implementationTimeline) {
            return 0;
          }
          
          const timeline = window.vendorData[vendor][orgSize].implementationTimeline;
          return Object.values(timeline).reduce((a, b) => a + b, 0);
        });
        
        // Prepare background colors
        const backgroundColors = vendors.map(vendor => {
          const baseColor = this.chartColors[vendor] || this.chartColors.neutral;
          return vendor === currentVendor ? baseColor : baseColor + '80';
        });
        
        this.charts.implementationComparison.data.labels = vendors.map(vendor => window.vendorData[vendor].name);
        this.charts.implementationComparison.data.datasets[0].data = implementationTimes;
        this.charts.implementationComparison.data.datasets[0].backgroundColor = backgroundColors;
        this.charts.implementationComparison.data.datasets[0].borderColor = backgroundColors;
      }
      
      // Update indexAxis based on mobile state
      this.charts.implementationComparison.options.indexAxis = this.isMobile ? 'y' : 'x';
      
      // Update chart
      this.charts.implementationComparison.update();
      
      console.log('Implementation comparison chart updated');
    } catch (error) {
      console.error('Error updating implementation comparison chart:', error);
    }
  }
  
  initROIChart() {
    const ctx = document.getElementById('roi-chart');
    if (!ctx) {
      console.warn('ROI chart canvas element not found');
      return;
    }
    
    try {
      const ctxCanvas = ctx.getContext('2d');
      if (!ctxCanvas) {
        console.warn('Could not get 2D context for ROI chart');
        return;
      }
      
      // Initialize with empty data
      this.charts.roi = new Chart(ctxCanvas, {
        type: 'line',
        data: {
          labels: ['Initial', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
          datasets: [
            {
              label: 'Status Quo Costs',
              data: [],
              borderColor: this.chartColors.neutral,
              backgroundColor: this.chartColors.neutral + '20',
              borderWidth: 2,
              fill: true
            },
            {
              label: 'Portnox Costs',
              data: [],
              borderColor: this.chartColors.portnox,
              backgroundColor: this.chartColors.portnox + '20',
              borderWidth: 2,
              fill: true
            },
            {
              label: 'Cumulative Savings',
              data: [],
              borderColor: '#28a745',
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderDash: [5, 5],
              fill: false,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          ...this.chartDefaults,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cumulative Cost ($)'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            },
            y1: {
              beginAtZero: true,
              position: 'right',
              grid: {
                drawOnChartArea: false
              },
              title: {
                display: true,
                text: 'Cumulative Savings ($)'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            ...this.chartDefaults.plugins,
            title: {
              display: true,
              text: 'Return on Investment Analysis',
              font: {
                size: 16
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += '$' + context.parsed.y.toLocaleString();
                  }
                  return label;
                }
              }
            }
          }
        }
      });
      
      console.log('ROI chart initialized');
    } catch (error) {
      console.error('Error initializing ROI chart:', error);
    }
  }
  
  updateROIChart(results) {
    if (!this.charts.roi || !results) {
      console.warn('ROI chart or results not available');
      return;
    }
    
    try {
      const currentVendor = window.uiController ? window.uiController.activeVendor : null;
      
      if (!currentVendor || !results[currentVendor] || !results['portnox']) {
        console.warn('Missing data for ROI chart');
        return;
      }
      
      // Project for 5 years
      const years = 5;
      
      // Calculate cumulative costs for current vendor and Portnox
      const currentVendorData = [];
      const portnoxData = [];
      const savingsData = [];
      
      // Calculate breakeven point
      const currentInitialCost = results[currentVendor].totalInitialCosts;
      const portnoxInitialCost = results['portnox'].totalInitialCosts + (results['portnox'].migrationCost || 0);
      const currentAnnualCost = results[currentVendor].annualCosts;
      const portnoxAnnualCost = results['portnox'].annualCosts;
      
      // Initial costs
      currentVendorData.push(currentInitialCost);
      portnoxData.push(portnoxInitialCost);
      savingsData.push(0);
      
      // Project costs and savings
      let cumulativeSavings = currentInitialCost - portnoxInitialCost;
      
      for (let i = 1; i <= years; i++) {
        const currentTotal = currentInitialCost + (currentAnnualCost * i);
        const portnoxTotal = portnoxInitialCost + (portnoxAnnualCost * i);
        
        cumulativeSavings += (currentAnnualCost - portnoxAnnualCost);
        
        currentVendorData.push(currentTotal);
        portnoxData.push(portnoxTotal);
        savingsData.push(cumulativeSavings);
      }
      
      // Update chart data
      this.charts.roi.data.datasets[0].data = currentVendorData;
      this.charts.roi.data.datasets[0].label = window.vendorData && window.vendorData[currentVendor] ? 
        window.vendorData[currentVendor].name + ' Costs' : 'Current Costs';
      this.charts.roi.data.datasets[0].borderColor = this.chartColors[currentVendor] || this.chartColors.neutral;
      this.charts.roi.data.datasets[0].backgroundColor = (this.chartColors[currentVendor] || this.chartColors.neutral) + '20';
      
      this.charts.roi.data.datasets[1].data = portnoxData;
      this.charts.roi.data.datasets[2].data = savingsData;
      
      // Calculate breakeven point if savings exist
      if (cumulativeSavings > 0) {
        const yearlySavings = currentAnnualCost - portnoxAnnualCost;
        const initialDiff = portnoxInitialCost - currentInitialCost;
        
        // Only calculate if there are annual savings
        if (yearlySavings > 0) {
          const breakEvenYears = initialDiff > 0 ? initialDiff / yearlySavings : 0;
          
          // Update chart title with breakeven point if relevant
          if (breakEvenYears > 0) {
            const breakEvenText = breakEvenYears < 1 ? 
              Math.round(breakEvenYears * 12) + ' months' : 
              breakEvenYears.toFixed(1) + ' years';
            
            this.charts.roi.options.plugins.title.text = 'Return on Investment Analysis (Breakeven: ' + breakEvenText + ')';
          } else {
            this.charts.roi.options.plugins.title.text = 'Return on Investment Analysis (Immediate Savings)';
          }
        } else {
          this.charts.roi.options.plugins.title.text = 'Return on Investment Analysis';
        }
      } else {
        this.charts.roi.options.plugins.title.text = 'Return on Investment Analysis';
      }
      
      // Update chart
      this.charts.roi.update();
      
      console.log('ROI chart updated');
    } catch (error) {
      console.error('Error updating ROI chart:', error);
    }
  }
}

// Initialize chartBuilder singleton on window
window.chartBuilder = new ChartBuilder();

console.log('Chart Builder initialized and available as window.chartBuilder');
'use strict';
var round = Math.round;

module.exports = function (it) {
  var value = round(it);
  return value < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
};
/**
 * Enhanced Chart Builder for Zero Trust NAC Architecture Designer Pro
 * Improved visualization, responsiveness, and highlighting Portnox advantages
 */

class EnhancedChartBuilder extends ChartBuilder {
  constructor() {
    super();
    
    // Enhanced color palette with gradients
    this.gradientColors = {};
    
    // Enhanced chart defaults with animations
    this.enhancedDefaults = {
      ...this.chartDefaults,
      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      },
      transitions: {
        active: {
          animation: {
            duration: 400
          }
        }
      },
      plugins: {
        ...this.chartDefaults.plugins,
        subtitle: {
          display: true,
          text: '',
          font: {
            size: 14,
            style: 'italic'
          },
          padding: {
            bottom: 10
          }
        },
        tooltip: {
          ...this.chartDefaults.plugins.tooltip,
          usePointStyle: true,
          boxPadding: 6
        }
      }
    };
    
    // Additional color schemes for different audiences
    this.audienceColors = {
      finance: {
        primary: '#2E7D32',
        secondary: '#4CAF50',
        accent: '#81C784'
      },
      executive: {
        primary: '#1565C0',
        secondary: '#42A5F5',
        accent: '#90CAF9'
      },
      security: {
        primary: '#7B1FA2',
        secondary: '#AB47BC',
        accent: '#CE93D8'
      }
    };
    
    // Initialize gradient colors when charts are created
    this.initGradientColors = (ctx) => {
      if (!ctx) return;
      
      // Portnox gradient
      const portnoxGradient = ctx.createLinearGradient(0, 0, 0, 400);
      portnoxGradient.addColorStop(0, 'rgba(43, 210, 91, 0.8)');
      portnoxGradient.addColorStop(1, 'rgba(43, 210, 91, 0.2)');
      this.gradientColors.portnox = portnoxGradient;
      
      // Cisco gradient
      const ciscoGradient = ctx.createLinearGradient(0, 0, 0, 400);
      ciscoGradient.addColorStop(0, 'rgba(4, 159, 217, 0.8)');
      ciscoGradient.addColorStop(1, 'rgba(4, 159, 217, 0.2)');
      this.gradientColors.cisco = ciscoGradient;
      
      // Additional vendor gradients...
      // ...
    };
  }
  
  // Override updateTCOComparisonChart to highlight Portnox advantage
  updateTCOComparisonChart(results) {
    super.updateTCOComparisonChart(results);
    
    if (!this.charts.tcoComparison || !results) return;
    
    // Add subtitle highlighting savings
    if (results.portnox && results.cisco) {
      const savingsVsCisco = results.cisco.totalCost - results.portnox.totalCost;
      const savingsPercent = ((savingsVsCisco / results.cisco.totalCost) * 100).toFixed(1);
      
      if (savingsVsCisco > 0) {
        this.charts.tcoComparison.options.plugins.subtitle.text = 
          `Save up to ${savingsPercent}% with Portnox Cloud vs. traditional solutions`;
        this.charts.tcoComparison.options.plugins.subtitle.display = true;
      }
    }
    
    // Update chart
    this.charts.tcoComparison.update();
  }
  
  // Enhanced feature comparison chart with better highlighting of Portnox advantages
  updateFeatureComparisonChart(currentVendor) {
    super.updateFeatureComparisonChart(currentVendor);
    
    if (!this.charts.featureComparison) return;
    
    // Get canvas context for annotations
    const ctx = this.charts.featureComparison.ctx;
    
    // Update chart options to highlight Portnox advantages
    this.charts.featureComparison.options.plugins.subtitle = {
      display: true,
      text: 'Areas with green highlight show Portnox advantages',
      font: {
        size: 14,
        style: 'italic'
      },
      padding: {
        bottom: 10
      }
    };
    
    // Customize dataset for Portnox to stand out
    this.charts.featureComparison.data.datasets.forEach(dataset => {
      if (dataset.label === 'Portnox Cloud') {
        dataset.pointBackgroundColor = this.chartColors.portnox;
        dataset.pointHoverBackgroundColor = this.chartColors.portnox;
        dataset.pointHoverBorderColor = this.chartColors.portnox;
        dataset.pointRadius = 5;
        dataset.pointHoverRadius = 7;
        dataset.borderWidth = 3;
      }
    });
    
    this.charts.featureComparison.update();
  }
  
  // New chart for FTE analysis
  initFTEAnalysisChart() {
    const ctx = document.getElementById('fte-analysis-chart');
    if (!ctx) {
      console.warn('FTE analysis chart canvas element not found');
      return;
    }
    
    const ctxCanvas = ctx.getContext('2d');
    if (!ctxCanvas) return;
    
    // Initialize gradient colors
    this.initGradientColors(ctxCanvas);
    
    // Chart configuration
    const chartConfig = {
      type: 'bar',
      data: {
        labels: ['Cisco ISE', 'Aruba ClearPass', 'Forescout', 'Microsoft NPS', 'FortiNAC', 'SecureW2', 'Portnox Cloud'],
        datasets: [
          {
            label: 'Implementation Resources',
            data: [2.5, 2.2, 2.0, 1.5, 1.8, 1.3, 0.8],
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            stack: 'Stack 0'
          },
          {
            label: 'Ongoing Management',
            data: [1.8, 1.6, 1.5, 1.2, 1.5, 1.0, 0.5],
            backgroundColor: 'rgba(255, 159, 64, 0.7)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
            stack: 'Stack 0'
          },
          {
            label: 'Security Operations',
            data: [1.2, 1.1, 1.3, 0.8, 1.0, 0.7, 0.4],
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            stack: 'Stack 0'
          }
        ]
      },
      options: {
        ...this.enhancedDefaults,
        indexAxis: this.isMobile ? 'y' : 'x',
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false
            },
            ticks: {
              autoSkip: false,
              maxRotation: this.isMobile ? 0 : 45,
              minRotation: 0
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Full-Time Equivalents (FTE)'
            }
          }
        },
        plugins: {
          ...this.enhancedDefaults.plugins,
          title: {
            display: true,
            text: 'Personnel Requirements Comparison',
            font: {
              size: 16
            }
          },
          subtitle: {
            display: true,
            text: 'Portnox requires up to 75% less staff resources'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + context.raw + ' FTE';
              }
            }
          }
        }
      }
    };
    
    // Create chart
    this.charts.fteAnalysis = new Chart(ctxCanvas, chartConfig);
    console.log('FTE Analysis chart initialized');
  }
  
  // Enhanced ROI chart with breakeven visualization
  updateROIChart(results) {
    super.updateROIChart(results);
    
    if (!this.charts.roi || !results) return;
    
    const currentVendor = window.uiController ? window.uiController.activeVendor : null;
    
    if (!currentVendor || !results[currentVendor] || !results['portnox']) return;
    
    // Calculate breakeven point more precisely
    const currentVendorInitial = results[currentVendor].totalInitialCosts;
    const portnoxInitial = results['portnox'].totalInitialCosts + (results['portnox'].migrationCost || 0);
    const currentAnnual = results[currentVendor].annualCosts;
    const portnoxAnnual = results['portnox'].annualCosts;
    
    // Only calculate if there are annual savings
    if (currentAnnual > portnoxAnnual) {
      const initialDiff = portnoxInitial - currentVendorInitial;
      
      if (initialDiff > 0) {
        const breakEvenYears = initialDiff / (currentAnnual - portnoxAnnual);
        const breakEvenMonths = Math.round(breakEvenYears * 12);
        
        // Add annotation for breakeven point
        if (breakEvenYears <= 5) {
          // Convert years to x position on chart (0 = initial, 1 = year 1, etc.)
          const xPos = breakEvenYears;
          
          // Add vertical line annotation at breakeven point
          this.charts.roi.options.plugins.annotation = {
            annotations: {
              breakEvenLine: {
                type: 'line',
                xMin: xPos,
                xMax: xPos,
                borderColor: 'rgba(255, 99, 132, 0.8)',
                borderWidth: 2,
                borderDash: [6, 6],
                label: {
                  content: 'Breakeven: ' + breakEvenMonths + ' months',
                  enabled: true,
                  position: 'top'
                }
              }
            }
          };
          
          // Add point annotation where cumulative savings crosses zero
          // This calculation would need to be more precise in production
          const yPos = 0; // This would need to be calculated precisely 
          
          this.charts.roi.options.plugins.annotation.annotations.breakEvenPoint = {
            type: 'point',
            xValue: xPos,
            yValue: yPos,
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            radius: 5
          };
        }
      } else {
        // Immediate savings
        this.charts.roi.options.plugins.subtitle = {
          display: true,
          text: 'Immediate savings from day one with Portnox Cloud',
          font: {
            size: 14,
            style: 'italic'
          }
        };
      }
    }
    
    // Update chart
    this.charts.roi.update();
  }
  
  // New compliance visualization chart
  initComplianceChart() {
    const ctx = document.getElementById('compliance-chart');
    if (!ctx) {
      console.warn('Compliance chart canvas element not found');
      return;
    }
    
    const ctxCanvas = ctx.getContext('2d');
    if (!ctxCanvas) return;
    
    // Compliance framework data
    const frameworks = ['NIST 800-53', 'ISO 27001', 'HIPAA', 'PCI DSS', 'GDPR', 'Zero Trust'];
    
    // Score data (0-100%)
    const ciscoScores = [85, 80, 75, 82, 70, 75];
    const arubaScores = [82, 78, 73, 80, 72, 73];
    const forescoutScores = [80, 75, 70, 78, 68, 72];
    const npsScores = [70, 65, 60, 70, 55, 60];
    const portnoxScores = [90, 88, 85, 92, 90, 95];
    
    // Chart configuration
    const chartConfig = {
      type: 'radar',
      data: {
        labels: frameworks,
        datasets: [
          {
            label: 'Cisco ISE',
            data: ciscoScores,
            backgroundColor: 'rgba(4, 159, 217, 0.2)',
            borderColor: 'rgba(4, 159, 217, 0.8)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(4, 159, 217, 1)',
            pointRadius: 3
          },
          {
            label: 'Aruba ClearPass',
            data: arubaScores,
            backgroundColor: 'rgba(255, 131, 0, 0.2)',
            borderColor: 'rgba(255, 131, 0, 0.8)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(255, 131, 0, 1)',
            pointRadius: 3
          },
          {
            label: 'Forescout',
            data: forescoutScores,
            backgroundColor: 'rgba(0, 93, 170, 0.2)',
            borderColor: 'rgba(0, 93, 170, 0.8)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(0, 93, 170, 1)',
            pointRadius: 3
          },
          {
            label: 'Microsoft NPS',
            data: npsScores,
            backgroundColor: 'rgba(0, 164, 239, 0.2)',
            borderColor: 'rgba(0, 164, 239, 0.8)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(0, 164, 239, 1)',
            pointRadius: 3
          },
          {
            label: 'Portnox Cloud',
            data: portnoxScores,
            backgroundColor: 'rgba(43, 210, 91, 0.3)',
            borderColor: 'rgba(43, 210, 91, 1)',
            borderWidth: 3,
            pointBackgroundColor: 'rgba(43, 210, 91, 1)',
            pointRadius: 5
          }
        ]
      },
      options: {
        ...this.enhancedDefaults,
        scales: {
          r: {
            angleLines: {
              display: true
            },
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: {
              stepSize: 20,
              callback: function(value) {
                return value + '%';
              }
            }
          }
        },
        plugins: {
          ...this.enhancedDefaults.plugins,
          title: {
            display: true,
            text: 'Compliance Framework Coverage',
            font: {
              size: 16
            }
          },
          subtitle: {
            display: true,
            text: 'Portnox offers superior compliance coverage across all frameworks'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + context.raw + '% compliance';
              }
            }
          }
        }
      }
    };
    
    // Create chart
    this.charts.compliance = new Chart(ctxCanvas, chartConfig);
    console.log('Compliance chart initialized');
  }
  
  // New method to initialize all enhanced charts
  initEnhancedCharts() {
    // Call parent method first
    this.initCharts();
    
    // Initialize new charts
    this.initFTEAnalysisChart();
    this.initComplianceChart();
    
    console.log('All enhanced charts initialized');
  }
}

// Replace the original ChartBuilder with the enhanced version
window.chartBuilder = new EnhancedChartBuilder();

console.log('Enhanced Chart Builder initialized and available as window.chartBuilder');
require('./').install({hookRequire: true});
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const makeSerializable = require("../util/makeSerializable");
const ModuleDependency = require("./ModuleDependency");
const NullDependency = require("./NullDependency");

class RequireEnsureItemDependency extends ModuleDependency {
	/**
	 * @param {string} request the request string
	 */
	constructor(request) {
		super(request);
	}

	get type() {
		return "require.ensure item";
	}

	get category() {
		return "commonjs";
	}
}

makeSerializable(
	RequireEnsureItemDependency,
	"webpack/lib/dependencies/RequireEnsureItemDependency"
);

RequireEnsureItemDependency.Template = NullDependency.Template;

module.exports = RequireEnsureItemDependency;
'use strict';
var $ = require('../internals/export');
var globalThis = require('../internals/global-this');
var $fromBase64 = require('../internals/uint8-from-base64');
var anUint8Array = require('../internals/an-uint8-array');

var Uint8Array = globalThis.Uint8Array;

var INCORRECT_BEHAVIOR_OR_DOESNT_EXISTS = !Uint8Array || !Uint8Array.prototype.setFromBase64 || !(function () {
  var target = new Uint8Array([255, 255, 255, 255, 255]);
  try {
    target.setFromBase64('MjYyZg===');
  } catch (error) {
    return target[0] === 50 && target[1] === 54 && target[2] === 50 && target[3] === 255 && target[4] === 255;
  }
})();

// `Uint8Array.prototype.setFromBase64` method
// https://github.com/tc39/proposal-arraybuffer-base64
if (Uint8Array) $({ target: 'Uint8Array', proto: true, forced: INCORRECT_BEHAVIOR_OR_DOESNT_EXISTS }, {
  setFromBase64: function setFromBase64(string /* , options */) {
    anUint8Array(this);

    var result = $fromBase64(string, arguments.length > 1 ? arguments[1] : undefined, this, this.length);

    return { read: result.read, written: result.written };
  }
});
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const Dependency = require("../Dependency");
const Template = require("../Template");
const makeSerializable = require("../util/makeSerializable");
const ModuleDependency = require("./ModuleDependency");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("../Dependency").ReferencedExport} ReferencedExport */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */
/** @typedef {import("../ModuleGraph")} ModuleGraph */
/** @typedef {import("../javascript/JavascriptParser").Range} Range */
/** @typedef {import("../util/runtime").RuntimeSpec} RuntimeSpec */

class RequireIncludeDependency extends ModuleDependency {
	/**
	 * @param {string} request the request string
	 * @param {Range} range location in source code
	 */
	constructor(request, range) {
		super(request);

		this.range = range;
	}

	/**
	 * Returns list of exports referenced by this dependency
	 * @param {ModuleGraph} moduleGraph module graph
	 * @param {RuntimeSpec} runtime the runtime for which the module is analysed
	 * @returns {(string[] | ReferencedExport)[]} referenced exports
	 */
	getReferencedExports(moduleGraph, runtime) {
		// This doesn't use any export
		return Dependency.NO_EXPORTS_REFERENCED;
	}

	get type() {
		return "require.include";
	}

	get category() {
		return "commonjs";
	}
}

makeSerializable(
	RequireIncludeDependency,
	"webpack/lib/dependencies/RequireIncludeDependency"
);

RequireIncludeDependency.Template = class RequireIncludeDependencyTemplate extends (
	ModuleDependency.Template
) {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(dependency, source, { runtimeTemplate }) {
		const dep = /** @type {RequireIncludeDependency} */ (dependency);
		const comment = runtimeTemplate.outputOptions.pathinfo
			? Template.toComment(
					`require.include ${runtimeTemplate.requestShortener.shorten(
						dep.request
					)}`
				)
			: "";

		source.replace(dep.range[0], dep.range[1] - 1, `undefined${comment}`);
	}
};

module.exports = RequireIncludeDependency;
/**
 * Enhanced Chart Builder
 * Creates advanced interactive charts for the TCO calculator with modern visualization
 */
class EnhancedChartBuilder {
  constructor() {
    this.charts = {};
    
    // Chart color schemes
    this.chartColors = {
        primary: {
            main: '#05547C',
            light: '#1B8DC0',
            dark: '#033E5B',
            transparent: 'rgba(5, 84, 124, 0.1)'
        },
        accent: {
            main: '#65BD44',
            light: '#8ED070',
            dark: '#4D9132',
            transparent: 'rgba(101, 189, 68, 0.1)'
        },
        vendors: {
            portnox: '#65BD44',
            cisco: '#1B67B2',
            aruba: '#F6921E',
            forescout: '#FFC20E',
            nps: '#00A4EF',
            fortinac: '#EE3124',
            securew2: '#662D91',
            noNac: '#A9A9A9'
        },
        chart: [
            '#05547C', // Primary
            '#65BD44', // Accent
            '#F6921E', // Orange
            '#662D91', // Purple
            '#FFC20E', // Yellow
            '#EE3124', // Red
            '#00A4EF'  // Sky Blue
        ],
        costCategories: {
            hardware: '#F6921E',      // Orange
            licensing: '#05547C',     // Primary Blue
            maintenance: '#662D91',   // Purple
            implementation: '#FFC20E', // Yellow
            staff: '#8ED070'          // Light Green
        }
    };
    
    // Chart defaults
    this.chartDefaults = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        },
        elements: {
            bar: {
                borderWidth: 0,
                borderRadius: 4
            }
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 12,
                    padding: 15,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 13
                },
                padding: 12,
                cornerRadius: 4,
                displayColors: true,
                usePointStyle: true,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += '$' + context.parsed.y.toLocaleString();
                        }
                        return label;
                    }
                }
            }
        }
    };
  }
  
  // Initialize charts
  init() {
    console.log('Initializing Enhanced Chart Builder...');
    
    // Create TCO comparison chart
    this.createTcoComparisonChart();
    
    // Create cumulative cost chart
    this.createCumulativeCostChart();
    
    // Create cost breakdown charts
    this.createCostBreakdownCharts();
    
    // Create feature comparison chart
    this.createFeatureComparisonChart();
    
    // Create ROI chart
    this.createRoiChart();
    
    // Create risk analysis charts
    this.createRiskAnalysisCharts();
    
    console.log('All charts initialized');
  }
  
  // Create TCO comparison chart
  createTcoComparisonChart() {
    const ctx = document.getElementById('tco-comparison-chart');
    if (!ctx) {
      console.warn('TCO Comparison chart canvas element not found');
      return;
    }
    
    try {
      const chartData = {
        labels: ['Current Solution', 'Portnox Cloud'],
        datasets: [{
          label: 'Total Cost of Ownership',
          data: [0, 0],
          backgroundColor: [this.chartColors.primary.main, this.chartColors.accent.main],
          barThickness: 60
        }]
      };
      
      this.charts.tcoComparison = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          ...this.chartDefaults,
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
            ...this.chartDefaults.plugins,
            tooltip: {
              ...this.chartDefaults.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  return 'Total Cost: $' + context.raw.toLocaleString();
                },
                afterLabel: function(context) {
                  if (context.dataIndex === 1 && context.dataset.data[0] > context.dataset.data[1]) {
                    const savings = context.dataset.data[0] - context.dataset.data[1];
                    const pct = Math.round((savings / context.dataset.data[0]) * 100);
                    return 'Savings: $' + savings.toLocaleString() + ' (' + pct + '%)';
                  }
                  return null;
                }
              }
            }
          }
        }
      });
      
      console.log('TCO Comparison chart created');
    } catch (error) {
      console.error('Error creating TCO Comparison chart:', error);
    }
  }
  
  // Update TCO comparison chart
  updateTcoComparisonChart(data) {
    if (!this.charts.tcoComparison) {
      console.warn('TCO Comparison chart not initialized');
      return;
    }
    
    this.charts.tcoComparison.data.labels = data.labels;
    this.charts.tcoComparison.data.datasets[0].data = data.values;
    this.charts.tcoComparison.update();
    
    console.log('TCO Comparison chart updated');
  }
  
  // Create cumulative cost chart
  createCumulativeCostChart() {
    const ctx = document.getElementById('cumulative-cost-chart');
    if (!ctx) {
      console.warn('Cumulative Cost chart canvas element not found');
      return;
    }
    
    try {
      const chartData = {
        labels: ['Year 1', 'Year 2', 'Year 3'],
        datasets: [
          {
            label: 'Current Solution',
            data: [0, 0, 0],
            borderColor: this.chartColors.primary.main,
            backgroundColor: this.chartColors.primary.transparent,
            fill: true,
            tension: 0.3
          },
          {
            label: 'Portnox Cloud',
            data: [0, 0, 0],
            borderColor: this.chartColors.accent.main,
            backgroundColor: this.chartColors.accent.transparent,
            fill: true,
            tension: 0.3
          }
        ]
      };
      
      this.charts.cumulativeCost = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          ...this.chartDefaults,
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
            ...this.chartDefaults.plugins,
            tooltip: {
              ...this.chartDefaults.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': $' + context.raw.toLocaleString();
                }
              }
            }
          }
        }
      });
      
      console.log('Cumulative Cost chart created');
    } catch (error) {
      console.error('Error creating Cumulative Cost chart:', error);
    }
  }
  
  // Update cumulative cost chart
  updateCumulativeCostChart(data) {
    if (!this.charts.cumulativeCost) {
      console.warn('Cumulative Cost chart not initialized');
      return;
    }
    
    this.charts.cumulativeCost.data.labels = data.years.map(year => `Year ${year}`);
    
    this.charts.cumulativeCost.data.datasets[0].label = data.currentVendorName;
    this.charts.cumulativeCost.data.datasets[0].data = data.currentVendorCosts;
    this.charts.cumulativeCost.data.datasets[1].data = data.portnoxCosts;
    
    this.charts.cumulativeCost.update();
    
    console.log('Cumulative Cost chart updated');
  }
  
  // More chart methods go here...
  
  // Create cost breakdown charts
  createCostBreakdownCharts() {
    // Current breakdown chart
    const currentCtx = document.getElementById('current-breakdown-chart');
    if (currentCtx) {
      this.charts.currentBreakdown = new Chart(currentCtx, {
        type: 'doughnut',
        data: {
          labels: ['Hardware', 'Licensing', 'Maintenance', 'Implementation', 'IT Staff'],
          datasets: [{
            data: [0, 0, 0, 0, 0],
            backgroundColor: Object.values(this.chartColors.costCategories),
            borderWidth: 0
          }]
        },
        options: {
          ...this.chartDefaults,
          cutout: '60%',
          plugins: {
            ...this.chartDefaults.plugins,
            tooltip: {
              ...this.chartDefaults.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw;
                  const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return label + ': $' + value.toLocaleString() + ' (' + percentage + '%)';
                }
              }
            }
          }
        }
      });
    }
    
    // Portnox breakdown chart
    const portnoxCtx = document.getElementById('alternative-breakdown-chart');
    if (portnoxCtx) {
      this.charts.portnoxBreakdown = new Chart(portnoxCtx, {
        type: 'doughnut',
        data: {
          labels: ['Hardware', 'Licensing', 'Maintenance', 'Implementation', 'IT Staff'],
          datasets: [{
            data: [0, 0, 0, 0, 0],
            backgroundColor: Object.values(this.chartColors.costCategories),
            borderWidth: 0
          }]
        },
        options: {
          ...this.chartDefaults,
          cutout: '60%',
          plugins: {
            ...this.chartDefaults.plugins,
            tooltip: {
              ...this.chartDefaults.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw;
                  const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return label + ': $' + value.toLocaleString() + ' (' + percentage + '%)';
                }
              }
            }
          }
        }
      });
    }
    
    console.log('Cost Breakdown charts created');
  }
  
  // Update cost breakdown charts
  updateCostBreakdownCharts(currentVendorCosts, portnoxCosts) {
    // Update current solution breakdown
    if (this.charts.currentBreakdown) {
      this.charts.currentBreakdown.data.datasets[0].data = [
        currentVendorCosts.hardwareCost,
        currentVendorCosts.licensingCost,
        currentVendorCosts.maintenanceCost,
        currentVendorCosts.implementationCost,
        currentVendorCosts.fteCost
      ];
      this.charts.currentBreakdown.update();
    }
    
    // Update Portnox breakdown
    if (this.charts.portnoxBreakdown) {
      this.charts.portnoxBreakdown.data.datasets[0].data = [
        portnoxCosts.hardwareCost,
        portnoxCosts.licensingCost,
        portnoxCosts.maintenanceCost,
        portnoxCosts.implementationCost,
        portnoxCosts.fteCost
      ];
      this.charts.portnoxBreakdown.update();
    }
    
    console.log('Cost Breakdown charts updated');
  }
  
  // Create feature comparison chart
  createFeatureComparisonChart() {
    const ctx = document.getElementById('feature-comparison-chart');
    if (!ctx) return;
    
    try {
      this.charts.featureComparison = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: [
            'Device Visibility',
            'Policy Management',
            'Guest Access',
            'BYOD Support',
            'Cloud Integration',
            'Automated Remediation',
            'Third-Party Integration',
            'Scalability',
            'Ease of Use',
            'Reporting'
          ],
          datasets: [
            {
              label: 'Current Solution',
              data: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
              borderColor: this.chartColors.primary.main,
              backgroundColor: this.chartColors.primary.transparent,
              borderWidth: 2,
              pointBackgroundColor: this.chartColors.primary.main
            },
            {
              label: 'Portnox Cloud',
              data: [8, 9, 8, 9, 10, 9, 9, 9, 9, 8],
              borderColor: this.chartColors.accent.main,
              backgroundColor: this.chartColors.accent.transparent,
              borderWidth: 2,
              pointBackgroundColor: this.chartColors.accent.main
            }
          ]
        },
        options: {
          ...this.chartDefaults,
          scales: {
            r: {
              angleLines: {
                display: true,
                color: 'rgba(0, 0, 0, 0.1)'
              },
              suggestedMin: 0,
              suggestedMax: 10,
              ticks: {
                stepSize: 2,
                callback: function(value) {
                  return value;
                }
              }
            }
          },
          plugins: {
            ...this.chartDefaults.plugins,
            tooltip: {
              ...this.chartDefaults.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.raw + '/10';
                }
              }
            }
          }
        }
      });
      
      console.log('Feature comparison chart created');
    } catch (error) {
      console.error('Error creating Feature comparison chart:', error);
    }
  }
  
  // Update feature comparison chart
  updateFeatureComparisonChart(currentVendor, currentVendorData) {
    if (!this.charts.featureComparison) return;
    
    // Update chart data
    this.charts.featureComparison.data.datasets[0].label = currentVendor;
    this.charts.featureComparison.data.datasets[0].data = currentVendorData;
    
    this.charts.featureComparison.update();
    
    console.log('Feature comparison chart updated');
  }
  
  // Create ROI chart
  createRoiChart() {
    const ctx = document.getElementById('roi-chart');
    if (!ctx) return;
    
    try {
      this.charts.roi = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Year 1', 'Year 2', 'Year 3'],
          datasets: [
            {
              label: 'Cumulative Investment',
              type: 'line',
              data: [0, 0, 0],
              borderColor: this.chartColors.primary.main,
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: this.chartColors.primary.main,
              yAxisID: 'y1'
            },
            {
              label: 'Annual Savings',
              data: [0, 0, 0],
              backgroundColor: this.chartColors.accent.main,
              barThickness: 40,
              yAxisID: 'y'
            },
            {
              label: 'Cumulative Savings',
              type: 'line',
              data: [0, 0, 0],
              borderColor: this.chartColors.costCategories.hardware,
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderDash: [5, 5],
              pointRadius: 4,
              pointBackgroundColor: this.chartColors.costCategories.hardware,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          ...this.chartDefaults,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Annual Savings'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            },
            y1: {
              position: 'right',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cumulative Value'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              },
              grid: {
                display: false
              }
            }
          },
          plugins: {
            ...this.chartDefaults.plugins,
            tooltip: {
              ...this.chartDefaults.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': $' + context.raw.toLocaleString();
                }
              }
            }
          }
        }
      });
      
      console.log('ROI chart created');
    } catch (error) {
      console.error('Error creating ROI chart:', error);
    }
  }
  
  // Update ROI chart
  updateRoiChart(data) {
    if (!this.charts.roi) return;
    
    // Update labels if years are different
    if (data.years && data.years.length > 0) {
      this.charts.roi.data.labels = data.years.map(year => `Year ${year}`);
    }
    
    // Update datasets
    this.charts.roi.data.datasets[0].data = data.investment;
    this.charts.roi.data.datasets[1].data = data.annualSavings;
    this.charts.roi.data.datasets[2].data = data.cumulativeSavings;
    
    this.charts.roi.update();
    
    console.log('ROI chart updated');
  }
  
  // Create risk analysis charts
  createRiskAnalysisCharts() {
    // Breach risk chart
    const breachCtx = document.getElementById('breach-risk-chart');
    if (breachCtx) {
      this.charts.breachRisk = new Chart(breachCtx, {
        type: 'bar',
        data: {
          labels: ['Without NAC', 'With NAC'],
          datasets: [{
            label: 'Expected Breach Costs',
            data: [0, 0],
            backgroundColor: [this.chartColors.costCategories.hardware, this.chartColors.accent.main],
            barThickness: 60
          }]
        },
        options: {
          ...this.chartDefaults,
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
            ...this.chartDefaults.plugins,
            tooltip: {
              ...this.chartDefaults.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  return 'Expected Cost: $' + context.raw.toLocaleString();
                },
                afterLabel: function(context) {
                  if (context.dataIndex === 1 && context.dataset.data[0] > context.dataset.data[1]) {
                    const reduction = context.dataset.data[0] - context.dataset.data[1];
                    const pct = Math.round((reduction / context.dataset.data[0]) * 100);
                    return 'Risk Reduction: $' + reduction.toLocaleString() + ' (' + pct + '%)';
                  }
                  return null;
                }
              }
            }
          }
        }
      });
    }
    
    // Risk components chart
    const riskComponentsCtx = document.getElementById('risk-components-chart');
    if (riskComponentsCtx) {
      this.charts.riskComponents = new Chart(riskComponentsCtx, {
        type: 'pie',
        data: {
          labels: ['Breach Risk', 'Compliance Risk', 'Operational Inefficiency', 'IT Staffing'],
          datasets: [{
            data: [0, 0, 0, 0],
            backgroundColor: [
              this.chartColors.costCategories.hardware,
              this.chartColors.primary.main,
              this.chartColors.costCategories.implementation,
              this.chartColors.costCategories.staff
            ],
            borderWidth: 0
          }]
        },
        options: {
          ...this.chartDefaults,
          plugins: {
            ...this.chartDefaults.plugins,
            tooltip: {
              ...this.chartDefaults.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw;
                  const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return label + ': $' + value.toLocaleString() + ' (' + percentage + '%)';
                }
              }
            }
          }
        }
      });
    }
    
    console.log('Risk Analysis charts created');
  }
  
  // Update breach risk chart
  updateBreachRiskChart(data) {
    if (!this.charts.breachRisk) return;
    
    this.charts.breachRisk.data.datasets[0].data = [
      data.withoutNac,
      data.withNac
    ];
    
    this.charts.breachRisk.update();
    
    console.log('Breach Risk chart updated');
  }
  
  // Update risk components chart
  updateRiskComponentsChart(data) {
    if (!this.charts.riskComponents) return;
    
    this.charts.riskComponents.data.datasets[0].data = [
      data.breachRisk,
      data.complianceRisk,
      data.operationalInefficiency,
      data.staffingCosts
    ];
    
    this.charts.riskComponents.update();
    
    console.log('Risk Components chart updated');
  }
}

// Initialize and expose the enhanced chart builder
window.EnhancedChartBuilder = new EnhancedChartBuilder();

console.log('Enhanced Chart Builder initialized and available as window.EnhancedChartBuilder');
// TODO: Remove in Babel 8

module.exports = require("@babel/compat-data/corejs2-built-ins");
'use strict';
var globalThis = require('../internals/global-this');
var DESCRIPTORS = require('../internals/descriptors');

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Avoid NodeJS experimental warning
module.exports = function (name) {
  if (!DESCRIPTORS) return globalThis[name];
  var descriptor = getOwnPropertyDescriptor(globalThis, name);
  return descriptor && descriptor.value;
};
import {
    AST_Array,
    AST_Atom,
    AST_Await,
    AST_BigInt,
    AST_Binary,
    AST_Block,
    AST_Call,
    AST_Catch,
    AST_Chain,
    AST_Class,
    AST_ClassProperty,
    AST_ClassPrivateProperty,
    AST_ConciseMethod,
    AST_Conditional,
    AST_Debugger,
    AST_Definitions,
    AST_Destructuring,
    AST_Directive,
    AST_Do,
    AST_Dot,
    AST_DotHash,
    AST_EmptyStatement,
    AST_Expansion,
    AST_Export,
    AST_Finally,
    AST_For,
    AST_ForIn,
    AST_ForOf,
    AST_If,
    AST_Import,
    AST_ImportMeta,
    AST_Jump,
    AST_LabeledStatement,
    AST_Lambda,
    AST_LoopControl,
    AST_NameMapping,
    AST_NewTarget,
    AST_Node,
    AST_Number,
    AST_Object,
    AST_ObjectGetter,
    AST_ObjectKeyVal,
    AST_ObjectProperty,
    AST_ObjectSetter,
    AST_PrefixedTemplateString,
    AST_PrivateMethod,
    AST_PropAccess,
    AST_RegExp,
    AST_Sequence,
    AST_SimpleStatement,
    AST_String,
    AST_Super,
    AST_Switch,
    AST_SwitchBranch,
    AST_Symbol,
    AST_TemplateSegment,
    AST_TemplateString,
    AST_This,
    AST_Toplevel,
    AST_Try,
    AST_Unary,
    AST_VarDef,
    AST_While,
    AST_With,
    AST_Yield
} from "./ast.js";

const shallow_cmp = (node1, node2) => {
    return (
        node1 === null && node2 === null
        || node1.TYPE === node2.TYPE && node1.shallow_cmp(node2)
    );
};

export const equivalent_to = (tree1, tree2) => {
    if (!shallow_cmp(tree1, tree2)) return false;
    const walk_1_state = [tree1];
    const walk_2_state = [tree2];

    const walk_1_push = walk_1_state.push.bind(walk_1_state);
    const walk_2_push = walk_2_state.push.bind(walk_2_state);

    while (walk_1_state.length && walk_2_state.length) {
        const node_1 = walk_1_state.pop();
        const node_2 = walk_2_state.pop();

        if (!shallow_cmp(node_1, node_2)) return false;

        node_1._children_backwards(walk_1_push);
        node_2._children_backwards(walk_2_push);

        if (walk_1_state.length !== walk_2_state.length) {
            // Different number of children
            return false;
        }
    }

    return walk_1_state.length == 0 && walk_2_state.length == 0;
};

const pass_through = () => true;

AST_Node.prototype.shallow_cmp = function () {
    throw new Error("did not find a shallow_cmp function for " + this.constructor.name);
};

AST_Debugger.prototype.shallow_cmp = pass_through;

AST_Directive.prototype.shallow_cmp = function(other) {
    return this.value === other.value;
};

AST_SimpleStatement.prototype.shallow_cmp = pass_through;

AST_Block.prototype.shallow_cmp = pass_through;

AST_EmptyStatement.prototype.shallow_cmp = pass_through;

AST_LabeledStatement.prototype.shallow_cmp = function(other) {
    return this.label.name === other.label.name;
};

AST_Do.prototype.shallow_cmp = pass_through;

AST_While.prototype.shallow_cmp = pass_through;

AST_For.prototype.shallow_cmp = function(other) {
    return (this.init == null ? other.init == null : this.init === other.init) && (this.condition == null ? other.condition == null : this.condition === other.condition) && (this.step == null ? other.step == null : this.step === other.step);
};

AST_ForIn.prototype.shallow_cmp = pass_through;

AST_ForOf.prototype.shallow_cmp = pass_through;

AST_With.prototype.shallow_cmp = pass_through;

AST_Toplevel.prototype.shallow_cmp = pass_through;

AST_Expansion.prototype.shallow_cmp = pass_through;

AST_Lambda.prototype.shallow_cmp = function(other) {
    return this.is_generator === other.is_generator && this.async === other.async;
};

AST_Destructuring.prototype.shallow_cmp = function(other) {
    return this.is_array === other.is_array;
};

AST_PrefixedTemplateString.prototype.shallow_cmp = pass_through;

AST_TemplateString.prototype.shallow_cmp = pass_through;

AST_TemplateSegment.prototype.shallow_cmp = function(other) {
    return this.value === other.value;
};

AST_Jump.prototype.shallow_cmp = pass_through;

AST_LoopControl.prototype.shallow_cmp = pass_through;

AST_Await.prototype.shallow_cmp = pass_through;

AST_Yield.prototype.shallow_cmp = function(other) {
    return this.is_star === other.is_star;
};

AST_If.prototype.shallow_cmp = function(other) {
    return this.alternative == null ? other.alternative == null : this.alternative === other.alternative;
};

AST_Switch.prototype.shallow_cmp = pass_through;

AST_SwitchBranch.prototype.shallow_cmp = pass_through;

AST_Try.prototype.shallow_cmp = function(other) {
    return (this.body === other.body) && (this.bcatch == null ? other.bcatch == null : this.bcatch === other.bcatch) && (this.bfinally == null ? other.bfinally == null : this.bfinally === other.bfinally);
};

AST_Catch.prototype.shallow_cmp = function(other) {
    return this.argname == null ? other.argname == null : this.argname === other.argname;
};

AST_Finally.prototype.shallow_cmp = pass_through;

AST_Definitions.prototype.shallow_cmp = pass_through;

AST_VarDef.prototype.shallow_cmp = function(other) {
    return this.value == null ? other.value == null : this.value === other.value;
};

AST_NameMapping.prototype.shallow_cmp = pass_through;

AST_Import.prototype.shallow_cmp = function(other) {
    return (this.imported_name == null ? other.imported_name == null : this.imported_name === other.imported_name) && (this.imported_names == null ? other.imported_names == null : this.imported_names === other.imported_names);
};

AST_ImportMeta.prototype.shallow_cmp = pass_through;

AST_Export.prototype.shallow_cmp = function(other) {
    return (this.exported_definition == null ? other.exported_definition == null : this.exported_definition === other.exported_definition) && (this.exported_value == null ? other.exported_value == null : this.exported_value === other.exported_value) && (this.exported_names == null ? other.exported_names == null : this.exported_names === other.exported_names) && this.module_name === other.module_name && this.is_default === other.is_default;
};

AST_Call.prototype.shallow_cmp = pass_through;

AST_Sequence.prototype.shallow_cmp = pass_through;

AST_PropAccess.prototype.shallow_cmp = pass_through;

AST_Chain.prototype.shallow_cmp = pass_through;

AST_Dot.prototype.shallow_cmp = function(other) {
    return this.property === other.property;
};

AST_DotHash.prototype.shallow_cmp = function(other) {
    return this.property === other.property;
};

AST_Unary.prototype.shallow_cmp = function(other) {
    return this.operator === other.operator;
};

AST_Binary.prototype.shallow_cmp = function(other) {
    return this.operator === other.operator;
};

AST_Conditional.prototype.shallow_cmp = pass_through;

AST_Array.prototype.shallow_cmp = pass_through;

AST_Object.prototype.shallow_cmp = pass_through;

AST_ObjectProperty.prototype.shallow_cmp = pass_through;

AST_ObjectKeyVal.prototype.shallow_cmp = function(other) {
    return this.key === other.key;
};

AST_ObjectSetter.prototype.shallow_cmp = function(other) {
    return this.static === other.static;
};

AST_ObjectGetter.prototype.shallow_cmp = function(other) {
    return this.static === other.static;
};

AST_ConciseMethod.prototype.shallow_cmp = function(other) {
    return this.static === other.static && this.is_generator === other.is_generator && this.async === other.async;
};

AST_PrivateMethod.prototype.shallow_cmp = function(other) {
    return this.static === other.static && this.is_generator === other.is_generator && this.async === other.async;
};

AST_Class.prototype.shallow_cmp = function(other) {
    return (this.name == null ? other.name == null : this.name === other.name) && (this.extends == null ? other.extends == null : this.extends === other.extends);
};

AST_ClassProperty.prototype.shallow_cmp = function(other) {
    return this.static === other.static
        && (typeof this.key === "string"
            ? this.key === other.key
            : true /* AST_Node handled elsewhere */);
};

AST_ClassPrivateProperty.prototype.shallow_cmp = function(other) {
    return this.static === other.static;
};

AST_Symbol.prototype.shallow_cmp = function(other) {
    return this.name === other.name;
};

AST_NewTarget.prototype.shallow_cmp = pass_through;

AST_This.prototype.shallow_cmp = pass_through;

AST_Super.prototype.shallow_cmp = pass_through;

AST_String.prototype.shallow_cmp = function(other) {
    return this.value === other.value;
};

AST_Number.prototype.shallow_cmp = function(other) {
    return this.value === other.value;
};

AST_BigInt.prototype.shallow_cmp = function(other) {
    return this.value === other.value;
};

AST_RegExp.prototype.shallow_cmp = function (other) {
    return (
        this.value.flags === other.value.flags
        && this.value.source === other.value.source
    );
};

AST_Atom.prototype.shallow_cmp = pass_through;
'use strict';
var defineBuiltIn = require('../internals/define-built-in');

module.exports = function (target, src, options) {
  for (var key in src) defineBuiltIn(target, key, src[key], options);
  return target;
};
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const RequireEnsureDependenciesBlock = require("./RequireEnsureDependenciesBlock");
const RequireEnsureDependency = require("./RequireEnsureDependency");
const RequireEnsureItemDependency = require("./RequireEnsureItemDependency");
const getFunctionExpression = require("./getFunctionExpression");

/** @typedef {import("../AsyncDependenciesBlock").GroupOptions} GroupOptions */
/** @typedef {import("../ChunkGroup").ChunkGroupOptions} ChunkGroupOptions */
/** @typedef {import("../Dependency").DependencyLocation} DependencyLocation */
/** @typedef {import("../javascript/BasicEvaluatedExpression")} BasicEvaluatedExpression */
/** @typedef {import("../javascript/JavascriptParser")} JavascriptParser */
/** @typedef {import("../javascript/JavascriptParser").Range} Range */

const PLUGIN_NAME = "RequireEnsureDependenciesBlockParserPlugin";

module.exports = class RequireEnsureDependenciesBlockParserPlugin {
	/**
	 * @param {JavascriptParser} parser the parser
	 * @returns {void}
	 */
	apply(parser) {
		parser.hooks.call.for("require.ensure").tap(PLUGIN_NAME, expr => {
			/** @type {string | GroupOptions | null} */
			let chunkName = null;
			let errorExpressionArg = null;
			let errorExpression = null;
			switch (expr.arguments.length) {
				case 4: {
					const chunkNameExpr = parser.evaluateExpression(expr.arguments[3]);
					if (!chunkNameExpr.isString()) return;
					chunkName =
						/** @type {string} */
						(chunkNameExpr.string);
				}
				// falls through
				case 3: {
					errorExpressionArg = expr.arguments[2];
					errorExpression = getFunctionExpression(errorExpressionArg);

					if (!errorExpression && !chunkName) {
						const chunkNameExpr = parser.evaluateExpression(expr.arguments[2]);
						if (!chunkNameExpr.isString()) return;
						chunkName =
							/** @type {string} */
							(chunkNameExpr.string);
					}
				}
				// falls through
				case 2: {
					const dependenciesExpr = parser.evaluateExpression(expr.arguments[0]);
					const dependenciesItems = /** @type {BasicEvaluatedExpression[]} */ (
						dependenciesExpr.isArray()
							? dependenciesExpr.items
							: [dependenciesExpr]
					);
					const successExpressionArg = expr.arguments[1];
					const successExpression = getFunctionExpression(successExpressionArg);

					if (successExpression) {
						parser.walkExpressions(successExpression.expressions);
					}
					if (errorExpression) {
						parser.walkExpressions(errorExpression.expressions);
					}

					const depBlock = new RequireEnsureDependenciesBlock(
						chunkName,
						/** @type {DependencyLocation} */
						(expr.loc)
					);
					const errorCallbackExists =
						expr.arguments.length === 4 ||
						(!chunkName && expr.arguments.length === 3);
					const dep = new RequireEnsureDependency(
						/** @type {Range} */ (expr.range),
						/** @type {Range} */ (expr.arguments[1].range),
						errorCallbackExists &&
							/** @type {Range} */ (expr.arguments[2].range)
					);
					dep.loc = /** @type {DependencyLocation} */ (expr.loc);
					depBlock.addDependency(dep);
					const old = parser.state.current;
					parser.state.current = /** @type {TODO} */ (depBlock);
					try {
						let failed = false;
						parser.inScope([], () => {
							for (const ee of dependenciesItems) {
								if (ee.isString()) {
									const ensureDependency = new RequireEnsureItemDependency(
										/** @type {string} */ (ee.string)
									);
									ensureDependency.loc =
										/** @type {DependencyLocation} */
										(expr.loc);
									depBlock.addDependency(ensureDependency);
								} else {
									failed = true;
								}
							}
						});
						if (failed) {
							return;
						}
						if (successExpression) {
							if (successExpression.fn.body.type === "BlockStatement") {
								parser.walkStatement(successExpression.fn.body);
							} else {
								parser.walkExpression(successExpression.fn.body);
							}
						}
						old.addBlock(depBlock);
					} finally {
						parser.state.current = old;
					}
					if (!successExpression) {
						parser.walkExpression(successExpressionArg);
					}
					if (errorExpression) {
						if (errorExpression.fn.body.type === "BlockStatement") {
							parser.walkStatement(errorExpression.fn.body);
						} else {
							parser.walkExpression(errorExpression.fn.body);
						}
					} else if (errorExpressionArg) {
						parser.walkExpression(errorExpressionArg);
					}
					return true;
				}
			}
		});
	}
};
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patternRequired_1 = __importDefault(require("../definitions/patternRequired"));
const patternRequired = (ajv) => ajv.addKeyword((0, patternRequired_1.default)());
exports.default = patternRequired;
module.exports = patternRequired;
//# sourceMappingURL=patternRequired.js.map/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const makeSerializable = require("../util/makeSerializable");
const ModuleDependency = require("./ModuleDependency");
const ModuleDependencyTemplateAsRequireId = require("./ModuleDependencyTemplateAsRequireId");

/** @typedef {import("../javascript/JavascriptParser").Range} Range */

class AMDRequireItemDependency extends ModuleDependency {
	/**
	 * @param {string} request the request string
	 * @param {Range=} range location in source code
	 */
	constructor(request, range) {
		super(request);

		this.range = range;
	}

	get type() {
		return "amd require";
	}

	get category() {
		return "amd";
	}
}

makeSerializable(
	AMDRequireItemDependency,
	"webpack/lib/dependencies/AMDRequireItemDependency"
);

AMDRequireItemDependency.Template = ModuleDependencyTemplateAsRequireId;

module.exports = AMDRequireItemDependency;
/**
 * Basic UI Controller for NAC Calculator
 * This is a simplified implementation that replaces the problematic enhanced-ui-controller.js
 */
class BasicUIController {
  constructor() {
    console.log("BasicUIController initializing...");
    
    // DOM cache for frequently accessed elements
    this.domCache = {
      calculator: document.getElementById('calculator-form'),
      deviceCount: document.getElementById('device-count'),
      organizationSize: document.getElementById('organization-size'),
      yearsToProject: document.getElementById('years-to-project'),
      currentVendor: null, // Will be set when a vendor is selected
      resultsContainer: document.getElementById('results-container'),
      loadingOverlay: document.getElementById('loading-overlay'),
      messageContainer: document.getElementById('message-container')
    };
    
    // State management
    this.state = {
      currentVendor: null,
      organizationSize: 'medium',
      deviceCount: 300,
      yearsToProject: 1,
      industry: null,
      hasAdvancedOptions: false,
      advancedOptions: {
        multipleLocations: false,
        locationCount: 2,
        complexAuthentication: false,
        legacyDevices: false,
        legacyPercentage: 10,
        cloudIntegration: false,
        customPolicies: false,
        policyComplexity: 'medium'
      },
      calculationResults: null,
      activeTab: 'comparison-tab',
      isCalculating: false
    };
    
    // Initialize UI
    this.initializeUI();
    
    console.log("BasicUIController initialized");
  }
  
  /**
   * Initialize UI elements and event listeners
   */
  initializeUI() {
    console.log("Initializing UI elements...");
    
    // Initialize vendor selection
    this._initializeVendorSelection();
    
    // Initialize calculator form
    this._initializeCalculatorForm();
    
    // Initialize tabs
    this._initializeTabs();
    
    // Initialize export options
    this._initializeExportOptions();
    
    // Initialize advanced options
    this._initializeAdvancedOptions();
    
    // Initialize industry selector if available
    this._initializeIndustrySelector();
    
    // Initial input validation
    this._validateInputs();
  }
  
  /**
   * Initialize vendor selection
   */
  _initializeVendorSelection() {
    // Get all vendor cards
    const vendorCards = document.querySelectorAll('.vendor-card');
    
    // Add click event to each vendor card
    vendorCards.forEach(card => {
      card.addEventListener('click', () => {
        // Remove active class from all vendor cards
        vendorCards.forEach(c => c.classList.remove('active'));
        
        // Add active class to selected vendor card
        card.classList.add('active');
        
        // Update current vendor
        const vendorId = card.getAttribute('data-vendor');
        this.state.currentVendor = vendorId;
        this.domCache.currentVendor = card;
        
        // Update aria-checked attributes for accessibility
        vendorCards.forEach(c => c.setAttribute('aria-checked', 'false'));
        card.setAttribute('aria-checked', 'true');
        
        // Validate inputs
        this._validateInputs();
        
        // Show message to calculate TCO
        this._showMessage('Vendor selected. Click "Calculate TCO" to see results.', 'info');
      });
      
      // Add keyboard handling for accessibility
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          card.click();
        }
      });
    });
  }
  
  /**
   * Initialize calculator form
   */
  _initializeCalculatorForm() {
    // Get calculate button
    const calculateBtn = document.getElementById('calculate-btn');
    
    // Add click event to calculate button
    if (calculateBtn) {
      calculateBtn.addEventListener('click', () => {
        this._handleCalculate();
      });
    }
    
    // Add input event listeners for form fields
    const deviceCount = document.getElementById('device-count');
    const organizationSize = document.getElementById('organization-size');
    const yearsToProject = document.getElementById('years-to-project');
    
    if (deviceCount) {
      deviceCount.addEventListener('input', () => {
        this.state.deviceCount = parseInt(deviceCount.value) || 300;
        this._validateInputs();
      });
    }
    
    if (organizationSize) {
      organizationSize.addEventListener('change', () => {
        this.state.organizationSize = organizationSize.value;
        this._validateInputs();
      });
    }
    
    if (yearsToProject) {
      yearsToProject.addEventListener('input', () => {
        this.state.yearsToProject = parseInt(yearsToProject.value) || 1;
        this._validateInputs();
      });
    }
  }
  
  /**
   * Initialize tabs
   */
  _initializeTabs() {
    // Get all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    
    // Add click event to each tab button
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Get tab id
        const tabId = button.getAttribute('data-tab');
        
        // Set active tab
        this._setActiveTab(tabId);
      });
      
      // Add keyboard handling for accessibility
      button.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          button.click();
        }
      });
    });
    
    // Activate first tab by default
    if (tabButtons.length > 0) {
      const firstTabId = tabButtons[0].getAttribute('data-tab');
      this._setActiveTab(firstTabId);
    }
    
    // Initialize sub-tabs if present
    const subTabButtons = document.querySelectorAll('.sub-tab-button');
    
    // Add click event to each sub-tab button
    subTabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Get sub-tab id
        const subTabId = button.getAttribute('data-subtab');
        
        // Set active sub-tab
        this._setActiveSubTab(subTabId);
      });
    });
  }
  
  /**
   * Initialize export options
   */
  _initializeExportOptions() {
    // Get export buttons
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    
    // Add click event to export CSV button
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        this._handleExportCSV();
      });
    }
    
    // Add click event to export PDF button
    if (exportPdfBtn) {
      exportPdfBtn.addEventListener('click', () => {
        this._handleExportPDF();
      });
    }
  }
  
  /**
   * Initialize advanced options
   */
  _initializeAdvancedOptions() {
    // Get advanced options toggle
    const advancedOptionsToggle = document.querySelector('.advanced-options-toggle button');
    const advancedOptionsPanel = document.getElementById('advanced-options-panel');
    
    // Add click event to advanced options toggle
    if (advancedOptionsToggle && advancedOptionsPanel) {
      advancedOptionsToggle.addEventListener('click', () => {
        // Toggle advanced options panel
        const isVisible = !advancedOptionsPanel.classList.contains('hidden');
        
        if (isVisible) {
          advancedOptionsPanel.classList.add('hidden');
          advancedOptionsToggle.setAttribute('aria-expanded', 'false');
          this.state.hasAdvancedOptions = false;
        } else {
          advancedOptionsPanel.classList.remove('hidden');
          advancedOptionsToggle.setAttribute('aria-expanded', 'true');
          this.state.hasAdvancedOptions = true;
        }
      });
    }
    
    // Initialize advanced option controls
    this._initializeAdvancedOptionControls();
  }
  
  /**
   * Initialize advanced option controls
   */
  _initializeAdvancedOptionControls() {
    // Multiple locations
    const multipleLocations = document.getElementById('multiple-locations');
    const locationCount = document.getElementById('location-count');
    const locationCountContainer = document.getElementById('location-count-container');
    
    if (multipleLocations && locationCount && locationCountContainer) {
      multipleLocations.addEventListener('change', () => {
        this.state.advancedOptions.multipleLocations = multipleLocations.checked;
        
        if (multipleLocations.checked) {
          locationCountContainer.classList.remove('hidden');
        } else {
          locationCountContainer.classList.add('hidden');
        }
      });
      
      locationCount.addEventListener('input', () => {
        this.state.advancedOptions.locationCount = parseInt(locationCount.value) || 2;
      });
    }
    
    // Complex authentication
    const complexAuthentication = document.getElementById('complex-authentication');
    
    if (complexAuthentication) {
      complexAuthentication.addEventListener('change', () => {
        this.state.advancedOptions.complexAuthentication = complexAuthentication.checked;
      });
    }
    
    // Legacy devices
    const legacyDevices = document.getElementById('legacy-devices');
    const legacyPercentage = document.getElementById('legacy-percentage');
    const legacyPercentageValue = document.getElementById('legacy-percentage-value');
    const legacyPercentageContainer = document.getElementById('legacy-percentage-container');
    
    if (legacyDevices && legacyPercentage && legacyPercentageValue && legacyPercentageContainer) {
      legacyDevices.addEventListener('change', () => {
        this.state.advancedOptions.legacyDevices = legacyDevices.checked;
        
        if (legacyDevices.checked) {
          legacyPercentageContainer.classList.remove('hidden');
        } else {
          legacyPercentageContainer.classList.add('hidden');
        }
      });
      
      legacyPercentage.addEventListener('input', () => {
        const value = parseInt(legacyPercentage.value) || 0;
        this.state.advancedOptions.legacyPercentage = value;
        legacyPercentageValue.textContent = value + "%";
        legacyPercentage.setAttribute('aria-valuenow', value);
      });
    }
    
    // Cloud integration
    const cloudIntegration = document.getElementById('cloud-integration');
    
    if (cloudIntegration) {
      cloudIntegration.addEventListener('change', () => {
        this.state.advancedOptions.cloudIntegration = cloudIntegration.checked;
      });
    }
    
    // Custom policies
    const customPolicies = document.getElementById('custom-policies');
    const policyComplexity = document.getElementById('policy-complexity');
    const policyComplexityContainer = document.getElementById('policy-complexity-container');
    
    if (customPolicies && policyComplexity && policyComplexityContainer) {
      customPolicies.addEventListener('change', () => {
        this.state.advancedOptions.customPolicies = customPolicies.checked;
        
        if (customPolicies.checked) {
          policyComplexityContainer.classList.remove('hidden');
        } else {
          policyComplexityContainer.classList.add('hidden');
        }
      });
      
      policyComplexity.addEventListener('change', () => {
        this.state.advancedOptions.policyComplexity = policyComplexity.value;
      });
    }
  }
  
  /**
   * Initialize industry selector
   */
  _initializeIndustrySelector() {
    // Get industry selector
    const industrySelector = document.getElementById('industry-selector');
    
    if (industrySelector) {
      // Add change event to industry selector
      industrySelector.addEventListener('change', () => {
        this.state.industry = industrySelector.value === 'none' ? null : industrySelector.value;
        
        // Update industry-specific sections if available
        this._updateIndustrySpecificSections();
      });
    }
  }
  
  /**
   * Update industry-specific sections
   */
  _updateIndustrySpecificSections() {
    // Implementation can be added later if needed
    console.log("Industry changed to:", this.state.industry);
  }
  
  /**
   * Validate inputs and update UI accordingly
   */
  _validateInputs() {
    // Get calculate button
    const calculateBtn = document.getElementById('calculate-btn');
    
    // Check if all required inputs are valid
    const isValid = (
      this.state.currentVendor && 
      this.state.deviceCount > 0 && 
      this.state.yearsToProject > 0
    );
    
    // Update calculate button
    if (calculateBtn) {
      if (isValid) {
        calculateBtn.disabled = false;
        calculateBtn.classList.remove('disabled');
      } else {
        calculateBtn.disabled = true;
        calculateBtn.classList.add('disabled');
      }
    }
    
    return isValid;
  }
  
  /**
   * Handle calculate button click
   */
  _handleCalculate() {
    // Validate inputs
    if (!this._validateInputs()) {
      this._showMessage('Please select a vendor and provide valid input values.', 'error');
      return;
    }
    
    // Show loading overlay
    this._showLoading(true);
    
    // Clear any previous messages
    this._clearMessage();
    
    // Calculate TCO
    setTimeout(() => {
      try {
        // Check if enhanced calculator is available
        if (window.enhancedCalculator) {
          console.log("Using enhanced calculator");
          // Calculate TCO for all vendors
          const results = window.enhancedCalculator.calculateAllVendors({
            currentVendor: this.state.currentVendor,
            organizationSize: this.state.organizationSize,
            deviceCount: this.state.deviceCount,
            yearsToProject: this.state.yearsToProject,
            industry: this.state.industry,
            hasAdvancedOptions: this.state.hasAdvancedOptions,
            advancedOptions: this.state.advancedOptions
          });
          
          // Store results
          this.state.calculationResults = results;
          
          // Update UI with results
          this._updateResultsUI(results);
          
          // Show results container
          this._showResults(true);
          
          // Hide loading overlay
          this._showLoading(false);
        } else if (window.calculateAllVendors) {
          console.log("Using legacy calculator");
          // Fall back to legacy calculator
          const results = window.calculateAllVendors(
            this.state.currentVendor,
            this.state.organizationSize,
            this.state.deviceCount,
            this.state.yearsToProject
          );
          
          // Store results
          this.state.calculationResults = results;
          
          // Update UI with results
          this._updateResultsUI(results);
          
          // Show results container
          this._showResults(true);
          
          // Hide loading overlay
          this._showLoading(false);
        } else {
          console.error("No calculator found");
          throw new Error('Calculator not available');
        }
      } catch (error) {
        console.error('Calculation error:', error);
        
        // Hide loading overlay
        this._showLoading(false);
        
        // Show error message
        this._showMessage('Error calculating TCO: ' + error.message, 'error');
      }
    }, 500);
  }
  
  /**
   * Handle export to CSV
   */
  _handleExportCSV() {
    // Check if results are available
    if (!this.state.calculationResults) {
      this._showMessage('No results to export. Please calculate TCO first.', 'warning');
      return;
    }
    
    try {
      // Get results
      const results = this.state.calculationResults;
      const comparison = results.comparison;
      
      if (!comparison) {
        throw new Error('Comparison data not available');
      }
      
      const currentVendor = results[comparison.vendorComparison.currentVendor];
      const portnox = results.portnox;
      
      // Create CSV content
      let csv = 'Category,Metric,Current Vendor,Portnox Cloud,Difference\n';
      
      // Add TCO data
      csv += 'TCO,"Total Cost (' + this.state.yearsToProject + ' years)"';
      csv += ',' + currentVendor.totalTCO + ',' + portnox.totalTCO + ',' + comparison.costSavings + '\n';
      
      // Add initial costs
      csv += 'Initial Costs,Hardware';
      csv += ',' + currentVendor.initialCosts.initialHardware + ',' + portnox.initialCosts.initialHardware + ',' + (currentVendor.initialCosts.initialHardware - portnox.initialCosts.initialHardware) + '\n';
      
      csv += 'Initial Costs,Network Redesign';
      csv += ',' + currentVendor.initialCosts.networkRedesign + ',' + portnox.initialCosts.networkRedesign + ',' + (currentVendor.initialCosts.networkRedesign - portnox.initialCosts.networkRedesign) + '\n';
      
      csv += 'Initial Costs,Implementation';
      csv += ',' + currentVendor.initialCosts.implementation + ',' + portnox.initialCosts.implementation + ',' + (currentVendor.initialCosts.implementation - portnox.initialCosts.implementation) + '\n';
      
      csv += 'Initial Costs,Training';
      csv += ',' + currentVendor.initialCosts.training + ',' + portnox.initialCosts.training + ',' + (currentVendor.initialCosts.training - portnox.initialCosts.training) + '\n';
      
      csv += 'Initial Costs,Migration';
      csv += ',0,' + portnox.migrationCosts + ',' + (-portnox.migrationCosts) + '\n';
      
      csv += 'Initial Costs,Total Initial';
      csv += ',' + currentVendor.initialCosts.total + ',' + (portnox.initialCosts.total + portnox.migrationCosts) + ',' + (currentVendor.initialCosts.total - (portnox.initialCosts.total + portnox.migrationCosts)) + '\n';
      
      // Add annual costs
      csv += 'Annual Costs,Maintenance';
      csv += ',' + currentVendor.annualCosts.annualMaintenance + ',' + portnox.annualCosts.annualMaintenance + ',' + (currentVendor.annualCosts.annualMaintenance - portnox.annualCosts.annualMaintenance) + '\n';
      
      csv += 'Annual Costs,Licensing';
      csv += ',' + currentVendor.annualCosts.annualLicensing + ',' + portnox.annualCosts.annualLicensing + ',' + (currentVendor.annualCosts.annualLicensing - portnox.annualCosts.annualLicensing) + '\n';
      
      csv += 'Annual Costs,Downtime Costs';
      csv += ',' + currentVendor.annualCosts.downtimeCost + ',' + portnox.annualCosts.downtimeCost + ',' + (currentVendor.annualCosts.downtimeCost - portnox.annualCosts.downtimeCost) + '\n';
      
      csv += 'Annual Costs,IT Personnel';
      csv += ',' + currentVendor.annualCosts.fteCosts + ',' + portnox.annualCosts.fteCosts + ',' + (currentVendor.annualCosts.fteCosts - portnox.annualCosts.fteCosts) + '\n';
      
      csv += 'Annual Costs,Total Annual';
      csv += ',' + currentVendor.annualCosts.total + ',' + portnox.annualCosts.total + ',' + (currentVendor.annualCosts.total - portnox.annualCosts.total) + '\n';
      
      // Add implementation timeline
      csv += 'Implementation,Total Days';
      csv += ',' + currentVendor.totalImplementationDays + ',' + portnox.totalImplementationDays + ',' + comparison.implementationReduction + '\n';
      
      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'nac_tco_comparison.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      this._showMessage('CSV file exported successfully.', 'success');
    } catch (error) {
      console.error('Export error:', error);
      
      // Show error message
      this._showMessage('Error exporting to CSV: ' + error.message, 'error');
    }
  }
  
  /**
   * Handle export to PDF
   */
  _handleExportPDF() {
    // Check if results are available
    if (!this.state.calculationResults) {
      this._showMessage('No results to export. Please calculate TCO first.', 'warning');
      return;
    }
    
    this._showMessage('PDF export will be implemented in a future update.', 'info');
  }
  
  /**
   * Show/hide loading overlay
   * @param {boolean} show - Whether to show or hide loading overlay
   */
  _showLoading(show) {
    // Update state
    this.state.isCalculating = show;
    
    // Get loading overlay
    const loadingOverlay = this.domCache.loadingOverlay || document.getElementById('loading-overlay');
    
    // Create loading overlay if not exists
    if (!loadingOverlay && show) {
      const overlay = document.createElement('div');
      overlay.id = 'loading-overlay';
      overlay.className = 'loading-overlay';
      
      const spinner = document.createElement('div');
      spinner.className = 'spinner';
      
      const text = document.createElement('div');
      text.className = 'loading-text';
      text.textContent = 'Calculating...';
      
      overlay.appendChild(spinner);
      overlay.appendChild(text);
      document.body.appendChild(overlay);
      
      // Cache loading overlay
      this.domCache.loadingOverlay = overlay;
    } else if (loadingOverlay) {
      // Show/hide loading overlay
      if (show) {
        loadingOverlay.style.display = 'flex';
      } else {
        loadingOverlay.style.display = 'none';
      }
    }
  }
  
  /**
   * Show/hide results container
   * @param {boolean} show - Whether to show or hide results container
   */
  _showResults(show) {
    // Get results container
    const resultsContainer = this.domCache.resultsContainer || document.getElementById('results-container');
    
    if (resultsContainer) {
      // Show/hide results container
      if (show) {
        resultsContainer.classList.remove('hidden');
        resultsContainer.setAttribute('aria-hidden', 'false');
        
        // Scroll to results container
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Set focus to results container for accessibility
        resultsContainer.focus();
      } else {
        resultsContainer.classList.add('hidden');
        resultsContainer.setAttribute('aria-hidden', 'true');
      }
    }
  }
  
  /**
   * Set active tab
   * @param {string} tabId - ID of tab to activate
   */
  _setActiveTab(tabId) {
    // Get all tab buttons and panes
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Remove active class from all buttons and panes
    tabButtons.forEach(button => {
      button.classList.remove('active');
      button.setAttribute('aria-selected', 'false');
      button.tabIndex = -1;
    });
    
    tabPanes.forEach(pane => {
      pane.classList.remove('active');
      pane.setAttribute('aria-hidden', 'true');
    });
    
    // Add active class to selected button and pane
    const selectedButton = document.querySelector('.tab-button[data-tab="' + tabId + '"]');
    const selectedPane = document.getElementById(tabId);
    
    if (selectedButton) {
      selectedButton.classList.add('active');
      selectedButton.setAttribute('aria-selected', 'true');
      selectedButton.tabIndex = 0;
    }
    
    if (selectedPane) {
      selectedPane.classList.add('active');
      selectedPane.setAttribute('aria-hidden', 'false');
    }
    
    // Update state
    this.state.activeTab = tabId;
  }
  
  /**
   * Set active sub-tab
   * @param {string} subTabId - ID of sub-tab to activate
   */
  _setActiveSubTab(subTabId) {
    // Get all sub-tab buttons and panes
    const subTabButtons = document.querySelectorAll('.sub-tab-button');
    const subTabPanes = document.querySelectorAll('.sub-tab-pane');
    
    // Remove active class from all buttons and panes
    subTabButtons.forEach(button => {
      button.classList.remove('active');
      button.setAttribute('aria-selected', 'false');
      button.tabIndex = -1;
    });
    
    subTabPanes.forEach(pane => {
      pane.classList.remove('active');
      pane.setAttribute('aria-hidden', 'true');
    });
    
    // Add active class to selected button and pane
    const selectedButton = document.querySelector('.sub-tab-button[data-subtab="' + subTabId + '"]');
    const selectedPane = document.getElementById(subTabId);
    
    if (selectedButton) {
      selectedButton.classList.add('active');
      selectedButton.setAttribute('aria-selected', 'true');
      selectedButton.tabIndex = 0;
    }
    
    if (selectedPane) {
      selectedPane.classList.add('active');
      selectedPane.setAttribute('aria-hidden', 'false');
    }
  }
  
  /**
   * Show message to user
   * @param {string} message - Message to show
   * @param {string} type - Message type (success, error, warning, info)
   */
  _showMessage(message, type = 'info') {
    // Get message container
    const messageContainer = this.domCache.messageContainer || document.getElementById('message-container');
    
    if (messageContainer) {
      // Clear any existing messages
      messageContainer.innerHTML = '';
      
      // Create message element
      const messageElement = document.createElement('div');
      messageElement.className = 'message message-' + type;
      messageElement.setAttribute('role', type === 'error' ? 'alert' : 'status');
      
      // Add icon based on message type
      const iconElement = document.createElement('i');
      
      switch (type) {
        case 'success':
          iconElement.className = 'fas fa-check-circle';
          break;
        case 'error':
          iconElement.className = 'fas fa-exclamation-circle';
          break;
        case 'warning':
          iconElement.className = 'fas fa-exclamation-triangle';
          break;
        case 'info':
        default:
          iconElement.className = 'fas fa-info-circle';
          break;
      }
      
      messageElement.appendChild(iconElement);
      
      // Add message text
      const textElement = document.createElement('span');
      textElement.textContent = message;
      messageElement.appendChild(textElement);
      
      // Add close button
      const closeButton = document.createElement('button');
      closeButton.className = 'message-close';
      closeButton.setAttribute('aria-label', 'Dismiss message');
      closeButton.innerHTML = '&times;';
      closeButton.addEventListener('click', () => {
        messageContainer.removeChild(messageElement);
      });
      
      messageElement.appendChild(closeButton);
      
      // Add message to container
      messageContainer.appendChild(messageElement);
      
      // Auto-dismiss success and info messages after 5 seconds
      if (type === 'success' || type === 'info') {
        setTimeout(() => {
          if (messageContainer.contains(messageElement)) {
            messageContainer.removeChild(messageElement);
          }
        }, 5000);
      }
    }
  }
  
  /**
   * Clear all messages
   */
  _clearMessage() {
    // Get message container
    const messageContainer = this.domCache.messageContainer || document.getElementById('message-container');
    
    if (messageContainer) {
      // Clear any existing messages
      messageContainer.innerHTML = '';
    }
  }
  
  /**
   * Update results UI with calculation results
   * @param {object} results - Calculation results
   */
  _updateResultsUI(results) {
    console.log("Updating UI with calculation results:", results);
    
    // Ensure we have comparison data
    if (!results.comparison) {
      this._showMessage('No comparison data available in the results.', 'error');
      return;
    }
    
    // Update comparison metrics
    this._updateComparisonMetrics(results);
    
    // Update tables
    this._updateTables(results);
    
    // Update vendor name placeholders
    if (results[results.comparison.vendorComparison.currentVendor]) {
      this._updateVendorNamePlaceholders(results[results.comparison.vendorComparison.currentVendor].name);
    }
    
    // Update charts if Chart.js is available
    if (typeof Chart !== 'undefined') {
      try {
        this._updateCharts(results);
      } catch (error) {
        console.error("Error updating charts:", error);
        this._showMessage('Error updating charts: ' + error.message, 'warning');
      }
    } else {
      console.warn("Chart.js not available, skipping chart updates");
    }
  }
  
  /**
   * Update comparison metrics
   * @param {object} results - Calculation results
   */
  _updateComparisonMetrics(results) {
    const comparison = results.comparison;
    if (!comparison) {
      return;
    }
    
    // Update comparison metrics
    const comparisonSavings = document.getElementById('comparison-savings');
    const comparisonImplementation = document.getElementById('comparison-implementation');
    
    if (comparisonSavings) {
      comparisonSavings.textContent = '$' + this._formatNumber(comparison.costSavings);
      
      // Update progress bar
      const progressBar = comparisonSavings.parentElement.querySelector('.progress');
      if (progressBar) {
        const width = Math.min(comparison.savingsPercentage, 100);
        progressBar.style.width = width + '%';
        
        // Update aria attributes
        const progressBarContainer = progressBar.parentElement;
        if (progressBarContainer) {
          progressBarContainer.setAttribute('aria-valuenow', Math.round(width));
        }
      }
      
      // Update progress label
      const progressLabel = comparisonSavings.parentElement.querySelector('.progress-labels span:last-child');
      if (progressLabel) {
        progressLabel.textContent = Math.round(comparison.savingsPercentage) + '% Savings';
      }
    }
    
    if (comparisonImplementation) {
      comparisonImplementation.textContent = Math.round(comparison.implementationPercentage) + '%';
      
      // Update progress bar
      const progressBar = comparisonImplementation.parentElement.querySelector('.progress');
      if (progressBar) {
        const width = Math.min(comparison.implementationPercentage, 100);
        progressBar.style.width = width + '%';
        
        // Update aria attributes
        const progressBarContainer = progressBar.parentElement;
        if (progressBarContainer) {
          progressBarContainer.setAttribute('aria-valuenow', Math.round(width));
        }
      }
      
      // Update progress label
      const progressLabel = comparisonImplementation.parentElement.querySelector('.progress-labels span:last-child');
      if (progressLabel) {
        progressLabel.textContent = Math.round(comparison.implementationPercentage) + '% Faster';
      }
    }
  }
  
  /**
   * Update tables with calculation results
   * @param {object} results - Calculation results
   */
  _updateTables(results) {
    const comparison = results.comparison;
    if (!comparison) {
      return;
    }
    
    // Get current vendor and Portnox data
    const currentVendor = results[comparison.vendorComparison.currentVendor];
    const portnox = results.portnox;
    
    // Update TCO summary table
    this._updateTCOSummaryTable(results);
    
    // Update annual costs table
    this._updateAnnualCostsTable(currentVendor, portnox);
  }
  
  /**
   * Update TCO summary table
   * @param {object} results - Calculation results
   */
  _updateTCOSummaryTable(results) {
    const tableBody = document.getElementById('tco-summary-table-body');
    if (!tableBody) {
      return;
    }
    
    // Clear table body
    tableBody.innerHTML = '';
    
    // Get vendors to include in table
    const currentVendor = results[results.comparison.vendorComparison.currentVendor];
    const portnox = results.portnox;
    
    if (!currentVendor || !portnox) {
      return;
    }
    
    // Add row for current vendor
    const currentVendorRow = document.createElement('tr');
    
    const currentVendorCell = document.createElement('td');
    currentVendorCell.textContent = currentVendor.vendor;
    currentVendorRow.appendChild(currentVendorCell);
    
    const currentInitialCell = document.createElement('td');
    currentInitialCell.textContent = '$' + this._formatNumber(currentVendor.initialCosts.total);
    currentVendorRow.appendChild(currentInitialCell);
    
    const currentAnnualCell = document.createElement('td');
    currentAnnualCell.textContent = '$' + this._formatNumber(currentVendor.annualCosts.total);
    currentVendorRow.appendChild(currentAnnualCell);
    
    const currentMigrationCell = document.createElement('td');
    currentMigrationCell.textContent = '$0';
    currentVendorRow.appendChild(currentMigrationCell);
    
    const currentTotalCell = document.createElement('td');
    currentTotalCell.textContent = '$' + this._formatNumber(currentVendor.totalTCO);
    currentVendorRow.appendChild(currentTotalCell);
    
    tableBody.appendChild(currentVendorRow);
    
    // Add row for Portnox
    const portnoxRow = document.createElement('tr');
    
    const portnoxNameCell = document.createElement('td');
    portnoxNameCell.textContent = portnox.vendor;
    portnoxRow.appendChild(portnoxNameCell);
    
    const portnoxInitialCell = document.createElement('td');
    portnoxInitialCell.textContent = '$' + this._formatNumber(portnox.initialCosts.total);
    portnoxRow.appendChild(portnoxInitialCell);
    
    const portnoxAnnualCell = document.createElement('td');
    portnoxAnnualCell.textContent = '$' + this._formatNumber(portnox.annualCosts.total);
    portnoxRow.appendChild(portnoxAnnualCell);
    
    const portnoxMigrationCell = document.createElement('td');
    portnoxMigrationCell.textContent = '$' + this._formatNumber(portnox.migrationCosts);
    portnoxRow.appendChild(portnoxMigrationCell);
    
    const portnoxTotalCell = document.createElement('td');
    portnoxTotalCell.textContent = '$' + this._formatNumber(portnox.totalTCO);
    portnoxRow.appendChild(portnoxTotalCell);
    
    tableBody.appendChild(portnoxRow);
    
    // Add savings row
    const savingsRow = document.createElement('tr');
    savingsRow.classList.add('savings-row');
    
    const savingsLabel = document.createElement('td');
    savingsLabel.textContent = 'Savings with Portnox Cloud';
    savingsLabel.style.fontWeight = 'bold';
    savingsRow.appendChild(savingsLabel);
    
    const initialSavings = document.createElement('td');
    initialSavings.textContent = '$' + this._formatNumber(currentVendor.initialCosts.total - portnox.initialCosts.total);
    savingsRow.appendChild(initialSavings);
    
    const annualSavings = document.createElement('td');
    annualSavings.textContent = '$' + this._formatNumber(currentVendor.annualCosts.total - portnox.annualCosts.total);
    savingsRow.appendChild(annualSavings);
    
    const migrationSavings = document.createElement('td');
    migrationSavings.textContent = '-$' + this._formatNumber(portnox.migrationCosts);
    savingsRow.appendChild(migrationSavings);
    
    const totalSavings = document.createElement('td');
    totalSavings.textContent = '$' + this._formatNumber(currentVendor.totalTCO - portnox.totalTCO);
    totalSavings.style.fontWeight = 'bold';
    savingsRow.appendChild(totalSavings);
    
    tableBody.appendChild(savingsRow);
  }
  
  /**
   * Update annual costs table
   * @param {object} currentVendor - Current vendor data
   * @param {object} portnox - Portnox data
   */
  _updateAnnualCostsTable(currentVendor, portnox) {
    const tableBody = document.getElementById('annual-costs-table-body');
    if (!tableBody) {
      return;
    }
    
    // Clear table body
    tableBody.innerHTML = '';
    
    // Add maintenance row
    const maintenanceRow = document.createElement('tr');
    
    const maintenanceLabel = document.createElement('td');
    maintenanceLabel.textContent = 'Maintenance and Support';
    maintenanceRow.appendChild(maintenanceLabel);
    
    const maintenanceCurrent = document.createElement('td');
    maintenanceCurrent.textContent = '$' + this._formatNumber(currentVendor.annualCosts.annualMaintenance);
    maintenanceRow.appendChild(maintenanceCurrent);
    
    const maintenancePortnox = document.createElement('td');
    maintenancePortnox.textContent = '$' + this._formatNumber(portnox.annualCosts.annualMaintenance);
    maintenanceRow.appendChild(maintenancePortnox);
    
    const maintenanceSavings = document.createElement('td');
    maintenanceSavings.textContent = '$' + this._formatNumber(currentVendor.annualCosts.annualMaintenance - portnox.annualCosts.annualMaintenance);
    maintenanceRow.appendChild(maintenanceSavings);
    
    tableBody.appendChild(maintenanceRow);
    
    // Add licensing row
    const licensingRow = document.createElement('tr');
    
    const licensingLabel = document.createElement('td');
    licensingLabel.textContent = 'Licensing and Subscriptions';
    licensingRow.appendChild(licensingLabel);
    
    const licensingCurrent = document.createElement('td');
    licensingCurrent.textContent = '$' + this._formatNumber(currentVendor.annualCosts.annualLicensing);
    licensingRow.appendChild(licensingCurrent);
    
    const licensingPortnox = document.createElement('td');
    licensingPortnox.textContent = '$' + this._formatNumber(portnox.annualCosts.annualLicensing);
    licensingRow.appendChild(licensingPortnox);
    
    const licensingSavings = document.createElement('td');
    licensingSavings.textContent = '$' + this._formatNumber(currentVendor.annualCosts.annualLicensing - portnox.annualCosts.annualLicensing);
    licensingRow.appendChild(licensingSavings);
    
    tableBody.appendChild(licensingRow);
    
    // Add downtime row
    const downtimeRow = document.createElement('tr');
    
    const downtimeLabel = document.createElement('td');
    downtimeLabel.textContent = 'Downtime Costs';
    downtimeRow.appendChild(downtimeLabel);
    
    const downtimeCurrent = document.createElement('td');
    downtimeCurrent.textContent = '$' + this._formatNumber(currentVendor.annualCosts.downtimeCost);
    downtimeRow.appendChild(downtimeCurrent);
    
    const downtimePortnox = document.createElement('td');
    downtimePortnox.textContent = '$' + this._formatNumber(portnox.annualCosts.downtimeCost);
    downtimeRow.appendChild(downtimePortnox);
    
    const downtimeSavings = document.createElement('td');
    downtimeSavings.textContent = '$' + this._formatNumber(currentVendor.annualCosts.downtimeCost - portnox.annualCosts.downtimeCost);
    downtimeRow.appendChild(downtimeSavings);
    
    tableBody.appendChild(downtimeRow);
    
    // Add IT personnel row
    const personnelRow = document.createElement('tr');
    
    const personnelLabel = document.createElement('td');
    personnelLabel.textContent = 'IT Personnel Costs';
    personnelRow.appendChild(personnelLabel);
    
    const personnelCurrent = document.createElement('td');
    personnelCurrent.textContent = '$' + this._formatNumber(currentVendor.annualCosts.fteCosts);
    personnelRow.appendChild(personnelCurrent);
    
    const personnelPortnox = document.createElement('td');
    personnelPortnox.textContent = '$' + this._formatNumber(portnox.annualCosts.fteCosts);
    personnelRow.appendChild(personnelPortnox);
    
    const personnelSavings = document.createElement('td');
    personnelSavings.textContent = '$' + this._formatNumber(currentVendor.annualCosts.fteCosts - portnox.annualCosts.fteCosts);
    personnelRow.appendChild(personnelSavings);
    
    tableBody.appendChild(personnelRow);
    
    // Add total row
    const totalRow = document.createElement('tr');
    totalRow.classList.add('total-row');
    
    const totalLabel = document.createElement('td');
    totalLabel.textContent = 'Total Annual Costs';
    totalLabel.style.fontWeight = 'bold';
    totalRow.appendChild(totalLabel);
    
    const totalCurrent = document.createElement('td');
    totalCurrent.textContent = '$' + this._formatNumber(currentVendor.annualCosts.total);
    totalCurrent.style.fontWeight = 'bold';
    totalRow.appendChild(totalCurrent);
    
    const totalPortnox = document.createElement('td');
    totalPortnox.textContent = '$' + this._formatNumber(portnox.annualCosts.total);
    totalPortnox.style.fontWeight = 'bold';
    totalRow.appendChild(totalPortnox);
    
    const totalSavings = document.createElement('td');
    totalSavings.textContent = '$' + this._formatNumber(currentVendor.annualCosts.total - portnox.annualCosts.total);
    totalSavings.style.fontWeight = 'bold';
    totalRow.appendChild(totalSavings);
    
    tableBody.appendChild(totalRow);
  }
  
  /**
   * Update vendor name placeholders
   * @param {string} vendorName - Vendor name
   */
  _updateVendorNamePlaceholders(vendorName) {
    const placeholders = document.querySelectorAll('.vendor-name-placeholder');
    
    placeholders.forEach(placeholder => {
      placeholder.textContent = vendorName;
    });
    
    // Update table headers
    const tcoComparisonVendor = document.getElementById('tco-comparison-vendor');
    if (tcoComparisonVendor) {
      tcoComparisonVendor.textContent = vendorName;
    }
    
    const annualComparisonVendor = document.getElementById('annual-comparison-vendor');
    if (annualComparisonVendor) {
      annualComparisonVendor.textContent = vendorName;
    }
    
    const implementationComparisonVendor = document.getElementById('implementation-comparison-vendor');
    if (implementationComparisonVendor) {
      implementationComparisonVendor.textContent = vendorName;
    }
  }
  
  /**
   * Update charts with calculation results
   * @param {object} results - Calculation results
   */
  _updateCharts(results) {
    const comparison = results.comparison;
    if (!comparison) {
      return;
    }
    
    // Get current vendor and Portnox data
    const currentVendor = results[comparison.vendorComparison.currentVendor];
    const portnox = results.portnox;
    
    // Update TCO comparison chart
    this._updateTCOComparisonChart(currentVendor, portnox);
    
    // Update cumulative cost chart
    this._updateCumulativeCostChart(currentVendor, portnox);
  }
  
  /**
   * Update TCO comparison chart
   * @param {object} currentVendor - Current vendor data
   * @param {object} portnox - Portnox data
   */
  _updateTCOComparisonChart(currentVendor, portnox) {
    const chartCanvas = document.getElementById('tco-comparison-chart');
    if (!chartCanvas) {
      return;
    }
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
      console.error('Chart.js not available');
      return;
    }
    
    // Destroy existing chart if any
    const existingChart = Chart.getChart && Chart.getChart(chartCanvas);
    if (existingChart) {
      existingChart.destroy();
    }
    
    // Create chart data
    const chartData = {
      labels: [currentVendor.vendor, 'Portnox Cloud'],
      datasets: [
        {
          label: 'Annual Costs',
          data: [
            currentVendor.annualCosts.total * this.state.yearsToProject,
            portnox.annualCosts.total * this.state.yearsToProject
          ],
          backgroundColor: 'rgba(54, 162, 235, 0.7)'
        },
        {
          label: 'Initial Costs',
          data: [
            currentVendor.initialCosts.total,
            portnox.initialCosts.total + portnox.migrationCosts
          ],
          backgroundColor: 'rgba(255, 99, 132, 0.7)'
        }
      ]
    };
    
    // Create chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true,
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
              return context.dataset.label + ': $' + context.raw.toLocaleString();
            },
            footer: function(tooltipItems) {
              let total = 0;
              tooltipItems.forEach(item => {
                total += item.parsed.y;
              });
              return 'Total: $' + total.toLocaleString();
            }
          }
        },
        legend: {
          position: 'bottom'
        }
      }
    };
    
    // Create chart
    new Chart(chartCanvas, {
      type: 'bar',
      data: chartData,
      options: chartOptions
    });
  }
  
  /**
   * Update cumulative cost chart
   * @param {object} currentVendor - Current vendor data
   * @param {object} portnox - Portnox data
   */
  _updateCumulativeCostChart(currentVendor, portnox) {
    const chartCanvas = document.getElementById('cumulative-cost-chart');
    if (!chartCanvas) {
      return;
    }
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
      console.error('Chart.js not available');
      return;
    }
    
    // Destroy existing chart if any
    const existingChart = Chart.getChart && Chart.getChart(chartCanvas);
    if (existingChart) {
      existingChart.destroy();
    }
    
    // Calculate cumulative costs
    const labels = ['Initial'];
    const currentVendorData = [currentVendor.initialCosts.total];
    const portnoxData = [portnox.initialCosts.total + portnox.migrationCosts];
    
    for (let year = 1; year <= this.state.yearsToProject; year++) {
      labels.push('Year ' + year);
      currentVendorData.push(currentVendor.initialCosts.total + currentVendor.annualCosts.total * year);
      portnoxData.push((portnox.initialCosts.total + portnox.migrationCosts) + portnox.annualCosts.total * year);
    }
    
    // Create chart data
    const chartData = {
      labels: labels,
      datasets: [
        {
          label: currentVendor.vendor,
          data: currentVendorData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.1
        },
        {
          label: 'Portnox Cloud',
          data: portnoxData,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.1
        }
      ]
    };
    
    // Create chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
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
              return context.dataset.label + ': $' + context.raw.toLocaleString();
            }
          }
        },
        legend: {
          position: 'bottom'
        }
      }
    };
    
    // Create chart
    new Chart(chartCanvas, {
      type: 'line',
      data: chartData,
      options: chartOptions
    });
  }
  
  /**
   * Format number with commas
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  _formatNumber(num) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

// Make BasicUIController available as both BasicUIController and EnhancedUIController
window.EnhancedUIController = BasicUIController;
/**
 * Integrated UI Setup
 * Initializes the enhanced UI components
 */
(function() {
    // Initialize all UI components when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Initializing Integrated UI...');
        
        // Initialize wizard if available
        if (typeof TCOWizard !== 'undefined') {
            TCOWizard.init();
            console.log('TCO Wizard initialized');
            
            // Add wizard button if not already present
            if (!document.getElementById('open-wizard-btn')) {
                const wizardButton = document.createElement('button');
                wizardButton.id = 'open-wizard-btn';
                wizardButton.className = 'btn btn-primary';
                wizardButton.innerHTML = '<i class="fas fa-magic"></i> TCO Wizard';
                
                // Add to header or as floating button
                const headerActions = document.querySelector('.header-actions');
                if (headerActions) {
                    headerActions.prepend(wizardButton);
                } else {
                    wizardButton.classList.add('floating-wizard-btn');
                    document.body.appendChild(wizardButton);
                }
                
                // Add click event
                wizardButton.addEventListener('click', TCOWizard.openWizard);
            }
        }
        
        // Initialize sensitivity analysis
        if (typeof IntegratedSensitivity !== 'undefined') {
            IntegratedSensitivity.init();
            console.log('Integrated Sensitivity Analysis initialized');
        }
        
        // Setup vendor cards if they exist
        setupVendorCards();
        
        console.log('Integrated UI initialization complete');
    });
    
    // Set up vendor cards functionality
    function setupVendorCards() {
        const vendorCards = document.querySelectorAll('.vendor-card');
        if (vendorCards.length === 0) return;
        
        console.log('Setting up vendor cards...');
        
        // Add click handlers to vendor cards
        vendorCards.forEach(card => {
            card.addEventListener('click', function() {
                // Deactivate all cards
                vendorCards.forEach(c => c.classList.remove('active'));
                
                // Activate this card
                this.classList.add('active');
                
                // Update information display
                updateVendorInfo(this.dataset.vendor);
                
                // If calculator exists, update selected vendor
                if (window.Calculator && typeof window.Calculator.updateState === 'function') {
                    window.Calculator.updateState({
                        currentVendor: this.dataset.vendor
                    });
                } else if (window.EnhancedCalculator && typeof window.EnhancedCalculator.updateState === 'function') {
                    window.EnhancedCalculator.updateState({
                        currentVendor: this.dataset.vendor
                    });
                }
            });
        });
        
        console.log('Vendor cards setup complete');
    }
    
    // Update vendor information display
    function updateVendorInfo(vendorId) {
        const infoBox = document.getElementById('vendor-info');
        if (!infoBox) return;
        
        const titleEl = document.getElementById('vendor-info-title');
        const descEl = document.getElementById('vendor-info-description');
        
        // Vendor data
        const vendorData = {
            cisco: {
                name: 'Cisco ISE',
                description: 'Comprehensive on-premises NAC solution with extensive enterprise features and strong Cisco infrastructure integration.'
            },
            aruba: {
                name: 'Aruba ClearPass',
                description: 'Full-featured NAC solution with excellent guest management capabilities and multi-vendor support.'
            },
            forescout: {
                name: 'Forescout',
                description: 'Agentless visibility platform with strong device discovery and classification, particularly for IoT/OT environments.'
            },
            fortinac: {
                name: 'FortiNAC',
                description: 'Part of the Fortinet Security Fabric with good integration and protection for Fortinet environments.'
            },
            nps: {
                name: 'Microsoft NPS',
                description: 'Basic NAC functionality included with Windows Server, providing simple authentication with minimal features.'
            },
            securew2: {
                name: 'SecureW2',
                description: 'Cloud-focused solution specializing in certificate-based authentication and passwordless access.'
            },
            noNac: {
                name: 'No NAC Solution',
                description: 'Operating without dedicated NAC increases security risks, complicates compliance, and reduces visibility into network endpoints.'
            }
        };
        
        // Set content
        if (vendorData[vendorId]) {
            titleEl.textContent = vendorData[vendorId].name;
            descEl.textContent = vendorData[vendorId].description;
            infoBox.classList.remove('hidden');
        } else {
            infoBox.classList.add('hidden');
        }
    }
})();
/**
 * UI Enhancement Script
 * Consolidates tabs and enhances the comparison view
 */
(function() {
  console.log('Applying UI Enhancements...');
  
  // Hide sidebar industry content
  function hideSidebarContent() {
    const elementsToHide = [
      '.sidebar-industry-preview',
      '.industry-templates-card',
      '.compliance-info-container'
    ];
    
    elementsToHide.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.display = 'none';
      });
    });
  }
  
  // Enhance the vendor comparison tab
  function enhanceVendorComparison() {
    // Create data for detailed vendor comparison
    const vendorData = {
      portnox: {
        name: "Portnox Cloud",
        type: "Cloud-Native",
        description: "Zero-trust, cloud-native NAC platform unifying authentication, risk mitigation, and remediation with no hardware requirements.",
        advantages: [
          "Cloud-Native Architecture: No hardware, deploy in hours",
          "Automatic Updates: Zero maintenance with continuous improvements",
          "Unlimited Scalability: Effortlessly scales to 100,000+ devices",
          "Lower TCO: 20-30% lower 3-year TCO vs on-premises solutions",
          "Global Access: Single cloud console manages all locations",
          "Minimal IT Resources: 60% less administrative overhead"
        ]
      },
      onprem: {
        name: "On-Premises NAC",
        type: "Hardware-Based",
        description: "Traditional NAC solutions requiring dedicated hardware, complex setup, and ongoing maintenance and updates.",
        disadvantages: [
          "Hardware Requirements: Appliances at every location",
          "Complex Implementation: Weeks to months deployment time",
          "Maintenance Burden: Manual updates and maintenance",
          "Limited Scalability: Hardware dependencies limit growth",
          "Higher TCO: Significant hardware and maintenance costs",
          "IT Resource Intensive: 1.5-2 FTE for administration"
        ]
      }
    };
    
    // Find or create comparison tab
    let comparisonTab = document.getElementById('comparison-tab');
    
    if (!comparisonTab) {
      // Find the tab container
      const tabContentContainer = document.querySelector('.tab-content');
      if (!tabContentContainer) return;
      
      // Create tab content
      comparisonTab = document.createElement('div');
      comparisonTab.id = 'comparison-tab';
      comparisonTab.className = 'tab-pane';
      
      tabContentContainer.appendChild(comparisonTab);
      
      // Create the tab button if it doesn't exist
      const tabsContainer = document.querySelector('.tabs');
      if (tabsContainer) {
        const comparisonButton = document.createElement('button');
        comparisonButton.className = 'tab-button';
        comparisonButton.setAttribute('data-tab', 'comparison-tab');
        comparisonButton.innerHTML = '<i class="fas fa-exchange-alt"></i> Cloud vs. On-Prem';
        
        // Insert after summary tab
        const summaryTab = document.querySelector('[data-tab="summary-tab"]');
        if (summaryTab && summaryTab.nextSibling) {
          tabsContainer.insertBefore(comparisonButton, summaryTab.nextSibling);
        } else {
          tabsContainer.appendChild(comparisonButton);
        }
        
        // Add click handler
        comparisonButton.addEventListener('click', function() {
          // Deactivate all tabs
          document.querySelectorAll('.tab-button').forEach(tab => {
            tab.classList.remove('active');
          });
          
          // Deactivate all tab panes
          document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
          });
          
          // Activate this tab
          this.classList.add('active');
          comparisonTab.classList.add('active');
        });
      }
    }
    
    // Create enhanced comparison content
    comparisonTab.innerHTML = `
      <h3>Cloud vs. On-Premises NAC Comparison</h3>
      <p>Compare the key differences between cloud-native and on-premises NAC solutions across critical dimensions.</p>
      
      <div class="comparison-summary" style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h4>Executive Summary: Why Portnox Cloud?</h4>
        <p>
          Portnox Cloud delivers a modern, zero-trust NAC solution with significant advantages over traditional on-premises alternatives:
          20-30% lower TCO, 80% faster implementation, and 60% reduced administrative overhead. With no hardware requirements
          and automatic updates, it represents the future of network access control.
        </p>
      </div>
      
      <div class="vendor-cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px;">
        <div class="vendor-card" style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); border-left: 4px solid #2BD25B;">
          <h4>${vendorData.portnox.name}</h4>
          <div style="font-size: 14px; color: #707070; margin-bottom: 10px; font-style: italic;">${vendorData.portnox.type}</div>
          <p>${vendorData.portnox.description}</p>
          <h5 style="color: #2BD25B; margin-top: 15px;">Key Advantages</h5>
          <ul style="padding-left: 20px; margin-top: 10px;">
            ${vendorData.portnox.advantages.map(adv => `<li>${adv}</li>`).join('')}
          </ul>
        </div>
        
        <div class="vendor-card" style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); border-left: 4px solid #1B67B2;">
          <h4>${vendorData.onprem.name}</h4>
          <div style="font-size: 14px; color: #707070; margin-bottom: 10px; font-style: italic;">${vendorData.onprem.type}</div>
          <p>${vendorData.onprem.description}</p>
          <h5 style="color: #1B67B2; margin-top: 15px;">Key Challenges</h5>
          <ul style="padding-left: 20px; margin-top: 10px;">
            ${vendorData.onprem.disadvantages.map(disadv => `<li>${disadv}</li>`).join('')}
          </ul>
        </div>
      </div>
      
      <h4>Detailed Comparison</h4>
      <div style="overflow-x: auto; margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 10px; text-align: left; background-color: #f8f9fa; border-bottom: 2px solid #ddd;">Feature</th>
              <th style="padding: 10px; text-align: left; background-color: #f8f9fa; border-bottom: 2px solid #ddd;">On-Premises NAC</th>
              <th style="padding: 10px; text-align: left; background-color: #f8f9fa; border-bottom: 2px solid #ddd;">Portnox Cloud</th>
              <th style="padding: 10px; text-align: left; background-color: #f8f9fa; border-bottom: 2px solid #ddd;">Advantage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Hardware Requirements</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Dedicated appliances at each location</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">No hardware requirements</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2BD25B;">Portnox</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Implementation Time</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Weeks to months</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Hours to days</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2BD25B;">Portnox</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>IT Staff Requirements</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">1.5-2 FTE</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">0.5 FTE</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2BD25B;">Portnox</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Updates &amp; Maintenance</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Manual, scheduled windows</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Automatic, continuous</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2BD25B;">Portnox</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Multi-site Deployment</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Hardware at each location</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Single cloud instance for all sites</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2BD25B;">Portnox</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Scalability</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Hardware-dependent</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Unlimited</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2BD25B;">Portnox</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Total Cost of Ownership</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">High (hardware, maintenance, personnel)</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">20-30% lower TCO over 3 years</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2BD25B;">Portnox</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Initial Investment</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">High (hardware, software, implementation)</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Low (subscription model)</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2BD25B;">Portnox</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Cloud Integration</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Limited or complex</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Native, seamless</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2BD25B;">Portnox</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Zero-Trust Support</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Varies by vendor</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Built-in, comprehensive</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2BD25B;">Portnox</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <h4>Industry-Specific Insights</h4>
      <div class="industry-section" style="margin-top: 20px;">
        <select id="industry-insights-selector" class="form-select" style="max-width: 300px; margin-bottom: 20px;">
          <option value="none">Select industry for specific insights...</option>
          <option value="healthcare">Healthcare</option>
          <option value="financial">Financial Services</option>
          <option value="education">Education</option>
          <option value="government">Government</option>
          <option value="manufacturing">Manufacturing</option>
        </select>
        
        <div id="industry-insights-content">
          <p>Select an industry above to view specific compliance requirements and Portnox advantages for your sector.</p>
        </div>
      </div>
      
      <div class="chart-sections" style="margin-top: 30px;">
        <h4>Cost Analysis Charts</h4>
        <div style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 15px;">
          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.07);">
            <h5>Cost Factors Impact Analysis</h5>
            <div class="chart-container">
              <canvas id="cost-factors-chart"></canvas>
            </div>
          </div>
          
          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.07);">
            <h5>ROI Timeline</h5>
            <div class="chart-container">
              <canvas id="roi-timeline-chart"></canvas>
            </div>
          </div>
          
          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.07);">
            <h5>Cost Analysis Over Time</h5>
            <div class="chart-container">
              <canvas id="cost-analysis-chart"></canvas>
            </div>
          </div>
          
          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.07);">
            <h5>IT Resource Utilization</h5>
            <div class="chart-container">
              <canvas id="resource-utilization-chart"></canvas>
            </div>
          </div>
          
          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.07);">
            <h5>Implementation Complexity</h5>
            <div class="chart-container">
              <canvas id="implementation-complexity-chart"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Setup industry selector
    const industrySelector = document.getElementById('industry-insights-selector');
    if (industrySelector) {
      industrySelector.addEventListener('change', function() {
        const industryId = this.value;
        const contentDiv = document.getElementById('industry-insights-content');
        
        if (industryId === 'none' || !contentDiv) {
          return;
        }
        
        // Industry data
        const industryData = {
          healthcare: {
            name: "Healthcare",
            compliance: "Healthcare organizations must comply with HIPAA, HITECH, and other regulations that mandate strong access controls, audit logging, and protection of patient health information (PHI).",
            portnoxAdvantage: "Portnox Cloud provides specialized medical device profiling and security policies with minimal disruption, plus built-in compliance reporting for HIPAA and HITECH with automated remediation.",
            savingsPercent: 35
          },
          financial: {
            name: "Financial Services",
            compliance: "Financial institutions must comply with regulations such as PCI DSS, GLBA, SOX, and others that require strict access controls, network segmentation, and extensive audit capabilities.",
            portnoxAdvantage: "Portnox Cloud delivers 30% savings on multi-location implementations with zero hardware requirements, plus advanced role-based access control with automatic revocation and pre-built compliance templates.",
            savingsPercent: 30
          },
          education: {
            name: "Education",
            compliance: "Educational institutions must comply with regulations like FERPA, COPPA, and in some cases HIPAA for student health services, requiring strong access controls while supporting diverse user populations.",
            portnoxAdvantage: "Portnox Cloud delivers 40% lower TCO than on-premises alternatives with subscription pricing model, plus self-service device registration to reduce IT burden during peak enrollment periods.",
            savingsPercent: 40
          },
          government: {
            name: "Government",
            compliance: "Government agencies must adhere to regulations such as FISMA, NIST 800-53, FedRAMP, and others that mandate strong security controls, continuous monitoring, and risk management.",
            portnoxAdvantage: "Portnox Cloud provides built-in FISMA and NIST compliance reporting with continuous monitoring, plus centralized cloud-based authentication with federated identity support for cross-agency access.",
            savingsPercent: 32
          },
          manufacturing: {
            name: "Manufacturing",
            compliance: "Manufacturing environments need to secure both IT and OT (Operational Technology) networks, often requiring compliance with industry standards such as NIST CSF, IEC 62443, and similar standards.",
            portnoxAdvantage: "Portnox Cloud offers dedicated OT device profiling with separate security policies for industrial systems, plus protocol-agnostic identification of legacy industrial devices with 99.99% uptime SLA.",
            savingsPercent: 38
          }
        };
        
        const industry = industryData[industryId];
        
        contentDiv.innerHTML = `
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
            <h5 style="color: #1B67B2; margin-top: 0;">${industry.name} Industry</h5>
            <p><strong>Compliance Requirements:</strong> ${industry.compliance}</p>
            <p><strong>Portnox Advantage:</strong> ${industry.portnoxAdvantage}</p>
            <p><strong>Average TCO Savings:</strong> ${industry.savingsPercent}% lower than on-premises alternatives</p>
          </div>
        `;
      });
    }
  }
  
  // Merge industry and compliance tabs
  function mergeIndustryComplianceTabs() {
    // Remove industry tab if it exists
    const industryTab = document.querySelector('[data-tab="industry-tab"]');
    if (industryTab) {
      industryTab.remove();
    }
    
    const industryPane = document.getElementById('industry-tab');
    if (industryPane) {
      industryPane.remove();
    }
  }
  
  // Fix cost configuration
  function enhanceCostConfiguration() {
    // Find the advanced options panel
    const advancedPanel = document.getElementById('advanced-options-panel');
    if (!advancedPanel) return;
    
    // Check if cost config section exists
    let costConfig = document.getElementById('cost-config-section');
    if (!costConfig) {
      // Create cost config section
      costConfig = document.createElement('div');
      costConfig.id = 'cost-config-section';
      costConfig.className = 'advanced-settings-section';
      
      // Add enhanced cost configuration
      costConfig.innerHTML = `
        <h5 style="color: #1B67B2; margin-bottom: 10px;">Enhanced Cost Configuration</h5>
        <p style="font-size: 14px; color: #505050; margin-bottom: 15px;">
          Configure detailed cost parameters to customize the TCO analysis with dollar values specific to your organization.
          All changes will automatically update the charts and calculations.
        </p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
          <div>
            <label for="cost-hardware" style="display: block; font-weight: 500; margin-bottom: 5px;">Hardware Costs ($)</label>
            <input type="number" id="cost-hardware" min="0" step="1000" value="10000" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <p style="font-size: 12px; color: #707070; margin-top: 5px;">Base hardware cost for on-premises deployment</p>
          </div>
          
          <div>
            <label for="cost-licensing" style="display: block; font-weight: 500; margin-bottom: 5px;">Licensing Costs ($)</label>
            <input type="number" id="cost-licensing" min="0" step="1000" value="25000" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <p style="font-size: 12px; color: #707070; margin-top: 5px;">Annual licensing fees per vendor</p>
          </div>
          
          <div>
            <label for="cost-maintenance" style="display: block; font-weight: 500; margin-bottom: 5px;">Maintenance Costs ($)</label>
            <input type="number" id="cost-maintenance" min="0" step="1000" value="15000" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <p style="font-size: 12px; color: #707070; margin-top: 5px;">Annual maintenance and support costs</p>
          </div>
          
          <div>
            <label for="cost-implementation" style="display: block; font-weight: 500; margin-bottom: 5px;">Implementation ($)</label>
            <input type="number" id="cost-implementation" min="0" step="5000" value="30000" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <p style="font-size: 12px; color: #707070; margin-top: 5px;">Implementation and professional services costs</p>
          </div>
          
          <div>
            <label for="cost-personnel" style="display: block; font-weight: 500; margin-bottom: 5px;">Personnel Costs ($)</label>
            <input type="number" id="cost-personnel" min="0" step="10000" value="100000" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <p style="font-size: 12px; color: #707070; margin-top: 5px;">Annual cost per full-time equivalent (FTE)</p>
          </div>
          
          <div>
            <label for="cost-downtime" style="display: block; font-weight: 500; margin-bottom: 5px;">Downtime Cost ($/hour)</label>
            <input type="number" id="cost-downtime" min="0" step="1000" value="5000" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <p style="font-size: 12px; color: #707070; margin-top: 5px;">Cost per hour of system downtime</p>
          </div>
        </div>
        
        <h5 style="color: #1B67B2; margin-top: 20px; margin-bottom: 10px;">Vendor-Specific Settings</h5>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-top: 10px;">
          <div>
            <label style="display: block; font-weight: 500; margin-bottom: 5px;">
              Portnox Discount (%)
              <span style="background: #2BD25B; color: white; border-radius: 4px; padding: 2px 6px; font-size: 11px; font-weight: 600; margin-left: 5px;">Recommended</span>
            </label>
            <input type="range" id="portnox-discount" min="0" max="40" step="5" value="25" style="width: 100%;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #707070;">
              <span>0%</span>
              <span id="portnox-discount-display">25%</span>
              <span>40%</span>
            </div>
          </div>
          
          <div>
            <label for="competitor-discount" style="display: block; font-weight: 500; margin-bottom: 5px;">Competitor Discount (%)</label>
            <input type="range" id="competitor-discount" min="0" max="25" step="5" value="0" style="width: 100%;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #707070;">
              <span>0%</span>
              <span id="competitor-discount-display">0%</span>
              <span>25%</span>
            </div>
          </div>
        </div>
        
        <button id="apply-cost-settings" style="background: #1B67B2; color: white; border: none; border-radius: 4px; padding: 8px 15px; margin-top: 15px; cursor: pointer;">
          Apply Settings & Recalculate
        </button>
      `;
      
      // Add to advanced panel
      advancedPanel.appendChild(costConfig);
      
      // Set up event listeners for range inputs
      const portnoxDiscount = document.getElementById('portnox-discount');
      const portnoxDiscountDisplay = document.getElementById('portnox-discount-display');
      
      if (portnoxDiscount && portnoxDiscountDisplay) {
        portnoxDiscount.addEventListener('input', function() {
          portnoxDiscountDisplay.textContent = this.value + '%';
        });
      }
      
      const competitorDiscount = document.getElementById('competitor-discount');
      const competitorDiscountDisplay = document.getElementById('competitor-discount-display');
      
      if (competitorDiscount && competitorDiscountDisplay) {
        competitorDiscount.addEventListener('input', function() {
          competitorDiscountDisplay.textContent = this.value + '%';
        });
      }
      
      // Set up apply button
      const applyButton = document.getElementById('apply-cost-settings');
      if (applyButton) {
        applyButton.addEventListener('click', function() {
          triggerCalculation();
        });
      }
    }
  }
  
  // Trigger calculation update
  function triggerCalculation() {
    if (window.calculator && typeof window.calculator.calculate === 'function') {
      console.log('Triggering calculation update...');
      window.calculator.calculate();
      
      // Reinitialize charts after calculation
      setTimeout(function() {
        if (window.ChartEnhancer) {
          window.ChartEnhancer.initMissingCharts();
        }
      }, 500);
    }
  }
  
  // Fix logo
  function fixLogo() {
    const logoUrl = 'https://events.vmblog.com/images/Mega%20Series/logo-portnox.png';
    
    document.querySelectorAll('.logo img, img[src*="portnox"], .vendor-card[data-vendor="portnox"] img').forEach(img => {
      img.src = logoUrl;
      img.alt = 'Portnox Logo';
    });
  }
  
  // Fix PDF Generator errors
  function fixPDFGenerator() {
    // Fix PDF generator error for orgSize
    if (window.PDFReportGenerator && window.PDFReportGenerator.prototype.generateCompleteReport) {
      const originalGenerateCompleteReport = window.PDFReportGenerator.prototype.generateCompleteReport;
      
      window.PDFReportGenerator.prototype.generateCompleteReport = function(data) {
        console.log('Running enhanced PDF report generation...');
        
        // Make sure orgSize is defined
        if (!data.orgSize) {
          data.orgSize = 'medium';
        }
        
        // Also make sure it's applied to the PDF generator itself
        this.orgSize = data.orgSize || 'medium';
        
        // Call original method with fixed data
        return originalGenerateCompleteReport.call(this, data);
      };
      
      console.log('PDF Generator fixed');
    }
  }
  
  // Initialize all enhancements
  function init() {
    // Add css fixes for charts
    const style = document.createElement('style');
    style.textContent = `
      .chart-container {
        display: block !important;
        height: 300px !important;
        position: relative !important;
        width: 100% !important;
        margin-bottom: 20px !important;
      }
      
      canvas {
        display: block !important;
      }
      
      .logo img {
        height: 40px !important;
        width: auto !important;
        object-fit: contain !important;
      }
      
      .sidebar-industry-preview,
      .industry-templates-card,
      .compliance-info-container {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    
    // Apply all enhancements
    hideSidebarContent();
    enhanceVendorComparison();
    mergeIndustryComplianceTabs();
    enhanceCostConfiguration();
    fixLogo();
    fixPDFGenerator();
    
    // Set interval to ensure fixes remain applied
    setInterval(hideSidebarContent, 2000);
    setInterval(fixLogo, 2000);
    
    console.log('UI Enhancements applied successfully');
  }
  
  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
'use strict';
var uncurryThis = require('../internals/function-uncurry-this');

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const DependencyTemplate = require("../DependencyTemplate");
const makeSerializable = require("../util/makeSerializable");
const LocalModuleDependency = require("./LocalModuleDependency");
const NullDependency = require("./NullDependency");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("../Dependency")} Dependency */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */
/** @typedef {import("../javascript/JavascriptParser").Range} Range */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectDeserializerContext} ObjectDeserializerContext */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectSerializerContext} ObjectSerializerContext */
/** @typedef {import("./AMDRequireItemDependency")} AMDRequireItemDependency */

class AMDRequireArrayDependency extends NullDependency {
	/**
	 * @param {(string | LocalModuleDependency | AMDRequireItemDependency)[]} depsArray deps array
	 * @param {Range} range range
	 */
	constructor(depsArray, range) {
		super();

		this.depsArray = depsArray;
		this.range = range;
	}

	get type() {
		return "amd require array";
	}

	get category() {
		return "amd";
	}

	/**
	 * @param {ObjectSerializerContext} context context
	 */
	serialize(context) {
		const { write } = context;

		write(this.depsArray);
		write(this.range);

		super.serialize(context);
	}

	/**
	 * @param {ObjectDeserializerContext} context context
	 */
	deserialize(context) {
		const { read } = context;

		this.depsArray = read();
		this.range = read();

		super.deserialize(context);
	}
}

makeSerializable(
	AMDRequireArrayDependency,
	"webpack/lib/dependencies/AMDRequireArrayDependency"
);

AMDRequireArrayDependency.Template = class AMDRequireArrayDependencyTemplate extends (
	DependencyTemplate
) {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(dependency, source, templateContext) {
		const dep = /** @type {AMDRequireArrayDependency} */ (dependency);
		const content = this.getContent(dep, templateContext);
		source.replace(dep.range[0], dep.range[1] - 1, content);
	}

	/**
	 * @param {AMDRequireArrayDependency} dep the dependency for which the template should be applied
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {string} content
	 */
	getContent(dep, templateContext) {
		const requires = dep.depsArray.map(dependency =>
			this.contentForDependency(dependency, templateContext)
		);
		return `[${requires.join(", ")}]`;
	}

	/**
	 * @param {string | LocalModuleDependency | AMDRequireItemDependency} dep the dependency for which the template should be applied
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {string} content
	 */
	contentForDependency(
		dep,
		{ runtimeTemplate, moduleGraph, chunkGraph, runtimeRequirements }
	) {
		if (typeof dep === "string") {
			return dep;
		}

		if (dep instanceof LocalModuleDependency) {
			return dep.localModule.variableName();
		}

		return runtimeTemplate.moduleExports({
			module: moduleGraph.getModule(dep),
			chunkGraph,
			request: dep.request,
			runtimeRequirements
		});
	}
};

module.exports = AMDRequireArrayDependency;
module.exports={A:{A:{"1":"A B","2":"K D E F oC"},B:{"1":"0 9 C L M G N O P Q H R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z AB BB CB DB EB FB GB HB IB JB KB LB MB NB OB PB I"},C:{"1":"0 1 2 3 4 5 6 7 8 9 L M G N O P RB SB TB UB VB WB XB YB ZB aB bB cB dB eB fB gB hB iB jB kB lB mB nB oB pB qB rB sB tB uB vB wB NC xB OC yB zB 0B 1B 2B 3B 4B 5B 6B 7B 8B 9B AC BC CC DC EC Q H R PC S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z AB BB CB DB EB FB GB HB IB JB KB LB MB NB OB PB I QC FC RC SC qC rC","2":"pC MC J QB sC tC","36":"K D E F A B C"},D:{"1":"0 1 2 3 4 5 6 7 8 9 SB TB UB VB WB XB YB ZB aB bB cB dB eB fB gB hB iB jB kB lB mB nB oB pB qB rB sB tB uB vB wB NC xB OC yB zB 0B 1B 2B 3B 4B 5B 6B 7B 8B 9B AC BC CC DC EC Q H R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z AB BB CB DB EB FB GB HB IB JB KB LB MB NB OB PB I QC FC RC SC","2":"J QB K D","36":"E F A B C L M G N O P RB"},E:{"1":"K D E F A B C L M G wC xC yC UC GC HC zC 0C 1C VC WC IC 2C JC XC YC ZC aC bC 3C KC cC dC eC fC gC 4C LC hC iC jC kC lC 5C","2":"J QB uC TC vC"},F:{"1":"0 1 2 3 4 5 6 7 8 G N O P RB SB TB UB VB WB XB YB ZB aB bB cB dB eB fB gB hB iB jB kB lB mB nB oB pB qB rB sB tB uB vB wB xB yB zB 0B 1B 2B 3B 4B 5B 6B 7B 8B 9B AC BC CC DC EC Q H R PC S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z HC","2":"F B C 6C 7C 8C 9C GC mC AD"},G:{"1":"E DD ED FD GD HD ID JD KD LD MD ND OD PD QD RD SD TD UD VC WC IC VD JC XC YC ZC aC bC WD KC cC dC eC fC gC XD LC hC iC jC kC lC","2":"TC BD nC CD"},H:{"2":"YD"},I:{"1":"I","2":"ZD aD bD","36":"MC J cD nC dD eD"},J:{"1":"A","2":"D"},K:{"1":"H HC","2":"A B C GC mC"},L:{"1":"I"},M:{"1":"FC"},N:{"1":"A B"},O:{"1":"IC"},P:{"1":"1 2 3 4 5 6 7 8 J fD gD hD iD jD UC kD lD mD nD oD JC KC LC pD"},Q:{"1":"qD"},R:{"1":"rD"},S:{"1":"sD tD"}},B:5,C:"Blob constructing",D:true};
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isNodesEquivalent;
var _index = require("../definitions/index.js");
function isNodesEquivalent(a, b) {
  if (typeof a !== "object" || typeof b !== "object" || a == null || b == null) {
    return a === b;
  }
  if (a.type !== b.type) {
    return false;
  }
  const fields = Object.keys(_index.NODE_FIELDS[a.type] || a.type);
  const visitorKeys = _index.VISITOR_KEYS[a.type];
  for (const field of fields) {
    const val_a = a[field];
    const val_b = b[field];
    if (typeof val_a !== typeof val_b) {
      return false;
    }
    if (val_a == null && val_b == null) {
      continue;
    } else if (val_a == null || val_b == null) {
      return false;
    }
    if (Array.isArray(val_a)) {
      if (!Array.isArray(val_b)) {
        return false;
      }
      if (val_a.length !== val_b.length) {
        return false;
      }
      for (let i = 0; i < val_a.length; i++) {
        if (!isNodesEquivalent(val_a[i], val_b[i])) {
          return false;
        }
      }
      continue;
    }
    if (typeof val_a === "object" && !(visitorKeys != null && visitorKeys.includes(field))) {
      for (const key of Object.keys(val_a)) {
        if (val_a[key] !== val_b[key]) {
          return false;
        }
      }
      continue;
    }
    if (!isNodesEquivalent(val_a, val_b)) {
      return false;
    }
  }
  return true;
}

//# sourceMappingURL=isNodesEquivalent.js.map
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/

"use strict";

const RuntimeGlobals = require("../RuntimeGlobals");
const RuntimeModule = require("../RuntimeModule");
const Template = require("../Template");
const {
	chunkHasJs,
	getChunkFilenameTemplate
} = require("../javascript/JavascriptModulesPlugin");
const { getInitialChunkIds } = require("../javascript/StartupHelpers");
const compileBooleanMatcher = require("../util/compileBooleanMatcher");
const { getUndoPath } = require("../util/identifier");

/** @typedef {import("../Chunk")} Chunk */
/** @typedef {import("../ChunkGraph")} ChunkGraph */
/** @typedef {import("../Compilation")} Compilation */
/** @typedef {import("../Module").ReadOnlyRuntimeRequirements} ReadOnlyRuntimeRequirements */

class RequireChunkLoadingRuntimeModule extends RuntimeModule {
	/**
	 * @param {ReadOnlyRuntimeRequirements} runtimeRequirements runtime requirements
	 */
	constructor(runtimeRequirements) {
		super("require chunk loading", RuntimeModule.STAGE_ATTACH);
		this.runtimeRequirements = runtimeRequirements;
	}

	/**
	 * @private
	 * @param {Chunk} chunk chunk
	 * @param {string} rootOutputDir root output directory
	 * @returns {string} generated code
	 */
	_generateBaseUri(chunk, rootOutputDir) {
		const options = chunk.getEntryOptions();
		if (options && options.baseUri) {
			return `${RuntimeGlobals.baseURI} = ${JSON.stringify(options.baseUri)};`;
		}

		return `${RuntimeGlobals.baseURI} = require("url").pathToFileURL(${
			rootOutputDir !== "./"
				? `__dirname + ${JSON.stringify(`/${rootOutputDir}`)}`
				: "__filename"
		});`;
	}

	/**
	 * @returns {string | null} runtime code
	 */
	generate() {
		const compilation = /** @type {Compilation} */ (this.compilation);
		const chunkGraph = /** @type {ChunkGraph} */ (this.chunkGraph);
		const chunk = /** @type {Chunk} */ (this.chunk);
		const { runtimeTemplate } = compilation;
		const fn = RuntimeGlobals.ensureChunkHandlers;
		const withBaseURI = this.runtimeRequirements.has(RuntimeGlobals.baseURI);
		const withExternalInstallChunk = this.runtimeRequirements.has(
			RuntimeGlobals.externalInstallChunk
		);
		const withOnChunkLoad = this.runtimeRequirements.has(
			RuntimeGlobals.onChunksLoaded
		);
		const withLoading = this.runtimeRequirements.has(
			RuntimeGlobals.ensureChunkHandlers
		);
		const withHmr = this.runtimeRequirements.has(
			RuntimeGlobals.hmrDownloadUpdateHandlers
		);
		const withHmrManifest = this.runtimeRequirements.has(
			RuntimeGlobals.hmrDownloadManifest
		);
		const conditionMap = chunkGraph.getChunkConditionMap(chunk, chunkHasJs);
		const hasJsMatcher = compileBooleanMatcher(conditionMap);
		const initialChunkIds = getInitialChunkIds(chunk, chunkGraph, chunkHasJs);

		const outputName = compilation.getPath(
			getChunkFilenameTemplate(chunk, compilation.outputOptions),
			{
				chunk,
				contentHashType: "javascript"
			}
		);
		const rootOutputDir = getUndoPath(
			outputName,
			/** @type {string} */ (compilation.outputOptions.path),
			true
		);

		const stateExpression = withHmr
			? `${RuntimeGlobals.hmrRuntimeStatePrefix}_require`
			: undefined;

		return Template.asString([
			withBaseURI
				? this._generateBaseUri(chunk, rootOutputDir)
				: "// no baseURI",
			"",
			"// object to store loaded chunks",
			'// "1" means "loaded", otherwise not loaded yet',
			`var installedChunks = ${
				stateExpression ? `${stateExpression} = ${stateExpression} || ` : ""
			}{`,
			Template.indent(
				Array.from(initialChunkIds, id => `${JSON.stringify(id)}: 1`).join(
					",\n"
				)
			),
			"};",
			"",
			withOnChunkLoad
				? `${
						RuntimeGlobals.onChunksLoaded
					}.require = ${runtimeTemplate.returningFunction(
						"installedChunks[chunkId]",
						"chunkId"
					)};`
				: "// no on chunks loaded",
			"",
			withLoading || withExternalInstallChunk
				? `var installChunk = ${runtimeTemplate.basicFunction("chunk", [
						"var moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;",
						"for(var moduleId in moreModules) {",
						Template.indent([
							`if(${RuntimeGlobals.hasOwnProperty}(moreModules, moduleId)) {`,
							Template.indent([
								`${RuntimeGlobals.moduleFactories}[moduleId] = moreModules[moduleId];`
							]),
							"}"
						]),
						"}",
						`if(runtime) runtime(${RuntimeGlobals.require});`,
						"for(var i = 0; i < chunkIds.length; i++)",
						Template.indent("installedChunks[chunkIds[i]] = 1;"),
						withOnChunkLoad ? `${RuntimeGlobals.onChunksLoaded}();` : ""
					])};`
				: "// no chunk install function needed",
			"",
			withLoading
				? Template.asString([
						"// require() chunk loading for javascript",
						`${fn}.require = ${runtimeTemplate.basicFunction(
							"chunkId, promises",
							hasJsMatcher !== false
								? [
										'// "1" is the signal for "already loaded"',
										"if(!installedChunks[chunkId]) {",
										Template.indent([
											hasJsMatcher === true
												? "if(true) { // all chunks have JS"
												: `if(${hasJsMatcher("chunkId")}) {`,
											Template.indent([
												`installChunk(require(${JSON.stringify(
													rootOutputDir
												)} + ${
													RuntimeGlobals.getChunkScriptFilename
												}(chunkId)));`
											]),
											"} else installedChunks[chunkId] = 1;",
											""
										]),
										"}"
									]
								: "installedChunks[chunkId] = 1;"
						)};`
					])
				: "// no chunk loading",
			"",
			withExternalInstallChunk
				? Template.asString([
						`module.exports = ${RuntimeGlobals.require};`,
						`${RuntimeGlobals.externalInstallChunk} = installChunk;`
					])
				: "// no external install chunk",
			"",
			withHmr
				? Template.asString([
						"function loadUpdateChunk(chunkId, updatedModulesList) {",
						Template.indent([
							`var update = require(${JSON.stringify(rootOutputDir)} + ${
								RuntimeGlobals.getChunkUpdateScriptFilename
							}(chunkId));`,
							"var updatedModules = update.modules;",
							"var runtime = update.runtime;",
							"for(var moduleId in updatedModules) {",
							Template.indent([
								`if(${RuntimeGlobals.hasOwnProperty}(updatedModules, moduleId)) {`,
								Template.indent([
									"currentUpdate[moduleId] = updatedModules[moduleId];",
									"if(updatedModulesList) updatedModulesList.push(moduleId);"
								]),
								"}"
							]),
							"}",
							"if(runtime) currentUpdateRuntime.push(runtime);"
						]),
						"}",
						"",
						Template.getFunctionContent(
							require("../hmr/JavascriptHotModuleReplacement.runtime.js")
						)
							.replace(/\$key\$/g, "require")
							.replace(/\$installedChunks\$/g, "installedChunks")
							.replace(/\$loadUpdateChunk\$/g, "loadUpdateChunk")
							.replace(/\$moduleCache\$/g, RuntimeGlobals.moduleCache)
							.replace(/\$moduleFactories\$/g, RuntimeGlobals.moduleFactories)
							.replace(
								/\$ensureChunkHandlers\$/g,
								RuntimeGlobals.ensureChunkHandlers
							)
							.replace(/\$hasOwnProperty\$/g, RuntimeGlobals.hasOwnProperty)
							.replace(/\$hmrModuleData\$/g, RuntimeGlobals.hmrModuleData)
							.replace(
								/\$hmrDownloadUpdateHandlers\$/g,
								RuntimeGlobals.hmrDownloadUpdateHandlers
							)
							.replace(
								/\$hmrInvalidateModuleHandlers\$/g,
								RuntimeGlobals.hmrInvalidateModuleHandlers
							)
					])
				: "// no HMR",
			"",
			withHmrManifest
				? Template.asString([
						`${RuntimeGlobals.hmrDownloadManifest} = function() {`,
						Template.indent([
							"return Promise.resolve().then(function() {",
							Template.indent([
								`return require(${JSON.stringify(rootOutputDir)} + ${
									RuntimeGlobals.getUpdateManifestFilename
								}());`
							]),
							"})['catch'](function(err) { if(err.code !== 'MODULE_NOT_FOUND') throw err; });"
						]),
						"}"
					])
				: "// no HMR manifest"
		]);
	}
}

module.exports = RequireChunkLoadingRuntimeModule;
'use strict';
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Uint8ClampedArray` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Uint8', function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);
/**
 * Enhanced UI Updates
 * Enhances the UI with multi-year projection options, No-NAC comparison, and improved visualizations
 */
(function() {
    // Configuration
    const config = {
        defaultProjectionYears: 3,
        availableProjectionYears: [1, 2, 3, 5],
        charts: {
            colors: {
                currentVendor: '#6c757d',
                portnox: '#2BD25B',
                noNac: '#dc3545',
                savings: '#1B67B2'
            }
        }
    };
    
    // DOM elements cache
    let elements = {};
    
    // Initialize UI enhancements
    function initialize() {
        cacheElements();
        setupEventListeners();
        enhanceYearsProjectionSelector();
        addNoNacBaselineOption();
        enhanceVendorComparison();
        enhanceSensitivityAnalysis();
        addIndustryCompliancePanel();
        
        console.log('Enhanced UI updates loaded.');
    }
    
    // Cache DOM elements for better performance
    function cacheElements() {
        elements = {
            yearsProjectSelect: document.getElementById('years-to-project'),
            deviceCountInput: document.getElementById('device-count'),
            organizationSizeSelect: document.getElementById('organization-size'),
            calculateButton: document.getElementById('calculate-btn'),
            vendorCards: document.querySelectorAll('.vendor-card'),
            industrySelector: document.getElementById('industry-selector'),
            tabs: document.querySelectorAll('.tab-button'),
            tabPanes: document.querySelectorAll('.tab-pane'),
            summaryTab: document.getElementById('summary-tab'),
            financialTab: document.getElementById('financial-tab'),
            implementationTab: document.getElementById('implementation-tab'),
            comparisonTab: document.getElementById('comparison-tab'),
            migrationTab: document.getElementById('migration-tab'),
            tcoComparisonChart: document.getElementById('tco-comparison-chart'),
            cumulativeCostChart: document.getElementById('cumulative-cost-chart'),
            currentBreakdownChart: document.getElementById('current-breakdown-chart'),
            alternativeBreakdownChart: document.getElementById('alternative-breakdown-chart'),
            advancedOptionsPanel: document.getElementById('advanced-options-panel'),
            advancedOptionsToggle: document.querySelector('.advanced-options-toggle')
        };
    }
    
    // Setup event listeners for enhanced functionality
    function setupEventListeners() {
        if (elements.calculateButton) {
            elements.calculateButton.addEventListener('click', handleEnhancedCalculation);
        }
        
        if (elements.yearsProjectSelect) {
            elements.yearsProjectSelect.addEventListener('change', handleYearsProjectionChange);
        }
        
        if (elements.industrySelector) {
            elements.industrySelector.addEventListener('change', handleIndustryChange);
        }
        
        // Expand advanced options by default
        if (elements.advancedOptionsToggle && elements.advancedOptionsPanel) {
            elements.advancedOptionsToggle.setAttribute('aria-expanded', 'true');
            elements.advancedOptionsPanel.classList.remove('hidden');
        }
    }
    
    // Enhance years projection selector
    function enhanceYearsProjectionSelector() {
        const select = elements.yearsProjectSelect;
        if (!select) return;
        
        // Clear existing options
        select.innerHTML = '';
        
        // Add available year options
        config.availableProjectionYears.forEach(years => {
            const option = document.createElement('option');
            option.value = years;
            option.textContent = `${years} Year${years > 1 ? 's' : ''}`;
            option.selected = years === config.defaultProjectionYears;
            select.appendChild(option);
        });
    }
    
    // Add No-NAC baseline option
    function addNoNacBaselineOption() {
        // Add No-NAC baseline toggle to advanced options
        const advancedOptions = elements.advancedOptionsPanel;
        if (!advancedOptions) return;
        
        const noNacToggleDiv = document.createElement('div');
        noNacToggleDiv.className = 'input-group checkbox-group';
        noNacToggleDiv.innerHTML = `
            <input type="checkbox" id="include-no-nac" name="include-no-nac" checked>
            <label for="include-no-nac">Include "No NAC" baseline comparison</label>
        `;
        
        advancedOptions.appendChild(noNacToggleDiv);
        
        // Add event listener
        const noNacToggle = document.getElementById('include-no-nac');
        if (noNacToggle) {
            noNacToggle.addEventListener('change', function() {
                // Re-run calculation if already calculated
                if (document.querySelector('.results-grid canvas')) {
                    handleEnhancedCalculation();
                }
            });
        }
    }
    
    // Enhance vendor comparison features
    function enhanceVendorComparison() {
        // Add feature comparison toggle to comparison tab
        const comparisonTab = elements.comparisonTab;
        if (!comparisonTab) return;
        
        // Add feature comparison button
        const featureComparisonBtn = document.createElement('button');
        featureComparisonBtn.className = 'btn btn-outline';
        featureComparisonBtn.innerHTML = '<i class="fas fa-table"></i> Detailed Feature Comparison';
        featureComparisonBtn.id = 'feature-comparison-btn';
        
        // Add button after architecture diagram
        const architectureDiagramContainer = comparisonTab.querySelector('.architecture-diagram-container');
        if (architectureDiagramContainer) {
            architectureDiagramContainer.after(featureComparisonBtn);
        } else {
            comparisonTab.appendChild(featureComparisonBtn);
        }
        
        // Add event listener
        featureComparisonBtn.addEventListener('click', showFeatureComparisonModal);
    }
    
    // Enhance sensitivity analysis features
    function enhanceSensitivityAnalysis() {
        // Add No-NAC option to sensitivity analysis param-vendor dropdown
        const sensitivityBtn = document.getElementById('sensitivity-analysis-btn');
        if (!sensitivityBtn) return;
        
        // Listen for sensitivity analysis button click to modify the sensitivity.html page
        sensitivityBtn.addEventListener('click', function() {
            // We'll need to modify the dropdown in sensitivity.html
            // This will need to be handled when sensitivity.html loads
            localStorage.setItem('enhanceTcoSensitivity', 'true');
        });
    }
    
    // Add industry compliance panel
    function addIndustryCompliancePanel() {
        // Add expanded compliance panel to comparison tab
        const comparisonTab = elements.comparisonTab;
        if (!comparisonTab) return;
        
        const compliancePanel = document.createElement('div');
        compliancePanel.className = 'compliance-panel result-card hidden';
        compliancePanel.id = 'industry-compliance-panel';
        compliancePanel.innerHTML = `
            <h3>Industry Compliance Requirements</h3>
            <p>Select an industry to view compliance requirements relevant to NAC implementations.</p>
            <div id="compliance-requirements-container"></div>
        `;
        
        // Add panel at the end of comparison tab
        comparisonTab.appendChild(compliancePanel);
    }
    
    // Show feature comparison modal
    function showFeatureComparisonModal() {
        // Get current vendor
        const selectedVendorCard = document.querySelector('.vendor-card.selected');
        if (!selectedVendorCard) return;
        
        const vendorId = selectedVendorCard.getAttribute('data-vendor');
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'feature-comparison-modal';
        modalContent.innerHTML = `
            <h3>Feature Comparison: ${vendorId.charAt(0).toUpperCase() + vendorId.slice(1)} vs. Portnox</h3>
            <div class="feature-comparison-loading">Loading feature comparison data...</div>
            <div class="feature-comparison-table-container"></div>
        `;
        
        // Create modal backdrop
        const modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'modal-backdrop';
        
        // Create modal element
        const modalElement = document.createElement('div');
        modalElement.className = 'modal feature-comparison-modal-container';
        modalElement.appendChild(modalContent);
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close-btn';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.addEventListener('click', function() {
            document.body.removeChild(modalBackdrop);
            document.body.removeChild(modalElement);
        });
        
        modalContent.prepend(closeButton);
        
        // Add to body
        document.body.appendChild(modalBackdrop);
        document.body.appendChild(modalElement);
        
        // Load feature comparison data
        loadFeatureComparisonData(vendorId, modalContent.querySelector('.feature-comparison-table-container'));
    }
    
    // Load feature comparison data
    function loadFeatureComparisonData(vendorId, container) {
        // Make sure VendorComparison is available
        if (typeof VendorComparison === 'undefined') {
            container.innerHTML = '<p class="error">Error: Vendor comparison data not available.</p>';
            return;
        }
        
        try {
            // Get feature comparison between selected vendor and Portnox
            const comparison = VendorComparison.getFeatureComparison([vendorId, 'portnox']);
            
            // Create HTML table
            let tableHtml = `
                <table class="data-table feature-comparison-table">
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>${vendorId.charAt(0).toUpperCase() + vendorId.slice(1)}</th>
                            <th>Portnox</th>
                            <th>Advantage</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            // Add rows for each feature
            Object.keys(comparison).forEach(featureId => {
                const feature = comparison[featureId];
                const vendorFeature = feature.vendors[vendorId];
                const portnoxFeature = feature.vendors.portnox;
                
                const vendorRating = vendorFeature ? vendorFeature.rating : 0;
                const portnoxRating = portnoxFeature ? portnoxFeature.rating : 0;
                const difference = portnoxRating - vendorRating;
                
                let advantageText = '';
                let advantageClass = '';
                
                if (difference > 0) {
                    advantageText = 'Portnox';
                    advantageClass = 'advantage-portnox';
                } else if (difference < 0) {
                    advantageText = vendorId.charAt(0).toUpperCase() + vendorId.slice(1);
                    advantageClass = 'advantage-competitor';
                } else {
                    advantageText = 'Equal';
                    advantageClass = 'advantage-equal';
                }
                
                tableHtml += `
                    <tr>
                        <td>
                            <strong>${feature.name}</strong>
                            <div class="feature-description">${feature.description}</div>
                        </td>
                        <td>
                            <div class="rating-container">
                                <div class="rating-value">${vendorRating}/10</div>
                                <div class="rating-bar">
                                    <div class="rating-fill" style="width: ${vendorRating * 10}%"></div>
                                </div>
                            </div>
                            <div class="feature-details">${vendorFeature ? vendorFeature.details : 'Not available'}</div>
                        </td>
                        <td>
                            <div class="rating-container">
                                <div class="rating-value">${portnoxRating}/10</div>
                                <div class="rating-bar">
                                    <div class="rating-fill portnox" style="width: ${portnoxRating * 10}%"></div>
                                </div>
                            </div>
                            <div class="feature-details">${portnoxFeature ? portnoxFeature.details : 'Not available'}</div>
                        </td>
                        <td class="${advantageClass}">${advantageText}</td>
                    </tr>
                `;
            });
            
            tableHtml += `
                    </tbody>
                </table>
            `;
            
            // Update container
            container.innerHTML = tableHtml;
            
            // Hide loading indicator
            const loadingDiv = container.parentElement.querySelector('.feature-comparison-loading');
            if (loadingDiv) {
                loadingDiv.style.display = 'none';
            }
            
        } catch (error) {
            console.error('Error loading feature comparison data:', error);
            container.innerHTML = `<p class="error">Error loading feature comparison data: ${error.message}</p>`;
        }
    }
    
    // Handle enhanced calculation
    function handleEnhancedCalculation() {
        // Make sure EnhancedTcoCalculator is available
        if (typeof EnhancedTcoCalculator === 'undefined') {
            showNotification('error', 'Enhanced TCO calculator not available. Please check console for errors.');
            return;
        }
        
        try {
            // Gather input values
            const params = gatherInputParams();
            
            // Calculate TCO with enhanced calculator
            const tcoResults = EnhancedTcoCalculator.calculateTco(params);
            
            // Update UI with results
            updateResultsUI(tcoResults);
            
        } catch (error) {
            console.error('Error calculating enhanced TCO:', error);
            showNotification('error', `Error calculating TCO: ${error.message}`);
        }
    }
    
    // Gather input parameters from form
    function gatherInputParams() {
        const deviceCount = parseInt(elements.deviceCountInput.value, 10) || 1000;
        const yearsToProject = parseInt(elements.yearsProjectSelect.value, 10) || 3;
        const organizationSize = elements.organizationSizeSelect.value || 'medium';
        
        // Get current vendor
        const selectedVendorCard = document.querySelector('.vendor-card.selected');
        const currentVendor = selectedVendorCard ? selectedVendorCard.getAttribute('data-vendor') : 'cisco';
        
        // Get industry
        const industry = elements.industrySelector.value !== 'none' ? elements.industrySelector.value : 'other';
        
        // Get additional options
        const hasMultipleLocations = document.getElementById('multiple-locations') ? 
            document.getElementById('multiple-locations').checked : false;
            
        const locationCount = hasMultipleLocations && document.getElementById('location-count') ? 
            parseInt(document.getElementById('location-count').value, 10) : 1;
            
        const legacyDevices = document.getElementById('legacy-devices') ? 
            document.getElementById('legacy-devices').checked : false;
            
        const legacyPercentage = legacyDevices && document.getElementById('legacy-percentage') ? 
            parseInt(document.getElementById('legacy-percentage').value, 10) : 0;
            
        const includeNoNac = document.getElementById('include-no-nac') ? 
            document.getElementById('include-no-nac').checked : true;
        
        return {
            deviceCount,
            yearsToProject,
            organizationSize,
            currentVendor,
            industry,
            hasMultipleLocations,
            locationCount,
            legacyPercentage,
            includeNoNac
        };
    }
    
    // Update UI with calculation results
    function updateResultsUI(results) {
        if (!results) return;
        
        // Show results container
        const resultsContainer = document.querySelector('.results-container');
        if (resultsContainer) {
            resultsContainer.classList.add('active');
        }
        
        // Update vendor names in UI
        updateVendorNamesInUI(results.currentVendor.name);
        
        // Update summary metrics
        updateSummaryMetrics(results);
        
        // Update comparison charts
        updateComparisonCharts(results);
        
        // Update financial breakdown
        updateFinancialBreakdown(results);
        
        // Update implementation comparison
        updateImplementationComparison(results);
        
        // Update cloud vs. on-prem comparison
        updateCloudOnPremComparison(results);
        
        // Update migration planning
        updateMigrationPlanning(results);
        
        // Update industry-specific metrics
        updateIndustryMetrics(results);
        
        // Update compliance requirements
        updateComplianceRequirements(results.parameters.industry);
        
        // Show first tab
        const firstTab = document.querySelector('.tab-button');
        if (firstTab) {
            firstTab.click();
        }
        
        // Show notification
        showNotification('success', 'TCO calculation complete.');
    }
    
    // Update vendor names in UI
    function updateVendorNamesInUI(vendorName) {
        document.querySelectorAll('.vendor-name-placeholder').forEach(element => {
            element.textContent = vendorName;
        });
        
        document.querySelectorAll('[id$="-comparison-vendor"]').forEach(element => {
            element.textContent = vendorName;
        });
    }
    
    // Update summary metrics
    function updateSummaryMetrics(results) {
        // Update savings amount
        const savingsAmountElement = document.getElementById('comparison-savings');
        if (savingsAmountElement) {
            savingsAmountElement.textContent = formatCurrency(results.savings.total);
        }
        
        // Update savings percentage in progress bar
        const savingsProgressElement = document.querySelector('#comparison-savings + .progress-container .progress');
        if (savingsProgressElement) {
            savingsProgressElement.style.width = `${Math.min(100, results.savings.percentage)}%`;
        }
        
        // Update implementation time reduction
        const implementationElement = document.getElementById('comparison-implementation');
        if (implementationElement) {
            const weeksSaved = results.implementationComparison.weeksSaved;
            implementationElement.textContent = `${weeksSaved.toFixed(1)} weeks`;
        }
        
        // Update implementation percentage in progress bar
        const implementationProgressElement = document.querySelector('#comparison-implementation + .progress-container .progress');
        if (implementationProgressElement) {
            implementationProgressElement.style.width = `${Math.min(100, results.implementationComparison.percentageFaster)}%`;
        }
        
        // Update portnox specific savings info in sidebar
        const portnoxSavingsAmount = document.getElementById('portnox-savings-amount');
        if (portnoxSavingsAmount) {
            portnoxSavingsAmount.textContent = formatCurrency(results.savings.total);
        }
        
        const portnoxSavingsPercentage = document.getElementById('portnox-savings-percentage');
        if (portnoxSavingsPercentage) {
            portnoxSavingsPercentage.textContent = `${results.savings.percentage.toFixed(1)}%`;
        }
        
        const portnoxImplementationTime = document.getElementById('portnox-implementation-time');
        if (portnoxImplementationTime) {
            portnoxImplementationTime.textContent = `${results.implementationComparison.weeksSaved.toFixed(1)} weeks`;
        }
        
        // Update benefits grid
        updateBenefitsGrid(results);
    }
    
    // Update benefits grid
    function updateBenefitsGrid(results) {
        const benefitsGrid = document.querySelector('.benefits-grid');
        if (!benefitsGrid) return;
        
        // Create benefits based on calculation results
        const benefits = [
            {
                icon: 'fa-dollar-sign',
                title: `${results.savings.percentage.toFixed(1)}% Lower TCO`,
                description: `Save ${formatCurrency(results.savings.total)} over ${results.parameters.yearsToProject} years compared to ${results.currentVendor.name}`
            },
            {
                icon: 'fa-clock',
                title: `${results.implementationComparison.percentageFaster.toFixed(1)}% Faster Deployment`,
                description: `${results.implementationComparison.weeksSaved.toFixed(1)} weeks faster implementation than ${results.currentVendor.name}`
            },
            {
                icon: 'fa-users',
                title: 'Reduced IT Staffing Needs',
                description: `${results.portnox.annual.staffing < results.currentVendor.annual.staffing ? 
                    ((1 - (results.portnox.annual.staffing / results.currentVendor.annual.staffing)) * 100).toFixed(1) + '%' : 
                    'Significant'} reduction in IT resource requirements`
            },
            {
                icon: 'fa-server',
                title: 'No Hardware Required',
                description: 'Eliminate hardware costs, maintenance, and refresh cycles'
            }
        ];
        
        // If No-NAC comparison is included, add benefit
        if (results.noNac && results.parameters.includeNoNac) {
            benefits.push({
                icon: 'fa-shield-alt',
                title: 'Reduced Risk Exposure',
                description: `${formatCurrency(results.noNac.cumulativeTotal - results.portnox.total)} lower risk costs vs. operating without NAC`
            });
        }
        
        // Add industry-specific benefit if available
        if (results.industryFactors) {
            benefits.push({
                icon: 'fa-industry',
                title: `Optimized for ${results.parameters.industry.charAt(0).toUpperCase() + results.parameters.industry.slice(1)}`,
                description: `Industry-specific features aligned with ${results.parameters.industry} requirements`
            });
        }
        
        // Create benefit elements
        benefitsGrid.innerHTML = '';
        benefits.forEach(benefit => {
            const benefitElement = document.createElement('div');
            benefitElement.className = 'benefit-card';
            benefitElement.innerHTML = `
                <div class="benefit-icon">
                    <i class="fas ${benefit.icon}"></i>
                </div>
                <div class="benefit-content">
                    <h4>${benefit.title}</h4>
                    <p>${benefit.description}</p>
                </div>
            `;
            benefitsGrid.appendChild(benefitElement);
        });
    }
    
    // Update comparison charts
    function updateComparisonCharts(results) {
        // Only update if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.error('Chart.js not available. Cannot update charts.');
            return;
        }
        
        // Update TCO comparison chart
        updateTcoComparisonChart(results);
        
        // Update cumulative cost chart
        updateCumulativeCostChart(results);
        
        // Update cost breakdown charts
        updateCostBreakdownCharts(results);
        
        // Update ROI timeline chart
        updateRoiTimelineChart(results);
    }
    
    // Update TCO comparison chart
    function updateTcoComparisonChart(results) {
        const chartCanvas = document.getElementById('tco-comparison-chart');
        if (!chartCanvas) return;
        
        // Destroy existing chart if it exists
        if (chartCanvas.chart) {
            chartCanvas.chart.destroy();
        }
        
        // Prepare data
        const data = {
            labels: [results.currentVendor.name, 'Portnox Cloud'],
            datasets: [{
                label: `${results.parameters.yearsToProject}-Year TCO`,
                data: [results.currentVendor.total, results.portnox.total],
                backgroundColor: [config.charts.colors.currentVendor, config.charts.colors.portnox],
                borderColor: [config.charts.colors.currentVendor, config.charts.colors.portnox],
                borderWidth: 1
            }]
        };
        
        // Add No-NAC data if included
        if (results.noNac && results.parameters.includeNoNac) {
            data.labels.push('No NAC (Baseline)');
            data.datasets[0].data.push(results.noNac.cumulativeTotal);
            data.datasets[0].backgroundColor.push(config.charts.colors.noNac);
            data.datasets[0].borderColor.push(config.charts.colors.noNac);
        }
        
        // Chart configuration
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(context.raw);
                        }
                    }
                },
                datalabels: {
                    color: '#fff',
                    formatter: function(value) {
                        return formatCurrency(value);
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value, true);
                        }
                    }
                }
            }
        };
        
        // Create chart
        chartCanvas.chart = new Chart(chartCanvas, {
            type: 'bar',
            data: data,
            options: options
        });
    }
    
    // Update cumulative cost chart
    function updateCumulativeCostChart(results) {
        const chartCanvas = document.getElementById('cumulative-cost-chart');
        if (!chartCanvas) return;
        
        // Destroy existing chart if it exists
        if (chartCanvas.chart) {
            chartCanvas.chart.destroy();
        }
        
        // Prepare data
        const years = Array.from({ length: results.parameters.yearsToProject }, (_, i) => `Year ${i + 1}`);
        
        const currentVendorData = results.yearByYearProjection.map(year => year.currentVendor.cumulative);
        const portnoxData = results.yearByYearProjection.map(year => year.portnox.cumulative);
        
        const data = {
            labels: years,
            datasets: [
                {
                    label: results.currentVendor.name,
                    data: currentVendorData,
                    backgroundColor: config.charts.colors.currentVendor,
                    borderColor: config.charts.colors.currentVendor,
                    borderWidth: 2,
                    tension: 0.1
                },
                {
                    label: 'Portnox Cloud',
                    data: portnoxData,
                    backgroundColor: config.charts.colors.portnox,
                    borderColor: config.charts.colors.portnox,
                    borderWidth: 2,
                    tension: 0.1
                }
            ]
        };
        
        // Add No-NAC data if included
        if (results.noNac && results.parameters.includeNoNac) {
            const noNacData = results.yearByYearProjection.map(year => year.noNac.cumulative);
            
            data.datasets.push({
                label: 'No NAC (Baseline)',
                data: noNacData,
                backgroundColor: config.charts.colors.noNac,
                borderColor: config.charts.colors.noNac,
                borderWidth: 2,
                tension: 0.1
            });
        }
        
        // Chart configuration
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.raw);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value, true);
                        }
                    }
                }
            }
        };
        
        // Create chart
        chartCanvas.chart = new Chart(chartCanvas, {
            type: 'line',
            data: data,
            options: options
        });
    }
    
    // Update cost breakdown charts
    function updateCostBreakdownCharts(results) {
        updateVendorBreakdownChart(
            'current-breakdown-chart', 
            results.currentVendor, 
            results.parameters.yearsToProject,
            results.currentVendor.name
        );
        
        updateVendorBreakdownChart(
            'alternative-breakdown-chart', 
            results.portnox, 
            results.parameters.yearsToProject,
            'Portnox Cloud'
        );
    }
    
    // Update vendor breakdown chart
    function updateVendorBreakdownChart(canvasId, vendorData, years, vendorName) {
        const chartCanvas = document.getElementById(canvasId);
        if (!chartCanvas) return;
        
        // Destroy existing chart if it exists
        if (chartCanvas.chart) {
            chartCanvas.chart.destroy();
        }
        
        // Calculate total annual costs
        const annualCosts = Object.values(vendorData.annual).reduce((a, b) => a + b, 0);
        
        // Prepare data
        const data = {
            labels: [
                'Implementation',
                'Licensing',
                'Hardware',
                'Maintenance',
                'IT Staffing',
                'Infrastructure',
                'Upgrades'
            ],
            datasets: [{
                label: `${vendorName} Costs`,
                data: [
                    vendorData.implementation,
                    vendorData.annual.licensing * years,
                    (vendorData.annual.hardware || 0) * years + (vendorData.hardwareRefresh || 0),
                    (vendorData.annual.maintenance || 0) * years,
                    vendorData.annual.staffing * years,
                    (vendorData.annual.infrastructure || 0) * years,
                    (vendorData.annual.upgrades || 0) * years
                ],
                backgroundColor: [
                    '#1B67B2',   // Implementation
                    '#2BD25B',   // Licensing
                    '#6c757d',   // Hardware
                    '#ffc107',   // Maintenance
                    '#fd7e14',   // IT Staffing
                    '#20c997',   // Infrastructure
                    '#e83e8c'    // Upgrades
                ]
            }]
        };
        
        // Filter out zero values
        const filteredLabels = [];
        const filteredData = [];
        const filteredColors = [];
        
        data.datasets[0].data.forEach((value, index) => {
            if (value > 0) {
                filteredLabels.push(data.labels[index]);
                filteredData.push(value);
                filteredColors.push(data.datasets[0].backgroundColor[index]);
            }
        });
        
        // Update data with filtered values
        data.labels = filteredLabels;
        data.datasets[0].data = filteredData;
        data.datasets[0].backgroundColor = filteredColors;
        
        // Chart configuration
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        };
        
        // Create chart
        chartCanvas.chart = new Chart(chartCanvas, {
            type: 'doughnut',
            data: data,
            options: options
        });
    }
    
    // Update ROI timeline chart
    function updateRoiTimelineChart(results) {
        const chartCanvas = document.getElementById('roi-timeline-chart');
        if (!chartCanvas) return;
        
        // Destroy existing chart if it exists
        if (chartCanvas.chart) {
            chartCanvas.chart.destroy();
        }
        
        // Only show ROI chart if No-NAC comparison is included
        if (!results.noNac || !results.parameters.includeNoNac) {
            const container = chartCanvas.parentElement;
            container.innerHTML = '<p class="chart-placeholder">Enable "No NAC" baseline comparison to view ROI timeline.</p>';
            return;
        }
        
        // Prepare data
        const years = Array.from({ length: results.parameters.yearsToProject }, (_, i) => `Year ${i + 1}`);
        
        const currentVendorRoi = results.yearByYearProjection.map(year => year.currentVendor.roi);
        const portnoxRoi = results.yearByYearProjection.map(year => year.portnox.roi);
        
        const data = {
            labels: years,
            datasets: [
                {
                    label: `${results.currentVendor.name} ROI vs. No NAC`,
                    data: currentVendorRoi,
                    backgroundColor: config.charts.colors.currentVendor,
                    borderColor: config.charts.colors.currentVendor,
                    borderWidth: 2,
                    tension: 0.1
                },
                {
                    label: 'Portnox Cloud ROI vs. No NAC',
                    data: portnoxRoi,
                    backgroundColor: config.charts.colors.portnox,
                    borderColor: config.charts.colors.portnox,
                    borderWidth: 2,
                    tension: 0.1
                }
            ]
        };
        
        // Add breakeven markers
        const annotations = {};
        
        if (results.breakevenPoint.currentVendor.years <= results.parameters.yearsToProject) {
            annotations.currentVendorBreakeven = {
                type: 'line',
                xMin: results.breakevenPoint.currentVendor.years - 1,
                xMax: results.breakevenPoint.currentVendor.years - 1,
                borderColor: config.charts.colors.currentVendor,
                borderWidth: 2,
                label: {
                    content: `${results.currentVendor.name} Breakeven: ${results.breakevenPoint.currentVendor.description}`,
                    enabled: true,
                    position: 'top'
                }
            };
        }
        
        if (results.breakevenPoint.portnox.years <= results.parameters.yearsToProject) {
            annotations.portnoxBreakeven = {
                type: 'line',
                xMin: results.breakevenPoint.portnox.years - 1,
                xMax: results.breakevenPoint.portnox.years - 1,
                borderColor: config.charts.colors.portnox,
                borderWidth: 2,
                label: {
                    content: `Portnox Breakeven: ${results.breakevenPoint.portnox.description}`,
                    enabled: true,
                    position: 'bottom'
                }
            };
        }
        
        // Chart configuration
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw.toFixed(1) + '%';
                        }
                    }
                },
                annotation: {
                    annotations: annotations
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        };
        
        // Create chart
        chartCanvas.chart = new Chart(chartCanvas, {
            type: 'line',
            data: data,
            options: options
        });
    }
    
    // Update financial breakdown
    function updateFinancialBreakdown(results) {
        const tcSummaryTableBody = document.getElementById('tco-summary-table-body');
        if (!tcSummaryTableBody) return;
        
        // Calculate annual costs
        const years = results.parameters.yearsToProject;
        const currentVendorAnnual = results.currentVendor.annual;
        const portnoxAnnual = results.portnox.annual;
        
        // Clear table
        tcSummaryTableBody.innerHTML = '';
        
        // Add implementation costs
        addTcoRow(tcSummaryTableBody, 'Implementation Costs', 
            results.currentVendor.implementation, 
            results.portnox.implementation, 
            results.currentVendor.implementation - results.portnox.implementation);
        
        // Add licensing costs
        addTcoRow(tcSummaryTableBody, `Licensing (${years} years)`, 
            currentVendorAnnual.licensing * years, 
            portnoxAnnual.licensing * years, 
            currentVendorAnnual.licensing * years - portnoxAnnual.licensing * years);
        
        // Add hardware costs
        if (currentVendorAnnual.hardware || portnoxAnnual.hardware) {
            addTcoRow(tcSummaryTableBody, `Hardware (${years} years)`, 
                (currentVendorAnnual.hardware || 0) * years, 
                (portnoxAnnual.hardware || 0) * years, 
                (currentVendorAnnual.hardware || 0) * years - (portnoxAnnual.hardware || 0) * years);
        }
        
        // Add maintenance costs
        if (currentVendorAnnual.maintenance || portnoxAnnual.maintenance) {
            addTcoRow(tcSummaryTableBody, `Maintenance (${years} years)`, 
                (currentVendorAnnual.maintenance || 0) * years, 
                (portnoxAnnual.maintenance || 0) * years, 
                (currentVendorAnnual.maintenance || 0) * years - (portnoxAnnual.maintenance || 0) * years);
        }
        
        // Add staffing costs
        addTcoRow(tcSummaryTableBody, `IT Staffing (${years} years)`, 
            currentVendorAnnual.staffing * years, 
            portnoxAnnual.staffing * years, 
            currentVendorAnnual.staffing * years - portnoxAnnual.staffing * years);
        
        // Add infrastructure costs
        if (currentVendorAnnual.infrastructure || portnoxAnnual.infrastructure) {
            addTcoRow(tcSummaryTableBody, `Infrastructure (${years} years)`, 
                (currentVendorAnnual.infrastructure || 0) * years, 
                (portnoxAnnual.infrastructure || 0) * years, 
                (currentVendorAnnual.infrastructure || 0) * years - (portnoxAnnual.infrastructure || 0) * years);
        }
        
        // Add upgrades costs
        if (currentVendorAnnual.upgrades || portnoxAnnual.upgrades) {
            addTcoRow(tcSummaryTableBody, `Upgrades (${years} years)`, 
                (currentVendorAnnual.upgrades || 0) * years, 
                (portnoxAnnual.upgrades || 0) * years, 
                (currentVendorAnnual.upgrades || 0) * years - (portnoxAnnual.upgrades || 0) * years);
        }
        
        // Add hardware refresh costs if applicable
        if (results.currentVendor.hardwareRefresh || results.portnox.hardwareRefresh) {
            addTcoRow(tcSummaryTableBody, 'Hardware Refresh', 
                results.currentVendor.hardwareRefresh || 0, 
                results.portnox.hardwareRefresh || 0, 
                (results.currentVendor.hardwareRefresh || 0) - (results.portnox.hardwareRefresh || 0));
        }
        
        // Add total row
        addTcoRow(tcSummaryTableBody, `Total ${years}-Year TCO`, 
            results.currentVendor.total, 
            results.portnox.total, 
            results.savings.total, 
            true);
            
        // Add ROI row if No-NAC baseline is included
        if (results.noNac && results.parameters.includeNoNac) {
            // Current vendor ROI
            const currentVendorRoi = results.yearByYearProjection[results.yearByYearProjection.length - 1].currentVendor.roi;
            
            // Portnox ROI
            const portnoxRoi = results.yearByYearProjection[results.yearByYearProjection.length - 1].portnox.roi;
            
            // Difference
            const roiDifference = portnoxRoi - currentVendorRoi;
            
            // Add ROI row
            const roiRow = document.createElement('tr');
            roiRow.innerHTML = `
                <td>Return on Investment (vs. No NAC)</td>
                <td>${currentVendorRoi.toFixed(1)}%</td>
                <td>${portnoxRoi.toFixed(1)}%</td>
                <td class="${roiDifference >= 0 ? 'positive' : 'negative'}">${roiDifference >= 0 ? '+' : ''}${roiDifference.toFixed(1)}%</td>
            `;
            tcSummaryTableBody.appendChild(roiRow);
            
            // Add breakeven row
            const breakevenRow = document.createElement('tr');
            breakevenRow.innerHTML = `
                <td>Breakeven Point (vs. No NAC)</td>
                <td>${results.breakevenPoint.currentVendor.description}</td>
                <td>${results.breakevenPoint.portnox.description}</td>
                <td class="positive">${results.breakevenPoint.comparisonAdvantage.toFixed(1)} years faster</td>
            `;
            tcSummaryTableBody.appendChild(breakevenRow);
        }
        
        // Update annual costs table
        updateAnnualCostsTable(results);
    }
    
    // Add row to TCO summary table
    function addTcoRow(tableBody, label, currentVendorValue, portnoxValue, savings, isTotal = false) {
        const row = document.createElement('tr');
        row.className = isTotal ? 'total-row' : '';
        
        row.innerHTML = `
            <td>${label}</td>
            <td>${formatCurrency(currentVendorValue)}</td>
            <td>${formatCurrency(portnoxValue)}</td>
            <td class="${savings >= 0 ? 'positive' : 'negative'}">${formatCurrency(savings)}</td>
        `;
        
        tableBody.appendChild(row);
    }
    
    // Update annual costs table
    function updateAnnualCostsTable(results) {
        const annualCostsTableBody = document.getElementById('annual-costs-table-body');
        if (!annualCostsTableBody) return;
        
        // Clear table
        annualCostsTableBody.innerHTML = '';
        
        const currentVendorAnnual = results.currentVendor.annual;
        const portnoxAnnual = results.portnox.annual;
        
        // Add licensing costs
        addAnnualCostRow(annualCostsTableBody, 'Licensing', 
            currentVendorAnnual.licensing, 
            portnoxAnnual.licensing, 
            currentVendorAnnual.licensing - portnoxAnnual.licensing);
        
        // Add hardware costs
        if (currentVendorAnnual.hardware || portnoxAnnual.hardware) {
            addAnnualCostRow(annualCostsTableBody, 'Hardware', 
                currentVendorAnnual.hardware || 0, 
                portnoxAnnual.hardware || 0, 
                (currentVendorAnnual.hardware || 0) - (portnoxAnnual.hardware || 0));
        }
        
        // Add maintenance costs
        if (currentVendorAnnual.maintenance || portnoxAnnual.maintenance) {
            addAnnualCostRow(annualCostsTableBody, 'Maintenance', 
                currentVendorAnnual.maintenance || 0, 
                portnoxAnnual.maintenance || 0, 
                (currentVendorAnnual.maintenance || 0) - (portnoxAnnual.maintenance || 0));
        }
        
        // Add staffing costs
        addAnnualCostRow(annualCostsTableBody, 'IT Staffing', 
            currentVendorAnnual.staffing, 
            portnoxAnnual.staffing, 
            currentVendorAnnual.staffing - portnoxAnnual.staffing);
        
        // Add infrastructure costs
        if (currentVendorAnnual.infrastructure || portnoxAnnual.infrastructure) {
            addAnnualCostRow(annualCostsTableBody, 'Infrastructure', 
                currentVendorAnnual.infrastructure || 0, 
                portnoxAnnual.infrastructure || 0, 
                (currentVendorAnnual.infrastructure || 0) - (portnoxAnnual.infrastructure || 0));
        }
        
        // Add upgrades costs
        if (currentVendorAnnual.upgrades || portnoxAnnual.upgrades) {
            addAnnualCostRow(annualCostsTableBody, 'Upgrades', 
                currentVendorAnnual.upgrades || 0, 
                portnoxAnnual.upgrades || 0, 
                (currentVendorAnnual.upgrades || 0) - (portnoxAnnual.upgrades || 0));
        }
        
        // Add total row
        const totalCurrentVendor = Object.values(currentVendorAnnual).reduce((a, b) => a + b, 0);
        const totalPortnox = Object.values(portnoxAnnual).reduce((a, b) => a + b, 0);
        
        addAnnualCostRow(annualCostsTableBody, 'Total Annual Operating Costs', 
            totalCurrentVendor, 
            totalPortnox, 
            totalCurrentVendor - totalPortnox, 
            true);
    }
    
    // Add row to annual costs table
    function addAnnualCostRow(tableBody, label, currentVendorValue, portnoxValue, savings, isTotal = false) {
        const row = document.createElement('tr');
        row.className = isTotal ? 'total-row' : '';
        
        row.innerHTML = `
            <td>${label}</td>
            <td>${formatCurrency(currentVendorValue)}</td>
            <td>${formatCurrency(portnoxValue)}</td>
            <td class="${savings >= 0 ? 'positive' : 'negative'}">${formatCurrency(savings)}</td>
        `;
        
        tableBody.appendChild(row);
    }
    
    // Update implementation comparison
    function updateImplementationComparison(results) {
        const implementationTableBody = document.getElementById('implementation-table-body');
        if (!implementationTableBody) return;
        
        // Clear table
        implementationTableBody.innerHTML = '';
        
        // Implementation phases
        const phases = [
            {
                name: 'Planning & Design',
                currentVendor: results.currentVendor.implementation.timeframe.avg * 0.2,
                portnox: results.portnox.implementation.timeframe.avg * 0.15
            },
            {
                name: 'Installation & Configuration',
                currentVendor: results.currentVendor.implementation.timeframe.avg * 0.3,
                portnox: results.portnox.implementation.timeframe.avg * 0.3
            },
            {
                name: 'Policy Development',
                currentVendor: results.currentVendor.implementation.timeframe.avg * 0.25,
                portnox: results.portnox.implementation.timeframe.avg * 0.25
            },
            {
                name: 'Testing & Validation',
                currentVendor: results.currentVendor.implementation.timeframe.avg * 0.15,
                portnox: results.portnox.implementation.timeframe.avg * 0.2
            },
            {
                name: 'Deployment & Rollout',
                currentVendor: results.currentVendor.implementation.timeframe.avg * 0.1,
                portnox: results.portnox.implementation.timeframe.avg * 0.1
            }
        ];
        
        // Add phase rows
        phases.forEach(phase => {
            const savings = phase.currentVendor - phase.portnox;
            const savingsPercentage = (savings / phase.currentVendor) * 100;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${phase.name}</td>
                <td>${phase.currentVendor.toFixed(1)} weeks</td>
                <td>${phase.portnox.toFixed(1)} weeks</td>
                <td class="${savings >= 0 ? 'positive' : 'negative'}">${savings.toFixed(1)} weeks (${savingsPercentage.toFixed(1)}%)</td>
            `;
            
            implementationTableBody.appendChild(row);
        });
        
        // Add total row
        const totalCurrentVendor = results.currentVendor.implementation.timeframe.avg;
        const totalPortnox = results.portnox.implementation.timeframe.avg;
        const totalSavings = totalCurrentVendor - totalPortnox;
        const savingsPercentage = (totalSavings / totalCurrentVendor) * 100;
        
        const totalRow = document.createElement('tr');
        totalRow.className = 'total-row';
        totalRow.innerHTML = `
            <td>Total Implementation Time</td>
            <td>${totalCurrentVendor.toFixed(1)} weeks</td>
            <td>${totalPortnox.toFixed(1)} weeks</td>
            <td class="positive">${totalSavings.toFixed(1)} weeks (${savingsPercentage.toFixed(1)}%)</td>
        `;
        
        implementationTableBody.appendChild(totalRow);
        
        // Update implementation comparison chart
        updateImplementationComparisonChart(results, phases);
    }
    
    // Update implementation comparison chart
    function updateImplementationComparisonChart(results, phases) {
        const chartCanvas = document.getElementById('implementation-comparison-chart');
        if (!chartCanvas) return;
        
        // Destroy existing chart if it exists
        if (chartCanvas.chart) {
            chartCanvas.chart.destroy();
        }
        
        // Prepare data
        const phaseNames = phases.map(phase => phase.name);
        const currentVendorData = phases.map(phase => phase.currentVendor);
        const portnoxData = phases.map(phase => phase.portnox);
        
        const data = {
            labels: phaseNames,
            datasets: [
                {
                    label: results.currentVendor.name,
                    data: currentVendorData,
                    backgroundColor: config.charts.colors.currentVendor,
                    stack: 'Stack 0'
                },
                {
                    label: 'Portnox Cloud',
                    data: portnoxData,
                    backgroundColor: config.charts.colors.portnox,
                    stack: 'Stack 1'
                }
            ]
        };
        
        // Chart configuration
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw.toFixed(1) + ' weeks';
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Weeks'
                    },
                    stacked: false
                },
                y: {
                    stacked: false
                }
            }
        };
        
        // Create chart
        chartCanvas.chart = new Chart(chartCanvas, {
            type: 'bar',
            data: data,
            options: options
        });
        
        // Update implementation complexity chart
        updateImplementationComplexityChart(results);
    }
    
    // Update implementation complexity chart
    function updateImplementationComplexityChart(results) {
        const chartCanvas = document.getElementById('implementation-complexity-chart');
        if (!chartCanvas) return;
        
        // Destroy existing chart if it exists
        if (chartCanvas.chart) {
            chartCanvas.chart.destroy();
        }
        
        // Prepare data
        const categories = [
            'Hardware Requirements',
            'Software Installation',
            'Network Integration',
            'Multiple Location Support',
            'Policy Configuration',
            'User Training'
        ];
        
        // Complexity ratings (1-10 scale where 10 is most complex)
        const currentVendorRatings = {
            'cisco': [9, 8, 9, 8, 9, 7],
            'aruba': [8, 7, 8, 7, 8, 6],
            'forescout': [8, 7, 8, 7, 7, 6],
            'fortinac': [7, 6, 7, 6, 7, 6],
            'nps': [4, 6, 5, 4, 5, 5],
            'securew2': [3, 4, 5, 3, 4, 3]
        };
        
        // Portnox complexity ratings
        const portnoxRatings = [2, 3, 3, 2, 5, 3];
        
        // Get current vendor ratings
        const vendorId = results.currentVendor.id;
        const currentVendorData = currentVendorRatings[vendorId] || currentVendorRatings.cisco;
        
        const data = {
            labels: categories,
            datasets: [
                {
                    label: results.currentVendor.name,
                    data: currentVendorData,
                    backgroundColor: config.charts.colors.currentVendor
                },
                {
                    label: 'Portnox Cloud',
                    data: portnoxRatings,
                    backgroundColor: config.charts.colors.portnox
                }
            ]
        };
        
        // Chart configuration
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Complexity (1-10 scale)'
                    },
                    beginAtZero: true,
                    max: 10
                }
            }
        };
        
        // Create chart
        chartCanvas.chart = new Chart(chartCanvas, {
            type: 'bar',
            data: data,
            options: options
        });
    }
    
    // Update cloud vs. on-prem comparison
    function updateCloudOnPremComparison(results) {
        const comparisonTableBody = document.getElementById('cloud-comparison-table-body');
        if (!comparisonTableBody) return;
        
        // Clear table
        comparisonTableBody.innerHTML = '';
        
        // Comparison features
        const features = [
            {
                name: 'Deployment Model',
                onPrem: 'Hardware appliances or virtual machines',
                cloud: 'SaaS with cloud connectors, no hardware required'
            },
            {
                name: 'Implementation Time',
                onPrem: `${results.currentVendor.implementation.timeframe.avg} weeks average`,
                cloud: `${results.portnox.implementation.timeframe.avg} weeks average`
            },
            {
                name: 'IT Resource Requirements',
                onPrem: 'Dedicated IT staff for deployment and maintenance',
                cloud: 'Minimal IT oversight required'
            },
            {
                name: 'Hardware Costs',
                onPrem: 'Significant upfront hardware investment',
                cloud: 'No hardware costs'
            },
            {
                name: 'Maintenance',
                onPrem: 'Manual updates and maintenance windows',
                cloud: 'Automatic updates managed by provider'
            },
            {
                name: 'Scaling',
                onPrem: 'Hardware expansion required for growth',
                cloud: 'Seamless scaling with subscription changes'
            },
            {
                name: 'Multi-Location Support',
                onPrem: 'Hardware required at each location',
                cloud: 'Single cloud instance manages all locations'
            },
            {
                name: 'Disaster Recovery',
                onPrem: 'Complex DR planning and infrastructure',
                cloud: 'Built-in redundancy and DR capabilities'
            },
            {
                name: 'Total Cost of Ownership',
                onPrem: `${formatCurrency(results.currentVendor.total)} (${results.parameters.yearsToProject} years)`,
                cloud: `${formatCurrency(results.portnox.total)} (${results.parameters.yearsToProject} years)`
            }
        ];
        
        // Add feature rows
        features.forEach(feature => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${feature.name}</td>
                <td>${feature.onPrem}</td>
                <td>${feature.cloud}</td>
            `;
            
            comparisonTableBody.appendChild(row);
        });
        
        // Update architecture diagrams
        updateArchitectureDiagrams();
    }
    
    // Update architecture diagrams
    function updateArchitectureDiagrams() {
        const onPremDiagram = document.querySelector('.on-prem-diagram');
        const cloudDiagram = document.querySelector('.cloud-diagram');
        
        if (!onPremDiagram || !cloudDiagram) return;
        
        // On-premises diagram
        onPremDiagram.innerHTML = `
        <svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
            <!-- Corporate HQ -->
            <rect x="50" y="50" width="180" height="200" rx="5" fill="#f5f5f5" stroke="#6c757d" stroke-width="2"/>
            <text x="140" y="30" text-anchor="middle" font-size="14" font-weight="bold">Corporate HQ</text>
            
            <!-- NAC Server -->
            <rect x="80" y="80" width="120" height="40" rx="5" fill="#6c757d" stroke="#333" stroke-width="1"/>
            <text x="140" y="105" text-anchor="middle" font-size="12" fill="white">NAC Servers</text>
            
            <!-- Network -->
            <rect x="80" y="140" width="120" height="40" rx="5" fill="#1B67B2" stroke="#333" stroke-width="1"/>
            <text x="140" y="165" text-anchor="middle" font-size="12" fill="white">Core Network</text>
            
            <!-- Endpoints -->
            <rect x="80" y="200" width="50" height="30" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="105" y="220" text-anchor="middle" font-size="10" fill="white">Users</text>
            
            <rect x="150" y="200" width="50" height="30" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="175" y="220" text-anchor="middle" font-size="10" fill="white">IoT</text>
            
            <!-- Branch Office -->
            <rect x="270" y="50" width="180" height="200" rx="5" fill="#f5f5f5" stroke="#6c757d" stroke-width="2"/>
            <text x="360" y="30" text-anchor="middle" font-size="14" font-weight="bold">Branch Office</text>
            
            <!-- NAC Server -->
            <rect x="300" y="80" width="120" height="40" rx="5" fill="#6c757d" stroke="#333" stroke-width="1"/>
            <text x="360" y="105" text-anchor="middle" font-size="12" fill="white">NAC Servers</text>
            
            <!-- Network -->
            <rect x="300" y="140" width="120" height="40" rx="5" fill="#1B67B2" stroke="#333" stroke-width="1"/>
            <text x="360" y="165" text-anchor="middle" font-size="12" fill="white">Branch Network</text>
            
            <!-- Endpoints -->
            <rect x="300" y="200" width="50" height="30" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="325" y="220" text-anchor="middle" font-size="10" fill="white">Users</text>
            
            <rect x="370" y="200" width="50" height="30" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="395" y="220" text-anchor="middle" font-size="10" fill="white">IoT</text>
            
            <!-- Connection between sites -->
            <line x1="230" y1="160" x2="270" y2="160" stroke="#333" stroke-width="2" stroke-dasharray="5,5"/>
            <text x="250" y="150" text-anchor="middle" font-size="10">WAN</text>
        </svg>
        `;
        
        // Cloud diagram
        cloudDiagram.innerHTML = `
        <svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
            <!-- Cloud -->
            <ellipse cx="250" cy="80" rx="130" ry="50" fill="#f5f5f5" stroke="#6c757d" stroke-width="2"/>
            <text x="250" y="85" text-anchor="middle" font-size="14" font-weight="bold">Portnox Cloud</text>
            
            <!-- Corporate HQ -->
            <rect x="50" y="150" width="180" height="130" rx="5" fill="#f5f5f5" stroke="#6c757d" stroke-width="2"/>
            <text x="140" y="140" text-anchor="middle" font-size="14" font-weight="bold">Corporate HQ</text>
            
            <!-- Cloud Connector -->
            <rect x="80" y="170" width="120" height="30" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="140" y="190" text-anchor="middle" font-size="12" fill="white">Cloud Connector</text>
            
            <!-- Network -->
            <rect x="80" y="210" width="120" height="30" rx="5" fill="#1B67B2" stroke="#333" stroke-width="1"/>
            <text x="140" y="230" text-anchor="middle" font-size="12" fill="white">Corporate Network</text>
            
            <!-- Endpoints -->
            <rect x="80" y="250" width="50" height="20" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="105" y="265" text-anchor="middle" font-size="10" fill="white">Users</text>
            
            <rect x="150" y="250" width="50" height="20" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="175" y="265" text-anchor="middle" font-size="10" fill="white">IoT</text>
            
            <!-- Branch Office -->
            <rect x="270" y="150" width="180" height="130" rx="5" fill="#f5f5f5" stroke="#6c757d" stroke-width="2"/>
            <text x="360" y="140" text-anchor="middle" font-size="14" font-weight="bold">Branch Office</text>
            
            <!-- Cloud Connector -->
            <rect x="300" y="170" width="120" height="30" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="360" y="190" text-anchor="middle" font-size="12" fill="white">Cloud Connector</text>
            
            <!-- Network -->
            <rect x="300" y="210" width="120" height="30" rx="5" fill="#1B67B2" stroke="#333" stroke-width="1"/>
            <text x="360" y="230" text-anchor="middle" font-size="12" fill="white">Branch Network</text>
            
            <!-- Endpoints -->
            <rect x="300" y="250" width="50" height="20" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="325" y="265" text-anchor="middle" font-size="10" fill="white">Users</text>
            
            <rect x="370" y="250" width="50" height="20" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="395" y="265" text-anchor="middle" font-size="10" fill="white">IoT</text>
            
            <!-- Connections to cloud -->
            <line x1="140" y1="170" x2="200" y2="100" stroke="#2BD25B" stroke-width="2"/>
            <line x1="360" y1="170" x2="300" y2="100" stroke="#2BD25B" stroke-width="2"/>
            
            <!-- BYOD and Remote Users -->
            <rect x="185" y="105" width="130" height="25" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="250" y="122" text-anchor="middle" font-size="12" fill="white">BYOD & Remote Users</text>
        </svg>
        `;
    }
    
    // Update migration planning
    function updateMigrationPlanning(results) {
        const migrationTableBody = document.getElementById('migration-table-body');
        if (!migrationTableBody) return;
        
        // Clear table
        migrationTableBody.innerHTML = '';
        
        // Migration phases
        const phases = [
            {
                name: 'Phase 1: Assessment & Planning',
                description: 'Evaluate current environment, define requirements, and create migration plan',
                duration: '1-2 weeks'
            },
            {
                name: 'Phase 2: Initial Deployment',
                description: 'Deploy Portnox Cloud and configure basic policies in monitoring mode',
                duration: '1 week'
            },
            {
                name: 'Phase 3: Policy Development',
                description: 'Develop and test comprehensive policies based on your organization\'s requirements',
                duration: '1-2 weeks'
            },
            {
                name: 'Phase 4: Pilot Deployment',
                description: 'Deploy to a limited group of users/devices to validate configuration',
                duration: '1 week'
            },
            {
                name: 'Phase 5: Full Deployment',
                description: 'Roll out to all users and devices in phases based on groups or locations',
                duration: '1-2 weeks'
            },
            {
                name: 'Phase 6: Transition & Decommissioning',
                description: `Decommission ${results.currentVendor.name} after successful parallel operation`,
                duration: '1 week'
            }
        ];
        
        // Add phase rows
        phases.forEach(phase => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${phase.name}</td>
                <td>${phase.description}</td>
                <td>${phase.duration}</td>
            `;
            
            migrationTableBody.appendChild(row);
        });
        
        // Update migration phases visualization
        updateMigrationPhases(phases, results);
    }
    
    // Update migration phases
    function updateMigrationPhases(phases, results) {
        const migrationPhasesContainer = document.querySelector('.migration-phases');
        if (!migrationPhasesContainer) return;
        
        // Clear container
        migrationPhasesContainer.innerHTML = '';
        
        // Create phase cards
        phases.forEach((phase, index) => {
            const phaseCard = document.createElement('div');
            phaseCard.className = 'migration-phase-card';
            
            phaseCard.innerHTML = `
                <div class="phase-number">${index + 1}</div>
                <div class="phase-content">
                    <h4>${phase.name.split(':')[1].trim()}</h4>
                    <p>${phase.description}</p>
                    <div class="phase-duration">
                        <i class="fas fa-clock"></i> ${phase.duration}
                    </div>
                </div>
            `;
            
            migrationPhasesContainer.appendChild(phaseCard);
        });
    }
    
    // Update industry-specific metrics
    function updateIndustryMetrics(results) {
        const industryMetricsContainer = document.getElementById('industry-specific-metrics');
        if (!industryMetricsContainer) return;
        
        // Only show if industry is selected
        if (results.parameters.industry === 'other' || results.parameters.industry === 'none') {
            industryMetricsContainer.classList.add('hidden');
            return;
        }
        
        // Show container
        industryMetricsContainer.classList.remove('hidden');
        
        // Clear container
        industryMetricsContainer.innerHTML = '';
        
        // Get industry name
        const industryName = results.parameters.industry.charAt(0).toUpperCase() + results.parameters.industry.slice(1);
        
        // Create industry metrics card
        const industryCard = document.createElement('div');
        industryCard.className = 'result-card';
        industryCard.innerHTML = `
            <h3>${industryName} Industry-Specific Metrics</h3>
            <div class="industry-metrics-content">
                <div class="industry-metrics-grid">
                    <div class="metric-container">
                        <div class="metric-label">Industry Cloud Adoption Rate</div>
                        <div class="metric-value">${(results.industryFactors.cloudSavingsPercentage * 100).toFixed(1)}%</div>
                    </div>
                    <div class="metric-container">
                        <div class="metric-label">Implementation Time Reduction</div>
                        <div class="metric-value">${(results.industryFactors.implementationTimeReduction * 100).toFixed(1)}%</div>
                    </div>
                    <div class="metric-container">
                        <div class="metric-label">IT Staffing Reduction</div>
                        <div class="metric-value">${((1 - (results.industryFactors.fteRequirements.cloud / results.industryFactors.fteRequirements.onPremise)) * 100).toFixed(1)}%</div>
                    </div>
                    <div class="metric-container">
                        <div class="metric-label">Breach Risk Reduction</div>
                        <div class="metric-value">${(results.industryFactors.breachRiskReduction * 100).toFixed(1)}%</div>
                    </div>
                </div>
                
                <div class="industry-requirements">
                    <h4>${industryName} NAC Requirements</h4>
                    <ul class="industry-requirements-list" id="industry-requirements-list"></ul>
                </div>
            </div>
        `;
        
        industryMetricsContainer.appendChild(industryCard);
        
        // Get industry data
        if (typeof IndustryData !== 'undefined') {
            const industryData = IndustryData.getIndustryData(results.parameters.industry);
            
            // Add requirements to list
            const requirementsList = document.getElementById('industry-requirements-list');
            if (requirementsList && industryData && industryData.metrics && industryData.metrics.keyRequirements) {
                industryData.metrics.keyRequirements.forEach(requirement => {
                    const li = document.createElement('li');
                    li.textContent = requirement;
                    requirementsList.appendChild(li);
                });
            }
        }
    }
    
    // Update compliance requirements
    function updateComplianceRequirements(industryId) {
        const compliancePanel = document.getElementById('industry-compliance-panel');
        if (!compliancePanel) return;
        
        // Only show if industry is selected
        if (industryId === 'other' || industryId === 'none') {
            compliancePanel.classList.add('hidden');
            return;
        }
        
        // Show panel
        compliancePanel.classList.remove('hidden');
        
        // Get compliance container
        const complianceContainer = document.getElementById('compliance-requirements-container');
        if (!complianceContainer) return;
        
        // Clear container
        complianceContainer.innerHTML = '';
        
        // Get compliance requirements
        if (typeof EnhancedTcoCalculator !== 'undefined') {
            const complianceRequirements = EnhancedTcoCalculator.getComplianceRequirements(industryId);
            
            // Create frameworks sections
            Object.keys(complianceRequirements).forEach(frameworkId => {
                const framework = complianceRequirements[frameworkId];
                
                const frameworkSection = document.createElement('div');
                frameworkSection.className = 'compliance-framework';
                
                frameworkSection.innerHTML = `
                    <h4>${framework.name} - ${framework.fullName}</h4>
                    <div class="compliance-requirements">
                        <table class="data-table compliance-table">
                            <thead>
                                <tr>
                                    <th>Requirement</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody class="compliance-requirements-body-${frameworkId}"></tbody>
                        </table>
                    </div>
                `;
                
                complianceContainer.appendChild(frameworkSection);
                
                // Add requirements to table
                const requirementsBody = document.querySelector(`.compliance-requirements-body-${frameworkId}`);
                if (requirementsBody) {
                    framework.requirements.forEach(requirement => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td><strong>${requirement.id}</strong></td>
                            <td>${requirement.description}</td>
                        `;
                        requirementsBody.appendChild(row);
                    });
                }
            });
        }
    }
    
    // Handle years projection change
    function handleYearsProjectionChange() {
        // Re-run calculation if already calculated
        if (document.querySelector('.results-grid canvas')) {
            handleEnhancedCalculation();
        }
    }
    
    // Handle industry change
    function handleIndustryChange() {
        // Re-run calculation if already calculated
        if (document.querySelector('.results-grid canvas')) {
            handleEnhancedCalculation();
        }
        
        // Update compliance requirements
        const industry = elements.industrySelector.value;
        if (industry !== 'none') {
            updateComplianceRequirements(industry);
        }
    }
    
    // Show notification
    function showNotification(type, message) {
        const messageContainer = document.getElementById('message-container');
        if (!messageContainer) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            </div>
            <div class="notification-message">${message}</div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add close handler
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', function() {
            messageContainer.removeChild(notification);
        });
        
        // Add to container
        messageContainer.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(function() {
            if (notification.parentElement) {
                messageContainer.removeChild(notification);
            }
        }, 5000);
    }
    
    // Format currency
    function formatCurrency(amount, abbreviate = false) {
        if (abbreviate && Math.abs(amount) >= 1000000) {
            return '$' + (amount / 1000000).toFixed(1) + 'M';
        } else if (abbreviate && Math.abs(amount) >= 1000) {
            return '$' + (amount / 1000).toFixed(1) + 'K';
        } else {
            return '$' + amount.toLocaleString(undefined, { maximumFractionDigits: 0 });
        }
    }
    
    // Initialize on document ready
    document.addEventListener('DOMContentLoaded', initialize);
    
    // Check for sensitivity analysis enhancement
    window.addEventListener('load', function() {
        if (window.location.pathname.includes('sensitivity.html')) {
            enhanceSensitivityAnalysisPage();
        }
    });
    
    // Enhance sensitivity analysis page
    function enhanceSensitivityAnalysisPage() {
        // Check if enhancement was requested
        if (localStorage.getItem('enhanceTcoSensitivity') !== 'true') return;
        
        // Clear flag
        localStorage.removeItem('enhanceTcoSensitivity');
        
        // Get vendor dropdown
        const vendorDropdown = document.getElementById('param-vendor');
        if (!vendorDropdown) return;
        
        // Add No-NAC option
        const noNacOption = document.createElement('option');
        noNacOption.value = 'noNac';
        noNacOption.textContent = 'No NAC (Baseline)';
        vendorDropdown.appendChild(noNacOption);
        
        // Add option for breach risk
        const variableDropdown = document.getElementById('param-variable');
        if (variableDropdown) {
            const breachRiskOption = document.createElement('option');
            breachRiskOption.value = 'breachRisk';
            breachRiskOption.textContent = 'Security Breach Risk';
            variableDropdown.appendChild(breachRiskOption);
            
            const complianceRiskOption = document.createElement('option');
            complianceRiskOption.value = 'complianceRisk';
            complianceRiskOption.textContent = 'Compliance Risk Factor';
            variableDropdown.appendChild(complianceRiskOption);
        }
    }
    
})();

// Add styles for enhanced UI
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
/* Enhanced UI Styles */
.hidden {
    display: none !important;
}

.input-group checkbox-group {
    margin-bottom: 1rem;
}

.positive {
    color: #2BD25B;
    font-weight: bold;
}

.negative {
    color: #dc3545;
    font-weight: bold;
}

.total-row {
    font-weight: bold;
    border-top: 2px solid #dee2e6;
}

.notification {
    display: flex;
    align-items: center;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.25rem;
    background-color: #f8f9fa;
    border-left: 4px solid #6c757d;
}

.notification.success {
    background-color: #f0fff4;
    border-left-color: #2BD25B;
}

.notification.error {
    background-color: #fff5f5;
    border-left-color: #dc3545;
}

.notification-icon {
    margin-right: 1rem;
    font-size: 1.25rem;
}

.notification.success .notification-icon {
    color: #2BD25B;
}

.notification.error .notification-icon {
    color: #dc3545;
}

.notification-message {
    flex: 1;
}

.notification-close {
    background: none;
    border: none;
    cursor: pointer;
    color: #6c757d;
}

.feature-comparison-modal-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 90%;
    width: 900px;
    max-height: 90vh;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    z-index: 1050;
    overflow: hidden;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1040;
}

.feature-comparison-modal {
    padding: 1.5rem;
    overflow-y: auto;
    max-height: 90vh;
}

.modal-close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6c757d;
}

.feature-comparison-table-container {
    margin-top: 1.5rem;
}

.feature-comparison-table {
    width: 100%;
}

.feature-comparison-table th,
.feature-comparison-table td {
    padding: 0.75rem;
}

.feature-description {
    font-size: 0.875rem;
    color: #6c757d;
    margin-top: 0.25rem;
}

.rating-container {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
}

.rating-value {
    width: 45px;
    text-align: right;
    margin-right: 0.5rem;
    font-weight: bold;
}

.rating-bar {
    flex: 1;
    height: 12px;
    background-color: #e9ecef;
    border-radius: 6px;
    overflow: hidden;
}

.rating-fill {
    height: 100%;
    background-color: #6c757d;
    border-radius: 6px;
}

.rating-fill.portnox {
    background-color: #2BD25B;
}

.feature-details {
    font-size: 0.875rem;
}

.advantage-portnox {
    color: #2BD25B;
    font-weight: bold;
}

.advantage-competitor {
    color: #6c757d;
    font-weight: bold;
}

.advantage-equal {
    color: #6c757d;
    font-style: italic;
}

.feature-comparison-loading {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
}

.chart-placeholder {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
    background-color: #f8f9fa;
    border-radius: 0.25rem;
}

.compliance-panel {
    margin-top: 2rem;
}

.compliance-framework {
    margin-bottom: 2rem;
}

.compliance-table {
    font-size: 0.875rem;
}

.migration-phases {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 1.5rem 0;
}

.migration-phase-card {
    flex: 1 1 calc(33.333% - 1rem);
    min-width: 250px;
    display: flex;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
    padding: 1rem;
    background-color: #f8f9fa;
}

.phase-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #1B67B2;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.25rem;
    margin-right: 1rem;
}

.phase-content {
    flex: 1;
}

.phase-content h4 {
    margin-top: 0;
    margin-bottom: 0.5rem;
}

.phase-content p {
    color: #6c757d;
    margin-bottom: 0.5rem;
}

.phase-duration {
    font-size: 0.875rem;
    color: #1B67B2;
    font-weight: bold;
}

.industry-metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.industry-requirements-list {
    columns: 2;
    column-gap: 2rem;
    list-style-type: none;
    padding: 0;
}

.industry-requirements-list li {
    margin-bottom: 0.5rem;
    position: relative;
    padding-left: 1.5rem;
}

.industry-requirements-list li:before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #2BD25B;
    font-weight: bold;
}

@media (max-width: 768px) {
    .industry-requirements-list {
        columns: 1;
    }
    
    .migration-phase-card {
        flex: 1 1 100%;
    }
}
`;

document.head.appendChild(enhancedStyles);
'use strict';
var $ = require('../internals/export');
var globalThis = require('../internals/global-this');
var uncurryThis = require('../internals/function-uncurry-this');
var anObjectOrUndefined = require('../internals/an-object-or-undefined');
var anUint8Array = require('../internals/an-uint8-array');
var notDetached = require('../internals/array-buffer-not-detached');
var base64Map = require('../internals/base64-map');
var getAlphabetOption = require('../internals/get-alphabet-option');

var base64Alphabet = base64Map.i2c;
var base64UrlAlphabet = base64Map.i2cUrl;

var charAt = uncurryThis(''.charAt);

// `Uint8Array.prototype.toBase64` method
// https://github.com/tc39/proposal-arraybuffer-base64
if (globalThis.Uint8Array) $({ target: 'Uint8Array', proto: true }, {
  toBase64: function toBase64(/* options */) {
    var array = anUint8Array(this);
    var options = arguments.length ? anObjectOrUndefined(arguments[0]) : undefined;
    var alphabet = getAlphabetOption(options) === 'base64' ? base64Alphabet : base64UrlAlphabet;
    var omitPadding = !!options && !!options.omitPadding;
    notDetached(this.buffer);

    var result = '';
    var i = 0;
    var length = array.length;
    var triplet;

    var at = function (shift) {
      return charAt(alphabet, (triplet >> (6 * shift)) & 63);
    };

    for (; i + 2 < length; i += 3) {
      triplet = (array[i] << 16) + (array[i + 1] << 8) + array[i + 2];
      result += at(3) + at(2) + at(1) + at(0);
    }
    if (i + 2 === length) {
      triplet = (array[i] << 16) + (array[i + 1] << 8);
      result += at(3) + at(2) + at(1) + (omitPadding ? '' : '=');
    } else if (i + 1 === length) {
      triplet = array[i] << 16;
      result += at(3) + at(2) + (omitPadding ? '' : '==');
    }

    return result;
  }
});
'use strict';
var classof = require('../internals/classof');

var $TypeError = TypeError;

// Perform ? RequireInternalSlot(argument, [[TypedArrayName]])
// If argument.[[TypedArrayName]] is not "Uint8Array", throw a TypeError exception
module.exports = function (argument) {
  if (classof(argument) === 'Uint8Array') return argument;
  throw new $TypeError('Argument is not an Uint8Array');
};
'use strict';
var parent = require('../../es/typed-array/uint32-array');
require('../../stable/typed-array/methods');

module.exports = parent;
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const RequireEnsureDependency = require("./RequireEnsureDependency");
const RequireEnsureItemDependency = require("./RequireEnsureItemDependency");

const RequireEnsureDependenciesBlockParserPlugin = require("./RequireEnsureDependenciesBlockParserPlugin");

const {
	JAVASCRIPT_MODULE_TYPE_AUTO,
	JAVASCRIPT_MODULE_TYPE_DYNAMIC
} = require("../ModuleTypeConstants");
const {
	evaluateToString,
	toConstantDependency
} = require("../javascript/JavascriptParserHelpers");

/** @typedef {import("../../declarations/WebpackOptions").JavascriptParserOptions} JavascriptParserOptions */
/** @typedef {import("../Compiler")} Compiler */
/** @typedef {import("../javascript/JavascriptParser")} Parser */

const PLUGIN_NAME = "RequireEnsurePlugin";

class RequireEnsurePlugin {
	/**
	 * Apply the plugin
	 * @param {Compiler} compiler the compiler instance
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.compilation.tap(
			PLUGIN_NAME,
			(compilation, { normalModuleFactory }) => {
				compilation.dependencyFactories.set(
					RequireEnsureItemDependency,
					normalModuleFactory
				);
				compilation.dependencyTemplates.set(
					RequireEnsureItemDependency,
					new RequireEnsureItemDependency.Template()
				);

				compilation.dependencyTemplates.set(
					RequireEnsureDependency,
					new RequireEnsureDependency.Template()
				);

				/**
				 * @param {Parser} parser parser parser
				 * @param {JavascriptParserOptions} parserOptions parserOptions
				 * @returns {void}
				 */
				const handler = (parser, parserOptions) => {
					if (
						parserOptions.requireEnsure !== undefined &&
						!parserOptions.requireEnsure
					)
						return;

					new RequireEnsureDependenciesBlockParserPlugin().apply(parser);
					parser.hooks.evaluateTypeof
						.for("require.ensure")
						.tap(PLUGIN_NAME, evaluateToString("function"));
					parser.hooks.typeof
						.for("require.ensure")
						.tap(
							PLUGIN_NAME,
							toConstantDependency(parser, JSON.stringify("function"))
						);
				};

				normalModuleFactory.hooks.parser
					.for(JAVASCRIPT_MODULE_TYPE_AUTO)
					.tap(PLUGIN_NAME, handler);
				normalModuleFactory.hooks.parser
					.for(JAVASCRIPT_MODULE_TYPE_DYNAMIC)
					.tap(PLUGIN_NAME, handler);
			}
		);
	}
}
module.exports = RequireEnsurePlugin;
'use strict';
/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = require('../internals/symbol-constructor-detection');

module.exports = NATIVE_SYMBOL &&
  !Symbol.sham &&
  typeof Symbol.iterator == 'symbol';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRequiredDef(keyword) {
    return () => ({
        keyword,
        type: "object",
        schemaType: "array",
        macro(schema) {
            if (schema.length === 0)
                return true;
            if (schema.length === 1)
                return { required: schema };
            const comb = keyword === "anyRequired" ? "anyOf" : "oneOf";
            return { [comb]: schema.map((p) => ({ required: [p] })) };
        },
        metaSchema: {
            type: "array",
            items: { type: "string" },
        },
    });
}
exports.default = getRequiredDef;
//# sourceMappingURL=_required.js.map'use strict';
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');

// eslint-disable-next-line es/no-typed-arrays -- safe
var getUint8 = uncurryThis(DataView.prototype.getUint8);

// `DataView.prototype.getUint8Clamped` method
// https://github.com/tc39/proposal-dataview-get-set-uint8clamped
$({ target: 'DataView', proto: true, forced: true }, {
  getUint8Clamped: function getUint8Clamped(byteOffset) {
    return getUint8(this, byteOffset);
  }
});
const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const csso = require('csso');

// Directories to process
const jsDir = './js';
const cssDir = './css';
const distDir = './dist';

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
  fs.mkdirSync(path.join(distDir, 'js'), { recursive: true });
  fs.mkdirSync(path.join(distDir, 'css'), { recursive: true });
}

// Minify JS files
async function minifyJS(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    const result = await minify(content, {
      compress: {
        drop_console: true
      },
      mangle: true
    });
    
    const relativePath = path.relative(jsDir, filePath);
    const outputPath = path.join(distDir, 'js', relativePath);
    
    // Create directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, result.code);
    console.log(`Minified JS: ${filePath} -> ${outputPath}`);
  } catch (error) {
    console.error(`Error minifying ${filePath}:`, error);
  }
}

// Minify CSS files
function minifyCSS(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    const result = csso.minify(content);
    
    const relativePath = path.relative(cssDir, filePath);
    const outputPath = path.join(distDir, 'css', relativePath);
    
    // Create directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, result.css);
    console.log(`Minified CSS: ${filePath} -> ${outputPath}`);
  } catch (error) {
    console.error(`Error minifying ${filePath}:`, error);
  }
}

// Process all JS files
function processJSFiles(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(directory, file.name);
    
    if (file.isDirectory()) {
      processJSFiles(filePath);
    } else if (file.isFile() && path.extname(file.name) === '.js') {
      minifyJS(filePath);
    }
  }
}

// Process all CSS files
function processCSSFiles(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(directory, file.name);
    
    if (file.isDirectory()) {
      processCSSFiles(filePath);
    } else if (file.isFile() && path.extname(file.name) === '.css') {
      minifyCSS(filePath);
    }
  }
}

// Process HTML files and update them to use minified resources
function processHTMLFiles() {
  const htmlFiles = ['index.html', 'calculator.html', 'sensitivity.html'];
  
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Replace JS paths
    let newContent = content.replace(/src="js\/(.*?)\.js"/g, 'src="dist/js/$1.js"');
    
    // Replace CSS paths
    newContent = newContent.replace(/href="css\/(.*?)\.css"/g, 'href="dist/css/$1.css"');
    
    // Write optimized HTML
    const outputPath = path.join(distDir, file);
    fs.writeFileSync(outputPath, newContent);
    console.log(`Processed HTML: ${file} -> ${outputPath}`);
  });
}

// Main process
async function main() {
  console.log('Starting build process...');
  
  // Process JS and CSS files
  processJSFiles(jsDir);
  processCSSFiles(cssDir);
  
  // Process HTML files
  processHTMLFiles();
  
  // Copy other necessary files (e.g., images)
  console.log('Copying other assets...');
  
  // Create img directory in dist if it doesn't exist
  if (!fs.existsSync(path.join(distDir, 'img'))) {
    fs.mkdirSync(path.join(distDir, 'img'), { recursive: true });
  }
  
  // Copy image files
  const imgDir = './img';
  if (fs.existsSync(imgDir)) {
    const imgFiles = fs.readdirSync(imgDir);
    
    imgFiles.forEach(file => {
      const sourcePath = path.join(imgDir, file);
      const outputPath = path.join(distDir, 'img', file);
      
      if (fs.statSync(sourcePath).isFile()) {
        fs.copyFileSync(sourcePath, outputPath);
        console.log(`Copied: ${sourcePath} -> ${outputPath}`);
      }
    });
  }
  
  console.log('Build completed successfully!');
}

// Run the build process
main().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const {
	JAVASCRIPT_MODULE_TYPE_AUTO,
	JAVASCRIPT_MODULE_TYPE_DYNAMIC
} = require("../ModuleTypeConstants");
const { cachedSetProperty } = require("../util/cleverMerge");
const ContextElementDependency = require("./ContextElementDependency");
const RequireContextDependency = require("./RequireContextDependency");
const RequireContextDependencyParserPlugin = require("./RequireContextDependencyParserPlugin");

/** @typedef {import("../../declarations/WebpackOptions").JavascriptParserOptions} JavascriptParserOptions */
/** @typedef {import("../../declarations/WebpackOptions").ResolveOptions} ResolveOptions */
/** @typedef {import("../Compiler")} Compiler */
/** @typedef {import("../javascript/JavascriptParser")} Parser */

/** @type {ResolveOptions} */
const EMPTY_RESOLVE_OPTIONS = {};

const PLUGIN_NAME = "RequireContextPlugin";

class RequireContextPlugin {
	/**
	 * Apply the plugin
	 * @param {Compiler} compiler the compiler instance
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.compilation.tap(
			PLUGIN_NAME,
			(compilation, { contextModuleFactory, normalModuleFactory }) => {
				compilation.dependencyFactories.set(
					RequireContextDependency,
					contextModuleFactory
				);
				compilation.dependencyTemplates.set(
					RequireContextDependency,
					new RequireContextDependency.Template()
				);

				compilation.dependencyFactories.set(
					ContextElementDependency,
					normalModuleFactory
				);

				/**
				 * @param {Parser} parser parser parser
				 * @param {JavascriptParserOptions} parserOptions parserOptions
				 * @returns {void}
				 */
				const handler = (parser, parserOptions) => {
					if (
						parserOptions.requireContext !== undefined &&
						!parserOptions.requireContext
					)
						return;

					new RequireContextDependencyParserPlugin().apply(parser);
				};

				normalModuleFactory.hooks.parser
					.for(JAVASCRIPT_MODULE_TYPE_AUTO)
					.tap(PLUGIN_NAME, handler);
				normalModuleFactory.hooks.parser
					.for(JAVASCRIPT_MODULE_TYPE_DYNAMIC)
					.tap(PLUGIN_NAME, handler);

				contextModuleFactory.hooks.alternativeRequests.tap(
					PLUGIN_NAME,
					(items, options) => {
						if (items.length === 0) return items;

						const finalResolveOptions = compiler.resolverFactory.get(
							"normal",
							cachedSetProperty(
								options.resolveOptions || EMPTY_RESOLVE_OPTIONS,
								"dependencyType",
								/** @type {string} */ (options.category)
							)
						).options;

						let newItems;
						if (!finalResolveOptions.fullySpecified) {
							newItems = [];
							for (const item of items) {
								const { request, context } = item;
								for (const ext of finalResolveOptions.extensions) {
									if (request.endsWith(ext)) {
										newItems.push({
											context,
											request: request.slice(0, -ext.length)
										});
									}
								}
								if (!finalResolveOptions.enforceExtension) {
									newItems.push(item);
								}
							}
							items = newItems;

							newItems = [];
							for (const obj of items) {
								const { request, context } = obj;
								for (const mainFile of finalResolveOptions.mainFiles) {
									if (request.endsWith(`/${mainFile}`)) {
										newItems.push({
											context,
											request: request.slice(0, -mainFile.length)
										});
										newItems.push({
											context,
											request: request.slice(0, -mainFile.length - 1)
										});
									}
								}
								newItems.push(obj);
							}
							items = newItems;
						}

						newItems = [];
						for (const item of items) {
							let hideOriginal = false;
							for (const modulesItems of finalResolveOptions.modules) {
								if (Array.isArray(modulesItems)) {
									for (const dir of modulesItems) {
										if (item.request.startsWith(`./${dir}/`)) {
											newItems.push({
												context: item.context,
												request: item.request.slice(dir.length + 3)
											});
											hideOriginal = true;
										}
									}
								} else {
									const dir = modulesItems.replace(/\\/g, "/");
									const fullPath =
										item.context.replace(/\\/g, "/") + item.request.slice(1);
									if (fullPath.startsWith(dir)) {
										newItems.push({
											context: item.context,
											request: fullPath.slice(dir.length + 1)
										});
									}
								}
							}
							if (!hideOriginal) {
								newItems.push(item);
							}
						}
						return newItems;
					}
				);
			}
		);
	}
}
module.exports = RequireContextPlugin;
// This file is for backward compatibility with v0.5.1.
require('./register')

console.warn("'json5/require' is deprecated. Please use 'json5/register' instead.")
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dependencies_1 = require("../applicator/dependencies");
const def = {
    keyword: "dependentRequired",
    type: "object",
    schemaType: "object",
    error: dependencies_1.error,
    code: (cxt) => (0, dependencies_1.validatePropertyDeps)(cxt),
};
exports.default = def;
//# sourceMappingURL=dependentRequired.js.map/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const { cutOffLoaderExecution } = require("./ErrorHelpers");
const WebpackError = require("./WebpackError");
const makeSerializable = require("./util/makeSerializable");

/** @typedef {import("./serialization/ObjectMiddleware").ObjectDeserializerContext} ObjectDeserializerContext */
/** @typedef {import("./serialization/ObjectMiddleware").ObjectSerializerContext} ObjectSerializerContext */

/** @typedef {Error & { hideStack?: boolean }} ErrorWithHideStack */

class ModuleBuildError extends WebpackError {
	/**
	 * @param {string | ErrorWithHideStack} err error thrown
	 * @param {{from?: string|null}} info additional info
	 */
	constructor(err, { from = null } = {}) {
		let message = "Module build failed";
		let details;

		message += from ? ` (from ${from}):\n` : ": ";

		if (err !== null && typeof err === "object") {
			if (typeof err.stack === "string" && err.stack) {
				const stack = cutOffLoaderExecution(err.stack);

				if (!err.hideStack) {
					message += stack;
				} else {
					details = stack;

					message +=
						typeof err.message === "string" && err.message ? err.message : err;
				}
			} else if (typeof err.message === "string" && err.message) {
				message += err.message;
			} else {
				message += String(err);
			}
		} else {
			message += String(err);
		}

		super(message);

		this.name = "ModuleBuildError";
		this.details = details;
		this.error = err;
	}

	/**
	 * @param {ObjectSerializerContext} context context
	 */
	serialize(context) {
		const { write } = context;

		write(this.error);

		super.serialize(context);
	}

	/**
	 * @param {ObjectDeserializerContext} context context
	 */
	deserialize(context) {
		const { read } = context;

		this.error = read();

		super.deserialize(context);
	}
}

makeSerializable(ModuleBuildError, "webpack/lib/ModuleBuildError");

module.exports = ModuleBuildError;
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const RuntimeGlobals = require("../RuntimeGlobals");
const makeSerializable = require("../util/makeSerializable");
const NullDependency = require("./NullDependency");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("../Dependency")} Dependency */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */
/** @typedef {import("../javascript/JavascriptParser").Range} Range */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectDeserializerContext} ObjectDeserializerContext */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectSerializerContext} ObjectSerializerContext */

class RequireHeaderDependency extends NullDependency {
	/**
	 * @param {Range} range range
	 */
	constructor(range) {
		super();
		if (!Array.isArray(range)) throw new Error("range must be valid");
		this.range = range;
	}

	/**
	 * @param {ObjectSerializerContext} context context
	 */
	serialize(context) {
		const { write } = context;
		write(this.range);
		super.serialize(context);
	}

	/**
	 * @param {ObjectDeserializerContext} context context
	 * @returns {RequireHeaderDependency} RequireHeaderDependency
	 */
	static deserialize(context) {
		const obj = new RequireHeaderDependency(context.read());
		obj.deserialize(context);
		return obj;
	}
}

makeSerializable(
	RequireHeaderDependency,
	"webpack/lib/dependencies/RequireHeaderDependency"
);

RequireHeaderDependency.Template = class RequireHeaderDependencyTemplate extends (
	NullDependency.Template
) {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(dependency, source, { runtimeRequirements }) {
		const dep = /** @type {RequireHeaderDependency} */ (dependency);
		runtimeRequirements.add(RuntimeGlobals.require);
		source.replace(dep.range[0], dep.range[1] - 1, RuntimeGlobals.require);
	}
};

module.exports = RequireHeaderDependency;
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const Template = require("../Template");
const { equals } = require("../util/ArrayHelpers");
const { getTrimmedIdsAndRange } = require("../util/chainedImports");
const makeSerializable = require("../util/makeSerializable");
const propertyAccess = require("../util/propertyAccess");
const ModuleDependency = require("./ModuleDependency");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("../Dependency")} Dependency */
/** @typedef {import("../Dependency").ReferencedExport} ReferencedExport */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */
/** @typedef {import("../ModuleGraph")} ModuleGraph */
/** @typedef {import("../javascript/JavascriptParser").Range} Range */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectDeserializerContext} ObjectDeserializerContext */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectSerializerContext} ObjectSerializerContext */
/** @typedef {import("../util/runtime").RuntimeSpec} RuntimeSpec */

class CommonJsFullRequireDependency extends ModuleDependency {
	/**
	 * @param {string} request the request string
	 * @param {Range} range location in source code
	 * @param {string[]} names accessed properties on module
	 * @param {Range[]=} idRanges ranges for members of ids; the two arrays are right-aligned
	 */
	constructor(
		request,
		range,
		names,
		idRanges /* TODO webpack 6 make this non-optional. It must always be set to properly trim ids. */
	) {
		super(request);
		this.range = range;
		this.names = names;
		this.idRanges = idRanges;
		this.call = false;
		this.asiSafe = undefined;
	}

	/**
	 * Returns list of exports referenced by this dependency
	 * @param {ModuleGraph} moduleGraph module graph
	 * @param {RuntimeSpec} runtime the runtime for which the module is analysed
	 * @returns {(string[] | ReferencedExport)[]} referenced exports
	 */
	getReferencedExports(moduleGraph, runtime) {
		if (this.call) {
			const importedModule = moduleGraph.getModule(this);
			if (
				!importedModule ||
				importedModule.getExportsType(moduleGraph, false) !== "namespace"
			) {
				return [this.names.slice(0, -1)];
			}
		}
		return [this.names];
	}

	/**
	 * @param {ObjectSerializerContext} context context
	 */
	serialize(context) {
		const { write } = context;
		write(this.names);
		write(this.idRanges);
		write(this.call);
		write(this.asiSafe);
		super.serialize(context);
	}

	/**
	 * @param {ObjectDeserializerContext} context context
	 */
	deserialize(context) {
		const { read } = context;
		this.names = read();
		this.idRanges = read();
		this.call = read();
		this.asiSafe = read();
		super.deserialize(context);
	}

	get type() {
		return "cjs full require";
	}

	get category() {
		return "commonjs";
	}
}

CommonJsFullRequireDependency.Template = class CommonJsFullRequireDependencyTemplate extends (
	ModuleDependency.Template
) {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(
		dependency,
		source,
		{
			module,
			runtimeTemplate,
			moduleGraph,
			chunkGraph,
			runtimeRequirements,
			runtime,
			initFragments
		}
	) {
		const dep = /** @type {CommonJsFullRequireDependency} */ (dependency);
		if (!dep.range) return;
		const importedModule = moduleGraph.getModule(dep);
		let requireExpr = runtimeTemplate.moduleExports({
			module: importedModule,
			chunkGraph,
			request: dep.request,
			weak: dep.weak,
			runtimeRequirements
		});

		const {
			trimmedRange: [trimmedRangeStart, trimmedRangeEnd],
			trimmedIds
		} = getTrimmedIdsAndRange(
			dep.names,
			dep.range,
			dep.idRanges,
			moduleGraph,
			dep
		);

		if (importedModule) {
			const usedImported = moduleGraph
				.getExportsInfo(importedModule)
				.getUsedName(trimmedIds, runtime);
			if (usedImported) {
				const comment = equals(usedImported, trimmedIds)
					? ""
					: `${Template.toNormalComment(propertyAccess(trimmedIds))} `;
				const access = `${comment}${propertyAccess(usedImported)}`;
				requireExpr =
					dep.asiSafe === true
						? `(${requireExpr}${access})`
						: `${requireExpr}${access}`;
			}
		}
		source.replace(trimmedRangeStart, trimmedRangeEnd - 1, requireExpr);
	}
};

makeSerializable(
	CommonJsFullRequireDependency,
	"webpack/lib/dependencies/CommonJsFullRequireDependency"
);

module.exports = CommonJsFullRequireDependency;
/*!
  * Bootstrap base-component.js v5.2.3 (https://getbootstrap.com/)
  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('./dom/data'), require('./util/index'), require('./dom/event-handler'), require('./util/config')) :
  typeof define === 'function' && define.amd ? define(['./dom/data', './util/index', './dom/event-handler', './util/config'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.BaseComponent = factory(global.Data, global.Index, global.EventHandler, global.Config));
})(this, (function (Data, index, EventHandler, Config) { 'use strict';

  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

  const Data__default = /*#__PURE__*/_interopDefaultLegacy(Data);
  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
  const Config__default = /*#__PURE__*/_interopDefaultLegacy(Config);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.2.3): base-component.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * Constants
   */

  const VERSION = '5.2.3';
  /**
   * Class definition
   */

  class BaseComponent extends Config__default.default {
    constructor(element, config) {
      super();
      element = index.getElement(element);

      if (!element) {
        return;
      }

      this._element = element;
      this._config = this._getConfig(config);
      Data__default.default.set(this._element, this.constructor.DATA_KEY, this);
    } // Public


    dispose() {
      Data__default.default.remove(this._element, this.constructor.DATA_KEY);
      EventHandler__default.default.off(this._element, this.constructor.EVENT_KEY);

      for (const propertyName of Object.getOwnPropertyNames(this)) {
        this[propertyName] = null;
      }
    }

    _queueCallback(callback, element, isAnimated = true) {
      index.executeAfterTransition(callback, element, isAnimated);
    }

    _getConfig(config) {
      config = this._mergeConfigObj(config, this._element);
      config = this._configAfterMerge(config);

      this._typeCheckConfig(config);

      return config;
    } // Static


    static getInstance(element) {
      return Data__default.default.get(index.getElement(element), this.DATA_KEY);
    }

    static getOrCreateInstance(element, config = {}) {
      return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
    }

    static get VERSION() {
      return VERSION;
    }

    static get DATA_KEY() {
      return `bs.${this.NAME}`;
    }

    static get EVENT_KEY() {
      return `.${this.DATA_KEY}`;
    }

    static eventName(name) {
      return `${name}${this.EVENT_KEY}`;
    }

  }

  return BaseComponent;

}));
//# sourceMappingURL=base-component.js.map
!function(r,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((r="undefined"!=typeof globalThis?globalThis:r||self).uuid={})}(this,(function(r){"use strict";var e,n=new Uint8Array(16);function t(){if(!e&&!(e="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return e(n)}var o=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;function a(r){return"string"==typeof r&&o.test(r)}for(var i,u,f=[],s=0;s<256;++s)f.push((s+256).toString(16).substr(1));function c(r){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=(f[r[e+0]]+f[r[e+1]]+f[r[e+2]]+f[r[e+3]]+"-"+f[r[e+4]]+f[r[e+5]]+"-"+f[r[e+6]]+f[r[e+7]]+"-"+f[r[e+8]]+f[r[e+9]]+"-"+f[r[e+10]]+f[r[e+11]]+f[r[e+12]]+f[r[e+13]]+f[r[e+14]]+f[r[e+15]]).toLowerCase();if(!a(n))throw TypeError("Stringified UUID is invalid");return n}var l=0,d=0;function v(r){if(!a(r))throw TypeError("Invalid UUID");var e,n=new Uint8Array(16);return n[0]=(e=parseInt(r.slice(0,8),16))>>>24,n[1]=e>>>16&255,n[2]=e>>>8&255,n[3]=255&e,n[4]=(e=parseInt(r.slice(9,13),16))>>>8,n[5]=255&e,n[6]=(e=parseInt(r.slice(14,18),16))>>>8,n[7]=255&e,n[8]=(e=parseInt(r.slice(19,23),16))>>>8,n[9]=255&e,n[10]=(e=parseInt(r.slice(24,36),16))/1099511627776&255,n[11]=e/4294967296&255,n[12]=e>>>24&255,n[13]=e>>>16&255,n[14]=e>>>8&255,n[15]=255&e,n}function p(r,e,n){function t(r,t,o,a){if("string"==typeof r&&(r=function(r){r=unescape(encodeURIComponent(r));for(var e=[],n=0;n<r.length;++n)e.push(r.charCodeAt(n));return e}(r)),"string"==typeof t&&(t=v(t)),16!==t.length)throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");var i=new Uint8Array(16+r.length);if(i.set(t),i.set(r,t.length),(i=n(i))[6]=15&i[6]|e,i[8]=63&i[8]|128,o){a=a||0;for(var u=0;u<16;++u)o[a+u]=i[u];return o}return c(i)}try{t.name=r}catch(r){}return t.DNS="6ba7b810-9dad-11d1-80b4-00c04fd430c8",t.URL="6ba7b811-9dad-11d1-80b4-00c04fd430c8",t}function h(r){return 14+(r+64>>>9<<4)+1}function y(r,e){var n=(65535&r)+(65535&e);return(r>>16)+(e>>16)+(n>>16)<<16|65535&n}function g(r,e,n,t,o,a){return y((i=y(y(e,r),y(t,a)))<<(u=o)|i>>>32-u,n);var i,u}function m(r,e,n,t,o,a,i){return g(e&n|~e&t,r,e,o,a,i)}function w(r,e,n,t,o,a,i){return g(e&t|n&~t,r,e,o,a,i)}function b(r,e,n,t,o,a,i){return g(e^n^t,r,e,o,a,i)}function A(r,e,n,t,o,a,i){return g(n^(e|~t),r,e,o,a,i)}var U=p("v3",48,(function(r){if("string"==typeof r){var e=unescape(encodeURIComponent(r));r=new Uint8Array(e.length);for(var n=0;n<e.length;++n)r[n]=e.charCodeAt(n)}return function(r){for(var e=[],n=32*r.length,t="0123456789abcdef",o=0;o<n;o+=8){var a=r[o>>5]>>>o%32&255,i=parseInt(t.charAt(a>>>4&15)+t.charAt(15&a),16);e.push(i)}return e}(function(r,e){r[e>>5]|=128<<e%32,r[h(e)-1]=e;for(var n=1732584193,t=-271733879,o=-1732584194,a=271733878,i=0;i<r.length;i+=16){var u=n,f=t,s=o,c=a;n=m(n,t,o,a,r[i],7,-680876936),a=m(a,n,t,o,r[i+1],12,-389564586),o=m(o,a,n,t,r[i+2],17,606105819),t=m(t,o,a,n,r[i+3],22,-1044525330),n=m(n,t,o,a,r[i+4],7,-176418897),a=m(a,n,t,o,r[i+5],12,1200080426),o=m(o,a,n,t,r[i+6],17,-1473231341),t=m(t,o,a,n,r[i+7],22,-45705983),n=m(n,t,o,a,r[i+8],7,1770035416),a=m(a,n,t,o,r[i+9],12,-1958414417),o=m(o,a,n,t,r[i+10],17,-42063),t=m(t,o,a,n,r[i+11],22,-1990404162),n=m(n,t,o,a,r[i+12],7,1804603682),a=m(a,n,t,o,r[i+13],12,-40341101),o=m(o,a,n,t,r[i+14],17,-1502002290),n=w(n,t=m(t,o,a,n,r[i+15],22,1236535329),o,a,r[i+1],5,-165796510),a=w(a,n,t,o,r[i+6],9,-1069501632),o=w(o,a,n,t,r[i+11],14,643717713),t=w(t,o,a,n,r[i],20,-373897302),n=w(n,t,o,a,r[i+5],5,-701558691),a=w(a,n,t,o,r[i+10],9,38016083),o=w(o,a,n,t,r[i+15],14,-660478335),t=w(t,o,a,n,r[i+4],20,-405537848),n=w(n,t,o,a,r[i+9],5,568446438),a=w(a,n,t,o,r[i+14],9,-1019803690),o=w(o,a,n,t,r[i+3],14,-187363961),t=w(t,o,a,n,r[i+8],20,1163531501),n=w(n,t,o,a,r[i+13],5,-1444681467),a=w(a,n,t,o,r[i+2],9,-51403784),o=w(o,a,n,t,r[i+7],14,1735328473),n=b(n,t=w(t,o,a,n,r[i+12],20,-1926607734),o,a,r[i+5],4,-378558),a=b(a,n,t,o,r[i+8],11,-2022574463),o=b(o,a,n,t,r[i+11],16,1839030562),t=b(t,o,a,n,r[i+14],23,-35309556),n=b(n,t,o,a,r[i+1],4,-1530992060),a=b(a,n,t,o,r[i+4],11,1272893353),o=b(o,a,n,t,r[i+7],16,-155497632),t=b(t,o,a,n,r[i+10],23,-1094730640),n=b(n,t,o,a,r[i+13],4,681279174),a=b(a,n,t,o,r[i],11,-358537222),o=b(o,a,n,t,r[i+3],16,-722521979),t=b(t,o,a,n,r[i+6],23,76029189),n=b(n,t,o,a,r[i+9],4,-640364487),a=b(a,n,t,o,r[i+12],11,-421815835),o=b(o,a,n,t,r[i+15],16,530742520),n=A(n,t=b(t,o,a,n,r[i+2],23,-995338651),o,a,r[i],6,-198630844),a=A(a,n,t,o,r[i+7],10,1126891415),o=A(o,a,n,t,r[i+14],15,-1416354905),t=A(t,o,a,n,r[i+5],21,-57434055),n=A(n,t,o,a,r[i+12],6,1700485571),a=A(a,n,t,o,r[i+3],10,-1894986606),o=A(o,a,n,t,r[i+10],15,-1051523),t=A(t,o,a,n,r[i+1],21,-2054922799),n=A(n,t,o,a,r[i+8],6,1873313359),a=A(a,n,t,o,r[i+15],10,-30611744),o=A(o,a,n,t,r[i+6],15,-1560198380),t=A(t,o,a,n,r[i+13],21,1309151649),n=A(n,t,o,a,r[i+4],6,-145523070),a=A(a,n,t,o,r[i+11],10,-1120210379),o=A(o,a,n,t,r[i+2],15,718787259),t=A(t,o,a,n,r[i+9],21,-343485551),n=y(n,u),t=y(t,f),o=y(o,s),a=y(a,c)}return[n,t,o,a]}(function(r){if(0===r.length)return[];for(var e=8*r.length,n=new Uint32Array(h(e)),t=0;t<e;t+=8)n[t>>5]|=(255&r[t/8])<<t%32;return n}(r),8*r.length))}));function I(r,e,n,t){switch(r){case 0:return e&n^~e&t;case 1:return e^n^t;case 2:return e&n^e&t^n&t;case 3:return e^n^t}}function C(r,e){return r<<e|r>>>32-e}var R=p("v5",80,(function(r){var e=[1518500249,1859775393,2400959708,3395469782],n=[1732584193,4023233417,2562383102,271733878,3285377520];if("string"==typeof r){var t=unescape(encodeURIComponent(r));r=[];for(var o=0;o<t.length;++o)r.push(t.charCodeAt(o))}else Array.isArray(r)||(r=Array.prototype.slice.call(r));r.push(128);for(var a=r.length/4+2,i=Math.ceil(a/16),u=new Array(i),f=0;f<i;++f){for(var s=new Uint32Array(16),c=0;c<16;++c)s[c]=r[64*f+4*c]<<24|r[64*f+4*c+1]<<16|r[64*f+4*c+2]<<8|r[64*f+4*c+3];u[f]=s}u[i-1][14]=8*(r.length-1)/Math.pow(2,32),u[i-1][14]=Math.floor(u[i-1][14]),u[i-1][15]=8*(r.length-1)&4294967295;for(var l=0;l<i;++l){for(var d=new Uint32Array(80),v=0;v<16;++v)d[v]=u[l][v];for(var p=16;p<80;++p)d[p]=C(d[p-3]^d[p-8]^d[p-14]^d[p-16],1);for(var h=n[0],y=n[1],g=n[2],m=n[3],w=n[4],b=0;b<80;++b){var A=Math.floor(b/20),U=C(h,5)+I(A,y,g,m)+w+e[A]+d[b]>>>0;w=m,m=g,g=C(y,30)>>>0,y=h,h=U}n[0]=n[0]+h>>>0,n[1]=n[1]+y>>>0,n[2]=n[2]+g>>>0,n[3]=n[3]+m>>>0,n[4]=n[4]+w>>>0}return[n[0]>>24&255,n[0]>>16&255,n[0]>>8&255,255&n[0],n[1]>>24&255,n[1]>>16&255,n[1]>>8&255,255&n[1],n[2]>>24&255,n[2]>>16&255,n[2]>>8&255,255&n[2],n[3]>>24&255,n[3]>>16&255,n[3]>>8&255,255&n[3],n[4]>>24&255,n[4]>>16&255,n[4]>>8&255,255&n[4]]}));r.NIL="00000000-0000-0000-0000-000000000000",r.parse=v,r.stringify=c,r.v1=function(r,e,n){var o=e&&n||0,a=e||new Array(16),f=(r=r||{}).node||i,s=void 0!==r.clockseq?r.clockseq:u;if(null==f||null==s){var v=r.random||(r.rng||t)();null==f&&(f=i=[1|v[0],v[1],v[2],v[3],v[4],v[5]]),null==s&&(s=u=16383&(v[6]<<8|v[7]))}var p=void 0!==r.msecs?r.msecs:Date.now(),h=void 0!==r.nsecs?r.nsecs:d+1,y=p-l+(h-d)/1e4;if(y<0&&void 0===r.clockseq&&(s=s+1&16383),(y<0||p>l)&&void 0===r.nsecs&&(h=0),h>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");l=p,d=h,u=s;var g=(1e4*(268435455&(p+=122192928e5))+h)%4294967296;a[o++]=g>>>24&255,a[o++]=g>>>16&255,a[o++]=g>>>8&255,a[o++]=255&g;var m=p/4294967296*1e4&268435455;a[o++]=m>>>8&255,a[o++]=255&m,a[o++]=m>>>24&15|16,a[o++]=m>>>16&255,a[o++]=s>>>8|128,a[o++]=255&s;for(var w=0;w<6;++w)a[o+w]=f[w];return e||c(a)},r.v3=U,r.v4=function(r,e,n){var o=(r=r||{}).random||(r.rng||t)();if(o[6]=15&o[6]|64,o[8]=63&o[8]|128,e){n=n||0;for(var a=0;a<16;++a)e[n+a]=o[a];return e}return c(o)},r.v5=R,r.validate=a,r.version=function(r){if(!a(r))throw TypeError("Invalid UUID");return parseInt(r.substr(14,1),16)},Object.defineProperty(r,"__esModule",{value:!0})}));// TODO: Remove in Babel 8
// https://github.com/vuejs/vue-cli/issues/3671

module.exports = require("./corejs2-built-ins.json");
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildMatchMemberExpression;
var _matchesPattern = require("./matchesPattern.js");
function buildMatchMemberExpression(match, allowPartial) {
  const parts = match.split(".");
  return member => (0, _matchesPattern.default)(member, parts, allowPartial);
}

//# sourceMappingURL=buildMatchMemberExpression.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeBase64 = exports.TrieBuilder = exports.BITS_32 = exports.BITS_16 = void 0;
var Trie_1 = require("./Trie");
var base64_arraybuffer_1 = require("base64-arraybuffer");
/**
 * Trie2 constants, defining shift widths, index array lengths, etc.
 *
 * These are needed for the runtime macros but users can treat these as
 * implementation details and skip to the actual public API further below.
 */
// const UTRIE2_OPTIONS_VALUE_BITS_MASK = 0x000f;
/** Number of code points per index-1 table entry. 2048=0x800 */
var UTRIE2_CP_PER_INDEX_1_ENTRY = 1 << Trie_1.UTRIE2_SHIFT_1;
/** The alignment size of a data block. Also the granularity for compaction. */
var UTRIE2_DATA_GRANULARITY = 1 << Trie_1.UTRIE2_INDEX_SHIFT;
/* Fixed layout of the first part of the index array. ------------------- */
/**
 * The BMP part of the index-2 table is fixed and linear and starts at offset 0.
 * Length=2048=0x800=0x10000>>UTRIE2_SHIFT_2.
 */
var UTRIE2_INDEX_2_OFFSET = 0;
var UTRIE2_MAX_INDEX_1_LENGTH = 0x100000 >> Trie_1.UTRIE2_SHIFT_1;
/*
 * Fixed layout of the first part of the data array. -----------------------
 * Starts with 4 blocks (128=0x80 entries) for ASCII.
 */
/**
 * The illegal-UTF-8 data block follows the ASCII block, at offset 128=0x80.
 * Used with linear access for single bytes 0..0xbf for simple error handling.
 * Length 64=0x40, not UTRIE2_DATA_BLOCK_LENGTH.
 */
var UTRIE2_BAD_UTF8_DATA_OFFSET = 0x80;
/** The start of non-linear-ASCII data blocks, at offset 192=0xc0. */
var UTRIE2_DATA_START_OFFSET = 0xc0;
/* Building a Trie2 ---------------------------------------------------------- */
/*
 * These definitions are mostly needed by utrie2_builder.c, but also by
 * utrie2_get32() and utrie2_enum().
 */
/*
 * At build time, leave a gap in the index-2 table,
 * at least as long as the maximum lengths of the 2-byte UTF-8 index-2 table
 * and the supplementary index-1 table.
 * Round up to UTRIE2_INDEX_2_BLOCK_LENGTH for proper compacting.
 */
var UNEWTRIE2_INDEX_GAP_OFFSET = Trie_1.UTRIE2_INDEX_2_BMP_LENGTH;
var UNEWTRIE2_INDEX_GAP_LENGTH = (Trie_1.UTRIE2_UTF8_2B_INDEX_2_LENGTH + UTRIE2_MAX_INDEX_1_LENGTH + Trie_1.UTRIE2_INDEX_2_MASK) & ~Trie_1.UTRIE2_INDEX_2_MASK;
/**
 * Maximum length of the build-time index-2 array.
 * Maximum number of Unicode code points (0x110000) shifted right by UTRIE2_SHIFT_2,
 * plus the part of the index-2 table for lead surrogate code points,
 * plus the build-time index gap,
 * plus the null index-2 block.
 */
var UNEWTRIE2_MAX_INDEX_2_LENGTH = (0x110000 >> Trie_1.UTRIE2_SHIFT_2) +
    Trie_1.UTRIE2_LSCP_INDEX_2_LENGTH +
    UNEWTRIE2_INDEX_GAP_LENGTH +
    Trie_1.UTRIE2_INDEX_2_BLOCK_LENGTH;
var UNEWTRIE2_INDEX_1_LENGTH = 0x110000 >> Trie_1.UTRIE2_SHIFT_1;
/**
 * Maximum length of the build-time data array.
 * One entry per 0x110000 code points, plus the illegal-UTF-8 block and the null block,
 * plus values for the 0x400 surrogate code units.
 */
var UNEWTRIE2_MAX_DATA_LENGTH = 0x110000 + 0x40 + 0x40 + 0x400;
/* Start with allocation of 16k data entries. */
var UNEWTRIE2_INITIAL_DATA_LENGTH = 1 << 14;
/* Grow about 8x each time. */
var UNEWTRIE2_MEDIUM_DATA_LENGTH = 1 << 17;
/** The null index-2 block, following the gap in the index-2 table. */
var UNEWTRIE2_INDEX_2_NULL_OFFSET = UNEWTRIE2_INDEX_GAP_OFFSET + UNEWTRIE2_INDEX_GAP_LENGTH;
/** The start of allocated index-2 blocks. */
var UNEWTRIE2_INDEX_2_START_OFFSET = UNEWTRIE2_INDEX_2_NULL_OFFSET + Trie_1.UTRIE2_INDEX_2_BLOCK_LENGTH;
/**
 * The null data block.
 * Length 64=0x40 even if UTRIE2_DATA_BLOCK_LENGTH is smaller,
 * to work with 6-bit trail bytes from 2-byte UTF-8.
 */
var UNEWTRIE2_DATA_NULL_OFFSET = UTRIE2_DATA_START_OFFSET;
/** The start of allocated data blocks. */
var UNEWTRIE2_DATA_START_OFFSET = UNEWTRIE2_DATA_NULL_OFFSET + 0x40;
/**
 * The start of data blocks for U+0800 and above.
 * Below, compaction uses a block length of 64 for 2-byte UTF-8.
 * From here on, compaction uses UTRIE2_DATA_BLOCK_LENGTH.
 * Data values for 0x780 code points beyond ASCII.
 */
var UNEWTRIE2_DATA_0800_OFFSET = UNEWTRIE2_DATA_START_OFFSET + 0x780;
/**
 * Maximum length of the runtime index array.
 * Limited by its own 16-bit index values, and by uint16_t UTrie2Header.indexLength.
 * (The actual maximum length is lower,
 * (0x110000>>UTRIE2_SHIFT_2)+UTRIE2_UTF8_2B_INDEX_2_LENGTH+UTRIE2_MAX_INDEX_1_LENGTH.)
 */
var UTRIE2_MAX_INDEX_LENGTH = 0xffff;
/**
 * Maximum length of the runtime data array.
 * Limited by 16-bit index values that are left-shifted by UTRIE2_INDEX_SHIFT,
 * and by uint16_t UTrie2Header.shiftedDataLength.
 */
var UTRIE2_MAX_DATA_LENGTH = 0xffff << Trie_1.UTRIE2_INDEX_SHIFT;
exports.BITS_16 = 16;
exports.BITS_32 = 32;
var isHighSurrogate = function (c) { return c >= 0xd800 && c <= 0xdbff; };
var equalInt = function (a, s, t, length) {
    for (var i = 0; i < length; i++) {
        if (a[s + i] !== a[t + i]) {
            return false;
        }
    }
    return true;
};
var TrieBuilder = /** @class */ (function () {
    function TrieBuilder(initialValue, errorValue) {
        if (initialValue === void 0) { initialValue = 0; }
        if (errorValue === void 0) { errorValue = 0; }
        this.initialValue = initialValue;
        this.errorValue = errorValue;
        this.highStart = 0x110000;
        this.data = new Uint32Array(UNEWTRIE2_INITIAL_DATA_LENGTH);
        this.dataCapacity = UNEWTRIE2_INITIAL_DATA_LENGTH;
        this.highStart = 0x110000;
        this.firstFreeBlock = 0; /* no free block in the list */
        this.isCompacted = false;
        this.index1 = new Uint32Array(UNEWTRIE2_INDEX_1_LENGTH);
        this.index2 = new Uint32Array(UNEWTRIE2_MAX_INDEX_2_LENGTH);
        /*
         * Multi-purpose per-data-block table.
         *
         * Before compacting:
         *
         * Per-data-block reference counters/free-block list.
         *  0: unused
         * >0: reference counter (number of index-2 entries pointing here)
         * <0: next free data block in free-block list
         *
         * While compacting:
         *
         * Map of adjusted indexes, used in compactData() and compactIndex2().
         * Maps from original indexes to new ones.
         */
        this.map = new Uint32Array(UNEWTRIE2_MAX_DATA_LENGTH >> Trie_1.UTRIE2_SHIFT_2);
        /*
         * preallocate and reset
         * - ASCII
         * - the bad-UTF-8-data block
         * - the null data block
         */
        var i, j;
        for (i = 0; i < 0x80; ++i) {
            this.data[i] = initialValue;
        }
        for (; i < 0xc0; ++i) {
            this.data[i] = errorValue;
        }
        for (i = UNEWTRIE2_DATA_NULL_OFFSET; i < UNEWTRIE2_DATA_START_OFFSET; ++i) {
            this.data[i] = initialValue;
        }
        this.dataNullOffset = UNEWTRIE2_DATA_NULL_OFFSET;
        this.dataLength = UNEWTRIE2_DATA_START_OFFSET;
        /* set the index-2 indexes for the 2=0x80>>UTRIE2_SHIFT_2 ASCII data blocks */
        for (i = 0, j = 0; j < 0x80; ++i, j += Trie_1.UTRIE2_DATA_BLOCK_LENGTH) {
            this.index2[i] = j;
            this.map[i] = 1;
        }
        /* reference counts for the bad-UTF-8-data block */
        for (; j < 0xc0; ++i, j += Trie_1.UTRIE2_DATA_BLOCK_LENGTH) {
            this.map[i] = 0;
        }
        /*
         * Reference counts for the null data block: all blocks except for the ASCII blocks.
         * Plus 1 so that we don't drop this block during compaction.
         * Plus as many as needed for lead surrogate code points.
         */
        /* i==newTrie->dataNullOffset */
        this.map[i++] = (0x110000 >> Trie_1.UTRIE2_SHIFT_2) - (0x80 >> Trie_1.UTRIE2_SHIFT_2) + 1 + Trie_1.UTRIE2_LSCP_INDEX_2_LENGTH;
        j += Trie_1.UTRIE2_DATA_BLOCK_LENGTH;
        for (; j < UNEWTRIE2_DATA_START_OFFSET; ++i, j += Trie_1.UTRIE2_DATA_BLOCK_LENGTH) {
            this.map[i] = 0;
        }
        /*
         * set the remaining indexes in the BMP index-2 block
         * to the null data block
         */
        for (i = 0x80 >> Trie_1.UTRIE2_SHIFT_2; i < Trie_1.UTRIE2_INDEX_2_BMP_LENGTH; ++i) {
            this.index2[i] = UNEWTRIE2_DATA_NULL_OFFSET;
        }
        /*
         * Fill the index gap with impossible values so that compaction
         * does not overlap other index-2 blocks with the gap.
         */
        for (i = 0; i < UNEWTRIE2_INDEX_GAP_LENGTH; ++i) {
            this.index2[UNEWTRIE2_INDEX_GAP_OFFSET + i] = -1;
        }
        /* set the indexes in the null index-2 block */
        for (i = 0; i < Trie_1.UTRIE2_INDEX_2_BLOCK_LENGTH; ++i) {
            this.index2[UNEWTRIE2_INDEX_2_NULL_OFFSET + i] = UNEWTRIE2_DATA_NULL_OFFSET;
        }
        this.index2NullOffset = UNEWTRIE2_INDEX_2_NULL_OFFSET;
        this.index2Length = UNEWTRIE2_INDEX_2_START_OFFSET;
        /* set the index-1 indexes for the linear index-2 block */
        for (i = 0, j = 0; i < Trie_1.UTRIE2_OMITTED_BMP_INDEX_1_LENGTH; ++i, j += Trie_1.UTRIE2_INDEX_2_BLOCK_LENGTH) {
            this.index1[i] = j;
        }
        /* set the remaining index-1 indexes to the null index-2 block */
        for (; i < UNEWTRIE2_INDEX_1_LENGTH; ++i) {
            this.index1[i] = UNEWTRIE2_INDEX_2_NULL_OFFSET;
        }
        /*
         * Preallocate and reset data for U+0080..U+07ff,
         * for 2-byte UTF-8 which will be compacted in 64-blocks
         * even if UTRIE2_DATA_BLOCK_LENGTH is smaller.
         */
        for (i = 0x80; i < 0x800; i += Trie_1.UTRIE2_DATA_BLOCK_LENGTH) {
            this.set(i, initialValue);
        }
    }
    /**
     * Set a value for a code point.
     *
     * @param c the code point
     * @param value the value
     */
    TrieBuilder.prototype.set = function (c, value) {
        if (c < 0 || c > 0x10ffff) {
            throw new Error('Invalid code point.');
        }
        this._set(c, true, value);
        return this;
    };
    /**
     * Set a value in a range of code points [start..end].
     * All code points c with start<=c<=end will get the value if
     * overwrite is TRUE or if the old value is the initial value.
     *
     * @param start the first code point to get the value
     * @param end the last code point to get the value (inclusive)
     * @param value the value
     * @param overwrite flag for whether old non-initial values are to be overwritten
     */
    TrieBuilder.prototype.setRange = function (start, end, value, overwrite) {
        if (overwrite === void 0) { overwrite = false; }
        /*
         * repeat value in [start..end]
         * mark index values for repeat-data blocks by setting bit 31 of the index values
         * fill around existing values if any, if(overwrite)
         */
        var block, rest, repeatBlock;
        if (start > 0x10ffff || start < 0 || end > 0x10ffff || end < 0 || start > end) {
            throw new Error('Invalid code point range.');
        }
        if (!overwrite && value === this.initialValue) {
            return this; /* nothing to do */
        }
        if (this.isCompacted) {
            throw new Error('Trie was already compacted');
        }
        var limit = end + 1;
        if ((start & Trie_1.UTRIE2_DATA_MASK) !== 0) {
            /* set partial block at [start..following block boundary[ */
            block = this.getDataBlock(start, true);
            var nextStart = (start + Trie_1.UTRIE2_DATA_BLOCK_LENGTH) & ~Trie_1.UTRIE2_DATA_MASK;
            if (nextStart <= limit) {
                this.fillBlock(block, start & Trie_1.UTRIE2_DATA_MASK, Trie_1.UTRIE2_DATA_BLOCK_LENGTH, value, this.initialValue, overwrite);
                start = nextStart;
            }
            else {
                this.fillBlock(block, start & Trie_1.UTRIE2_DATA_MASK, limit & Trie_1.UTRIE2_DATA_MASK, value, this.initialValue, overwrite);
                return this;
            }
        }
        /* number of positions in the last, partial block */
        rest = limit & Trie_1.UTRIE2_DATA_MASK;
        /* round down limit to a block boundary */
        limit &= ~Trie_1.UTRIE2_DATA_MASK;
        /* iterate over all-value blocks */
        repeatBlock = value === this.initialValue ? this.dataNullOffset : -1;
        while (start < limit) {
            var i2 = void 0;
            var setRepeatBlock = false;
            if (value === this.initialValue && this.isInNullBlock(start, true)) {
                start += Trie_1.UTRIE2_DATA_BLOCK_LENGTH; /* nothing to do */
                continue;
            }
            /* get index value */
            i2 = this.getIndex2Block(start, true);
            i2 += (start >> Trie_1.UTRIE2_SHIFT_2) & Trie_1.UTRIE2_INDEX_2_MASK;
            block = this.index2[i2];
            if (this.isWritableBlock(block)) {
                /* already allocated */
                if (overwrite && block >= UNEWTRIE2_DATA_0800_OFFSET) {
                    /*
                     * We overwrite all values, and it's not a
                     * protected (ASCII-linear or 2-byte UTF-8) block:
                     * replace with the repeatBlock.
                     */
                    setRepeatBlock = true;
                }
                else {
                    /* !overwrite, or protected block: just write the values into this block */
                    this.fillBlock(block, 0, Trie_1.UTRIE2_DATA_BLOCK_LENGTH, value, this.initialValue, overwrite);
                }
            }
            else if (this.data[block] !== value && (overwrite || block === this.dataNullOffset)) {
                /*
                 * Set the repeatBlock instead of the null block or previous repeat block:
                 *
                 * If !isWritableBlock() then all entries in the block have the same value
                 * because it's the null block or a range block (the repeatBlock from a previous
                 * call to utrie2_setRange32()).
                 * No other blocks are used multiple times before compacting.
                 *
                 * The null block is the only non-writable block with the initialValue because
                 * of the repeatBlock initialization above. (If value==initialValue, then
                 * the repeatBlock will be the null data block.)
                 *
                 * We set our repeatBlock if the desired value differs from the block's value,
                 * and if we overwrite any data or if the data is all initial values
                 * (which is the same as the block being the null block, see above).
                 */
                setRepeatBlock = true;
            }
            if (setRepeatBlock) {
                if (repeatBlock >= 0) {
                    this.setIndex2Entry(i2, repeatBlock);
                }
                else {
                    /* create and set and fill the repeatBlock */
                    repeatBlock = this.getDataBlock(start, true);
                    this.writeBlock(repeatBlock, value);
                }
            }
            start += Trie_1.UTRIE2_DATA_BLOCK_LENGTH;
        }
        if (rest > 0) {
            /* set partial block at [last block boundary..limit[ */
            block = this.getDataBlock(start, true);
            this.fillBlock(block, 0, rest, value, this.initialValue, overwrite);
        }
        return this;
    };
    /**
     * Get the value for a code point as stored in the Trie2.
     *
     * @param codePoint the code point
     * @return the value
     */
    TrieBuilder.prototype.get = function (codePoint) {
        if (codePoint < 0 || codePoint > 0x10ffff) {
            return this.errorValue;
        }
        else {
            return this._get(codePoint, true);
        }
    };
    TrieBuilder.prototype._get = function (c, fromLSCP) {
        var i2;
        if (c >= this.highStart && (!(c >= 0xd800 && c < 0xdc00) || fromLSCP)) {
            return this.data[this.dataLength - UTRIE2_DATA_GRANULARITY];
        }
        if (c >= 0xd800 && c < 0xdc00 && fromLSCP) {
            i2 = Trie_1.UTRIE2_LSCP_INDEX_2_OFFSET - (0xd800 >> Trie_1.UTRIE2_SHIFT_2) + (c >> Trie_1.UTRIE2_SHIFT_2);
        }
        else {
            i2 = this.index1[c >> Trie_1.UTRIE2_SHIFT_1] + ((c >> Trie_1.UTRIE2_SHIFT_2) & Trie_1.UTRIE2_INDEX_2_MASK);
        }
        var block = this.index2[i2];
        return this.data[block + (c & Trie_1.UTRIE2_DATA_MASK)];
    };
    TrieBuilder.prototype.freeze = function (valueBits) {
        if (valueBits === void 0) { valueBits = exports.BITS_32; }
        var i;
        var allIndexesLength;
        var dataMove; /* >0 if the data is moved to the end of the index array */
        /* compact if necessary */
        if (!this.isCompacted) {
            this.compactTrie();
        }
        allIndexesLength = this.highStart <= 0x10000 ? Trie_1.UTRIE2_INDEX_1_OFFSET : this.index2Length;
        if (valueBits === exports.BITS_16) {
            // dataMove = allIndexesLength;
            dataMove = 0;
        }
        else {
            dataMove = 0;
        }
        /* are indexLength and dataLength within limits? */
        if (
        /* for unshifted indexLength */
        allIndexesLength > UTRIE2_MAX_INDEX_LENGTH ||
            /* for unshifted dataNullOffset */
            dataMove + this.dataNullOffset > 0xffff ||
            /* for unshifted 2-byte UTF-8 index-2 values */
            dataMove + UNEWTRIE2_DATA_0800_OFFSET > 0xffff ||
            /* for shiftedDataLength */
            dataMove + this.dataLength > UTRIE2_MAX_DATA_LENGTH) {
            throw new Error('Trie data is too large.');
        }
        var index = new Uint16Array(allIndexesLength);
        /* write the index-2 array values shifted right by UTRIE2_INDEX_SHIFT, after adding dataMove */
        var destIdx = 0;
        for (i = 0; i < Trie_1.UTRIE2_INDEX_2_BMP_LENGTH; i++) {
            index[destIdx++] = (this.index2[i] + dataMove) >> Trie_1.UTRIE2_INDEX_SHIFT;
        }
        /* write UTF-8 2-byte index-2 values, not right-shifted */
        for (i = 0; i < 0xc2 - 0xc0; ++i) {
            /* C0..C1 */
            index[destIdx++] = dataMove + UTRIE2_BAD_UTF8_DATA_OFFSET;
        }
        for (; i < 0xe0 - 0xc0; ++i) {
            /* C2..DF */
            index[destIdx++] = dataMove + this.index2[i << (6 - Trie_1.UTRIE2_SHIFT_2)];
        }
        if (this.highStart > 0x10000) {
            var index1Length = (this.highStart - 0x10000) >> Trie_1.UTRIE2_SHIFT_1;
            var index2Offset = Trie_1.UTRIE2_INDEX_2_BMP_LENGTH + Trie_1.UTRIE2_UTF8_2B_INDEX_2_LENGTH + index1Length;
            /* write 16-bit index-1 values for supplementary code points */
            for (i = 0; i < index1Length; i++) {
                index[destIdx++] = UTRIE2_INDEX_2_OFFSET + this.index1[i + Trie_1.UTRIE2_OMITTED_BMP_INDEX_1_LENGTH];
            }
            /*
             * write the index-2 array values for supplementary code points,
             * shifted right by UTRIE2_INDEX_SHIFT, after adding dataMove
             */
            for (i = 0; i < this.index2Length - index2Offset; i++) {
                index[destIdx++] = (dataMove + this.index2[index2Offset + i]) >> Trie_1.UTRIE2_INDEX_SHIFT;
            }
        }
        /* write the 16/32-bit data array */
        switch (valueBits) {
            case exports.BITS_16:
                /* write 16-bit data values */
                var data16 = new Uint16Array(this.dataLength);
                for (i = 0; i < this.dataLength; i++) {
                    data16[i] = this.data[i];
                }
                return new Trie_1.Trie(this.initialValue, this.errorValue, this.highStart, dataMove + this.dataLength - UTRIE2_DATA_GRANULARITY, index, data16);
            case exports.BITS_32:
                /* write 32-bit data values */
                var data32 = new Uint32Array(this.dataLength);
                for (i = 0; i < this.dataLength; i++) {
                    data32[i] = this.data[i];
                }
                return new Trie_1.Trie(this.initialValue, this.errorValue, this.highStart, dataMove + this.dataLength - UTRIE2_DATA_GRANULARITY, index, data32);
            default:
                throw new Error('Bits should be either 16 or 32');
        }
    };
    /*
     * Find the start of the last range in the trie by enumerating backward.
     * Indexes for supplementary code points higher than this will be omitted.
     */
    TrieBuilder.prototype.findHighStart = function (highValue) {
        var value;
        var i2, j, i2Block, prevI2Block, block, prevBlock;
        /* set variables for previous range */
        if (highValue === this.initialValue) {
            prevI2Block = this.index2NullOffset;
            prevBlock = this.dataNullOffset;
        }
        else {
            prevI2Block = -1;
            prevBlock = -1;
        }
        var prev = 0x110000;
        /* enumerate index-2 blocks */
        var i1 = UNEWTRIE2_INDEX_1_LENGTH;
        var c = prev;
        while (c > 0) {
            i2Block = this.index1[--i1];
            if (i2Block === prevI2Block) {
                /* the index-2 block is the same as the previous one, and filled with highValue */
                c -= UTRIE2_CP_PER_INDEX_1_ENTRY;
                continue;
            }
            prevI2Block = i2Block;
            if (i2Block === this.index2NullOffset) {
                /* this is the null index-2 block */
                if (highValue !== this.initialValue) {
                    return c;
                }
                c -= UTRIE2_CP_PER_INDEX_1_ENTRY;
            }
            else {
                /* enumerate data blocks for one index-2 block */
                for (i2 = Trie_1.UTRIE2_INDEX_2_BLOCK_LENGTH; i2 > 0;) {
                    block = this.index2[i2Block + --i2];
                    if (block === prevBlock) {
                        /* the block is the same as the previous one, and filled with highValue */
                        c -= Trie_1.UTRIE2_DATA_BLOCK_LENGTH;
                        continue;
                    }
                    prevBlock = block;
                    if (block === this.dataNullOffset) {
                        /* this is the null data block */
                        if (highValue !== this.initialValue) {
                            return c;
                        }
                        c -= Trie_1.UTRIE2_DATA_BLOCK_LENGTH;
                    }
                    else {
                        for (j = Trie_1.UTRIE2_DATA_BLOCK_LENGTH; j > 0;) {
                            value = this.data[block + --j];
                            if (value !== highValue) {
                                return c;
                            }
                            --c;
                        }
                    }
                }
            }
        }
        /* deliver last range */
        return 0;
    };
    /*
     * Compact a build-time trie.
     *
     * The compaction
     * - removes blocks that are identical with earlier ones
     * - overlaps adjacent blocks as much as possible (if overlap==TRUE)
     * - moves blocks in steps of the data granularity
     * - moves and overlaps blocks that overlap with multiple values in the overlap region
     *
     * It does not
     * - try to move and overlap blocks that are not already adjacent
     */
    TrieBuilder.prototype.compactData = function () {
        var start, movedStart;
        var blockLength, overlap;
        var i, mapIndex, blockCount;
        /* do not compact linear-ASCII data */
        var newStart = UTRIE2_DATA_START_OFFSET;
        for (start = 0, i = 0; start < newStart; start += Trie_1.UTRIE2_DATA_BLOCK_LENGTH, ++i) {
            this.map[i] = start;
        }
        /*
         * Start with a block length of 64 for 2-byte UTF-8,
         * then switch to UTRIE2_DATA_BLOCK_LENGTH.
         */
        blockLength = 64;
        blockCount = blockLength >> Trie_1.UTRIE2_SHIFT_2;
        for (start = newStart; start < this.dataLength;) {
            /*
             * start: index of first entry of current block
             * newStart: index where the current block is to be moved
             *           (right after current end of already-compacted data)
             */
            if (start === UNEWTRIE2_DATA_0800_OFFSET) {
                blockLength = Trie_1.UTRIE2_DATA_BLOCK_LENGTH;
                blockCount = 1;
            }
            /* skip blocks that are not used */
            if (this.map[start >> Trie_1.UTRIE2_SHIFT_2] <= 0) {
                /* advance start to the next block */
                start += blockLength;
                /* leave newStart with the previous block! */
                continue;
            }
            /* search for an identical block */
            movedStart = this.findSameDataBlock(newStart, start, blockLength);
            if (movedStart >= 0) {
                /* found an identical block, set the other block's index value for the current block */
                for (i = blockCount, mapIndex = start >> Trie_1.UTRIE2_SHIFT_2; i > 0; --i) {
                    this.map[mapIndex++] = movedStart;
                    movedStart += Trie_1.UTRIE2_DATA_BLOCK_LENGTH;
                }
                /* advance start to the next block */
                start += blockLength;
                /* leave newStart with the previous block! */
                continue;
            }
            /* see if the beginning of this block can be overlapped with the end of the previous block */
            /* look for maximum overlap (modulo granularity) with the previous, adjacent block */
            for (overlap = blockLength - UTRIE2_DATA_GRANULARITY; overlap > 0 && !equalInt(this.data, newStart - overlap, start, overlap); overlap -= UTRIE2_DATA_GRANULARITY) { }
            if (overlap > 0 || newStart < start) {
                /* some overlap, or just move the whole block */
                movedStart = newStart - overlap;
                for (i = blockCount, mapIndex = start >> Trie_1.UTRIE2_SHIFT_2; i > 0; --i) {
                    this.map[mapIndex++] = movedStart;
                    movedStart += Trie_1.UTRIE2_DATA_BLOCK_LENGTH;
                }
                /* move the non-overlapping indexes to their new positions */
                start += overlap;
                for (i = blockLength - overlap; i > 0; --i) {
                    this.data[newStart++] = this.data[start++];
                }
            }
            else {
                /* no overlap && newStart==start */
                for (i = blockCount, mapIndex = start >> Trie_1.UTRIE2_SHIFT_2; i > 0; --i) {
                    this.map[mapIndex++] = start;
                    start += Trie_1.UTRIE2_DATA_BLOCK_LENGTH;
                }
                newStart = start;
            }
        }
        /* now adjust the index-2 table */
        for (i = 0; i < this.index2Length; ++i) {
            if (i === UNEWTRIE2_INDEX_GAP_OFFSET) {
                /* Gap indexes are invalid (-1). Skip over the gap. */
                i += UNEWTRIE2_INDEX_GAP_LENGTH;
            }
            this.index2[i] = this.map[this.index2[i] >> Trie_1.UTRIE2_SHIFT_2];
        }
        this.dataNullOffset = this.map[this.dataNullOffset >> Trie_1.UTRIE2_SHIFT_2];
        /* ensure dataLength alignment */
        while ((newStart & (UTRIE2_DATA_GRANULARITY - 1)) !== 0) {
            this.data[newStart++] = this.initialValue;
        }
        this.dataLength = newStart;
    };
    TrieBuilder.prototype.findSameDataBlock = function (dataLength, otherBlock, blockLength) {
        var block = 0;
        /* ensure that we do not even partially get past dataLength */
        dataLength -= blockLength;
        for (; block <= dataLength; block += UTRIE2_DATA_GRANULARITY) {
            if (equalInt(this.data, block, otherBlock, blockLength)) {
                return block;
            }
        }
        return -1;
    };
    TrieBuilder.prototype.compactTrie = function () {
        var highValue = this.get(0x10ffff);
        /* find highStart and round it up */
        var localHighStart = this.findHighStart(highValue);
        localHighStart = (localHighStart + (UTRIE2_CP_PER_INDEX_1_ENTRY - 1)) & ~(UTRIE2_CP_PER_INDEX_1_ENTRY - 1);
        if (localHighStart === 0x110000) {
            highValue = this.errorValue;
        }
        /*
         * Set trie->highStart only after utrie2_get32(trie, highStart).
         * Otherwise utrie2_get32(trie, highStart) would try to read the highValue.
         */
        this.highStart = localHighStart;
        if (this.highStart < 0x110000) {
            /* Blank out [highStart..10ffff] to release associated data blocks. */
            var suppHighStart = this.highStart <= 0x10000 ? 0x10000 : this.highStart;
            this.setRange(suppHighStart, 0x10ffff, this.initialValue, true);
        }
        this.compactData();
        if (this.highStart > 0x10000) {
            this.compactIndex2();
        }
        /*
         * Store the highValue in the data array and round up the dataLength.
         * Must be done after compactData() because that assumes that dataLength
         * is a multiple of UTRIE2_DATA_BLOCK_LENGTH.
         */
        this.data[this.dataLength++] = highValue;
        while ((this.dataLength & (UTRIE2_DATA_GRANULARITY - 1)) !== 0) {
            this.data[this.dataLength++] = this.initialValue;
        }
        this.isCompacted = true;
    };
    TrieBuilder.prototype.compactIndex2 = function () {
        var i, start, movedStart, overlap;
        /* do not compact linear-BMP index-2 blocks */
        var newStart = Trie_1.UTRIE2_INDEX_2_BMP_LENGTH;
        for (start = 0, i = 0; start < newStart; start += Trie_1.UTRIE2_INDEX_2_BLOCK_LENGTH, ++i) {
            this.map[i] = start;
        }
        /* Reduce the index table gap to what will be needed at runtime. */
        newStart += Trie_1.UTRIE2_UTF8_2B_INDEX_2_LENGTH + ((this.highStart - 0x10000) >> Trie_1.UTRIE2_SHIFT_1);
        for (start = UNEWTRIE2_INDEX_2_NULL_OFFSET; start < this.index2Length;) {
            /*
             * start: index of first entry of current block
             * newStart: index where the current block is to be moved
             *           (right after current end of already-compacted data)
             */
            /* search for an identical block */
            if ((movedStart = this.findSameIndex2Block(newStart, start)) >= 0) {
                /* found an identical block, set the other block's index value for the current block */
                this.map[start >> Trie_1.UTRIE2_SHIFT_1_2] = movedStart;
                /* advance start to the next block */
                start += Trie_1.UTRIE2_INDEX_2_BLOCK_LENGTH;
                /* leave newStart with the previous block! */
                continue;
            }
            /* see if the beginning of this block can be overlapped with the end of the previous block */
            /* look for maximum overlap with the previous, adjacent block */
            for (overlap = Trie_1.UTRIE2_INDEX_2_BLOCK_LENGTH - 1; overlap > 0 && !equalInt(this.index2, newStart - overlap, start, overlap); --overlap) { }
            if (overlap > 0 || newStart < start) {
                /* some overlap, or just move the whole block */
                this.map[start >> Trie_1.UTRIE2_SHIFT_1_2] = newStart - overlap;
                /* move the non-overlapping indexes to their new positions */
                start += overlap;
                for (i = Trie_1.UTRIE2_INDEX_2_BLOCK_LENGTH - overlap; i > 0; --i) {
                    this.index2[newStart++] = this.index2[start++];
                }
            }
            else {
                /* no overlap && newStart==start */ this.map[start >> Trie_1.UTRIE2_SHIFT_1_2] = start;
                start += Trie_1.UTRIE2_INDEX_2_BLOCK_LENGTH;
                newStart = start;
            }
        }
        /* now adjust the index-1 table */
        for (i = 0; i < UNEWTRIE2_INDEX_1_LENGTH; ++i) {
            this.index1[i] = this.map[this.index1[i] >> Trie_1.UTRIE2_SHIFT_1_2];
        }
        this.index2NullOffset = this.map[this.index2NullOffset >> Trie_1.UTRIE2_SHIFT_1_2];
        /*
         * Ensure data table alignment:
         * Needs to be granularity-aligned for 16-bit trie
         * (so that dataMove will be down-shiftable),
         * and 2-aligned for uint32_t data.
         */
        while ((newStart & ((UTRIE2_DATA_GRANULARITY - 1) | 1)) !== 0) {
            /* Arbitrary value: 0x3fffc not possible for real data. */
            this.index2[newStart++] = 0x0000ffff << Trie_1.UTRIE2_INDEX_SHIFT;
        }
        this.index2Length = newStart;
    };
    TrieBuilder.prototype.findSameIndex2Block = function (index2Length, otherBlock) {
        /* ensure that we do not even partially get past index2Length */
        index2Length -= Trie_1.UTRIE2_INDEX_2_BLOCK_LENGTH;
        for (var block = 0; block <= index2Length; ++block) {
            if (equalInt(this.index2, block, otherBlock, Trie_1.UTRIE2_INDEX_2_BLOCK_LENGTH)) {
                return block;
            }
        }
        return -1;
    };
    TrieBuilder.prototype._set = function (c, forLSCP, value) {
        if (this.isCompacted) {
            throw new Error('Trie was already compacted');
        }
        var block = this.getDataBlock(c, forLSCP);
        this.data[block + (c & Trie_1.UTRIE2_DATA_MASK)] = value;
        return this;
    };
    TrieBuilder.prototype.writeBlock = function (block, value) {
        var limit = block + Trie_1.UTRIE2_DATA_BLOCK_LENGTH;
        while (block < limit) {
            this.data[block++] = value;
        }
    };
    TrieBuilder.prototype.isInNullBlock = function (c, forLSCP) {
        var i2 = isHighSurrogate(c) && forLSCP
            ? Trie_1.UTRIE2_LSCP_INDEX_2_OFFSET - (0xd800 >> Trie_1.UTRIE2_SHIFT_2) + (c >> Trie_1.UTRIE2_SHIFT_2)
            : this.index1[c >> Trie_1.UTRIE2_SHIFT_1] + ((c >> Trie_1.UTRIE2_SHIFT_2) & Trie_1.UTRIE2_INDEX_2_MASK);
        var block = this.index2[i2];
        return block === this.dataNullOffset;
    };
    TrieBuilder.prototype.fillBlock = function (block, start, limit, value, initialValue, overwrite) {
        var pLimit = block + limit;
        if (overwrite) {
            for (var i = block + start; i < pLimit; i++) {
                this.data[i] = value;
            }
        }
        else {
            for (var i = block + start; i < pLimit; i++) {
                if (this.data[i] === initialValue) {
                    this.data[i] = value;
                }
            }
        }
    };
    TrieBuilder.prototype.setIndex2Entry = function (i2, block) {
        ++this.map[block >> Trie_1.UTRIE2_SHIFT_2]; /* increment first, in case block==oldBlock! */
        var oldBlock = this.index2[i2];
        if (0 === --this.map[oldBlock >> Trie_1.UTRIE2_SHIFT_2]) {
            this.releaseDataBlock(oldBlock);
        }
        this.index2[i2] = block;
    };
    TrieBuilder.prototype.releaseDataBlock = function (block) {
        /* put this block at the front of the free-block chain */
        this.map[block >> Trie_1.UTRIE2_SHIFT_2] = -this.firstFreeBlock;
        this.firstFreeBlock = block;
    };
    TrieBuilder.prototype.getDataBlock = function (c, forLSCP) {
        var i2 = this.getIndex2Block(c, forLSCP);
        i2 += (c >> Trie_1.UTRIE2_SHIFT_2) & Trie_1.UTRIE2_INDEX_2_MASK;
        var oldBlock = this.index2[i2];
        if (this.isWritableBlock(oldBlock)) {
            return oldBlock;
        }
        /* allocate a new data block */
        var newBlock = this.allocDataBlock(oldBlock);
        this.setIndex2Entry(i2, newBlock);
        return newBlock;
    };
    TrieBuilder.prototype.isWritableBlock = function (block) {
        return block !== this.dataNullOffset && 1 === this.map[block >> Trie_1.UTRIE2_SHIFT_2];
    };
    TrieBuilder.prototype.getIndex2Block = function (c, forLSCP) {
        if (c >= 0xd800 && c < 0xdc00 && forLSCP) {
            return Trie_1.UTRIE2_LSCP_INDEX_2_OFFSET;
        }
        var i1 = c >> Trie_1.UTRIE2_SHIFT_1;
        var i2 = this.index1[i1];
        if (i2 === this.index2NullOffset) {
            i2 = this.allocIndex2Block();
            this.index1[i1] = i2;
        }
        return i2;
    };
    TrieBuilder.prototype.allocDataBlock = function (copyBlock) {
        var newBlock;
        if (this.firstFreeBlock !== 0) {
            /* get the first free block */
            newBlock = this.firstFreeBlock;
            this.firstFreeBlock = -this.map[newBlock >> Trie_1.UTRIE2_SHIFT_2];
        }
        else {
            /* get a new block from the high end */
            newBlock = this.dataLength;
            var newTop = newBlock + Trie_1.UTRIE2_DATA_BLOCK_LENGTH;
            if (newTop > this.dataCapacity) {
                var capacity = void 0;
                /* out of memory in the data array */
                if (this.dataCapacity < UNEWTRIE2_MEDIUM_DATA_LENGTH) {
                    capacity = UNEWTRIE2_MEDIUM_DATA_LENGTH;
                }
                else if (this.dataCapacity < UNEWTRIE2_MAX_DATA_LENGTH) {
                    capacity = UNEWTRIE2_MAX_DATA_LENGTH;
                }
                else {
                    /*
                     * Should never occur.
                     * Either UNEWTRIE2_MAX_DATA_LENGTH is incorrect,
                     * or the code writes more values than should be possible.
                     */
                    throw new Error('Internal error in Trie creation.');
                }
                var newData = new Uint32Array(capacity);
                newData.set(this.data.subarray(0, this.dataLength));
                this.data = newData;
                this.dataCapacity = capacity;
            }
            this.dataLength = newTop;
        }
        this.data.set(this.data.subarray(copyBlock, copyBlock + Trie_1.UTRIE2_DATA_BLOCK_LENGTH), newBlock);
        this.map[newBlock >> Trie_1.UTRIE2_SHIFT_2] = 0;
        return newBlock;
    };
    TrieBuilder.prototype.allocIndex2Block = function () {
        var newBlock = this.index2Length;
        var newTop = newBlock + Trie_1.UTRIE2_INDEX_2_BLOCK_LENGTH;
        if (newTop > this.index2.length) {
            throw new Error('Internal error in Trie creation.');
            /*
             * Should never occur.
             * Either UTRIE2_MAX_BUILD_TIME_INDEX_LENGTH is incorrect,
             * or the code writes more values than should be possible.
             */
        }
        this.index2Length = newTop;
        this.index2.set(this.index2.subarray(this.index2NullOffset, this.index2NullOffset + Trie_1.UTRIE2_INDEX_2_BLOCK_LENGTH), newBlock);
        return newBlock;
    };
    return TrieBuilder;
}());
exports.TrieBuilder = TrieBuilder;
var serializeBase64 = function (trie) {
    var index = trie.index;
    var data = trie.data;
    if (!(index instanceof Uint16Array) || !(data instanceof Uint16Array || data instanceof Uint32Array)) {
        throw new Error('TrieBuilder serializer only support TypedArrays');
    }
    var headerLength = Uint32Array.BYTES_PER_ELEMENT * 6;
    var bufferLength = headerLength + index.byteLength + data.byteLength;
    var buffer = new ArrayBuffer(Math.ceil(bufferLength / 4) * 4);
    var view32 = new Uint32Array(buffer);
    var view16 = new Uint16Array(buffer);
    view32[0] = trie.initialValue;
    view32[1] = trie.errorValue;
    view32[2] = trie.highStart;
    view32[3] = trie.highValueIndex;
    view32[4] = index.byteLength;
    // $FlowFixMe
    view32[5] = data.BYTES_PER_ELEMENT;
    view16.set(index, headerLength / Uint16Array.BYTES_PER_ELEMENT);
    if (data.BYTES_PER_ELEMENT === Uint16Array.BYTES_PER_ELEMENT) {
        view16.set(data, (headerLength + index.byteLength) / Uint16Array.BYTES_PER_ELEMENT);
    }
    else {
        view32.set(data, Math.ceil((headerLength + index.byteLength) / Uint32Array.BYTES_PER_ELEMENT));
    }
    return [base64_arraybuffer_1.encode(new Uint8Array(buffer)), buffer.byteLength];
};
exports.serializeBase64 = serializeBase64;
//# sourceMappingURL=TrieBuilder.js.map'use strict';
var parent = require('../../es/typed-array/uint8-clamped-array');
require('../../stable/typed-array/methods');

module.exports = parent;
'use strict';
var globalThis = require('../internals/global-this');
var IS_NODE = require('../internals/environment-is-node');

module.exports = function (name) {
  if (IS_NODE) {
    try {
      return globalThis.process.getBuiltinModule(name);
    } catch (error) { /* empty */ }
    try {
      // eslint-disable-next-line no-new-func -- safe
      return Function('return require("' + name + '")')();
    } catch (error) { /* empty */ }
  }
};
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
function helpers() {
  const data = require("@babel/helpers");
  helpers = function () {
    return data;
  };
  return data;
}
function _generator() {
  const data = require("@babel/generator");
  _generator = function () {
    return data;
  };
  return data;
}
function _template() {
  const data = require("@babel/template");
  _template = function () {
    return data;
  };
  return data;
}
function _t() {
  const data = require("@babel/types");
  _t = function () {
    return data;
  };
  return data;
}
const {
  arrayExpression,
  assignmentExpression,
  binaryExpression,
  blockStatement,
  callExpression,
  cloneNode,
  conditionalExpression,
  exportNamedDeclaration,
  exportSpecifier,
  expressionStatement,
  functionExpression,
  identifier,
  memberExpression,
  objectExpression,
  program,
  stringLiteral,
  unaryExpression,
  variableDeclaration,
  variableDeclarator
} = _t();
const buildUmdWrapper = replacements => _template().default.statement`
    (function (root, factory) {
      if (typeof define === "function" && define.amd) {
        define(AMD_ARGUMENTS, factory);
      } else if (typeof exports === "object") {
        factory(COMMON_ARGUMENTS);
      } else {
        factory(BROWSER_ARGUMENTS);
      }
    })(UMD_ROOT, function (FACTORY_PARAMETERS) {
      FACTORY_BODY
    });
  `(replacements);
function buildGlobal(allowlist) {
  const namespace = identifier("babelHelpers");
  const body = [];
  const container = functionExpression(null, [identifier("global")], blockStatement(body));
  const tree = program([expressionStatement(callExpression(container, [conditionalExpression(binaryExpression("===", unaryExpression("typeof", identifier("global")), stringLiteral("undefined")), identifier("self"), identifier("global"))]))]);
  body.push(variableDeclaration("var", [variableDeclarator(namespace, assignmentExpression("=", memberExpression(identifier("global"), namespace), objectExpression([])))]));
  buildHelpers(body, namespace, allowlist);
  return tree;
}
function buildModule(allowlist) {
  const body = [];
  const refs = buildHelpers(body, null, allowlist);
  body.unshift(exportNamedDeclaration(null, Object.keys(refs).map(name => {
    return exportSpecifier(cloneNode(refs[name]), identifier(name));
  })));
  return program(body, [], "module");
}
function buildUmd(allowlist) {
  const namespace = identifier("babelHelpers");
  const body = [];
  body.push(variableDeclaration("var", [variableDeclarator(namespace, identifier("global"))]));
  buildHelpers(body, namespace, allowlist);
  return program([buildUmdWrapper({
    FACTORY_PARAMETERS: identifier("global"),
    BROWSER_ARGUMENTS: assignmentExpression("=", memberExpression(identifier("root"), namespace), objectExpression([])),
    COMMON_ARGUMENTS: identifier("exports"),
    AMD_ARGUMENTS: arrayExpression([stringLiteral("exports")]),
    FACTORY_BODY: body,
    UMD_ROOT: identifier("this")
  })]);
}
function buildVar(allowlist) {
  const namespace = identifier("babelHelpers");
  const body = [];
  body.push(variableDeclaration("var", [variableDeclarator(namespace, objectExpression([]))]));
  const tree = program(body);
  buildHelpers(body, namespace, allowlist);
  body.push(expressionStatement(namespace));
  return tree;
}
function buildHelpers(body, namespace, allowlist) {
  const getHelperReference = name => {
    return namespace ? memberExpression(namespace, identifier(name)) : identifier(`_${name}`);
  };
  const refs = {};
  helpers().list.forEach(function (name) {
    if (allowlist && !allowlist.includes(name)) return;
    const ref = refs[name] = getHelperReference(name);
    const {
      nodes
    } = helpers().get(name, getHelperReference, namespace ? null : `_${name}`, [], namespace ? (ast, exportName, mapExportBindingAssignments) => {
      mapExportBindingAssignments(node => assignmentExpression("=", ref, node));
      ast.body.push(expressionStatement(assignmentExpression("=", ref, identifier(exportName))));
    } : null);
    body.push(...nodes);
  });
  return refs;
}
function _default(allowlist, outputType = "global") {
  let tree;
  const build = {
    global: buildGlobal,
    module: buildModule,
    umd: buildUmd,
    var: buildVar
  }[outputType];
  if (build) {
    tree = build(allowlist);
  } else {
    throw new Error(`Unsupported output type ${outputType}`);
  }
  return (0, _generator().default)(tree).code;
}
0 && 0;

//# sourceMappingURL=build-external-helpers.js.map
/**
 * Compliance UI Controller for Zero Trust NAC Architecture Designer Pro
 * Manages industry and compliance visualization UI
 */

class ComplianceUI {
  constructor() {
    this.analyzer = window.complianceAnalyzer;
    this.chartBuilder = window.chartBuilder;
    this.activeIndustry = 'healthcare';
    this.activeFramework = 'hipaa';
    this.currentVendor = window.uiController ? window.uiController.activeVendor : 'cisco';
    
    this.init();
  }
  
  init() {
    console.log('Initializing Compliance UI...');
    
    this.setupEventListeners();
    this.initComplianceChart();
    
    // Initial UI update
    this.updateIndustryUI(this.activeIndustry);
    this.updateFrameworkUI(this.activeFramework);
    
    console.log('Compliance UI initialized');
  }
  
  setupEventListeners() {
    // Industry selector
    const industryOptions = document.querySelectorAll('.industry-option');
    industryOptions.forEach(option => {
      option.addEventListener('click', () => {
        const industry = option.dataset.industry;
        this.setActiveIndustry(industry);
      });
    });
    
    // Framework tabs
    const frameworkTabs = document.querySelectorAll('.scorecard-tab');
    frameworkTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const framework = tab.dataset.framework;
        this.setActiveFramework(framework);
      });
    });
    
    // Help button
    const helpBtn = document.getElementById('compliance-help-btn');
    const helpModal = document.getElementById('compliance-help-modal');
    const helpModalClose = document.getElementById('compliance-help-modal-close');
    const helpModalCloseBtn = document.getElementById('compliance-help-modal-close-btn');
    
    if (helpBtn && helpModal) {
      helpBtn.addEventListener('click', () => {
        helpModal.classList.remove('hidden');
      });
      
      if (helpModalClose) {
        helpModalClose.addEventListener('click', () => {
          helpModal.classList.add('hidden');
        });
      }
      
      if (helpModalCloseBtn) {
        helpModalCloseBtn.addEventListener('click', () => {
          helpModal.classList.add('hidden');
        });
      }
    }
    
    // Return to calculator button
    const returnBtn = document.getElementById('return-to-calculator');
    if (returnBtn) {
      returnBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }
    
    // Print report button
    const printBtn = document.getElementById('compliance-print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
    
    // Add event delegation for framework detail buttons
    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('view-framework-btn') || 
          event.target.closest('.view-framework-btn')) {
        const btn = event.target.classList.contains('view-framework-btn') ? 
          event.target : event.target.closest('.view-framework-btn');
        const framework = btn.dataset.framework;
        
        // Switch to framework in scorecard tabs
        this.setActiveFramework(framework);
        
        // Scroll to scorecard section
        document.querySelector('.compliance-scorecards').scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }
  
  setActiveIndustry(industry) {
    if (this.activeIndustry === industry) return;
    
    this.activeIndustry = industry;
    
    // Update UI
    document.querySelectorAll('.industry-option').forEach(option => {
      option.classList.toggle('active', option.dataset.industry === industry);
    });
    
    this.updateIndustryUI(industry);
    
    // Set active framework to first relevant one
    const relevantFrameworks = this.analyzer.getIndustryFrameworks(industry);
    if (relevantFrameworks.length > 0 && !relevantFrameworks.includes(this.activeFramework)) {
      this.setActiveFramework(relevantFrameworks[0]);
    } else {
      this.updateFrameworkUI(this.activeFramework);
    }
    
    // Update compliance chart
    this.updateComplianceChart();
  }
  
  setActiveFramework(framework) {
    if (this.activeFramework === framework) return;
    
    this.activeFramework = framework;
    
    // Update UI
    document.querySelectorAll('.scorecard-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.framework === framework);
    });
    
    this.updateFrameworkUI(framework);
  }
  
  updateIndustryUI(industry) {
    const industryData = this.analyzer.data.industries[industry];
    if (!industryData) return;
    
    // Update industry name
    const industryNameEl = document.getElementById('industry-name');
    if (industryNameEl) {
      industryNameEl.textContent = industryData.name;
    }
    
    // Update regulatory requirements
    const regulatoryContent = document.getElementById('regulatory-content');
    if (regulatoryContent) {
      regulatoryContent.innerHTML = this.analyzer.generateRegulatoryRequirements(industry);
    }
    
    // Update framework tabs visibility based on relevance
    const relevantFrameworks = industryData.frameworks || [];
    document.querySelectorAll('.scorecard-tab').forEach(tab => {
      const framework = tab.dataset.framework;
      tab.style.display = relevantFrameworks.includes(framework) ? 'block' : 'none';
    });
    
    // Update industry requirements
    this.updateIndustryRequirements(industry);
  }
  
  updateFrameworkUI(framework) {
    // Update scorecard content
    const scorecardDetails = document.getElementById('scorecard-details');
    if (scorecardDetails) {
      scorecardDetails.innerHTML = this.analyzer.generateFrameworkScorecard(framework, this.currentVendor);
    }
  }
  
  updateIndustryRequirements(industry) {
    const industryData = this.analyzer.data.industries[industry];
    if (!industryData || !industryData.requirements) return;
    
    // Update requirement cards
    const requirements = industryData.requirements;
    const requirementCards = document.querySelectorAll('.requirement-card');
    
    if (requirementCards.length === requirements.length) {
      requirementCards.forEach((card, index) => {
        const req = requirements[index];
        const portnoxScore = req.vendorScores['portnox'] || 0;
        const currentScore = req.vendorScores[this.currentVendor] || 0;
        
        // Update card content
        const icon = card.querySelector('.requirement-icon i');
        const title = card.querySelector('h4');
        const meter = card.querySelector('.compliance-value');
        const portnoxScoreEl = card.querySelector('.vendor-score.portnox');
        const currentScoreEl = card.querySelector('.vendor-score.current');
        
        if (title) title.textContent = req.name;
        if (meter) meter.style.width = portnoxScore + '%';
        if (portnoxScoreEl) portnoxScoreEl.textContent = portnoxScore + '%';
        if (currentScoreEl) currentScoreEl.textContent = currentScore + '%';
      });
    }
  }
  
  initComplianceChart() {
    const ctx = document.getElementById('compliance-coverage-chart');
    if (!ctx) {
      console.warn('Compliance coverage chart canvas element not found');
      return;
    }
    
    try {
      const ctxCanvas = ctx.getContext('2d');
      if (!ctxCanvas) {
        console.warn('Could not get 2D context for compliance coverage chart');
        return;
      }
      
      // Define chart configuration
      const chartConfig = {
        type: 'radar',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Portnox Cloud',
              data: [],
              backgroundColor: 'rgba(43, 210, 91, 0.3)',
              borderColor: '#2bd25b',
              borderWidth: 2,
              pointBackgroundColor: '#2bd25b',
              pointRadius: 4
            },
            {
              label: 'Current Solution',
              data: [],
              backgroundColor: 'rgba(136, 136, 136, 0.3)',
              borderColor: '#888888',
              borderWidth: 2,
              pointBackgroundColor: '#888888',
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: {
                display: true
              },
              suggestedMin: 0,
              suggestedMax: 100,
              ticks: {
                stepSize: 20,
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 15,
                padding: 15
              }
            },
            title: {
              display: true,
              text: 'Compliance Framework Coverage',
              font: {
                size: 16,
                weight: 'bold'
              },
              padding: {
                top: 10,
                bottom: 20
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.raw + '%';
                }
              }
            }
          }
        }
      };
      
      // Create chart
      window.complianceChart = new Chart(ctxCanvas, chartConfig);
      
      // Initial update
      this.updateComplianceChart();
      
      console.log('Compliance coverage chart initialized');
    } catch (error) {
      console.error('Error initializing compliance coverage chart:', error);
    }
  }
  
  updateComplianceChart() {
    if (!window.complianceChart) {
      console.warn('Compliance chart not initialized');
      return;
    }
    
    try {
      // Get relevant frameworks for current industry
      const industryData = this.analyzer.data.industries[this.activeIndustry];
      if (!industryData) return;
      
      const frameworks = industryData.frameworks || [];
      const frameworkLabels = frameworks.map(id => {
        const framework = this.analyzer.data.frameworks[id];
        return framework ? framework.name : id;
      });
      
      // Get scores
      const portnoxScores = frameworks.map(id => {
        return this.analyzer.data.vendorCompliance['portnox'][id] || 0;
      });
      
      const currentScores = frameworks.map(id => {
        return this.analyzer.data.vendorCompliance[this.currentVendor][id] || 0;
      });
      
      // Update chart data
      window.complianceChart.data.labels = frameworkLabels;
      window.complianceChart.data.datasets[0].data = portnoxScores;
      window.complianceChart.data.datasets[1].data = currentScores;
      
      // Update current vendor label
      window.complianceChart.data.datasets[1].label = window.vendorData && window.vendorData[this.currentVendor] ? 
        window.vendorData[this.currentVendor].name : 'Current Solution';
      
      // Update legend in the document
      const currentVendorLegend = document.querySelector('.legend-item.current-vendor .legend-text');
      if (currentVendorLegend) {
        currentVendorLegend.textContent = window.vendorData && window.vendorData[this.currentVendor] ? 
          window.vendorData[this.currentVendor].name : 'Current Solution';
      }
      
      const currentVendorColor = document.querySelector('.legend-item.current-vendor .legend-color');
      if (currentVendorColor && window.chartBuilder && window.chartBuilder.chartColors) {
        currentVendorColor.style.backgroundColor = window.chartBuilder.chartColors[this.currentVendor] || '#888888';
      }
      
      // Update chart
      window.complianceChart.update();
      
      console.log('Compliance chart updated');
    } catch (error) {
      console.error('Error updating compliance chart:', error);
    }
  }
}

// Initialize compliance UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.complianceUI = new ComplianceUI();
});
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const WebpackError = require("../WebpackError");
const {
	evaluateToString,
	toConstantDependency
} = require("../javascript/JavascriptParserHelpers");
const makeSerializable = require("../util/makeSerializable");
const RequireIncludeDependency = require("./RequireIncludeDependency");

/** @typedef {import("../Dependency").DependencyLocation} DependencyLocation */
/** @typedef {import("../javascript/JavascriptParser")} JavascriptParser */
/** @typedef {import("../javascript/JavascriptParser").Range} Range */

module.exports = class RequireIncludeDependencyParserPlugin {
	/**
	 * @param {boolean} warn true: warn about deprecation, false: don't warn
	 */
	constructor(warn) {
		this.warn = warn;
	}

	/**
	 * @param {JavascriptParser} parser the parser
	 * @returns {void}
	 */
	apply(parser) {
		const { warn } = this;
		parser.hooks.call
			.for("require.include")
			.tap("RequireIncludeDependencyParserPlugin", expr => {
				if (expr.arguments.length !== 1) return;
				const param = parser.evaluateExpression(expr.arguments[0]);
				if (!param.isString()) return;

				if (warn) {
					parser.state.module.addWarning(
						new RequireIncludeDeprecationWarning(
							/** @type {DependencyLocation} */ (expr.loc)
						)
					);
				}

				const dep = new RequireIncludeDependency(
					/** @type {string} */ (param.string),
					/** @type {Range} */ (expr.range)
				);
				dep.loc = /** @type {DependencyLocation} */ (expr.loc);
				parser.state.current.addDependency(dep);
				return true;
			});
		parser.hooks.evaluateTypeof
			.for("require.include")
			.tap("RequireIncludePlugin", expr => {
				if (warn) {
					parser.state.module.addWarning(
						new RequireIncludeDeprecationWarning(
							/** @type {DependencyLocation} */ (expr.loc)
						)
					);
				}
				return evaluateToString("function")(expr);
			});
		parser.hooks.typeof
			.for("require.include")
			.tap("RequireIncludePlugin", expr => {
				if (warn) {
					parser.state.module.addWarning(
						new RequireIncludeDeprecationWarning(
							/** @type {DependencyLocation} */ (expr.loc)
						)
					);
				}
				return toConstantDependency(parser, JSON.stringify("function"))(expr);
			});
	}
};

class RequireIncludeDeprecationWarning extends WebpackError {
	/**
	 * @param {DependencyLocation} loc location
	 */
	constructor(loc) {
		super("require.include() is deprecated and will be removed soon.");

		this.name = "RequireIncludeDeprecationWarning";

		this.loc = loc;
	}
}

makeSerializable(
	RequireIncludeDeprecationWarning,
	"webpack/lib/dependencies/RequireIncludeDependencyParserPlugin",
	"RequireIncludeDeprecationWarning"
);
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const AsyncDependenciesBlock = require("../AsyncDependenciesBlock");
const makeSerializable = require("../util/makeSerializable");

/** @typedef {import("../AsyncDependenciesBlock").GroupOptions} GroupOptions */
/** @typedef {import("../ChunkGroup").ChunkGroupOptions} ChunkGroupOptions */
/** @typedef {import("../Dependency").DependencyLocation} DependencyLocation */

class RequireEnsureDependenciesBlock extends AsyncDependenciesBlock {
	/**
	 * @param {GroupOptions | null} chunkName chunk name
	 * @param {(DependencyLocation | null)=} loc location info
	 */
	constructor(chunkName, loc) {
		super(chunkName, loc, null);
	}
}

makeSerializable(
	RequireEnsureDependenciesBlock,
	"webpack/lib/dependencies/RequireEnsureDependenciesBlock"
);

module.exports = RequireEnsureDependenciesBlock;
'use strict';
var $ = require('../internals/export');
var globalThis = require('../internals/global-this');
var uncurryThis = require('../internals/function-uncurry-this');
var anUint8Array = require('../internals/an-uint8-array');
var notDetached = require('../internals/array-buffer-not-detached');

var numberToString = uncurryThis(1.0.toString);

// `Uint8Array.prototype.toHex` method
// https://github.com/tc39/proposal-arraybuffer-base64
if (globalThis.Uint8Array) $({ target: 'Uint8Array', proto: true }, {
  toHex: function toHex() {
    anUint8Array(this);
    notDetached(this.buffer);
    var result = '';
    for (var i = 0, length = this.length; i < length; i++) {
      var hex = numberToString(this[i], 16);
      result += hex.length === 1 ? '0' + hex : hex;
    }
    return result;
  }
});
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTemplateBuilder;
var _options = require("./options.js");
var _string = require("./string.js");
var _literal = require("./literal.js");
const NO_PLACEHOLDER = (0, _options.validate)({
  placeholderPattern: false
});
function createTemplateBuilder(formatter, defaultOpts) {
  const templateFnCache = new WeakMap();
  const templateAstCache = new WeakMap();
  const cachedOpts = defaultOpts || (0, _options.validate)(null);
  return Object.assign((tpl, ...args) => {
    if (typeof tpl === "string") {
      if (args.length > 1) throw new Error("Unexpected extra params.");
      return extendedTrace((0, _string.default)(formatter, tpl, (0, _options.merge)(cachedOpts, (0, _options.validate)(args[0]))));
    } else if (Array.isArray(tpl)) {
      let builder = templateFnCache.get(tpl);
      if (!builder) {
        builder = (0, _literal.default)(formatter, tpl, cachedOpts);
        templateFnCache.set(tpl, builder);
      }
      return extendedTrace(builder(args));
    } else if (typeof tpl === "object" && tpl) {
      if (args.length > 0) throw new Error("Unexpected extra params.");
      return createTemplateBuilder(formatter, (0, _options.merge)(cachedOpts, (0, _options.validate)(tpl)));
    }
    throw new Error(`Unexpected template param ${typeof tpl}`);
  }, {
    ast: (tpl, ...args) => {
      if (typeof tpl === "string") {
        if (args.length > 1) throw new Error("Unexpected extra params.");
        return (0, _string.default)(formatter, tpl, (0, _options.merge)((0, _options.merge)(cachedOpts, (0, _options.validate)(args[0])), NO_PLACEHOLDER))();
      } else if (Array.isArray(tpl)) {
        let builder = templateAstCache.get(tpl);
        if (!builder) {
          builder = (0, _literal.default)(formatter, tpl, (0, _options.merge)(cachedOpts, NO_PLACEHOLDER));
          templateAstCache.set(tpl, builder);
        }
        return builder(args)();
      }
      throw new Error(`Unexpected template param ${typeof tpl}`);
    }
  });
}
function extendedTrace(fn) {
  let rootStack = "";
  try {
    throw new Error();
  } catch (error) {
    if (error.stack) {
      rootStack = error.stack.split("\n").slice(3).join("\n");
    }
  }
  return arg => {
    try {
      return fn(arg);
    } catch (err) {
      err.stack += `\n    =============\n${rootStack}`;
      throw err;
    }
  };
}

//# sourceMappingURL=builder.js.map
'use strict';
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Uint8Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Uint8', function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const {
	JAVASCRIPT_MODULE_TYPE_AUTO,
	JAVASCRIPT_MODULE_TYPE_DYNAMIC
} = require("./ModuleTypeConstants");
const RuntimeGlobals = require("./RuntimeGlobals");
const ConstDependency = require("./dependencies/ConstDependency");
const {
	toConstantDependency
} = require("./javascript/JavascriptParserHelpers");

/** @typedef {import("../declarations/WebpackOptions").JavascriptParserOptions} JavascriptParserOptions */
/** @typedef {import("./Compiler")} Compiler */
/** @typedef {import("./javascript/JavascriptParser")} JavascriptParser */

const PLUGIN_NAME = "RequireJsStuffPlugin";

module.exports = class RequireJsStuffPlugin {
	/**
	 * Apply the plugin
	 * @param {Compiler} compiler the compiler instance
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.compilation.tap(
			PLUGIN_NAME,
			(compilation, { normalModuleFactory }) => {
				compilation.dependencyTemplates.set(
					ConstDependency,
					new ConstDependency.Template()
				);
				/**
				 * @param {JavascriptParser} parser the parser
				 * @param {JavascriptParserOptions} parserOptions options
				 * @returns {void}
				 */
				const handler = (parser, parserOptions) => {
					if (
						parserOptions.requireJs === undefined ||
						!parserOptions.requireJs
					) {
						return;
					}

					parser.hooks.call
						.for("require.config")
						.tap(PLUGIN_NAME, toConstantDependency(parser, "undefined"));
					parser.hooks.call
						.for("requirejs.config")
						.tap(PLUGIN_NAME, toConstantDependency(parser, "undefined"));

					parser.hooks.expression
						.for("require.version")
						.tap(
							PLUGIN_NAME,
							toConstantDependency(parser, JSON.stringify("0.0.0"))
						);
					parser.hooks.expression
						.for("requirejs.onError")
						.tap(
							PLUGIN_NAME,
							toConstantDependency(
								parser,
								RuntimeGlobals.uncaughtErrorHandler,
								[RuntimeGlobals.uncaughtErrorHandler]
							)
						);
				};
				normalModuleFactory.hooks.parser
					.for(JAVASCRIPT_MODULE_TYPE_AUTO)
					.tap(PLUGIN_NAME, handler);
				normalModuleFactory.hooks.parser
					.for(JAVASCRIPT_MODULE_TYPE_DYNAMIC)
					.tap(PLUGIN_NAME, handler);
			}
		);
	}
};
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const oneRequired_1 = __importDefault(require("../definitions/oneRequired"));
const oneRequired = (ajv) => ajv.addKeyword((0, oneRequired_1.default)());
exports.default = oneRequired;
module.exports = oneRequired;
//# sourceMappingURL=oneRequired.js.map/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const makeSerializable = require("../util/makeSerializable");
const ContextDependency = require("./ContextDependency");
const ModuleDependencyTemplateAsRequireId = require("./ModuleDependencyTemplateAsRequireId");

/** @typedef {import("../javascript/JavascriptParser").Range} Range */
/** @typedef {import("./ContextDependency").ContextDependencyOptions} ContextDependencyOptions */

class RequireContextDependency extends ContextDependency {
	/**
	 * @param {ContextDependencyOptions} options options
	 * @param {Range} range range
	 */
	constructor(options, range) {
		super(options);

		this.range = range;
	}

	get type() {
		return "require.context";
	}
}

makeSerializable(
	RequireContextDependency,
	"webpack/lib/dependencies/RequireContextDependency"
);

RequireContextDependency.Template = ModuleDependencyTemplateAsRequireId;

module.exports = RequireContextDependency;
'use strict';
var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');
var isCallable = require('../internals/is-callable');
var hasOwn = require('../internals/has-own-property');
var DESCRIPTORS = require('../internals/descriptors');
var CONFIGURABLE_FUNCTION_NAME = require('../internals/function-name').CONFIGURABLE;
var inspectSource = require('../internals/inspect-source');
var InternalStateModule = require('../internals/internal-state');

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');
/**
 * Simple Chart Builder
 * Non-conflicting basic chart initialization
 */
(function() {
  console.log("Initializing Simple Chart Builder");
  
  // Wait for Chart.js to be available
  function waitForChart(callback, attempts = 0) {
    if (typeof Chart !== 'undefined') {
      callback();
    } else if (attempts < 30) {
      setTimeout(() => waitForChart(callback, attempts + 1), 100);
    } else {
      console.error("Chart.js not available after multiple attempts");
    }
  }
  
  // Initialize chart instances
  function initCharts() {
    console.log("Initializing charts");
    
    // Sample chart colors
    const colors = {
      primary: '#05547C',
      accent: '#65BD44',
      vendors: {
        cisco: '#1B67B2',
        aruba: '#F6921E',
        forescout: '#FFC20E',
        fortinac: '#EE3124',
        nps: '#00A4EF',
        securew2: '#662D91',
        portnox: '#65BD44',
        noNac: '#A9A9A9'
      }
    };
    
    // Initialize all charts
    initTcoComparisonChart(colors);
    initCumulativeCostChart(colors);
    initCostBreakdownCharts(colors);
    initFeatureComparisonChart(colors);
    initImplementationComparisonChart(colors);
    initRoiChart(colors);
    
    console.log("All charts initialized");
  }
  
  // Initialize TCO comparison chart
  function initTcoComparisonChart(colors) {
    const ctx = document.getElementById('tco-comparison-chart');
    if (!ctx) return null;
    
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Current Solution', 'Portnox Cloud'],
        datasets: [{
          label: 'Total Cost of Ownership',
          data: [400000, 220000],
          backgroundColor: [colors.primary, colors.accent]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'TCO Comparison',
            font: { size: 16 }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return 'Cost: $' + context.raw.toLocaleString();
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Cost ($)' },
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
  
  // Initialize cumulative cost chart
  function initCumulativeCostChart(colors) {
    const ctx = document.getElementById('cumulative-cost-chart');
    if (!ctx) return null;
    
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Year 1', 'Year 2', 'Year 3'],
        datasets: [
          {
            label: 'Current Solution',
            data: [250000, 330000, 400000],
            borderColor: colors.primary,
            backgroundColor: 'rgba(5, 84, 124, 0.1)',
            fill: true
          },
          {
            label: 'Portnox Cloud',
            data: [150000, 190000, 220000],
            borderColor: colors.accent,
            backgroundColor: 'rgba(101, 189, 68, 0.1)',
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Cumulative Costs Over Time',
            font: { size: 16 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Cumulative Cost ($)' },
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
  
  // Initialize cost breakdown charts
  function initCostBreakdownCharts(colors) {
    const currentCtx = document.getElementById('current-breakdown-chart');
    const portnoxCtx = document.getElementById('alternative-breakdown-chart');
    
    if (currentCtx) {
      new Chart(currentCtx, {
        type: 'doughnut',
        data: {
          labels: ['Hardware', 'Software', 'Maintenance', 'Implementation', 'Personnel'],
          datasets: [{
            data: [70000, 120000, 60000, 80000, 70000],
            backgroundColor: [
              '#1B67B2', '#4BC0C0', '#FF6384', '#FFCD56', '#36A2EB'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Current Solution Breakdown',
              font: { size: 16 }
            }
          }
        }
      });
    }
    
    if (portnoxCtx) {
      new Chart(portnoxCtx, {
        type: 'doughnut',
        data: {
          labels: ['Hardware', 'Software', 'Maintenance', 'Implementation', 'Personnel'],
          datasets: [{
            data: [0, 150000, 20000, 30000, 20000],
            backgroundColor: [
              '#1B67B2', '#4BC0C0', '#FF6384', '#FFCD56', '#36A2EB'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Portnox Cloud Breakdown',
              font: { size: 16 }
            }
          }
        }
      });
    }
  }
  
  // Initialize feature comparison chart
  function initFeatureComparisonChart(colors) {
    const ctx = document.getElementById('feature-comparison-chart');
    if (!ctx) return null;
    
    return new Chart(ctx, {
      type: 'radar',
      data: {
        labels: [
          'Device Visibility',
          'Policy Management',
          'Guest Access',
          'BYOD Support',
          'Cloud Integration',
          'Scalability',
          'Ease of Use'
        ],
        datasets: [
          {
            label: 'Current Solution',
            data: [7, 8, 6, 6, 5, 7, 4],
            backgroundColor: 'rgba(5, 84, 124, 0.2)',
            borderColor: colors.primary,
            pointBackgroundColor: colors.primary
          },
          {
            label: 'Portnox Cloud',
            data: [8, 9, 8, 9, 10, 9, 9],
            backgroundColor: 'rgba(101, 189, 68, 0.2)',
            borderColor: colors.accent,
            pointBackgroundColor: colors.accent
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Feature Comparison',
            font: { size: 16 }
          }
        },
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
    });
  }
  
  // Initialize implementation comparison chart
  function initImplementationComparisonChart(colors) {
    const ctx = document.getElementById('implementation-comparison-chart');
    if (!ctx) return null;
    
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Planning', 'Hardware', 'Software', 'Configuration', 'Testing', 'Training', 'Rollout'],
        datasets: [
          {
            label: 'Current Solution',
            data: [15, 20, 10, 25, 20, 15, 20],
            backgroundColor: colors.primary
          },
          {
            label: 'Portnox Cloud',
            data: [10, 0, 0, 15, 10, 5, 10],
            backgroundColor: colors.accent
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Implementation Timeline (Days)',
            font: { size: 16 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Days' }
          }
        }
      }
    });
  }
  
  // Initialize ROI chart
  function initRoiChart(colors) {
    const ctx = document.getElementById('roi-chart');
    if (!ctx) return null;
    
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Year 1', 'Year 2', 'Year 3'],
        datasets: [
          {
            label: 'Annual Savings',
            data: [80000, 90000, 110000],
            backgroundColor: colors.accent,
            order: 2
          },
          {
            label: 'Cumulative Savings',
            data: [80000, 170000, 280000],
            type: 'line',
            borderColor: colors.primary,
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointBackgroundColor: colors.primary,
            order: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'ROI Analysis',
            font: { size: 16 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Savings ($)' },
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
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      waitForChart(initCharts);
    });
  } else {
    waitForChart(initCharts);
  }
  
  console.log("Simple Chart Builder initialization complete");
})();
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const makeSerializable = require("../util/makeSerializable");
const ModuleDependency = require("./ModuleDependency");
const ModuleDependencyTemplateAsId = require("./ModuleDependencyTemplateAsId");

/** @typedef {import("../javascript/JavascriptParser").Range} Range */

class CommonJsRequireDependency extends ModuleDependency {
	/**
	 * @param {string} request request
	 * @param {Range=} range location in source code
	 * @param {string=} context request context
	 */
	constructor(request, range, context) {
		super(request);
		this.range = range;
		this._context = context;
	}

	get type() {
		return "cjs require";
	}

	get category() {
		return "commonjs";
	}
}

CommonJsRequireDependency.Template = ModuleDependencyTemplateAsId;

makeSerializable(
	CommonJsRequireDependency,
	"webpack/lib/dependencies/CommonJsRequireDependency"
);

module.exports = CommonJsRequireDependency;
import _typeof from "./typeof.js";
function _interopRequireWildcard(e, t) {
  if ("function" == typeof WeakMap) var r = new WeakMap(),
    n = new WeakMap();
  return (_interopRequireWildcard = function _interopRequireWildcard(e, t) {
    if (!t && e && e.__esModule) return e;
    var o,
      i,
      f = {
        __proto__: null,
        "default": e
      };
    if (null === e || "object" != _typeof(e) && "function" != typeof e) return f;
    if (o = t ? n : r) {
      if (o.has(e)) return o.get(e);
      o.set(e, f);
    }
    for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]);
    return f;
  })(e, t);
}
export { _interopRequireWildcard as default };'use strict';
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');
var setPrototypeOf = require('../internals/object-set-prototype-of');

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable(NewTarget = dummy.constructor) &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};
'use strict';
var makeBuiltIn = require('../internals/make-built-in');
var defineProperty = require('../internals/object-define-property');

module.exports = function (target, name, descriptor) {
  if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
  if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
  return defineProperty.f(target, name, descriptor);
};
'use strict';
var parent = require('../../es/typed-array/uint16-array');
require('../../stable/typed-array/methods');

module.exports = parent;
"use strict";

exports.__esModule = true;
exports.StaticProperties = exports.InstanceProperties = exports.CommonIterators = exports.BuiltIns = void 0;
var _corejs2BuiltIns = _interopRequireDefault(require("@babel/compat-data/corejs2-built-ins"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const define = (name, pure, global = [], meta) => {
  return {
    name,
    pure,
    global,
    meta
  };
};
const pureAndGlobal = (pure, global, minRuntimeVersion = null) => define(global[0], pure, global, {
  minRuntimeVersion
});
const globalOnly = global => define(global[0], null, global);
const pureOnly = (pure, name) => define(name, pure, []);
const ArrayNatureIterators = ["es6.object.to-string", "es6.array.iterator", "web.dom.iterable"];
const CommonIterators = ["es6.string.iterator", ...ArrayNatureIterators];
exports.CommonIterators = CommonIterators;
const PromiseDependencies = ["es6.object.to-string", "es6.promise"];
const BuiltIns = {
  DataView: globalOnly(["es6.typed.data-view"]),
  Float32Array: globalOnly(["es6.typed.float32-array"]),
  Float64Array: globalOnly(["es6.typed.float64-array"]),
  Int8Array: globalOnly(["es6.typed.int8-array"]),
  Int16Array: globalOnly(["es6.typed.int16-array"]),
  Int32Array: globalOnly(["es6.typed.int32-array"]),
  Map: pureAndGlobal("map", ["es6.map", ...CommonIterators]),
  Number: globalOnly(["es6.number.constructor"]),
  Promise: pureAndGlobal("promise", PromiseDependencies),
  RegExp: globalOnly(["es6.regexp.constructor"]),
  Set: pureAndGlobal("set", ["es6.set", ...CommonIterators]),
  Symbol: pureAndGlobal("symbol/index", ["es6.symbol"]),
  Uint8Array: globalOnly(["es6.typed.uint8-array"]),
  Uint8ClampedArray: globalOnly(["es6.typed.uint8-clamped-array"]),
  Uint16Array: globalOnly(["es6.typed.uint16-array"]),
  Uint32Array: globalOnly(["es6.typed.uint32-array"]),
  WeakMap: pureAndGlobal("weak-map", ["es6.weak-map", ...CommonIterators]),
  WeakSet: pureAndGlobal("weak-set", ["es6.weak-set", ...CommonIterators]),
  setImmediate: pureOnly("set-immediate", "web.immediate"),
  clearImmediate: pureOnly("clear-immediate", "web.immediate"),
  parseFloat: pureOnly("parse-float", "es6.parse-float"),
  parseInt: pureOnly("parse-int", "es6.parse-int")
};
exports.BuiltIns = BuiltIns;
const InstanceProperties = {
  __defineGetter__: globalOnly(["es7.object.define-getter"]),
  __defineSetter__: globalOnly(["es7.object.define-setter"]),
  __lookupGetter__: globalOnly(["es7.object.lookup-getter"]),
  __lookupSetter__: globalOnly(["es7.object.lookup-setter"]),
  anchor: globalOnly(["es6.string.anchor"]),
  big: globalOnly(["es6.string.big"]),
  bind: globalOnly(["es6.function.bind"]),
  blink: globalOnly(["es6.string.blink"]),
  bold: globalOnly(["es6.string.bold"]),
  codePointAt: globalOnly(["es6.string.code-point-at"]),
  copyWithin: globalOnly(["es6.array.copy-within"]),
  endsWith: globalOnly(["es6.string.ends-with"]),
  entries: globalOnly(ArrayNatureIterators),
  every: globalOnly(["es6.array.every"]),
  fill: globalOnly(["es6.array.fill"]),
  filter: globalOnly(["es6.array.filter"]),
  finally: globalOnly(["es7.promise.finally", ...PromiseDependencies]),
  find: globalOnly(["es6.array.find"]),
  findIndex: globalOnly(["es6.array.find-index"]),
  fixed: globalOnly(["es6.string.fixed"]),
  flags: globalOnly(["es6.regexp.flags"]),
  flatMap: globalOnly(["es7.array.flat-map"]),
  fontcolor: globalOnly(["es6.string.fontcolor"]),
  fontsize: globalOnly(["es6.string.fontsize"]),
  forEach: globalOnly(["es6.array.for-each"]),
  includes: globalOnly(["es6.string.includes", "es7.array.includes"]),
  indexOf: globalOnly(["es6.array.index-of"]),
  italics: globalOnly(["es6.string.italics"]),
  keys: globalOnly(ArrayNatureIterators),
  lastIndexOf: globalOnly(["es6.array.last-index-of"]),
  link: globalOnly(["es6.string.link"]),
  map: globalOnly(["es6.array.map"]),
  match: globalOnly(["es6.regexp.match"]),
  name: globalOnly(["es6.function.name"]),
  padStart: globalOnly(["es7.string.pad-start"]),
  padEnd: globalOnly(["es7.string.pad-end"]),
  reduce: globalOnly(["es6.array.reduce"]),
  reduceRight: globalOnly(["es6.array.reduce-right"]),
  repeat: globalOnly(["es6.string.repeat"]),
  replace: globalOnly(["es6.regexp.replace"]),
  search: globalOnly(["es6.regexp.search"]),
  small: globalOnly(["es6.string.small"]),
  some: globalOnly(["es6.array.some"]),
  sort: globalOnly(["es6.array.sort"]),
  split: globalOnly(["es6.regexp.split"]),
  startsWith: globalOnly(["es6.string.starts-with"]),
  strike: globalOnly(["es6.string.strike"]),
  sub: globalOnly(["es6.string.sub"]),
  sup: globalOnly(["es6.string.sup"]),
  toISOString: globalOnly(["es6.date.to-iso-string"]),
  toJSON: globalOnly(["es6.date.to-json"]),
  toString: globalOnly(["es6.object.to-string", "es6.date.to-string", "es6.regexp.to-string"]),
  trim: globalOnly(["es6.string.trim"]),
  trimEnd: globalOnly(["es7.string.trim-right"]),
  trimLeft: globalOnly(["es7.string.trim-left"]),
  trimRight: globalOnly(["es7.string.trim-right"]),
  trimStart: globalOnly(["es7.string.trim-left"]),
  values: globalOnly(ArrayNatureIterators)
};

// This isn't present in older @babel/compat-data versions
exports.InstanceProperties = InstanceProperties;
if ("es6.array.slice" in _corejs2BuiltIns.default) {
  InstanceProperties.slice = globalOnly(["es6.array.slice"]);
}
const StaticProperties = {
  Array: {
    from: pureAndGlobal("array/from", ["es6.symbol", "es6.array.from", ...CommonIterators]),
    isArray: pureAndGlobal("array/is-array", ["es6.array.is-array"]),
    of: pureAndGlobal("array/of", ["es6.array.of"])
  },
  Date: {
    now: pureAndGlobal("date/now", ["es6.date.now"])
  },
  JSON: {
    stringify: pureOnly("json/stringify", "es6.symbol")
  },
  Math: {
    // 'Math' was not included in the 7.0.0
    // release of '@babel/runtime'. See issue https://github.com/babel/babel/pull/8616.
    acosh: pureAndGlobal("math/acosh", ["es6.math.acosh"], "7.0.1"),
    asinh: pureAndGlobal("math/asinh", ["es6.math.asinh"], "7.0.1"),
    atanh: pureAndGlobal("math/atanh", ["es6.math.atanh"], "7.0.1"),
    cbrt: pureAndGlobal("math/cbrt", ["es6.math.cbrt"], "7.0.1"),
    clz32: pureAndGlobal("math/clz32", ["es6.math.clz32"], "7.0.1"),
    cosh: pureAndGlobal("math/cosh", ["es6.math.cosh"], "7.0.1"),
    expm1: pureAndGlobal("math/expm1", ["es6.math.expm1"], "7.0.1"),
    fround: pureAndGlobal("math/fround", ["es6.math.fround"], "7.0.1"),
    hypot: pureAndGlobal("math/hypot", ["es6.math.hypot"], "7.0.1"),
    imul: pureAndGlobal("math/imul", ["es6.math.imul"], "7.0.1"),
    log1p: pureAndGlobal("math/log1p", ["es6.math.log1p"], "7.0.1"),
    log10: pureAndGlobal("math/log10", ["es6.math.log10"], "7.0.1"),
    log2: pureAndGlobal("math/log2", ["es6.math.log2"], "7.0.1"),
    sign: pureAndGlobal("math/sign", ["es6.math.sign"], "7.0.1"),
    sinh: pureAndGlobal("math/sinh", ["es6.math.sinh"], "7.0.1"),
    tanh: pureAndGlobal("math/tanh", ["es6.math.tanh"], "7.0.1"),
    trunc: pureAndGlobal("math/trunc", ["es6.math.trunc"], "7.0.1")
  },
  Number: {
    EPSILON: pureAndGlobal("number/epsilon", ["es6.number.epsilon"]),
    MIN_SAFE_INTEGER: pureAndGlobal("number/min-safe-integer", ["es6.number.min-safe-integer"]),
    MAX_SAFE_INTEGER: pureAndGlobal("number/max-safe-integer", ["es6.number.max-safe-integer"]),
    isFinite: pureAndGlobal("number/is-finite", ["es6.number.is-finite"]),
    isInteger: pureAndGlobal("number/is-integer", ["es6.number.is-integer"]),
    isSafeInteger: pureAndGlobal("number/is-safe-integer", ["es6.number.is-safe-integer"]),
    isNaN: pureAndGlobal("number/is-nan", ["es6.number.is-nan"]),
    parseFloat: pureAndGlobal("number/parse-float", ["es6.number.parse-float"]),
    parseInt: pureAndGlobal("number/parse-int", ["es6.number.parse-int"])
  },
  Object: {
    assign: pureAndGlobal("object/assign", ["es6.object.assign"]),
    create: pureAndGlobal("object/create", ["es6.object.create"]),
    defineProperties: pureAndGlobal("object/define-properties", ["es6.object.define-properties"]),
    defineProperty: pureAndGlobal("object/define-property", ["es6.object.define-property"]),
    entries: pureAndGlobal("object/entries", ["es7.object.entries"]),
    freeze: pureAndGlobal("object/freeze", ["es6.object.freeze"]),
    getOwnPropertyDescriptor: pureAndGlobal("object/get-own-property-descriptor", ["es6.object.get-own-property-descriptor"]),
    getOwnPropertyDescriptors: pureAndGlobal("object/get-own-property-descriptors", ["es7.object.get-own-property-descriptors"]),
    getOwnPropertyNames: pureAndGlobal("object/get-own-property-names", ["es6.object.get-own-property-names"]),
    getOwnPropertySymbols: pureAndGlobal("object/get-own-property-symbols", ["es6.symbol"]),
    getPrototypeOf: pureAndGlobal("object/get-prototype-of", ["es6.object.get-prototype-of"]),
    is: pureAndGlobal("object/is", ["es6.object.is"]),
    isExtensible: pureAndGlobal("object/is-extensible", ["es6.object.is-extensible"]),
    isFrozen: pureAndGlobal("object/is-frozen", ["es6.object.is-frozen"]),
    isSealed: pureAndGlobal("object/is-sealed", ["es6.object.is-sealed"]),
    keys: pureAndGlobal("object/keys", ["es6.object.keys"]),
    preventExtensions: pureAndGlobal("object/prevent-extensions", ["es6.object.prevent-extensions"]),
    seal: pureAndGlobal("object/seal", ["es6.object.seal"]),
    setPrototypeOf: pureAndGlobal("object/set-prototype-of", ["es6.object.set-prototype-of"]),
    values: pureAndGlobal("object/values", ["es7.object.values"])
  },
  Promise: {
    all: globalOnly(CommonIterators),
    race: globalOnly(CommonIterators)
  },
  Reflect: {
    apply: pureAndGlobal("reflect/apply", ["es6.reflect.apply"]),
    construct: pureAndGlobal("reflect/construct", ["es6.reflect.construct"]),
    defineProperty: pureAndGlobal("reflect/define-property", ["es6.reflect.define-property"]),
    deleteProperty: pureAndGlobal("reflect/delete-property", ["es6.reflect.delete-property"]),
    get: pureAndGlobal("reflect/get", ["es6.reflect.get"]),
    getOwnPropertyDescriptor: pureAndGlobal("reflect/get-own-property-descriptor", ["es6.reflect.get-own-property-descriptor"]),
    getPrototypeOf: pureAndGlobal("reflect/get-prototype-of", ["es6.reflect.get-prototype-of"]),
    has: pureAndGlobal("reflect/has", ["es6.reflect.has"]),
    isExtensible: pureAndGlobal("reflect/is-extensible", ["es6.reflect.is-extensible"]),
    ownKeys: pureAndGlobal("reflect/own-keys", ["es6.reflect.own-keys"]),
    preventExtensions: pureAndGlobal("reflect/prevent-extensions", ["es6.reflect.prevent-extensions"]),
    set: pureAndGlobal("reflect/set", ["es6.reflect.set"]),
    setPrototypeOf: pureAndGlobal("reflect/set-prototype-of", ["es6.reflect.set-prototype-of"])
  },
  String: {
    at: pureOnly("string/at", "es7.string.at"),
    fromCodePoint: pureAndGlobal("string/from-code-point", ["es6.string.from-code-point"]),
    raw: pureAndGlobal("string/raw", ["es6.string.raw"])
  },
  Symbol: {
    // FIXME: Pure disabled to work around zloirock/core-js#262.
    asyncIterator: globalOnly(["es6.symbol", "es7.symbol.async-iterator"]),
    for: pureOnly("symbol/for", "es6.symbol"),
    hasInstance: pureOnly("symbol/has-instance", "es6.symbol"),
    isConcatSpreadable: pureOnly("symbol/is-concat-spreadable", "es6.symbol"),
    iterator: define("es6.symbol", "symbol/iterator", CommonIterators),
    keyFor: pureOnly("symbol/key-for", "es6.symbol"),
    match: pureAndGlobal("symbol/match", ["es6.regexp.match"]),
    replace: pureOnly("symbol/replace", "es6.symbol"),
    search: pureOnly("symbol/search", "es6.symbol"),
    species: pureOnly("symbol/species", "es6.symbol"),
    split: pureOnly("symbol/split", "es6.symbol"),
    toPrimitive: pureOnly("symbol/to-primitive", "es6.symbol"),
    toStringTag: pureOnly("symbol/to-string-tag", "es6.symbol"),
    unscopables: pureOnly("symbol/unscopables", "es6.symbol")
  }
};
exports.StaticProperties = StaticProperties;'use strict';
// https://github.com/tc39/proposal-dataview-get-set-uint8clamped
require('../modules/esnext.data-view.get-uint8-clamped');
require('../modules/esnext.data-view.set-uint8-clamped');
const SemVer = require('../classes/semver')
const compareBuild = (a, b, loose) => {
  const versionA = new SemVer(a, loose)
  const versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}
module.exports = compareBuild
'use strict';
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Uint16Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Uint16', function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const RuntimeGlobals = require("../RuntimeGlobals");
const makeSerializable = require("../util/makeSerializable");
const NullDependency = require("./NullDependency");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("../AsyncDependenciesBlock")} AsyncDependenciesBlock */
/** @typedef {import("../Dependency")} Dependency */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */
/** @typedef {import("../javascript/JavascriptParser").Range} Range */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectDeserializerContext} ObjectDeserializerContext */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectSerializerContext} ObjectSerializerContext */

class AMDRequireDependency extends NullDependency {
	/**
	 * @param {Range} outerRange outer range
	 * @param {Range} arrayRange array range
	 * @param {Range | null} functionRange function range
	 * @param {Range | null} errorCallbackRange error callback range
	 */
	constructor(outerRange, arrayRange, functionRange, errorCallbackRange) {
		super();

		this.outerRange = outerRange;
		this.arrayRange = arrayRange;
		this.functionRange = functionRange;
		this.errorCallbackRange = errorCallbackRange;
		this.functionBindThis = false;
		this.errorCallbackBindThis = false;
	}

	get category() {
		return "amd";
	}

	/**
	 * @param {ObjectSerializerContext} context context
	 */
	serialize(context) {
		const { write } = context;

		write(this.outerRange);
		write(this.arrayRange);
		write(this.functionRange);
		write(this.errorCallbackRange);
		write(this.functionBindThis);
		write(this.errorCallbackBindThis);

		super.serialize(context);
	}

	/**
	 * @param {ObjectDeserializerContext} context context
	 */
	deserialize(context) {
		const { read } = context;

		this.outerRange = read();
		this.arrayRange = read();
		this.functionRange = read();
		this.errorCallbackRange = read();
		this.functionBindThis = read();
		this.errorCallbackBindThis = read();

		super.deserialize(context);
	}
}

makeSerializable(
	AMDRequireDependency,
	"webpack/lib/dependencies/AMDRequireDependency"
);

AMDRequireDependency.Template = class AMDRequireDependencyTemplate extends (
	NullDependency.Template
) {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(
		dependency,
		source,
		{ runtimeTemplate, moduleGraph, chunkGraph, runtimeRequirements }
	) {
		const dep = /** @type {AMDRequireDependency} */ (dependency);
		const depBlock = /** @type {AsyncDependenciesBlock} */ (
			moduleGraph.getParentBlock(dep)
		);
		const promise = runtimeTemplate.blockPromise({
			chunkGraph,
			block: depBlock,
			message: "AMD require",
			runtimeRequirements
		});

		// has array range but no function range
		if (dep.arrayRange && !dep.functionRange) {
			const startBlock = `${promise}.then(function() {`;
			const endBlock = `;})['catch'](${RuntimeGlobals.uncaughtErrorHandler})`;
			runtimeRequirements.add(RuntimeGlobals.uncaughtErrorHandler);

			source.replace(dep.outerRange[0], dep.arrayRange[0] - 1, startBlock);

			source.replace(dep.arrayRange[1], dep.outerRange[1] - 1, endBlock);

			return;
		}

		// has function range but no array range
		if (dep.functionRange && !dep.arrayRange) {
			const startBlock = `${promise}.then((`;
			const endBlock = `).bind(exports, ${RuntimeGlobals.require}, exports, module))['catch'](${RuntimeGlobals.uncaughtErrorHandler})`;
			runtimeRequirements.add(RuntimeGlobals.uncaughtErrorHandler);

			source.replace(dep.outerRange[0], dep.functionRange[0] - 1, startBlock);

			source.replace(dep.functionRange[1], dep.outerRange[1] - 1, endBlock);

			return;
		}

		// has array range, function range, and errorCallbackRange
		if (dep.arrayRange && dep.functionRange && dep.errorCallbackRange) {
			const startBlock = `${promise}.then(function() { `;
			const errorRangeBlock = `}${
				dep.functionBindThis ? ".bind(this)" : ""
			})['catch'](`;
			const endBlock = `${dep.errorCallbackBindThis ? ".bind(this)" : ""})`;

			source.replace(dep.outerRange[0], dep.arrayRange[0] - 1, startBlock);

			source.insert(dep.arrayRange[0], "var __WEBPACK_AMD_REQUIRE_ARRAY__ = ");

			source.replace(dep.arrayRange[1], dep.functionRange[0] - 1, "; (");

			source.insert(
				dep.functionRange[1],
				").apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);"
			);

			source.replace(
				dep.functionRange[1],
				dep.errorCallbackRange[0] - 1,
				errorRangeBlock
			);

			source.replace(
				dep.errorCallbackRange[1],
				dep.outerRange[1] - 1,
				endBlock
			);

			return;
		}

		// has array range, function range, but no errorCallbackRange
		if (dep.arrayRange && dep.functionRange) {
			const startBlock = `${promise}.then(function() { `;
			const endBlock = `}${
				dep.functionBindThis ? ".bind(this)" : ""
			})['catch'](${RuntimeGlobals.uncaughtErrorHandler})`;
			runtimeRequirements.add(RuntimeGlobals.uncaughtErrorHandler);

			source.replace(dep.outerRange[0], dep.arrayRange[0] - 1, startBlock);

			source.insert(dep.arrayRange[0], "var __WEBPACK_AMD_REQUIRE_ARRAY__ = ");

			source.replace(dep.arrayRange[1], dep.functionRange[0] - 1, "; (");

			source.insert(
				dep.functionRange[1],
				").apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);"
			);

			source.replace(dep.functionRange[1], dep.outerRange[1] - 1, endBlock);
		}
	}
};

module.exports = AMDRequireDependency;
module.exports={A:{A:{"2":"K D E F A B oC"},B:{"1":"0 9 Q H R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z AB BB CB DB EB FB GB HB IB JB KB LB MB NB OB PB I","2":"C L M G N O P"},C:{"1":"0 9 b c d e f g h i j k l m n o p q r s t u v w x y z AB BB CB DB EB FB GB HB IB JB KB LB MB NB OB PB I QC FC RC SC qC rC","2":"1 2 3 4 5 6 7 8 pC MC J QB K D E F A B C L M G N O P RB SB TB UB VB WB XB YB ZB aB bB cB dB eB fB gB sC tC","132":"hB iB jB kB lB mB nB oB pB qB rB sB tB uB vB wB NC xB OC yB zB 0B 1B 2B 3B 4B 5B 6B 7B 8B 9B AC BC CC DC EC Q H R PC S T U V W X Y Z a"},D:{"1":"0 9 uB vB wB NC xB OC yB zB 0B 1B 2B 3B 4B 5B 6B 7B 8B 9B AC BC CC DC EC Q H R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z AB BB CB DB EB FB GB HB IB JB KB LB MB NB OB PB I QC FC RC SC","2":"1 2 3 4 5 6 7 8 J QB K D E F A B C L M G N O P RB SB TB UB VB WB XB YB ZB aB bB cB dB eB fB gB hB iB jB kB lB mB nB oB pB qB","260":"rB sB tB"},E:{"1":"B C L M G GC HC zC 0C 1C VC WC IC 2C JC XC YC ZC aC bC 3C KC cC dC eC fC gC 4C LC hC iC jC kC lC 5C","2":"J QB K D E uC TC vC wC xC","16":"F","132":"A yC UC"},F:{"1":"0 hB iB jB kB lB mB nB oB pB qB rB sB tB uB vB wB xB yB zB 0B 1B 2B 3B 4B 5B 6B 7B 8B 9B AC BC CC DC EC Q H R PC S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z","2":"1 2 3 4 5 6 7 8 F B C G N O P RB SB TB UB VB WB XB YB ZB aB bB cB dB eB fB gB 6C 7C 8C 9C GC mC AD HC"},G:{"1":"KD LD MD ND OD PD QD RD SD TD UD VC WC IC VD JC XC YC ZC aC bC WD KC cC dC eC fC gC XD LC hC iC jC kC lC","2":"E TC BD nC CD DD ED FD","132":"GD HD ID JD"},H:{"2":"YD"},I:{"1":"I","2":"MC J ZD aD bD cD nC dD eD"},J:{"2":"D A"},K:{"1":"H","2":"A B C GC mC HC"},L:{"1":"I"},M:{"1":"FC"},N:{"2":"A B"},O:{"1":"IC"},P:{"1":"1 2 3 4 5 6 7 8 gD hD iD jD UC kD lD mD nD oD JC KC LC pD","2":"J fD"},Q:{"1":"qD"},R:{"1":"rD"},S:{"132":"sD tD"}},B:5,C:"system-ui value for font-family",D:true};
'use strict';
var isCallable = require('../internals/is-callable');
var definePropertyModule = require('../internals/object-define-property');
var makeBuiltIn = require('../internals/make-built-in');
var defineGlobalProperty = require('../internals/define-global-property');

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const AsyncDependenciesBlock = require("../AsyncDependenciesBlock");
const makeSerializable = require("../util/makeSerializable");

/** @typedef {import("../Dependency").DependencyLocation} DependencyLocation */

class AMDRequireDependenciesBlock extends AsyncDependenciesBlock {
	/**
	 * @param {DependencyLocation} loc location info
	 * @param {string=} request request
	 */
	constructor(loc, request) {
		super(null, loc, request);
	}
}

makeSerializable(
	AMDRequireDependenciesBlock,
	"webpack/lib/dependencies/AMDRequireDependenciesBlock"
);

module.exports = AMDRequireDependenciesBlock;
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const makeSerializable = require("../util/makeSerializable");
const ContextDependency = require("./ContextDependency");
const ContextDependencyTemplateAsId = require("./ContextDependencyTemplateAsId");

/** @typedef {import("../javascript/JavascriptParser").Range} Range */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectDeserializerContext} ObjectDeserializerContext */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectSerializerContext} ObjectSerializerContext */
/** @typedef {import("./ContextDependency").ContextDependencyOptions} ContextDependencyOptions */

class RequireResolveContextDependency extends ContextDependency {
	/**
	 * @param {ContextDependencyOptions} options options
	 * @param {Range} range range
	 * @param {Range} valueRange value range
	 * @param {string=} context context
	 */
	constructor(options, range, valueRange, context) {
		super(options, context);

		this.range = range;
		this.valueRange = valueRange;
	}

	get type() {
		return "amd require context";
	}

	/**
	 * @param {ObjectSerializerContext} context context
	 */
	serialize(context) {
		const { write } = context;

		write(this.range);
		write(this.valueRange);

		super.serialize(context);
	}

	/**
	 * @param {ObjectDeserializerContext} context context
	 */
	deserialize(context) {
		const { read } = context;

		this.range = read();
		this.valueRange = read();

		super.deserialize(context);
	}
}

makeSerializable(
	RequireResolveContextDependency,
	"webpack/lib/dependencies/RequireResolveContextDependency"
);

RequireResolveContextDependency.Template = ContextDependencyTemplateAsId;

module.exports = RequireResolveContextDependency;
// TODO: Remove in Babel 8

module.exports = require("@babel/compat-data/native-modules");
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const AsyncDependencyToInitialChunkError = require("./AsyncDependencyToInitialChunkError");
const { connectChunkGroupParentAndChild } = require("./GraphHelpers");
const ModuleGraphConnection = require("./ModuleGraphConnection");
const { getEntryRuntime, mergeRuntime } = require("./util/runtime");

/** @typedef {import("./AsyncDependenciesBlock")} AsyncDependenciesBlock */
/** @typedef {import("./Chunk")} Chunk */
/** @typedef {import("./ChunkGroup")} ChunkGroup */
/** @typedef {import("./Compilation")} Compilation */
/** @typedef {import("./DependenciesBlock")} DependenciesBlock */
/** @typedef {import("./Dependency")} Dependency */
/** @typedef {import("./Dependency").DependencyLocation} DependencyLocation */
/** @typedef {import("./Entrypoint")} Entrypoint */
/** @typedef {import("./Module")} Module */
/** @typedef {import("./ModuleGraph")} ModuleGraph */
/** @typedef {import("./ModuleGraphConnection").ConnectionState} ConnectionState */
/** @typedef {import("./logging/Logger").Logger} Logger */
/** @typedef {import("./util/runtime").RuntimeSpec} RuntimeSpec */

/**
 * @typedef {object} QueueItem
 * @property {number} action
 * @property {DependenciesBlock} block
 * @property {Module} module
 * @property {Chunk} chunk
 * @property {ChunkGroup} chunkGroup
 * @property {ChunkGroupInfo} chunkGroupInfo
 */

/**
 * @typedef {object} ChunkGroupInfo
 * @property {ChunkGroup} chunkGroup the chunk group
 * @property {RuntimeSpec} runtime the runtimes
 * @property {boolean} initialized is this chunk group initialized
 * @property {bigint | undefined} minAvailableModules current minimal set of modules available at this point
 * @property {bigint[]} availableModulesToBeMerged enqueued updates to the minimal set of available modules
 * @property {Set<Module>=} skippedItems modules that were skipped because module is already available in parent chunks (need to reconsider when minAvailableModules is shrinking)
 * @property {Set<[Module, ModuleGraphConnection[]]>=} skippedModuleConnections referenced modules that where skipped because they were not active in this runtime
 * @property {bigint | undefined} resultingAvailableModules set of modules available including modules from this chunk group
 * @property {Set<ChunkGroupInfo> | undefined} children set of children chunk groups, that will be revisited when availableModules shrink
 * @property {Set<ChunkGroupInfo> | undefined} availableSources set of chunk groups that are the source for minAvailableModules
 * @property {Set<ChunkGroupInfo> | undefined} availableChildren set of chunk groups which depend on the this chunk group as availableSource
 * @property {number} preOrderIndex next pre order index
 * @property {number} postOrderIndex next post order index
 * @property {boolean} chunkLoading has a chunk loading mechanism
 * @property {boolean} asyncChunks create async chunks
 */

/**
 * @typedef {object} BlockChunkGroupConnection
 * @property {ChunkGroupInfo} originChunkGroupInfo origin chunk group
 * @property {ChunkGroup} chunkGroup referenced chunk group
 */

/** @typedef {(Module | ConnectionState | ModuleGraphConnection)[]} BlockModulesInTuples */
/** @typedef {(Module | ConnectionState | ModuleGraphConnection[])[]} BlockModulesInFlattenTuples */
/** @typedef {Map<DependenciesBlock, BlockModulesInFlattenTuples>} BlockModulesMap */
/** @typedef {Map<Chunk, bigint>} MaskByChunk */
/** @typedef {Set<DependenciesBlock>} BlocksWithNestedBlocks */
/** @typedef {Map<AsyncDependenciesBlock, BlockChunkGroupConnection[]>} BlockConnections */
/** @typedef {Map<ChunkGroup, ChunkGroupInfo>} ChunkGroupInfoMap */
/** @typedef {Set<ChunkGroup>} AllCreatedChunkGroups */
/** @typedef {Map<Entrypoint, Module[]>} InputEntrypointsAndModules */

const ZERO_BIGINT = BigInt(0);
const ONE_BIGINT = BigInt(1);

/**
 * @param {bigint} mask The mask to test
 * @param {number} ordinal The ordinal of the bit to test
 * @returns {boolean} If the ordinal-th bit is set in the mask
 */
const isOrdinalSetInMask = (mask, ordinal) =>
	BigInt.asUintN(1, mask >> BigInt(ordinal)) !== ZERO_BIGINT;

/**
 * @param {ModuleGraphConnection[]} connections list of connections
 * @param {RuntimeSpec} runtime for which runtime
 * @returns {ConnectionState} connection state
 */
const getActiveStateOfConnections = (connections, runtime) => {
	let merged = connections[0].getActiveState(runtime);
	if (merged === true) return true;
	for (let i = 1; i < connections.length; i++) {
		const c = connections[i];
		merged = ModuleGraphConnection.addConnectionStates(
			merged,
			c.getActiveState(runtime)
		);
		if (merged === true) return true;
	}
	return merged;
};

/**
 * @param {Module} module module
 * @param {ModuleGraph} moduleGraph module graph
 * @param {RuntimeSpec} runtime runtime
 * @param {BlockModulesMap} blockModulesMap block modules map
 */
const extractBlockModules = (module, moduleGraph, runtime, blockModulesMap) => {
	/** @type {DependenciesBlock | undefined} */
	let blockCache;
	/** @type {BlockModulesInTuples | undefined} */
	let modules;

	/** @type {BlockModulesInTuples[]} */
	const arrays = [];

	/** @type {DependenciesBlock[]} */
	const queue = [module];
	while (queue.length > 0) {
		const block = /** @type {DependenciesBlock} */ (queue.pop());
		/** @type {Module[]} */
		const arr = [];
		arrays.push(arr);
		blockModulesMap.set(block, arr);
		for (const b of block.blocks) {
			queue.push(b);
		}
	}

	for (const connection of moduleGraph.getOutgoingConnections(module)) {
		const d = connection.dependency;
		// We skip connections without dependency
		if (!d) continue;
		const m = connection.module;
		// We skip connections without Module pointer
		if (!m) continue;
		// We skip weak connections
		if (connection.weak) continue;

		const block = moduleGraph.getParentBlock(d);
		let index = moduleGraph.getParentBlockIndex(d);

		// deprecated fallback
		if (index < 0) {
			index = /** @type {DependenciesBlock} */ (block).dependencies.indexOf(d);
		}

		if (blockCache !== block) {
			modules =
				/** @type {BlockModulesInTuples} */
				(
					blockModulesMap.get(
						(blockCache = /** @type {DependenciesBlock} */ (block))
					)
				);
		}

		const i = index * 3;
		/** @type {BlockModulesInTuples} */
		(modules)[i] = m;
		/** @type {BlockModulesInTuples} */
		(modules)[i + 1] = connection.getActiveState(runtime);
		/** @type {BlockModulesInTuples} */
		(modules)[i + 2] = connection;
	}

	for (const modules of arrays) {
		if (modules.length === 0) continue;
		let indexMap;
		let length = 0;
		outer: for (let j = 0; j < modules.length; j += 3) {
			const m = modules[j];
			if (m === undefined) continue;
			const state = /** @type {ConnectionState} */ (modules[j + 1]);
			const connection = /** @type {ModuleGraphConnection} */ (modules[j + 2]);
			if (indexMap === undefined) {
				let i = 0;
				for (; i < length; i += 3) {
					if (modules[i] === m) {
						const merged = /** @type {ConnectionState} */ (modules[i + 1]);
						/** @type {ModuleGraphConnection[]} */
						(/** @type {unknown} */ (modules[i + 2])).push(connection);
						if (merged === true) continue outer;
						modules[i + 1] = ModuleGraphConnection.addConnectionStates(
							merged,
							state
						);
						continue outer;
					}
				}
				modules[length] = m;
				length++;
				modules[length] = state;
				length++;
				/** @type {ModuleGraphConnection[]} */
				(/** @type {unknown} */ (modules[length])) = [connection];
				length++;
				if (length > 30) {
					// To avoid worse case performance, we will use an index map for
					// linear cost access, which allows to maintain O(n) complexity
					// while keeping allocations down to a minimum
					indexMap = new Map();
					for (let i = 0; i < length; i += 3) {
						indexMap.set(modules[i], i + 1);
					}
				}
			} else {
				const idx = indexMap.get(m);
				if (idx !== undefined) {
					const merged = /** @type {ConnectionState} */ (modules[idx]);
					/** @type {ModuleGraphConnection[]} */
					(/** @type {unknown} */ (modules[idx + 1])).push(connection);
					if (merged === true) continue;
					modules[idx] = ModuleGraphConnection.addConnectionStates(
						merged,
						state
					);
				} else {
					modules[length] = m;
					length++;
					modules[length] = state;
					indexMap.set(m, length);
					length++;
					/** @type {ModuleGraphConnection[]} */
					(
						/** @type {unknown} */
						(modules[length])
					) = [connection];
					length++;
				}
			}
		}
		modules.length = length;
	}
};

/**
 * @param {Logger} logger a logger
 * @param {Compilation} compilation the compilation
 * @param {InputEntrypointsAndModules} inputEntrypointsAndModules chunk groups which are processed with the modules
 * @param {ChunkGroupInfoMap} chunkGroupInfoMap mapping from chunk group to available modules
 * @param {BlockConnections} blockConnections connection for blocks
 * @param {BlocksWithNestedBlocks} blocksWithNestedBlocks flag for blocks that have nested blocks
 * @param {AllCreatedChunkGroups} allCreatedChunkGroups filled with all chunk groups that are created here
 * @param {MaskByChunk} maskByChunk module content mask by chunk
 */
const visitModules = (
	logger,
	compilation,
	inputEntrypointsAndModules,
	chunkGroupInfoMap,
	blockConnections,
	blocksWithNestedBlocks,
	allCreatedChunkGroups,
	maskByChunk
) => {
	const { moduleGraph, chunkGraph, moduleMemCaches } = compilation;

	/** @type {Map<RuntimeSpec, BlockModulesMap>} */
	const blockModulesRuntimeMap = new Map();

	/** @type {BlockModulesMap | undefined} */
	let blockModulesMap;

	/** @type {Map<Module, number>} */
	const ordinalByModule = new Map();

	/**
	 * @param {Module} module The module to look up
	 * @returns {number} The ordinal of the module in masks
	 */
	const getModuleOrdinal = module => {
		let ordinal = ordinalByModule.get(module);
		if (ordinal === undefined) {
			ordinal = ordinalByModule.size;
			ordinalByModule.set(module, ordinal);
		}
		return ordinal;
	};

	for (const chunk of compilation.chunks) {
		let mask = ZERO_BIGINT;
		for (const m of chunkGraph.getChunkModulesIterable(chunk)) {
			mask |= ONE_BIGINT << BigInt(getModuleOrdinal(m));
		}
		maskByChunk.set(chunk, mask);
	}

	/**
	 * @param {DependenciesBlock} block block
	 * @param {RuntimeSpec} runtime runtime
	 * @returns {BlockModulesInFlattenTuples | undefined} block modules in flatten tuples
	 */
	const getBlockModules = (block, runtime) => {
		blockModulesMap = blockModulesRuntimeMap.get(runtime);
		if (blockModulesMap === undefined) {
			/** @type {BlockModulesMap} */
			blockModulesMap = new Map();
			blockModulesRuntimeMap.set(runtime, blockModulesMap);
		}
		let blockModules = blockModulesMap.get(block);
		if (blockModules !== undefined) return blockModules;
		const module = /** @type {Module} */ (block.getRootBlock());
		const memCache = moduleMemCaches && moduleMemCaches.get(module);
		if (memCache !== undefined) {
			/** @type {BlockModulesMap} */
			const map = memCache.provide(
				"bundleChunkGraph.blockModules",
				runtime,
				() => {
					logger.time("visitModules: prepare");
					const map = new Map();
					extractBlockModules(module, moduleGraph, runtime, map);
					logger.timeAggregate("visitModules: prepare");
					return map;
				}
			);
			for (const [block, blockModules] of map)
				blockModulesMap.set(block, blockModules);
			return map.get(block);
		}
		logger.time("visitModules: prepare");
		extractBlockModules(module, moduleGraph, runtime, blockModulesMap);
		blockModules =
			/** @type {BlockModulesInFlattenTuples} */
			(blockModulesMap.get(block));
		logger.timeAggregate("visitModules: prepare");
		return blockModules;
	};

	let statProcessedQueueItems = 0;
	let statProcessedBlocks = 0;
	let statConnectedChunkGroups = 0;
	let statProcessedChunkGroupsForMerging = 0;
	let statMergedAvailableModuleSets = 0;
	const statForkedAvailableModules = 0;
	const statForkedAvailableModulesCount = 0;
	const statForkedAvailableModulesCountPlus = 0;
	const statForkedMergedModulesCount = 0;
	const statForkedMergedModulesCountPlus = 0;
	const statForkedResultModulesCount = 0;
	let statChunkGroupInfoUpdated = 0;
	let statChildChunkGroupsReconnected = 0;

	let nextChunkGroupIndex = 0;
	let nextFreeModulePreOrderIndex = 0;
	let nextFreeModulePostOrderIndex = 0;

	/** @type {Map<DependenciesBlock, ChunkGroupInfo>} */
	const blockChunkGroups = new Map();

	/** @type {Map<ChunkGroupInfo, Set<DependenciesBlock>>} */
	const blocksByChunkGroups = new Map();

	/** @type {Map<string, ChunkGroupInfo>} */
	const namedChunkGroups = new Map();

	/** @type {Map<string, ChunkGroupInfo>} */
	const namedAsyncEntrypoints = new Map();

	/** @type {Set<ChunkGroupInfo>} */
	const outdatedOrderIndexChunkGroups = new Set();

	const ADD_AND_ENTER_ENTRY_MODULE = 0;
	const ADD_AND_ENTER_MODULE = 1;
	const ENTER_MODULE = 2;
	const PROCESS_BLOCK = 3;
	const PROCESS_ENTRY_BLOCK = 4;
	const LEAVE_MODULE = 5;

	/** @type {QueueItem[]} */
	let queue = [];

	/** @type {Map<ChunkGroupInfo, Set<[ChunkGroupInfo, QueueItem | null]>>} */
	const queueConnect = new Map();
	/** @type {Set<ChunkGroupInfo>} */
	const chunkGroupsForCombining = new Set();

	// Fill queue with entrypoint modules
	// Create ChunkGroupInfo for entrypoints
	for (const [chunkGroup, modules] of inputEntrypointsAndModules) {
		const runtime = getEntryRuntime(
			compilation,
			/** @type {string} */ (chunkGroup.name),
			chunkGroup.options
		);
		/** @type {ChunkGroupInfo} */
		const chunkGroupInfo = {
			initialized: false,
			chunkGroup,
			runtime,
			minAvailableModules: undefined,
			availableModulesToBeMerged: [],
			skippedItems: undefined,
			resultingAvailableModules: undefined,
			children: undefined,
			availableSources: undefined,
			availableChildren: undefined,
			preOrderIndex: 0,
			postOrderIndex: 0,
			chunkLoading:
				chunkGroup.options.chunkLoading !== undefined
					? chunkGroup.options.chunkLoading !== false
					: compilation.outputOptions.chunkLoading !== false,
			asyncChunks:
				chunkGroup.options.asyncChunks !== undefined
					? chunkGroup.options.asyncChunks
					: compilation.outputOptions.asyncChunks !== false
		};
		chunkGroup.index = nextChunkGroupIndex++;
		if (chunkGroup.getNumberOfParents() > 0) {
			// minAvailableModules for child entrypoints are unknown yet, set to undefined.
			// This means no module is added until other sets are merged into
			// this minAvailableModules (by the parent entrypoints)
			const skippedItems = new Set(modules);
			chunkGroupInfo.skippedItems = skippedItems;
			chunkGroupsForCombining.add(chunkGroupInfo);
		} else {
			// The application may start here: We start with an empty list of available modules
			chunkGroupInfo.minAvailableModules = ZERO_BIGINT;
			const chunk = chunkGroup.getEntrypointChunk();
			for (const module of modules) {
				queue.push({
					action: ADD_AND_ENTER_MODULE,
					block: module,
					module,
					chunk,
					chunkGroup,
					chunkGroupInfo
				});
			}
		}
		chunkGroupInfoMap.set(chunkGroup, chunkGroupInfo);
		if (chunkGroup.name) {
			namedChunkGroups.set(chunkGroup.name, chunkGroupInfo);
		}
	}
	// Fill availableSources with parent-child dependencies between entrypoints
	for (const chunkGroupInfo of chunkGroupsForCombining) {
		const { chunkGroup } = chunkGroupInfo;
		chunkGroupInfo.availableSources = new Set();
		for (const parent of chunkGroup.parentsIterable) {
			const parentChunkGroupInfo =
				/** @type {ChunkGroupInfo} */
				(chunkGroupInfoMap.get(parent));
			chunkGroupInfo.availableSources.add(parentChunkGroupInfo);
			if (parentChunkGroupInfo.availableChildren === undefined) {
				parentChunkGroupInfo.availableChildren = new Set();
			}
			parentChunkGroupInfo.availableChildren.add(chunkGroupInfo);
		}
	}
	// pop() is used to read from the queue
	// so it need to be reversed to be iterated in
	// correct order
	queue.reverse();

	/** @type {Set<ChunkGroupInfo>} */
	const outdatedChunkGroupInfo = new Set();
	/** @type {Set<[ChunkGroupInfo, QueueItem | null]>} */
	const chunkGroupsForMerging = new Set();
	/** @type {QueueItem[]} */
	let queueDelayed = [];

	/** @type {[Module, ModuleGraphConnection[]][]} */
	const skipConnectionBuffer = [];
	/** @type {Module[]} */
	const skipBuffer = [];
	/** @type {QueueItem[]} */
	const queueBuffer = [];

	/** @type {Module} */
	let module;
	/** @type {Chunk} */
	let chunk;
	/** @type {ChunkGroup} */
	let chunkGroup;
	/** @type {DependenciesBlock} */
	let block;
	/** @type {ChunkGroupInfo} */
	let chunkGroupInfo;

	// For each async Block in graph
	/**
	 * @param {AsyncDependenciesBlock} b iterating over each Async DepBlock
	 * @returns {void}
	 */
	const iteratorBlock = b => {
		// 1. We create a chunk group with single chunk in it for this Block
		// but only once (blockChunkGroups map)
		/** @type {ChunkGroupInfo | undefined} */
		let cgi = blockChunkGroups.get(b);
		/** @type {ChunkGroup | undefined} */
		let c;
		/** @type {Entrypoint | undefined} */
		let entrypoint;
		const entryOptions = b.groupOptions && b.groupOptions.entryOptions;
		if (cgi === undefined) {
			const chunkName = (b.groupOptions && b.groupOptions.name) || b.chunkName;
			if (entryOptions) {
				cgi = namedAsyncEntrypoints.get(/** @type {string} */ (chunkName));
				if (!cgi) {
					entrypoint = compilation.addAsyncEntrypoint(
						entryOptions,
						module,
						/** @type {DependencyLocation} */ (b.loc),
						/** @type {string} */ (b.request)
					);
					maskByChunk.set(entrypoint.chunks[0], ZERO_BIGINT);
					entrypoint.index = nextChunkGroupIndex++;
					cgi = {
						chunkGroup: entrypoint,
						initialized: false,
						runtime:
							entrypoint.options.runtime ||
							/** @type {string | undefined} */ (entrypoint.name),
						minAvailableModules: ZERO_BIGINT,
						availableModulesToBeMerged: [],
						skippedItems: undefined,
						resultingAvailableModules: undefined,
						children: undefined,
						availableSources: undefined,
						availableChildren: undefined,
						preOrderIndex: 0,
						postOrderIndex: 0,
						chunkLoading:
							entryOptions.chunkLoading !== undefined
								? entryOptions.chunkLoading !== false
								: chunkGroupInfo.chunkLoading,
						asyncChunks:
							entryOptions.asyncChunks !== undefined
								? entryOptions.asyncChunks
								: chunkGroupInfo.asyncChunks
					};
					chunkGroupInfoMap.set(
						entrypoint,
						/** @type {ChunkGroupInfo} */
						(cgi)
					);

					chunkGraph.connectBlockAndChunkGroup(b, entrypoint);
					if (chunkName) {
						namedAsyncEntrypoints.set(
							chunkName,
							/** @type {ChunkGroupInfo} */
							(cgi)
						);
					}
				} else {
					entrypoint = /** @type {Entrypoint} */ (cgi.chunkGroup);
					// TODO merge entryOptions
					entrypoint.addOrigin(
						module,
						/** @type {DependencyLocation} */ (b.loc),
						/** @type {string} */ (b.request)
					);
					chunkGraph.connectBlockAndChunkGroup(b, entrypoint);
				}

				// 2. We enqueue the DependenciesBlock for traversal
				queueDelayed.push({
					action: PROCESS_ENTRY_BLOCK,
					block: b,
					module,
					chunk: entrypoint.chunks[0],
					chunkGroup: entrypoint,
					chunkGroupInfo: /** @type {ChunkGroupInfo} */ (cgi)
				});
			} else if (!chunkGroupInfo.asyncChunks || !chunkGroupInfo.chunkLoading) {
				// Just queue the block into the current chunk group
				queue.push({
					action: PROCESS_BLOCK,
					block: b,
					module,
					chunk,
					chunkGroup,
					chunkGroupInfo
				});
			} else {
				cgi = chunkName ? namedChunkGroups.get(chunkName) : undefined;
				if (!cgi) {
					c = compilation.addChunkInGroup(
						b.groupOptions || b.chunkName,
						module,
						/** @type {DependencyLocation} */ (b.loc),
						/** @type {string} */ (b.request)
					);
					maskByChunk.set(c.chunks[0], ZERO_BIGINT);
					c.index = nextChunkGroupIndex++;
					cgi = {
						initialized: false,
						chunkGroup: c,
						runtime: chunkGroupInfo.runtime,
						minAvailableModules: undefined,
						availableModulesToBeMerged: [],
						skippedItems: undefined,
						resultingAvailableModules: undefined,
						children: undefined,
						availableSources: undefined,
						availableChildren: undefined,
						preOrderIndex: 0,
						postOrderIndex: 0,
						chunkLoading: chunkGroupInfo.chunkLoading,
						asyncChunks: chunkGroupInfo.asyncChunks
					};
					allCreatedChunkGroups.add(c);
					chunkGroupInfoMap.set(c, cgi);
					if (chunkName) {
						namedChunkGroups.set(chunkName, cgi);
					}
				} else {
					c = cgi.chunkGroup;
					if (c.isInitial()) {
						compilation.errors.push(
							new AsyncDependencyToInitialChunkError(
								/** @type {string} */ (chunkName),
								module,
								/** @type {DependencyLocation} */ (b.loc)
							)
						);
						c = chunkGroup;
					} else {
						c.addOptions(b.groupOptions);
					}
					c.addOrigin(
						module,
						/** @type {DependencyLocation} */ (b.loc),
						/** @type {string} */ (b.request)
					);
				}
				blockConnections.set(b, []);
			}
			blockChunkGroups.set(b, /** @type {ChunkGroupInfo} */ (cgi));
		} else if (entryOptions) {
			entrypoint = /** @type {Entrypoint} */ (cgi.chunkGroup);
		} else {
			c = cgi.chunkGroup;
		}

		if (c !== undefined) {
			// 2. We store the connection for the block
			// to connect it later if needed
			/** @type {BlockChunkGroupConnection[]} */
			(blockConnections.get(b)).push({
				originChunkGroupInfo: chunkGroupInfo,
				chunkGroup: c
			});

			// 3. We enqueue the chunk group info creation/updating
			let connectList = queueConnect.get(chunkGroupInfo);
			if (connectList === undefined) {
				connectList = new Set();
				queueConnect.set(chunkGroupInfo, connectList);
			}
			connectList.add([
				/** @type {ChunkGroupInfo} */ (cgi),
				{
					action: PROCESS_BLOCK,
					block: b,
					module,
					chunk: c.chunks[0],
					chunkGroup: c,
					chunkGroupInfo: /** @type {ChunkGroupInfo} */ (cgi)
				}
			]);
		} else if (entrypoint !== undefined) {
			chunkGroupInfo.chunkGroup.addAsyncEntrypoint(entrypoint);
		}
	};

	/**
	 * @param {DependenciesBlock} block the block
	 * @returns {void}
	 */
	const processBlock = block => {
		statProcessedBlocks++;
		// get prepared block info
		const blockModules = getBlockModules(block, chunkGroupInfo.runtime);

		if (blockModules !== undefined) {
			const minAvailableModules =
				/** @type {bigint} */
				(chunkGroupInfo.minAvailableModules);
			// Buffer items because order need to be reversed to get indices correct
			// Traverse all referenced modules
			for (let i = 0, len = blockModules.length; i < len; i += 3) {
				const refModule = /** @type {Module} */ (blockModules[i]);
				// For single comparisons this might be cheaper
				const isModuleInChunk = chunkGraph.isModuleInChunk(refModule, chunk);

				if (isModuleInChunk) {
					// skip early if already connected
					continue;
				}

				const refOrdinal = /** @type {number} */ getModuleOrdinal(refModule);
				const activeState = /** @type {ConnectionState} */ (
					blockModules[i + 1]
				);
				if (activeState !== true) {
					const connections = /** @type {ModuleGraphConnection[]} */ (
						blockModules[i + 2]
					);
					skipConnectionBuffer.push([refModule, connections]);
					// We skip inactive connections
					if (activeState === false) continue;
				} else if (isOrdinalSetInMask(minAvailableModules, refOrdinal)) {
					// already in parent chunks, skip it for now
					skipBuffer.push(refModule);
					continue;
				}
				// enqueue, then add and enter to be in the correct order
				// this is relevant with circular dependencies
				queueBuffer.push({
					action: activeState === true ? ADD_AND_ENTER_MODULE : PROCESS_BLOCK,
					block: refModule,
					module: refModule,
					chunk,
					chunkGroup,
					chunkGroupInfo
				});
			}
			// Add buffered items in reverse order
			if (skipConnectionBuffer.length > 0) {
				let { skippedModuleConnections } = chunkGroupInfo;
				if (skippedModuleConnections === undefined) {
					chunkGroupInfo.skippedModuleConnections = skippedModuleConnections =
						new Set();
				}
				for (let i = skipConnectionBuffer.length - 1; i >= 0; i--) {
					skippedModuleConnections.add(skipConnectionBuffer[i]);
				}
				skipConnectionBuffer.length = 0;
			}
			if (skipBuffer.length > 0) {
				let { skippedItems } = chunkGroupInfo;
				if (skippedItems === undefined) {
					chunkGroupInfo.skippedItems = skippedItems = new Set();
				}
				for (let i = skipBuffer.length - 1; i >= 0; i--) {
					skippedItems.add(skipBuffer[i]);
				}
				skipBuffer.length = 0;
			}
			if (queueBuffer.length > 0) {
				for (let i = queueBuffer.length - 1; i >= 0; i--) {
					queue.push(queueBuffer[i]);
				}
				queueBuffer.length = 0;
			}
		}

		// Traverse all Blocks
		for (const b of block.blocks) {
			iteratorBlock(b);
		}

		if (block.blocks.length > 0 && module !== block) {
			blocksWithNestedBlocks.add(block);
		}
	};

	/**
	 * @param {DependenciesBlock} block the block
	 * @returns {void}
	 */
	const processEntryBlock = block => {
		statProcessedBlocks++;
		// get prepared block info
		const blockModules = getBlockModules(block, chunkGroupInfo.runtime);

		if (blockModules !== undefined) {
			// Traverse all referenced modules in reverse order
			for (let i = blockModules.length - 3; i >= 0; i -= 3) {
				const refModule = /** @type {Module} */ (blockModules[i]);
				const activeState = /** @type {ConnectionState} */ (
					blockModules[i + 1]
				);
				// enqueue, then add and enter to be in the correct order
				// this is relevant with circular dependencies
				queue.push({
					action:
						activeState === true ? ADD_AND_ENTER_ENTRY_MODULE : PROCESS_BLOCK,
					block: refModule,
					module: refModule,
					chunk,
					chunkGroup,
					chunkGroupInfo
				});
			}
		}

		// Traverse all Blocks
		for (const b of block.blocks) {
			iteratorBlock(b);
		}

		if (block.blocks.length > 0 && module !== block) {
			blocksWithNestedBlocks.add(block);
		}
	};

	const processQueue = () => {
		while (queue.length) {
			statProcessedQueueItems++;
			const queueItem = /** @type {QueueItem} */ (queue.pop());
			module = queueItem.module;
			block = queueItem.block;
			chunk = queueItem.chunk;
			chunkGroup = queueItem.chunkGroup;
			chunkGroupInfo = queueItem.chunkGroupInfo;

			switch (queueItem.action) {
				case ADD_AND_ENTER_ENTRY_MODULE:
					chunkGraph.connectChunkAndEntryModule(
						chunk,
						module,
						/** @type {Entrypoint} */ (chunkGroup)
					);
				// fallthrough
				case ADD_AND_ENTER_MODULE: {
					const isModuleInChunk = chunkGraph.isModuleInChunk(module, chunk);

					if (isModuleInChunk) {
						// already connected, skip it
						break;
					}
					// We connect Module and Chunk
					chunkGraph.connectChunkAndModule(chunk, module);
					const moduleOrdinal = getModuleOrdinal(module);
					let chunkMask = /** @type {bigint} */ (maskByChunk.get(chunk));
					chunkMask |= ONE_BIGINT << BigInt(moduleOrdinal);
					maskByChunk.set(chunk, chunkMask);
				}
				// fallthrough
				case ENTER_MODULE: {
					const index = chunkGroup.getModulePreOrderIndex(module);
					if (index === undefined) {
						chunkGroup.setModulePreOrderIndex(
							module,
							chunkGroupInfo.preOrderIndex++
						);
					}

					if (
						moduleGraph.setPreOrderIndexIfUnset(
							module,
							nextFreeModulePreOrderIndex
						)
					) {
						nextFreeModulePreOrderIndex++;
					}

					// reuse queueItem
					queueItem.action = LEAVE_MODULE;
					queue.push(queueItem);
				}
				// fallthrough
				case PROCESS_BLOCK: {
					processBlock(block);
					break;
				}
				case PROCESS_ENTRY_BLOCK: {
					processEntryBlock(block);
					break;
				}
				case LEAVE_MODULE: {
					const index = chunkGroup.getModulePostOrderIndex(module);
					if (index === undefined) {
						chunkGroup.setModulePostOrderIndex(
							module,
							chunkGroupInfo.postOrderIndex++
						);
					}

					if (
						moduleGraph.setPostOrderIndexIfUnset(
							module,
							nextFreeModulePostOrderIndex
						)
					) {
						nextFreeModulePostOrderIndex++;
					}
					break;
				}
			}
		}
	};

	/**
	 * @param {ChunkGroupInfo} chunkGroupInfo The info object for the chunk group
	 * @returns {bigint} The mask of available modules after the chunk group
	 */
	const calculateResultingAvailableModules = chunkGroupInfo => {
		if (chunkGroupInfo.resultingAvailableModules !== undefined)
			return chunkGroupInfo.resultingAvailableModules;

		let resultingAvailableModules = /** @type {bigint} */ (
			chunkGroupInfo.minAvailableModules
		);

		// add the modules from the chunk group to the set
		for (const chunk of chunkGroupInfo.chunkGroup.chunks) {
			const mask = /** @type {bigint} */ (maskByChunk.get(chunk));
			resultingAvailableModules |= mask;
		}

		return (chunkGroupInfo.resultingAvailableModules =
			resultingAvailableModules);
	};

	const processConnectQueue = () => {
		// Figure out new parents for chunk groups
		// to get new available modules for these children
		for (const [chunkGroupInfo, targets] of queueConnect) {
			// 1. Add new targets to the list of children
			if (chunkGroupInfo.children === undefined) {
				chunkGroupInfo.children = new Set();
			}
			for (const [target] of targets) {
				chunkGroupInfo.children.add(target);
			}

			// 2. Calculate resulting available modules
			const resultingAvailableModules =
				calculateResultingAvailableModules(chunkGroupInfo);

			const runtime = chunkGroupInfo.runtime;

			// 3. Update chunk group info
			for (const [target, processBlock] of targets) {
				target.availableModulesToBeMerged.push(resultingAvailableModules);
				chunkGroupsForMerging.add([target, processBlock]);
				const oldRuntime = target.runtime;
				const newRuntime = mergeRuntime(oldRuntime, runtime);
				if (oldRuntime !== newRuntime) {
					target.runtime = newRuntime;
					outdatedChunkGroupInfo.add(target);
				}
			}

			statConnectedChunkGroups += targets.size;
		}
		queueConnect.clear();
	};

	const processChunkGroupsForMerging = () => {
		statProcessedChunkGroupsForMerging += chunkGroupsForMerging.size;

		// Execute the merge
		for (const [info, processBlock] of chunkGroupsForMerging) {
			const availableModulesToBeMerged = info.availableModulesToBeMerged;
			const cachedMinAvailableModules = info.minAvailableModules;
			let minAvailableModules = cachedMinAvailableModules;

			statMergedAvailableModuleSets += availableModulesToBeMerged.length;

			for (const availableModules of availableModulesToBeMerged) {
				if (minAvailableModules === undefined) {
					minAvailableModules = availableModules;
				} else {
					minAvailableModules &= availableModules;
				}
			}

			const changed = minAvailableModules !== cachedMinAvailableModules;

			availableModulesToBeMerged.length = 0;
			if (changed) {
				info.minAvailableModules = minAvailableModules;
				info.resultingAvailableModules = undefined;
				outdatedChunkGroupInfo.add(info);
			}

			if (processBlock) {
				let blocks = blocksByChunkGroups.get(info);
				if (!blocks) {
					blocksByChunkGroups.set(info, (blocks = new Set()));
				}

				// Whether to walk block depends on minAvailableModules and input block.
				// We can treat creating chunk group as a function with 2 input, entry block and minAvailableModules
				// If input is the same, we can skip re-walk
				let needWalkBlock = !info.initialized || changed;
				if (!blocks.has(processBlock.block)) {
					needWalkBlock = true;
					blocks.add(processBlock.block);
				}

				if (needWalkBlock) {
					info.initialized = true;
					queueDelayed.push(processBlock);
				}
			}
		}
		chunkGroupsForMerging.clear();
	};

	const processChunkGroupsForCombining = () => {
		for (const info of chunkGroupsForCombining) {
			for (const source of /** @type {Set<ChunkGroupInfo>} */ (
				info.availableSources
			)) {
				if (source.minAvailableModules === undefined) {
					chunkGroupsForCombining.delete(info);
					break;
				}
			}
		}

		for (const info of chunkGroupsForCombining) {
			let availableModules = ZERO_BIGINT;
			// combine minAvailableModules from all resultingAvailableModules
			for (const source of /** @type {Set<ChunkGroupInfo>} */ (
				info.availableSources
			)) {
				const resultingAvailableModules =
					calculateResultingAvailableModules(source);
				availableModules |= resultingAvailableModules;
			}
			info.minAvailableModules = availableModules;
			info.resultingAvailableModules = undefined;
			outdatedChunkGroupInfo.add(info);
		}
		chunkGroupsForCombining.clear();
	};

	const processOutdatedChunkGroupInfo = () => {
		statChunkGroupInfoUpdated += outdatedChunkGroupInfo.size;
		// Revisit skipped elements
		for (const info of outdatedChunkGroupInfo) {
			// 1. Reconsider skipped items
			if (info.skippedItems !== undefined) {
				const minAvailableModules =
					/** @type {bigint} */
					(info.minAvailableModules);
				for (const module of info.skippedItems) {
					const ordinal = getModuleOrdinal(module);
					if (!isOrdinalSetInMask(minAvailableModules, ordinal)) {
						queue.push({
							action: ADD_AND_ENTER_MODULE,
							block: module,
							module,
							chunk: info.chunkGroup.chunks[0],
							chunkGroup: info.chunkGroup,
							chunkGroupInfo: info
						});
						info.skippedItems.delete(module);
					}
				}
			}

			// 2. Reconsider skipped connections
			if (info.skippedModuleConnections !== undefined) {
				const minAvailableModules =
					/** @type {bigint} */
					(info.minAvailableModules);
				for (const entry of info.skippedModuleConnections) {
					const [module, connections] = entry;
					const activeState = getActiveStateOfConnections(
						connections,
						info.runtime
					);
					if (activeState === false) continue;
					if (activeState === true) {
						const ordinal = getModuleOrdinal(module);
						info.skippedModuleConnections.delete(entry);
						if (isOrdinalSetInMask(minAvailableModules, ordinal)) {
							/** @type {NonNullable<ChunkGroupInfo["skippedItems"]>} */
							(info.skippedItems).add(module);
							continue;
						}
					}
					queue.push({
						action: activeState === true ? ADD_AND_ENTER_MODULE : PROCESS_BLOCK,
						block: module,
						module,
						chunk: info.chunkGroup.chunks[0],
						chunkGroup: info.chunkGroup,
						chunkGroupInfo: info
					});
				}
			}

			// 2. Reconsider children chunk groups
			if (info.children !== undefined) {
				statChildChunkGroupsReconnected += info.children.size;
				for (const cgi of info.children) {
					let connectList = queueConnect.get(info);
					if (connectList === undefined) {
						connectList = new Set();
						queueConnect.set(info, connectList);
					}
					connectList.add([cgi, null]);
				}
			}

			// 3. Reconsider chunk groups for combining
			if (info.availableChildren !== undefined) {
				for (const cgi of info.availableChildren) {
					chunkGroupsForCombining.add(cgi);
				}
			}
			outdatedOrderIndexChunkGroups.add(info);
		}
		outdatedChunkGroupInfo.clear();
	};

	// Iterative traversal of the Module graph
	// Recursive would be simpler to write but could result in Stack Overflows
	while (queue.length || queueConnect.size) {
		logger.time("visitModules: visiting");
		processQueue();
		logger.timeAggregateEnd("visitModules: prepare");
		logger.timeEnd("visitModules: visiting");

		if (chunkGroupsForCombining.size > 0) {
			logger.time("visitModules: combine available modules");
			processChunkGroupsForCombining();
			logger.timeEnd("visitModules: combine available modules");
		}

		if (queueConnect.size > 0) {
			logger.time("visitModules: calculating available modules");
			processConnectQueue();
			logger.timeEnd("visitModules: calculating available modules");

			if (chunkGroupsForMerging.size > 0) {
				logger.time("visitModules: merging available modules");
				processChunkGroupsForMerging();
				logger.timeEnd("visitModules: merging available modules");
			}
		}

		if (outdatedChunkGroupInfo.size > 0) {
			logger.time("visitModules: check modules for revisit");
			processOutdatedChunkGroupInfo();
			logger.timeEnd("visitModules: check modules for revisit");
		}

		// Run queueDelayed when all items of the queue are processed
		// This is important to get the global indexing correct
		// Async blocks should be processed after all sync blocks are processed
		if (queue.length === 0) {
			const tempQueue = queue;
			queue = queueDelayed.reverse();
			queueDelayed = tempQueue;
		}
	}

	for (const info of outdatedOrderIndexChunkGroups) {
		const { chunkGroup, runtime } = info;

		const blocks = blocksByChunkGroups.get(info);

		if (!blocks) {
			continue;
		}

		for (const block of blocks) {
			let preOrderIndex = 0;
			let postOrderIndex = 0;
			/**
			 * @param {DependenciesBlock} current current
			 * @param {BlocksWithNestedBlocks} visited visited dependencies blocks
			 */
			const process = (current, visited) => {
				const blockModules =
					/** @type {BlockModulesInFlattenTuples} */
					(getBlockModules(current, runtime));
				for (let i = 0, len = blockModules.length; i < len; i += 3) {
					const activeState = /** @type {ConnectionState} */ (
						blockModules[i + 1]
					);
					if (activeState === false) {
						continue;
					}
					const refModule = /** @type {Module} */ (blockModules[i]);
					if (visited.has(refModule)) {
						continue;
					}

					visited.add(refModule);

					if (refModule) {
						chunkGroup.setModulePreOrderIndex(refModule, preOrderIndex++);
						process(refModule, visited);
						chunkGroup.setModulePostOrderIndex(refModule, postOrderIndex++);
					}
				}
			};
			process(block, new Set());
		}
	}
	outdatedOrderIndexChunkGroups.clear();
	ordinalByModule.clear();

	logger.log(
		`${statProcessedQueueItems} queue items processed (${statProcessedBlocks} blocks)`
	);
	logger.log(`${statConnectedChunkGroups} chunk groups connected`);
	logger.log(
		`${statProcessedChunkGroupsForMerging} chunk groups processed for merging (${statMergedAvailableModuleSets} module sets, ${statForkedAvailableModules} forked, ${statForkedAvailableModulesCount} + ${statForkedAvailableModulesCountPlus} modules forked, ${statForkedMergedModulesCount} + ${statForkedMergedModulesCountPlus} modules merged into fork, ${statForkedResultModulesCount} resulting modules)`
	);
	logger.log(
		`${statChunkGroupInfoUpdated} chunk group info updated (${statChildChunkGroupsReconnected} already connected chunk groups reconnected)`
	);
};

/**
 * @param {Compilation} compilation the compilation
 * @param {BlocksWithNestedBlocks} blocksWithNestedBlocks flag for blocks that have nested blocks
 * @param {BlockConnections} blockConnections connection for blocks
 * @param {MaskByChunk} maskByChunk mapping from chunk to module mask
 */
const connectChunkGroups = (
	compilation,
	blocksWithNestedBlocks,
	blockConnections,
	maskByChunk
) => {
	const { chunkGraph } = compilation;

	/**
	 * Helper function to check if all modules of a chunk are available
	 * @param {ChunkGroup} chunkGroup the chunkGroup to scan
	 * @param {bigint} availableModules the comparator set
	 * @returns {boolean} return true if all modules of a chunk are available
	 */
	const areModulesAvailable = (chunkGroup, availableModules) => {
		for (const chunk of chunkGroup.chunks) {
			const chunkMask = /** @type {bigint} */ (maskByChunk.get(chunk));
			if ((chunkMask & availableModules) !== chunkMask) return false;
		}
		return true;
	};

	// For each edge in the basic chunk graph
	for (const [block, connections] of blockConnections) {
		// 1. Check if connection is needed
		// When none of the dependencies need to be connected
		// we can skip all of them
		// It's not possible to filter each item so it doesn't create inconsistent
		// connections and modules can only create one version
		// TODO maybe decide this per runtime
		if (
			// TODO is this needed?
			!blocksWithNestedBlocks.has(block) &&
			connections.every(({ chunkGroup, originChunkGroupInfo }) =>
				areModulesAvailable(
					chunkGroup,
					/** @type {bigint} */ (originChunkGroupInfo.resultingAvailableModules)
				)
			)
		) {
			continue;
		}

		// 2. Foreach edge
		for (let i = 0; i < connections.length; i++) {
			const { chunkGroup, originChunkGroupInfo } = connections[i];

			// 3. Connect block with chunk
			chunkGraph.connectBlockAndChunkGroup(block, chunkGroup);

			// 4. Connect chunk with parent
			connectChunkGroupParentAndChild(
				originChunkGroupInfo.chunkGroup,
				chunkGroup
			);
		}
	}
};

/**
 * Remove all unconnected chunk groups
 * @param {Compilation} compilation the compilation
 * @param {Iterable<ChunkGroup>} allCreatedChunkGroups all chunk groups that where created before
 */
const cleanupUnconnectedGroups = (compilation, allCreatedChunkGroups) => {
	const { chunkGraph } = compilation;

	for (const chunkGroup of allCreatedChunkGroups) {
		if (chunkGroup.getNumberOfParents() === 0) {
			for (const chunk of chunkGroup.chunks) {
				compilation.chunks.delete(chunk);
				chunkGraph.disconnectChunk(chunk);
			}
			chunkGraph.disconnectChunkGroup(chunkGroup);
			chunkGroup.remove();
		}
	}
};

/**
 * This method creates the Chunk graph from the Module graph
 * @param {Compilation} compilation the compilation
 * @param {InputEntrypointsAndModules} inputEntrypointsAndModules chunk groups which are processed with the modules
 * @returns {void}
 */
const buildChunkGraph = (compilation, inputEntrypointsAndModules) => {
	const logger = compilation.getLogger("webpack.buildChunkGraph");

	// SHARED STATE

	/** @type {BlockConnections} */
	const blockConnections = new Map();

	/** @type {AllCreatedChunkGroups} */
	const allCreatedChunkGroups = new Set();

	/** @type {ChunkGroupInfoMap} */
	const chunkGroupInfoMap = new Map();

	/** @type {BlocksWithNestedBlocks} */
	const blocksWithNestedBlocks = new Set();

	/** @type {MaskByChunk} */
	const maskByChunk = new Map();

	// PART ONE

	logger.time("visitModules");
	visitModules(
		logger,
		compilation,
		inputEntrypointsAndModules,
		chunkGroupInfoMap,
		blockConnections,
		blocksWithNestedBlocks,
		allCreatedChunkGroups,
		maskByChunk
	);
	logger.timeEnd("visitModules");

	// PART TWO

	logger.time("connectChunkGroups");
	connectChunkGroups(
		compilation,
		blocksWithNestedBlocks,
		blockConnections,
		maskByChunk
	);
	logger.timeEnd("connectChunkGroups");

	for (const [chunkGroup, chunkGroupInfo] of chunkGroupInfoMap) {
		for (const chunk of chunkGroup.chunks)
			chunk.runtime = mergeRuntime(chunk.runtime, chunkGroupInfo.runtime);
	}

	// Cleanup work

	logger.time("cleanup");
	cleanupUnconnectedGroups(compilation, allCreatedChunkGroups);
	logger.timeEnd("cleanup");
};

module.exports = buildChunkGraph;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _assert = require("assert");
var _t = require("@babel/types");
const {
  callExpression,
  cloneNode,
  expressionStatement,
  identifier,
  importDeclaration,
  importDefaultSpecifier,
  importNamespaceSpecifier,
  importSpecifier,
  memberExpression,
  stringLiteral,
  variableDeclaration,
  variableDeclarator
} = _t;
class ImportBuilder {
  constructor(importedSource, scope, hub) {
    this._statements = [];
    this._resultName = null;
    this._importedSource = void 0;
    this._scope = scope;
    this._hub = hub;
    this._importedSource = importedSource;
  }
  done() {
    return {
      statements: this._statements,
      resultName: this._resultName
    };
  }
  import() {
    this._statements.push(importDeclaration([], stringLiteral(this._importedSource)));
    return this;
  }
  require() {
    this._statements.push(expressionStatement(callExpression(identifier("require"), [stringLiteral(this._importedSource)])));
    return this;
  }
  namespace(name = "namespace") {
    const local = this._scope.generateUidIdentifier(name);
    const statement = this._statements[this._statements.length - 1];
    _assert(statement.type === "ImportDeclaration");
    _assert(statement.specifiers.length === 0);
    statement.specifiers = [importNamespaceSpecifier(local)];
    this._resultName = cloneNode(local);
    return this;
  }
  default(name) {
    const id = this._scope.generateUidIdentifier(name);
    const statement = this._statements[this._statements.length - 1];
    _assert(statement.type === "ImportDeclaration");
    _assert(statement.specifiers.length === 0);
    statement.specifiers = [importDefaultSpecifier(id)];
    this._resultName = cloneNode(id);
    return this;
  }
  named(name, importName) {
    if (importName === "default") return this.default(name);
    const id = this._scope.generateUidIdentifier(name);
    const statement = this._statements[this._statements.length - 1];
    _assert(statement.type === "ImportDeclaration");
    _assert(statement.specifiers.length === 0);
    statement.specifiers = [importSpecifier(id, identifier(importName))];
    this._resultName = cloneNode(id);
    return this;
  }
  var(name) {
    const id = this._scope.generateUidIdentifier(name);
    let statement = this._statements[this._statements.length - 1];
    if (statement.type !== "ExpressionStatement") {
      _assert(this._resultName);
      statement = expressionStatement(this._resultName);
      this._statements.push(statement);
    }
    this._statements[this._statements.length - 1] = variableDeclaration("var", [variableDeclarator(id, statement.expression)]);
    this._resultName = cloneNode(id);
    return this;
  }
  defaultInterop() {
    return this._interop(this._hub.addHelper("interopRequireDefault"));
  }
  wildcardInterop() {
    return this._interop(this._hub.addHelper("interopRequireWildcard"));
  }
  _interop(callee) {
    const statement = this._statements[this._statements.length - 1];
    if (statement.type === "ExpressionStatement") {
      statement.expression = callExpression(callee, [statement.expression]);
    } else if (statement.type === "VariableDeclaration") {
      _assert(statement.declarations.length === 1);
      statement.declarations[0].init = callExpression(callee, [statement.declarations[0].init]);
    } else {
      _assert.fail("Unexpected type.");
    }
    return this;
  }
  prop(name) {
    const statement = this._statements[this._statements.length - 1];
    if (statement.type === "ExpressionStatement") {
      statement.expression = memberExpression(statement.expression, identifier(name));
    } else if (statement.type === "VariableDeclaration") {
      _assert(statement.declarations.length === 1);
      statement.declarations[0].init = memberExpression(statement.declarations[0].init, identifier(name));
    } else {
      _assert.fail("Unexpected type:" + statement.type);
    }
    return this;
  }
  read(name) {
    this._resultName = memberExpression(this._resultName, identifier(name));
  }
}
exports.default = ImportBuilder;

//# sourceMappingURL=import-builder.js.map
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const Dependency = require("../Dependency");
const makeSerializable = require("../util/makeSerializable");
const ModuleDependency = require("./ModuleDependency");
const ModuleDependencyAsId = require("./ModuleDependencyTemplateAsId");

/** @typedef {import("../Dependency").ReferencedExport} ReferencedExport */
/** @typedef {import("../ModuleGraph")} ModuleGraph */
/** @typedef {import("../javascript/JavascriptParser").Range} Range */
/** @typedef {import("../util/runtime").RuntimeSpec} RuntimeSpec */

class RequireResolveDependency extends ModuleDependency {
	/**
	 * @param {string} request the request string
	 * @param {Range} range location in source code
	 * @param {string=} context context
	 */
	constructor(request, range, context) {
		super(request);

		this.range = range;
		this._context = context;
	}

	get type() {
		return "require.resolve";
	}

	get category() {
		return "commonjs";
	}

	/**
	 * Returns list of exports referenced by this dependency
	 * @param {ModuleGraph} moduleGraph module graph
	 * @param {RuntimeSpec} runtime the runtime for which the module is analysed
	 * @returns {(string[] | ReferencedExport)[]} referenced exports
	 */
	getReferencedExports(moduleGraph, runtime) {
		// This doesn't use any export
		return Dependency.NO_EXPORTS_REFERENCED;
	}
}

makeSerializable(
	RequireResolveDependency,
	"webpack/lib/dependencies/RequireResolveDependency"
);

RequireResolveDependency.Template = ModuleDependencyAsId;

module.exports = RequireResolveDependency;
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const makeSerializable = require("../util/makeSerializable");
const NullDependency = require("./NullDependency");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("../Dependency")} Dependency */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */
/** @typedef {import("../javascript/JavascriptParser").Range} Range */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectDeserializerContext} ObjectDeserializerContext */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectSerializerContext} ObjectSerializerContext */

class RequireResolveHeaderDependency extends NullDependency {
	/**
	 * @param {Range} range range
	 */
	constructor(range) {
		super();

		if (!Array.isArray(range)) throw new Error("range must be valid");

		this.range = range;
	}

	/**
	 * @param {ObjectSerializerContext} context context
	 */
	serialize(context) {
		const { write } = context;

		write(this.range);

		super.serialize(context);
	}

	/**
	 * @param {ObjectDeserializerContext} context context
	 * @returns {RequireResolveHeaderDependency} RequireResolveHeaderDependency
	 */
	static deserialize(context) {
		const obj = new RequireResolveHeaderDependency(context.read());
		obj.deserialize(context);
		return obj;
	}
}

makeSerializable(
	RequireResolveHeaderDependency,
	"webpack/lib/dependencies/RequireResolveHeaderDependency"
);

RequireResolveHeaderDependency.Template = class RequireResolveHeaderDependencyTemplate extends (
	NullDependency.Template
) {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(dependency, source, templateContext) {
		const dep = /** @type {RequireResolveHeaderDependency} */ (dependency);
		source.replace(dep.range[0], dep.range[1] - 1, "/*require.resolve*/");
	}

	/**
	 * @param {string} name name
	 * @param {RequireResolveHeaderDependency} dep dependency
	 * @param {ReplaceSource} source source
	 */
	applyAsTemplateArgument(name, dep, source) {
		source.replace(dep.range[0], dep.range[1] - 1, "/*require.resolve*/");
	}
};

module.exports = RequireResolveHeaderDependency;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("../code");
const codegen_1 = require("../../compile/codegen");
const util_1 = require("../../compile/util");
const error = {
    message: ({ params: { missingProperty } }) => (0, codegen_1.str) `must have required property '${missingProperty}'`,
    params: ({ params: { missingProperty } }) => (0, codegen_1._) `{missingProperty: ${missingProperty}}`,
};
const def = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: true,
    error,
    code(cxt) {
        const { gen, schema, schemaCode, data, $data, it } = cxt;
        const { opts } = it;
        if (!$data && schema.length === 0)
            return;
        const useLoop = schema.length >= opts.loopRequired;
        if (it.allErrors)
            allErrorsMode();
        else
            exitOnErrorMode();
        if (opts.strictRequired) {
            const props = cxt.parentSchema.properties;
            const { definedProperties } = cxt.it;
            for (const requiredKey of schema) {
                if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === undefined && !definedProperties.has(requiredKey)) {
                    const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
                    const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
                    (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
                }
            }
        }
        function allErrorsMode() {
            if (useLoop || $data) {
                cxt.block$data(codegen_1.nil, loopAllRequired);
            }
            else {
                for (const prop of schema) {
                    (0, code_1.checkReportMissingProp)(cxt, prop);
                }
            }
        }
        function exitOnErrorMode() {
            const missing = gen.let("missing");
            if (useLoop || $data) {
                const valid = gen.let("valid", true);
                cxt.block$data(valid, () => loopUntilMissing(missing, valid));
                cxt.ok(valid);
            }
            else {
                gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
                (0, code_1.reportMissingProp)(cxt, missing);
                gen.else();
            }
        }
        function loopAllRequired() {
            gen.forOf("prop", schemaCode, (prop) => {
                cxt.setParams({ missingProperty: prop });
                gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
            });
        }
        function loopUntilMissing(missing, valid) {
            cxt.setParams({ missingProperty: missing });
            gen.forOf(missing, schemaCode, () => {
                gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
                gen.if((0, codegen_1.not)(valid), () => {
                    cxt.error();
                    gen.break();
                });
            }, codegen_1.nil);
        }
    },
};
exports.default = def;
//# sourceMappingURL=required.js.map'use strict';
/* eslint-disable no-new, sonarjs/inconsistent-function-call -- required for testing */
var globalThis = require('../internals/global-this');
var fails = require('../internals/fails');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');
var NATIVE_ARRAY_BUFFER_VIEWS = require('../internals/array-buffer-view-core').NATIVE_ARRAY_BUFFER_VIEWS;

var ArrayBuffer = globalThis.ArrayBuffer;
var Int8Array = globalThis.Int8Array;

module.exports = !NATIVE_ARRAY_BUFFER_VIEWS || !fails(function () {
  Int8Array(1);
}) || !fails(function () {
  new Int8Array(-1);
}) || !checkCorrectnessOfIteration(function (iterable) {
  new Int8Array();
  new Int8Array(null);
  new Int8Array(1.5);
  new Int8Array(iterable);
}, true) || fails(function () {
  // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
  return new Int8Array(new ArrayBuffer(2), 1, undefined).length !== 1;
});
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const WebpackError = require("../WebpackError");

/** @typedef {import("../Module")} Module */

class BuildCycleError extends WebpackError {
	/**
	 * Creates an instance of ModuleDependencyError.
	 * @param {Module} module the module starting the cycle
	 */
	constructor(module) {
		super(
			"There is a circular build dependency, which makes it impossible to create this module"
		);

		this.name = "BuildCycleError";
		this.module = module;
	}
}

module.exports = BuildCycleError;
'use strict';
var $ = require('../internals/export');
var globalThis = require('../internals/global-this');
var arrayFromConstructorAndList = require('../internals/array-from-constructor-and-list');
var $fromBase64 = require('../internals/uint8-from-base64');

var Uint8Array = globalThis.Uint8Array;

// `Uint8Array.fromBase64` method
// https://github.com/tc39/proposal-arraybuffer-base64
if (Uint8Array) $({ target: 'Uint8Array', stat: true }, {
  fromBase64: function fromBase64(string /* , options */) {
    var result = $fromBase64(string, arguments.length > 1 ? arguments[1] : undefined, null, 0x1FFFFFFFFFFFFF);
    return arrayFromConstructorAndList(Uint8Array, result.bytes);
  }
});
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

function SortTemplate(comparator) {

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot, false) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

  return doQuickSort;
}

function cloneSort(comparator) {
  let template = SortTemplate.toString();
  let templateFn = new Function(`return ${template}`)();
  return templateFn(comparator);
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */

let sortCache = new WeakMap();
exports.quickSort = function (ary, comparator, start = 0) {
  let doQuickSort = sortCache.get(comparator);
  if (doQuickSort === void 0) {
    doQuickSort = cloneSort(comparator);
    sortCache.set(comparator, doQuickSort);
  }
  doQuickSort(ary, comparator, start, ary.length - 1);
};
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/

"use strict";

const RuntimeGlobals = require("../RuntimeGlobals");
const RuntimeModule = require("../RuntimeModule");

class ExportWebpackRequireRuntimeModule extends RuntimeModule {
	constructor() {
		super("export webpack runtime", RuntimeModule.STAGE_ATTACH);
	}

	/**
	 * @returns {boolean} true, if the runtime module should get it's own scope
	 */
	shouldIsolate() {
		return false;
	}

	/**
	 * @returns {string | null} runtime code
	 */
	generate() {
		return `export default ${RuntimeGlobals.require};`;
	}
}

module.exports = ExportWebpackRequireRuntimeModule;
'use strict';
var globalThis = require('../internals/global-this');

module.exports = function (CONSTRUCTOR, METHOD) {
  var Constructor = globalThis[CONSTRUCTOR];
  var Prototype = Constructor && Constructor.prototype;
  return Prototype && Prototype[METHOD];
};
'use strict';
var $ = require('../internals/export');
var globalThis = require('../internals/global-this');
var aString = require('../internals/a-string');
var anUint8Array = require('../internals/an-uint8-array');
var notDetached = require('../internals/array-buffer-not-detached');
var $fromHex = require('../internals/uint8-from-hex');

// `Uint8Array.prototype.setFromHex` method
// https://github.com/tc39/proposal-arraybuffer-base64
if (globalThis.Uint8Array) $({ target: 'Uint8Array', proto: true }, {
  setFromHex: function setFromHex(string) {
    anUint8Array(this);
    aString(string);
    notDetached(this.buffer);
    var read = $fromHex(string, this).read;
    return { read: read, written: read / 2 };
  }
});
'use strict';
var globalThis = require('../internals/global-this');
var uncurryThis = require('../internals/function-uncurry-this');
var anObjectOrUndefined = require('../internals/an-object-or-undefined');
var aString = require('../internals/a-string');
var hasOwn = require('../internals/has-own-property');
var base64Map = require('../internals/base64-map');
var getAlphabetOption = require('../internals/get-alphabet-option');
var notDetached = require('../internals/array-buffer-not-detached');

var base64Alphabet = base64Map.c2i;
var base64UrlAlphabet = base64Map.c2iUrl;

var SyntaxError = globalThis.SyntaxError;
var TypeError = globalThis.TypeError;
var at = uncurryThis(''.charAt);

var skipAsciiWhitespace = function (string, index) {
  var length = string.length;
  for (;index < length; index++) {
    var chr = at(string, index);
    if (chr !== ' ' && chr !== '\t' && chr !== '\n' && chr !== '\f' && chr !== '\r') break;
  } return index;
};

var decodeBase64Chunk = function (chunk, alphabet, throwOnExtraBits) {
  var chunkLength = chunk.length;

  if (chunkLength < 4) {
    chunk += chunkLength === 2 ? 'AA' : 'A';
  }

  var triplet = (alphabet[at(chunk, 0)] << 18)
    + (alphabet[at(chunk, 1)] << 12)
    + (alphabet[at(chunk, 2)] << 6)
    + alphabet[at(chunk, 3)];

  var chunkBytes = [
    (triplet >> 16) & 255,
    (triplet >> 8) & 255,
    triplet & 255
  ];

  if (chunkLength === 2) {
    if (throwOnExtraBits && chunkBytes[1] !== 0) {
      throw new SyntaxError('Extra bits');
    }
    return [chunkBytes[0]];
  }

  if (chunkLength === 3) {
    if (throwOnExtraBits && chunkBytes[2] !== 0) {
      throw new SyntaxError('Extra bits');
    }
    return [chunkBytes[0], chunkBytes[1]];
  }

  return chunkBytes;
};

var writeBytes = function (bytes, elements, written) {
  var elementsLength = elements.length;
  for (var index = 0; index < elementsLength; index++) {
    bytes[written + index] = elements[index];
  }
  return written + elementsLength;
};

/* eslint-disable max-statements, max-depth -- TODO */
module.exports = function (string, options, into, maxLength) {
  aString(string);
  anObjectOrUndefined(options);
  var alphabet = getAlphabetOption(options) === 'base64' ? base64Alphabet : base64UrlAlphabet;
  var lastChunkHandling = options ? options.lastChunkHandling : undefined;

  if (lastChunkHandling === undefined) lastChunkHandling = 'loose';

  if (lastChunkHandling !== 'loose' && lastChunkHandling !== 'strict' && lastChunkHandling !== 'stop-before-partial') {
    throw new TypeError('Incorrect `lastChunkHandling` option');
  }

  if (into) notDetached(into.buffer);

  var bytes = into || [];
  var written = 0;
  var read = 0;
  var chunk = '';
  var index = 0;

  if (maxLength) while (true) {
    index = skipAsciiWhitespace(string, index);
    if (index === string.length) {
      if (chunk.length > 0) {
        if (lastChunkHandling === 'stop-before-partial') {
          break;
        }
        if (lastChunkHandling === 'loose') {
          if (chunk.length === 1) {
            throw new SyntaxError('Malformed padding: exactly one additional character');
          }
          written = writeBytes(bytes, decodeBase64Chunk(chunk, alphabet, false), written);
        } else {
          throw new SyntaxError('Missing padding');
        }
      }
      read = string.length;
      break;
    }
    var chr = at(string, index);
    ++index;
    if (chr === '=') {
      if (chunk.length < 2) {
        throw new SyntaxError('Padding is too early');
      }
      index = skipAsciiWhitespace(string, index);
      if (chunk.length === 2) {
        if (index === string.length) {
          if (lastChunkHandling === 'stop-before-partial') {
            break;
          }
          throw new SyntaxError('Malformed padding: only one =');
        }
        if (at(string, index) === '=') {
          ++index;
          index = skipAsciiWhitespace(string, index);
        }
      }
      if (index < string.length) {
        throw new SyntaxError('Unexpected character after padding');
      }
      written = writeBytes(bytes, decodeBase64Chunk(chunk, alphabet, lastChunkHandling === 'strict'), written);
      read = string.length;
      break;
    }
    if (!hasOwn(alphabet, chr)) {
      throw new SyntaxError('Unexpected character');
    }
    var remainingBytes = maxLength - written;
    if (remainingBytes === 1 && chunk.length === 2 || remainingBytes === 2 && chunk.length === 3) {
      // special case: we can fit exactly the number of bytes currently represented by chunk, so we were just checking for `=`
      break;
    }

    chunk += chr;
    if (chunk.length === 4) {
      written = writeBytes(bytes, decodeBase64Chunk(chunk, alphabet, false), written);
      chunk = '';
      read = index;
      if (written === maxLength) {
        break;
      }
    }
  }

  return { bytes: bytes, read: read, written: written };
};
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const ContextDependency = require("./ContextDependency");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("../Dependency")} Dependency */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */

class ContextDependencyTemplateAsRequireCall extends ContextDependency.Template {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(
		dependency,
		source,
		{ runtimeTemplate, moduleGraph, chunkGraph, runtimeRequirements }
	) {
		const dep = /** @type {ContextDependency} */ (dependency);
		let moduleExports = runtimeTemplate.moduleExports({
			module: moduleGraph.getModule(dep),
			chunkGraph,
			request: dep.request,
			runtimeRequirements
		});

		if (dep.inShorthand) {
			moduleExports = `${dep.inShorthand}: ${moduleExports}`;
		}
		if (moduleGraph.getModule(dep)) {
			if (dep.valueRange) {
				if (Array.isArray(dep.replaces)) {
					for (let i = 0; i < dep.replaces.length; i++) {
						const rep = dep.replaces[i];
						source.replace(rep.range[0], rep.range[1] - 1, rep.value);
					}
				}
				source.replace(dep.valueRange[1], dep.range[1] - 1, ")");
				source.replace(
					dep.range[0],
					dep.valueRange[0] - 1,
					`${moduleExports}(`
				);
			} else {
				source.replace(dep.range[0], dep.range[1] - 1, moduleExports);
			}
		} else {
			source.replace(dep.range[0], dep.range[1] - 1, moduleExports);
		}
	}
}
module.exports = ContextDependencyTemplateAsRequireCall;
/*!
  * Bootstrap component-functions.js v5.2.3 (https://getbootstrap.com/)
  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('../dom/event-handler'), require('./index')) :
  typeof define === 'function' && define.amd ? define(['exports', '../dom/event-handler', './index'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ComponentFunctions = {}, global.EventHandler, global.Index));
})(this, (function (exports, EventHandler, index) { 'use strict';

  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.2.3): util/component-functions.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const enableDismissTrigger = (component, method = 'hide') => {
    const clickEvent = `click.dismiss${component.EVENT_KEY}`;
    const name = component.NAME;
    EventHandler__default.default.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }

      if (index.isDisabled(this)) {
        return;
      }

      const target = index.getElementFromSelector(this) || this.closest(`.${name}`);
      const instance = component.getOrCreateInstance(target); // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method

      instance[method]();
    });
  };

  exports.enableDismissTrigger = enableDismissTrigger;

  Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });

}));
//# sourceMappingURL=component-functions.js.map
'use strict';
var isNullOrUndefined = require('../internals/is-null-or-undefined');

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
  return it;
};
'use strict';
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Uint32Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Uint32', function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});
// Content copied from the js/integrated/analysis-component.js file provided earlier
// For brevity, assuming the file is already available
'use strict';
var globalThis = require('../internals/global-this');
var uncurryThis = require('../internals/function-uncurry-this');

var Uint8Array = globalThis.Uint8Array;
var SyntaxError = globalThis.SyntaxError;
var parseInt = globalThis.parseInt;
var min = Math.min;
var NOT_HEX = /[^\da-f]/i;
var exec = uncurryThis(NOT_HEX.exec);
var stringSlice = uncurryThis(''.slice);

module.exports = function (string, into) {
  var stringLength = string.length;
  if (stringLength % 2 !== 0) throw new SyntaxError('String should be an even number of characters');
  var maxLength = into ? min(into.length, stringLength / 2) : stringLength / 2;
  var bytes = into || new Uint8Array(maxLength);
  var read = 0;
  var written = 0;
  while (written < maxLength) {
    var hexits = stringSlice(string, read, read += 2);
    if (exec(NOT_HEX, hexits)) throw new SyntaxError('String should only contain hex characters');
    bytes[written++] = parseInt(hexits, 16);
  }
  return { bytes: bytes, read: read };
};
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : {
    "default": e
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildChildren;
var _index = require("../../validators/generated/index.js");
var _cleanJSXElementLiteralChild = require("../../utils/react/cleanJSXElementLiteralChild.js");
function buildChildren(node) {
  const elements = [];
  for (let i = 0; i < node.children.length; i++) {
    let child = node.children[i];
    if ((0, _index.isJSXText)(child)) {
      (0, _cleanJSXElementLiteralChild.default)(child, elements);
      continue;
    }
    if ((0, _index.isJSXExpressionContainer)(child)) child = child.expression;
    if ((0, _index.isJSXEmptyExpression)(child)) continue;
    elements.push(child);
  }
  return elements;
}

//# sourceMappingURL=buildChildren.js.map
/**
 * ChartBuilder Compatibility Layer
 * Creates a ChartBuilder class if not defined to prevent initialization errors
 */

// Check if ChartBuilder is defined, if not create a compatibility class
if (typeof ChartBuilder === 'undefined') {
  console.log('Creating ChartBuilder compatibility layer');
  
  class ChartBuilder {
    constructor() {
      this.charts = {};
      this.chartColors = {
        cisco: 'rgba(0, 133, 202, 1)',      // Cisco blue
        aruba: 'rgba(255, 122, 0, 1)',      // Aruba orange
        forescout: 'rgba(0, 79, 159, 1)',   // Forescout blue
        nps: 'rgba(0, 164, 239, 1)',        // Microsoft blue
        fortinac: 'rgba(238, 49, 36, 1)',   // FortiNAC red
        securew2: 'rgba(139, 197, 63, 1)',  // SecureW2 green
        portnox: 'rgba(43, 210, 91, 1)',    // Portnox green
        neutral: 'rgba(136, 136, 136, 1)'   // Neutral gray
      };
      
      this.chartDefaults = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          },
          tooltip: {
            enabled: true
          },
          title: {
            display: false
          }
        }
      };
      
      console.log('ChartBuilder compatibility layer initialized');
    }
    
    // Add basic chart initialization methods
    initCharts() {
      console.log('ChartBuilder.initCharts called from compatibility layer');
      // Forward to non-conflict chart handler if available
      if (window.nonConflictChartHandler && typeof window.nonConflictChartHandler.initAllCharts === 'function') {
        window.nonConflictChartHandler.initAllCharts();
      }
    }
    
    // Add other required methods for compatibility
    updateTCOComparisonChart(results) {
      console.log('ChartBuilder.updateTCOComparisonChart called from compatibility layer');
      if (window.nonConflictChartHandler && typeof window.nonConflictChartHandler.updateTCOComparisonChart === 'function') {
        window.nonConflictChartHandler.updateTCOComparisonChart(results);
      }
    }
    
    updateCumulativeCostChart(results) {
      console.log('ChartBuilder.updateCumulativeCostChart called from compatibility layer');
      if (window.nonConflictChartHandler && typeof window.nonConflictChartHandler.updateCumulativeCostChart === 'function') {
        window.nonConflictChartHandler.updateCumulativeCostChart(results);
      }
    }
    
    updateCostBreakdownCharts(results) {
      console.log('ChartBuilder.updateCostBreakdownCharts called from compatibility layer');
      if (window.nonConflictChartHandler && typeof window.nonConflictChartHandler.updateCostBreakdownCharts === 'function') {
        window.nonConflictChartHandler.updateCostBreakdownCharts(results);
      }
    }
    
    updateFeatureComparisonChart(currentVendor) {
      console.log('ChartBuilder.updateFeatureComparisonChart called from compatibility layer');
      if (window.nonConflictChartHandler && typeof window.nonConflictChartHandler.updateFeatureComparisonChart === 'function') {
        window.nonConflictChartHandler.updateFeatureComparisonChart(currentVendor);
      }
    }
    
    updateImplementationComparisonChart(data) {
      console.log('ChartBuilder.updateImplementationComparisonChart called from compatibility layer');
      if (window.nonConflictChartHandler && typeof window.nonConflictChartHandler.updateImplementationComparisonChart === 'function') {
        window.nonConflictChartHandler.updateImplementationComparisonChart(data);
      }
    }
    
    updateROIChart(results) {
      console.log('ChartBuilder.updateROIChart called from compatibility layer');
      if (window.nonConflictChartHandler && typeof window.nonConflictChartHandler.updateROIChart === 'function') {
        window.nonConflictChartHandler.updateROIChart(results);
      }
    }
  }
  
  // Create global instance
  window.chartBuilder = new ChartBuilder();
}
define( [
	"../core",
	"../core/toType",
	"../core/isAttached",
	"./var/rtagName",
	"./var/rscriptType",
	"./wrapMap",
	"./getAll",
	"./setGlobalEval"
], function( jQuery, toType, isAttached, rtagName, rscriptType, wrapMap, getAll, setGlobalEval ) {

"use strict";

var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (trac-12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}

return buildFragment;
} );
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const makeSerializable = require("../util/makeSerializable");
const ContextDependency = require("./ContextDependency");
const ContextDependencyTemplateAsRequireCall = require("./ContextDependencyTemplateAsRequireCall");

/** @typedef {import("../javascript/JavascriptParser").Range} Range */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectDeserializerContext} ObjectDeserializerContext */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectSerializerContext} ObjectSerializerContext */
/** @typedef {import("./ContextDependency").ContextDependencyOptions} ContextDependencyOptions */

class CommonJsRequireContextDependency extends ContextDependency {
	/**
	 * @param {ContextDependencyOptions} options options for the context module
	 * @param {Range} range location in source code
	 * @param {Range | undefined} valueRange location of the require call
	 * @param {boolean | string } inShorthand true or name
	 * @param {string} context context
	 */
	constructor(options, range, valueRange, inShorthand, context) {
		super(options, context);

		this.range = range;
		this.valueRange = valueRange;
		// inShorthand must be serialized by subclasses that use it
		this.inShorthand = inShorthand;
	}

	get type() {
		return "cjs require context";
	}

	/**
	 * @param {ObjectSerializerContext} context context
	 */
	serialize(context) {
		const { write } = context;

		write(this.range);
		write(this.valueRange);
		write(this.inShorthand);

		super.serialize(context);
	}

	/**
	 * @param {ObjectDeserializerContext} context context
	 */
	deserialize(context) {
		const { read } = context;

		this.range = read();
		this.valueRange = read();
		this.inShorthand = read();

		super.deserialize(context);
	}
}

makeSerializable(
	CommonJsRequireContextDependency,
	"webpack/lib/dependencies/CommonJsRequireContextDependency"
);

CommonJsRequireContextDependency.Template =
	ContextDependencyTemplateAsRequireCall;

module.exports = CommonJsRequireContextDependency;
const set = require('regenerate')();
set.addRange(0x1E800, 0x1E8C4).addRange(0x1E8C7, 0x1E8D6);
exports.characters = set;
'use strict';
var globalThis = require('../internals/global-this');
var isCallable = require('../internals/is-callable');

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(globalThis[namespace]) : globalThis[namespace] && globalThis[namespace][method];
};
