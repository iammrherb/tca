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
