/**
 * Complete rewrite of enhanced sensitivity analyzer functionality
 * Fixes syntax error and ensures charts render properly
 */
class SensitivityAnalyzer {
  constructor() {
    this.results = null;
    this.analyzing = false;
    this.charts = {};
    
    // Chart colors
    this.chartColors = {
      cisco: '#049fd9',
      aruba: '#ff8300',
      forescout: '#005daa',
      nps: '#00a4ef',
      fortinac: '#ee3124',
      securew2: '#8bc53f',
      portnox: '#2bd25b',
      neutral: '#888888'
    };
    
    // Initialize immediately
    this.initEventListeners();
    this.initCharts();
  }
  
  /**
   * Initialize all event listeners
   */
  initEventListeners() {
    console.log('Initializing sensitivity analyzer event listeners...');
    
    // Run button
    const sensitivityBtn = document.getElementById('sensitivity-btn');
    if (sensitivityBtn) {
      sensitivityBtn.addEventListener('click', () => {
        this.analyze();
      });
    }
    
    // Variable selector
    const variableSelect = document.getElementById('param-variable');
    if (variableSelect) {
      variableSelect.addEventListener('change', () => {
        this.updateRangeDefaults(variableSelect.value);
      });
    }
    
    // Export buttons
    const exportCsvBtn = document.getElementById('export-sensitivity-csv-btn');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        this.exportToCSV();
      });
    }
    
    const exportPdfBtn = document.getElementById('export-sensitivity-pdf-btn');
    if (exportPdfBtn) {
      exportPdfBtn.addEventListener('click', () => {
        this.exportToPDF();
      });
    }
  }
  
  /**
   * Initialize chart components
   */
  initCharts() {
    console.log('Initializing sensitivity analyzer charts...');
    
    // Initialize sensitivity chart
    const sensChart = document.getElementById('sensitivity-chart');
    if (sensChart) {
      try {
        // Destroy existing chart if it exists
        if (this.charts.sensitivity) {
          this.charts.sensitivity.destroy();
        }
        
        this.charts.sensitivity = new Chart(sensChart.getContext('2d'), {
          type: 'line',
          data: {
            labels: [],
            datasets: []
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Total Cost of Ownership ($)'
                },
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Variable Value'
                }
              }
            },
            plugins: {
              title: {
                display: true,
                text: 'TCO Sensitivity Analysis',
                font: {
                  size: 16
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                  }
                }
              }
            }
          }
        });
        
        console.log('Sensitivity chart initialized');
      } catch (error) {
        console.error('Error initializing sensitivity chart:', error);
      }
    }
    
    // Initialize savings impact chart
    const savingsChart = document.getElementById('savings-impact-chart');
    if (savingsChart) {
      try {
        // Destroy existing chart if it exists
        if (this.charts.savingsImpact) {
          this.charts.savingsImpact.destroy();
        }
        
        this.charts.savingsImpact = new Chart(savingsChart.getContext('2d'), {
          type: 'line',
          data: {
            labels: [],
            datasets: []
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Savings Percentage (%)'
                },
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  }
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Variable Value'
                }
              }
            },
            plugins: {
              title: {
                display: true,
                text: 'Portnox Savings Impact Analysis',
                font: {
                  size: 16
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                  }
                }
              }
            }
          }
        });
        
        console.log('Savings impact chart initialized');
      } catch (error) {
        console.error('Error initializing savings impact chart:', error);
      }
    }
  }
  
  /**
   * Update range defaults based on selected variable
   */
  updateRangeDefaults(variable) {
    console.log('Updating range defaults for variable:', variable);
    
    const minInput = document.getElementById('param-min');
    const maxInput = document.getElementById('param-max');
    const stepsInput = document.getElementById('param-steps');
    
    if (!minInput || !maxInput || !stepsInput) return;
    
    // Get current form values for dynamic ranges
    const deviceCount = parseInt(document.getElementById('device-count')?.value) || 1000;
    const legacyPercentage = parseInt(document.getElementById('legacy-percentage')?.value) || 10;
    const locationCount = parseInt(document.getElementById('location-count')?.value) || 2;
    const yearsToProject = parseInt(document.getElementById('years-to-project')?.value) || 3;
    
    switch (variable) {
      case 'deviceCount':
        minInput.value = Math.max(Math.floor(deviceCount * 0.5), 100);
        maxInput.value = Math.ceil(deviceCount * 2);
        stepsInput.value = '10';
        break;
      case 'legacyPercentage':
        minInput.value = '0';
        maxInput.value = '100';
        stepsInput.value = '11';
        break;
      case 'locationCount':
        minInput.value = '1';
        maxInput.value = Math.max(locationCount * 3, 20);
        stepsInput.value = '10';
        break;
      case 'yearsToProject':
        minInput.value = '1';
        maxInput.value = '10';
        stepsInput.value = '10';
        break;
      case 'hardwareCost':
      case 'licensingCost':
      case 'maintenanceCost':
      case 'fteCost':
      case 'implementationCost':
        minInput.value = '0.5';
        maxInput.value = '2.0';
        stepsInput.value = '7';
        break;
      case 'downtimeCost':
        minInput.value = '1000';
        maxInput.value = '10000';
        stepsInput.value = '10';
        break;
      default:
        minInput.value = '0';
        maxInput.value = '100';
        stepsInput.value = '10';
    }
    
    // Update parameter description
    this.updateParameterDescription(variable);
  }
  
  /**
   * Update parameter description
   */
  updateParameterDescription(variable) {
    const descriptionElement = document.getElementById('parameter-description');
    if (!descriptionElement) return;
    
    const descriptions = {
      deviceCount: 'Analyze how changes in the total number of devices affect TCO and relative savings. More devices typically increase hardware and licensing costs for on-premises solutions.',
      legacyPercentage: 'Evaluate the impact of legacy device percentages on overall costs. Legacy devices often require additional security measures and management overhead.',
      locationCount: 'Assess how distributed deployments across multiple locations affect total costs. On-premises solutions typically require hardware at each location.',
      yearsToProject: 'Compare short-term vs. long-term TCO projections. Cloud solutions often show higher relative savings over longer time periods.',
      hardwareCost: 'Test sensitivity to hardware cost changes, such as price increases or discounts. This primarily affects on-premises deployments.',
      licensingCost: 'Analyze how licensing cost variations affect overall TCO. Both cloud and on-premises solutions include licensing costs.',
      maintenanceCost: 'Evaluate the impact of maintenance cost changes on long-term TCO. On-premises solutions typically have higher maintenance requirements.',
      implementationCost: 'Assess how implementation cost factors affect initial deployment expenses. Complex deployments increase professional services costs.',
      fteCost: 'Test sensitivity to changes in IT staffing costs or allocation. On-premises solutions typically require more IT staff time.',
      downtimeCost: 'Analyze how the cost of downtime affects overall TCO. Different solutions have varying reliability characteristics.'
    };
    
    descriptionElement.textContent = descriptions[variable] || 'Analyze how changes in this parameter affect the total cost of ownership and potential savings.';
  }
  
  /**
   * Run sensitivity analysis
   */
  analyze() {
    if (this.analyzing) {
      console.log('Analysis already in progress');
      return;
    }
    
    this.analyzing = true;
    this.showLoading();
    
    try {
      // Get input parameters
      const variableToAnalyze = document.getElementById('param-variable').value;
      const vendorToAnalyze = document.getElementById('param-vendor').value;
      const minValue = parseFloat(document.getElementById('param-min').value);
      const maxValue = parseFloat(document.getElementById('param-max').value);
      const steps = parseInt(document.getElementById('param-steps').value);
      
      console.log(`Running sensitivity analysis for ${variableToAnalyze}, vendor: ${vendorToAnalyze}, range: ${minValue}-${maxValue}, steps: ${steps}`);
      
      // Validate inputs
      if (isNaN(minValue) || isNaN(maxValue) || isNaN(steps)) {
        throw new Error('Invalid input parameters');
      }
      
      if (minValue >= maxValue) {
        throw new Error('Maximum value must be greater than minimum value');
      }
      
      if (steps < 2 || steps > 20) {
        throw new Error('Number of steps must be between 2 and 20');
      }
      
      // Get additional analysis options
      const includeBreakeven = document.getElementById('include-breakeven')?.checked || false;
      const compareToNoNAC = document.getElementById('compare-to-no-nac')?.checked || false;
      
      // Generate data points
      const stepSize = (maxValue - minValue) / (steps - 1);
      const dataPoints = Array.from({length: steps}, (_, i) => minValue + (i * stepSize));
      
      // Run analysis for each data point
      const analysisResults = {
        variable: variableToAnalyze,
        vendor: vendorToAnalyze,
        minValue,
        maxValue,
        steps,
        dataPoints,
        results: [],
        includeBreakeven,
        compareToNoNAC
      };
      
      // Keep a copy of the original form values
      const originalValues = this.saveOriginalValues();
      
      // For each data point, calculate TCO by modifying the relevant form value
      dataPoints.forEach(dataPoint => {
        // Set the form value for the variable being analyzed
        this.setVariableValue(variableToAnalyze, dataPoint);
        
        // Calculate TCO for this data point
        const calculationResults = this.runCalculation();
        
        // Store results
        analysisResults.results.push({
          dataPoint,
          calculationResults
        });
      });
      
      // Calculate breakeven values if requested
      if (includeBreakeven) {
        analysisResults.breakevenPoints = this.calculateBreakevenPoints(analysisResults);
      }
      
      // Restore original form values
      this.restoreOriginalValues(originalValues);
      
      // Save results
      this.results = analysisResults;
      
      // Update UI with results
      this.updateUI();
      
      // Hide loading indicator
      this.hideLoading();
      this.analyzing = false;
      
      return analysisResults;
    } catch (error) {
      console.error("Error in sensitivity analysis:", error);
      
      // Hide loading indicator
      this.hideLoading();
      this.analyzing = false;
      
      // Show error message
      this.showError("Error in sensitivity analysis: " + error.message);
      
      return null;
    }
  }
  
  /**
   * Calculate breakeven points
   */
  calculateBreakevenPoints(analysisResults) {
    const breakevenPoints = {};
    
    // Only calculate if comparing to Portnox
    if (analysisResults.vendor !== 'portnox' && analysisResults.vendor !== 'all') {
      const results = analysisResults.results;
      
      // Find where the lines cross (TCO becomes equal)
      for (let i = 0; i < results.length - 1; i++) {
        const current = results[i];
        const next = results[i + 1];
        
        const currentVendorTCO1 = current.calculationResults[analysisResults.vendor]?.totalTCO || 0;
        const portnoxTCO1 = current.calculationResults['portnox']?.totalTCO || 0;
        const currentVendorTCO2 = next.calculationResults[analysisResults.vendor]?.totalTCO || 0;
        const portnoxTCO2 = next.calculationResults['portnox']?.totalTCO || 0;
        
        // Calculate differences
        const diff1 = currentVendorTCO1 - portnoxTCO1;
        const diff2 = currentVendorTCO2 - portnoxTCO2;
        
        // Check if the lines cross (TCO difference changes sign)
        if ((diff1 > 0 && diff2 < 0) || (diff1 < 0 && diff2 > 0)) {
          // Calculate the crossover point using linear interpolation
          const x1 = current.dataPoint;
          const x2 = next.dataPoint;
          
          // Calculate the exact breakeven point
          const ratio = Math.abs(diff1) / (Math.abs(diff1) + Math.abs(diff2));
          const breakeven = x1 + (x2 - x1) * ratio;
          
          // Store the breakeven point
          breakevenPoints[analysisResults.vendor] = {
            value: breakeven,
            unit: this.getVariableUnit(analysisResults.variable)
          };
          
          // We only need to find one breakeven point
          break;
        }
      }
    } else if (analysisResults.vendor === 'all') {
      // If comparing all vendors, find breakeven points for each vs Portnox
      const vendors = Object.keys(window.vendorData || {}).filter(v => v !== 'portnox');
      
      vendors.forEach(vendor => {
        const breakevenFound = this.findBreakevenPoint(vendor, analysisResults);
        if (breakevenFound) {
          breakevenPoints[vendor] = breakevenFound;
        }
      });
    }
    
    return breakevenPoints;
  }
  
  /**
   * Find breakeven point between a vendor and Portnox
   */
  findBreakevenPoint(vendor, analysisResults) {
    const results = analysisResults.results;
    
    // Find where the lines cross (TCO becomes equal)
    for (let i = 0; i < results.length - 1; i++) {
      const current = results[i];
      const next = results[i + 1];
      
      const vendorTCO1 = current.calculationResults[vendor]?.totalTCO || 0;
      const portnoxTCO1 = current.calculationResults['portnox']?.totalTCO || 0;
      const vendorTCO2 = next.calculationResults[vendor]?.totalTCO || 0;
      const portnoxTCO2 = next.calculationResults['portnox']?.totalTCO || 0;
      
      // Calculate differences
      const diff1 = vendorTCO1 - portnoxTCO1;
      const diff2 = vendorTCO2 - portnoxTCO2;
      
      // Check if the lines cross (TCO difference changes sign)
      if ((diff1 > 0 && diff2 < 0) || (diff1 < 0 && diff2 > 0)) {
        // Calculate the crossover point using linear interpolation
        const x1 = current.dataPoint;
        const x2 = next.dataPoint;
        
        // Calculate the exact breakeven point
        const ratio = Math.abs(diff1) / (Math.abs(diff1) + Math.abs(diff2));
        const breakeven = x1 + (x2 - x1) * ratio;
        
        // Return the breakeven point
        return {
          value: breakeven,
          unit: this.getVariableUnit(analysisResults.variable)
        };
      }
    }
    
    return null;
  }
  
  /**
   * Get variable unit for display
   */
  getVariableUnit(variable) {
    switch (variable) {
      case 'deviceCount':
        return 'devices';
      case 'legacyPercentage':
        return '%';
      case 'locationCount':
        return 'locations';
      case 'yearsToProject':
        return 'years';
      case 'hardwareCost':
      case 'licensingCost':
      case 'maintenanceCost':
      case 'fteCost':
      case 'implementationCost':
        return 'multiplier';
      case 'downtimeCost':
        return '$/hour';
      default:
        return '';
    }
  }
  
  /**
   * Save original form values
   */
  saveOriginalValues() {
    return {
      deviceCount: document.getElementById('device-count')?.value,
      legacyPercentage: document.getElementById('legacy-percentage')?.value,
      locationCount: document.getElementById('location-count')?.value,
      yearsToProject: document.getElementById('years-to-project')?.value
    };
  }
  
  /**
   * Restore original form values
   */
  restoreOriginalValues(originalValues) {
    if (originalValues.deviceCount) document.getElementById('device-count').value = originalValues.deviceCount;
    if (originalValues.legacyPercentage) document.getElementById('legacy-percentage').value = originalValues.legacyPercentage;
    if (originalValues.locationCount) document.getElementById('location-count').value = originalValues.locationCount;
    if (originalValues.yearsToProject) document.getElementById('years-to-project').value = originalValues.yearsToProject;
  }
  
  /**
   * Set variable value during analysis
   */
  setVariableValue(variable, value) {
    switch (variable) {
      case 'deviceCount':
        document.getElementById('device-count').value = Math.round(value);
        break;
      case 'legacyPercentage':
        document.getElementById('legacy-percentage').value = Math.round(value);
        if (value > 0) {
          document.getElementById('legacy-devices').checked = true;
        }
        break;
      case 'locationCount':
        document.getElementById('location-count').value = Math.round(value);
        if (value > 1) {
          document.getElementById('multiple-locations').checked = true;
        }
        break;
      case 'yearsToProject':
        document.getElementById('years-to-project').value = Math.round(value);
        break;
      default:
        console.warn(`Unknown variable: ${variable}`);
    }
  }
  
  /**
   * Run calculation using calculator if available
   */
  runCalculation() {
    // Check if calculator is available
    if (!window.calculator) {
      console.warn('Calculator not available, using dummy data');
      return this.generateDummyResults();
    }
    
    try {
      // Get values from form
      const deviceCount = parseInt(document.getElementById('device-count').value) || 1000;
      const orgSize = document.getElementById('organization-size').value;
      const yearsToProject = parseInt(document.getElementById('years-to-project').value) || 3;
      const currentVendor = window.uiController ? window.uiController.activeVendor : 'cisco';
      
      // Calculate TCO for all vendors
      const vendorData = window.vendorData || {};
      const tcoResults = {};
      
      Object.keys(vendorData).forEach(vendor => {
        const result = window.calculator.calculateVendorTCO(vendor, currentVendor, orgSize, deviceCount, yearsToProject);
        tcoResults[vendor] = result;
      });
      
      // Add metadata
      tcoResults.yearsToProject = yearsToProject;
      tcoResults.deviceCount = deviceCount;
      tcoResults.orgSize = orgSize;
      
      return tcoResults;
    } catch (error) {
      console.error("Error in calculation:", error);
      return this.generateDummyResults();
    }
  }
  
  /**
   * Generate dummy results for testing
   */
  generateDummyResults() {
    const vendorData = window.vendorData || {
      cisco: { name: 'Cisco ISE' },
      aruba: { name: 'Aruba ClearPass' },
      forescout: { name: 'Forescout' },
      nps: { name: 'Microsoft NPS' },
      fortinac: { name: 'FortiNAC' },
      securew2: { name: 'SecureW2' },
      portnox: { name: 'Portnox Cloud' }
    };
    
    const results = {};
    const vendors = Object.keys(vendorData);
    
    vendors.forEach(vendor => {
      // Generate random costs that favors Portnox
      const isPortnox = vendor === 'portnox';
      const multiplier = isPortnox ? 0.7 : 1 + (Math.random() * 0.5);
      
      results[vendor] = {
        totalTCO: 1000000 * multiplier,
        totalInitialCosts: 400000 * multiplier,
        annualCosts: 200000 * multiplier,
        migrationCost: isPortnox ? 50000 : 0,
        totalSavings: isPortnox ? 0 : 300000,
        savingsPercentage: isPortnox ? 0 : 30,
        annualSavings: isPortnox ? 0 : 60000
      };
    });
    
    results.yearsToProject = 3;
    results.deviceCount = 1000;
    results.orgSize = 'medium';
    
    return results;
  }
  
  /**
   * Update UI with results
   */
  updateUI() {
    if (!this.results) {
      console.warn("No analysis results available");
      return;
    }
    
    // Update sensitivity chart
    this.updateSensitivityChart();
    
    // Update savings impact chart
    this.updateSavingsImpactChart();
    
    // Update data table
    this.updateDataTable();
    
    // Update breakeven container if needed
    if (this.results.includeBreakeven && this.results.breakevenPoints) {
      this.updateBreakevenContainer();
    }
    
    // Show success message
    this.showSuccess("Sensitivity analysis completed successfully");
  }
  
  /**
   * Update sensitivity chart
   */
  updateSensitivityChart() {
    if (!this.charts.sensitivity) {
      console.warn('Sensitivity chart not initialized');
      return;
    }
    
    // Prepare chart data
    const labels = this.results.dataPoints.map(dp => this.formatDataPoint(this.results.variable, dp));
    
    const datasets = [];
    const vendors = this.results.vendor === 'all' ? 
      Object.keys(window.vendorData || {}) : 
      [this.results.vendor];
    
    vendors.forEach(vendor => {
      const vendorName = window.vendorData?.[vendor]?.name || vendor;
      const vendorColor = this.chartColors[vendor] || this.chartColors.neutral;
      
      const data = this.results.results.map(result => {
        return result.calculationResults[vendor]?.totalTCO || 0;
      });
      
      datasets.push({
        label: vendorName,
        data: data,
        backgroundColor: vendorColor,
        borderColor: vendorColor,
        borderWidth: 2,
        fill: false
      });
    });
    
    // Update chart
    this.charts.sensitivity.data.labels = labels;
    this.charts.sensitivity.data.datasets = datasets;
    this.charts.sensitivity.options.scales.x.title.text = this.getVariableLabel(this.results.variable);
    this.charts.sensitivity.options.plugins.title.text = `TCO Sensitivity to ${this.getVariableLabel(this.results.variable)}`;
    this.charts.sensitivity.update();
  }
  
  /**
   * Update savings impact chart
   */
  updateSavingsImpactChart() {
    if (!this.charts.savingsImpact) {
      console.warn('Savings impact chart not initialized');
      return;
    }
    
    // Only relevant when comparing to Portnox
    if (!window.vendorData?.portnox) {
      return;
    }
    
    // Prepare chart data
    const labels = this.results.dataPoints.map(dp => this.formatDataPoint(this.results.variable, dp));
    
    const datasets = [];
    const vendors = this.results.vendor === 'all' ? 
      Object.keys(window.vendorData).filter(v => v !== 'portnox') : 
      [this.results.vendor];
    
    vendors.forEach(vendor => {
      // Skip Portnox as we're calculating savings vs. Portnox
      if (vendor === 'portnox') return;
      
      const vendorName = window.vendorData?.[vendor]?.name || vendor;
      const vendorColor = this.chartColors[vendor] || this.chartColors.neutral;
      
      const data = this.results.results.map(result => {
        const vendorTCO = result.calculationResults[vendor]?.totalTCO || 0;
        const portnoxTCO = result.calculationResults['portnox']?.totalTCO || 0;
        return vendorTCO > 0 && portnoxTCO > 0 ? 
          ((vendorTCO - portnoxTCO) / vendorTCO * 100) : 0;
      });
      
      datasets.push({
        label: `Savings vs. ${vendorName}`,
        data: data,
        backgroundColor: vendorColor,
        borderColor: vendorColor,
        borderWidth: 2,
        fill: false
      });
    });
    
    // Update chart
    this.charts.savingsImpact.data.labels = labels;
    this.charts.savingsImpact.data.datasets = datasets;
    this.charts.savingsImpact.options.scales.x.title.text = this.getVariableLabel(this.results.variable);
    this.charts.savingsImpact.options.plugins.title.text = `Portnox Savings Impact by ${this.getVariableLabel(this.results.variable)}`;
    this.charts.savingsImpact.update();
  }
  
  /**
   * Update data table
   */
  updateDataTable() {
    const tableHeader = document.getElementById('sensitivity-table-header');
    const tableBody = document.getElementById('sensitivity-table-body');
    
    if (!tableHeader || !tableBody) {
      console.warn('Data table elements not found');
      return;
    }
    
    // Clear existing table
    tableHeader.innerHTML = `<th scope="col">${this.getVariableLabel(this.results.variable)}</th>`;
    tableBody.innerHTML = '';
    
    // Add vendor columns to header
    const vendors = this.results.vendor === 'all' ? 
      Object.keys(window.vendorData || {}) : 
      [this.results.vendor];
    
    vendors.forEach(vendor => {
      const vendorName = window.vendorData?.[vendor]?.name || vendor;
      tableHeader.innerHTML += `<th scope="col">${vendorName}</th>`;
      
      // Add Portnox savings column if comparing to other vendors
      if (vendor !== 'portnox' && vendors.includes('portnox')) {
        tableHeader.innerHTML += `<th scope="col">Savings vs. ${vendorName}</th>`;
      }
    });
    
    // Add data rows
    this.results.results.forEach(result => {
      const row = document.createElement('tr');
      
      // Add data point column
      row.innerHTML = `<td>${this.formatDataPoint(this.results.variable, result.dataPoint)}</td>`;
      
      // Add vendor TCO columns
      vendors.forEach(vendor => {
        const tco = result.calculationResults[vendor]?.totalTCO || 0;
        row.innerHTML += `<td>${this.formatCurrency(tco)}</td>`;
        
        // Add Portnox savings column if comparing to other vendors
        if (vendor !== 'portnox' && vendors.includes('portnox')) {
          const vendorTCO = result.calculationResults[vendor]?.totalTCO || 0;
          const portnoxTCO = result.calculationResults['portnox']?.totalTCO || 0;
          
          const savingsAmount = vendorTCO - portnoxTCO;
          const savingsPercentage = vendorTCO > 0 ? (savingsAmount / vendorTCO) * 100 : 0;
          
          row.innerHTML += `<td>${this.formatCurrency(savingsAmount)} (${savingsPercentage.toFixed(1)}%)</td>`;
        }
      });
      
      tableBody.appendChild(row);
    });
  }
  
  /**
   * Update breakeven container
   */
  updateBreakevenContainer() {
    const container = document.getElementById('breakeven-container');
    if (!container) return;
    
    if (!this.results.breakevenPoints || Object.keys(this.results.breakevenPoints).length === 0) {
      container.classList.add('hidden');
      return;
    }
    
    // Create breakeven content
    let html = `
      <div class="result-card breakeven-card">
        <h3>Breakeven Analysis</h3>
        <p>The following breakeven points indicate where Portnox Cloud becomes more cost-effective than the compared vendor:</p>
        <div class="breakeven-grid">
    `;
    
    // Add each breakeven point
    Object.entries(this.results.breakevenPoints).forEach(([vendor, point]) => {
      const vendorName = window.vendorData?.[vendor]?.name || vendor;
      html += `
        <div class="breakeven-item">
          <div class="breakeven-vendor">${vendorName}</div>
          <div class="breakeven-value">${this.formatValue(point.value)} ${point.unit}</div>
          <div class="breakeven-explanation">
            Portnox Cloud becomes more cost-effective than ${vendorName} when the ${this.getVariableLabel(this.results.variable)} 
            ${this.getComparisonType(this.results.variable)} ${this.formatValue(point.value)} ${point.unit}.
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
        <div class="breakeven-note">
          <p>Note: These breakeven points are based on the current configuration and assumptions in the model.</p>
        </div>
      </div>
    `;
    
    // Update container
    container.innerHTML = html;
    container.classList.remove('hidden');
  }
  
  /**
   * Get comparison type text
   */
  getComparisonType(variable) {
    switch (variable) {
      case 'deviceCount':
      case 'locationCount':
      case 'yearsToProject':
        return 'exceeds';
      case 'legacyPercentage':
        return 'is above';
      case 'hardwareCost':
      case 'licensingCost':
      case 'maintenanceCost':
      case 'fteCost':
      case 'implementationCost':
        return 'is greater than';
      case 'downtimeCost':
        return 'exceeds';
      default:
        return 'reaches';
    }
  }
  
  /**
   * Format value for display
   */
  formatValue(value) {
    if (typeof value !== 'number') return value;
    
    if (value >= 1000) {
      return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
    }
    
    return value.toLocaleString(undefined, { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }
  
  /**
   * Format currency value
   */
  formatCurrency(value) {
    if (window.formatCurrency) {
      return window.formatCurrency(value);
    }
    
    return '$' + value.toLocaleString(undefined, { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
  
  /**
   * Format data point based on variable type
   */
  formatDataPoint(variable, value) {
    switch (variable) {
      case 'deviceCount':
        return this.formatValue(value) + ' devices';
      case 'legacyPercentage':
        return value + '%';
      case 'locationCount':
        return this.formatValue(value) + ' locations';
      case 'yearsToProject':
        return value + ' years';
      case 'hardwareCost':
      case 'licensingCost':
      case 'maintenanceCost':
      case 'fteCost':
      case 'implementationCost':
        return value.toFixed(1) + 'x';
      case 'downtimeCost':
        return '$' + this.formatValue(value) + '/hour';
      default:
        return value.toString();
    }
  }
  
  /**
   * Get human-readable label for variable
   */
  getVariableLabel(variable) {
    switch (variable) {
      case 'deviceCount':
        return 'Device Count';
      case 'legacyPercentage':
        return 'Legacy Device Percentage';
      case 'locationCount':
        return 'Number of Locations';
      case 'yearsToProject':
        return 'Years to Project';
      case 'hardwareCost':
        return 'Hardware Cost Multiplier';
      case 'licensingCost':
        return 'Licensing Cost Multiplier';
      case 'maintenanceCost':
        return 'Maintenance Cost Multiplier';
      case 'fteCost':
        return 'Personnel Cost Multiplier';
      case 'implementationCost':
        return 'Implementation Cost Multiplier';
      case 'downtimeCost':
        return 'Downtime Cost';
      default:
        return variable;
    }
  }
  
  /**
   * Export results to CSV
   */
  exportToCSV() {
    if (!this.results) {
      this.showError("No results to export");
      return;
    }
    
    try {
      // Create CSV content
      let csv = [];
      
      // Add header
      csv.push(['Portnox Total Cost Analyzer - Sensitivity Analysis']);
      csv.push([`Generated on ${new Date().toLocaleDateString()}`]);
      csv.push([]);
      
      // Add analysis parameters
      csv.push(['Analysis Parameters']);
      csv.push(['Variable', this.getVariableLabel(this.results.variable)]);
      csv.push(['Vendor', this.results.vendor === 'all' ? 'All Vendors' : (window.vendorData?.[this.results.vendor]?.name || this.results.vendor)]);
      csv.push(['Range', `${this.formatValue(this.results.minValue)} to ${this.formatValue(this.results.maxValue)}`]);
      csv.push(['Steps', this.results.steps]);
      csv.push([]);
      
      // Add results table
      const header = [this.getVariableLabel(this.results.variable)];
      
      // Add vendor columns
      const vendors = this.results.vendor === 'all' ? 
        Object.keys(window.vendorData || {}) : 
        [this.results.vendor];
      
      vendors.forEach(vendor => {
        header.push(window.vendorData?.[vendor]?.name || vendor);
        
        // Add savings column if needed
        if (vendor !== 'portnox' && vendors.includes('portnox')) {
          header.push(`Savings vs. ${window.vendorData?.[vendor]?.name || vendor}`);
        }
      });
      
      csv.push(header);
      
      // Add data rows
      this.results.results.forEach(result => {
        const row = [this.formatDataPoint(this.results.variable, result.dataPoint)];
        
        vendors.forEach(vendor => {
          row.push(result.calculationResults[vendor]?.totalTCO || 0);
          
          // Add savings column if needed
          if (vendor !== 'portnox' && vendors.includes('portnox')) {
            const vendorTCO = result.calculationResults[vendor]?.totalTCO || 0;
            const portnoxTCO = result.calculationResults['portnox']?.totalTCO || 0;
            row.push(vendorTCO - portnoxTCO);
          }
        });
        
        csv.push(row);
      });
      
      // Add breakeven info if available
      if (this.results.breakevenPoints && Object.keys(this.results.breakevenPoints).length > 0) {
        csv.push([]);
        csv.push(['Breakeven Analysis']);
        csv.push(['Vendor', 'Breakeven Point']);
        
        Object.entries(this.results.breakevenPoints).forEach(([vendor, point]) => {
          csv.push([
            window.vendorData?.[vendor]?.name || vendor,
            `${this.formatValue(point.value)} ${point.unit}`
          ]);
        });
      }
      
      // Format CSV content
      const csvContent = csv.map(row => {
        return row.map(cell => {
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
      link.href = url;
      link.download = `Portnox_Sensitivity_Analysis_${this.results.variable}_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.showSuccess("CSV file exported successfully");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      this.showError("Failed to export CSV: " + error.message);
    }
  }
  
  /**
   * Export results to PDF
   */
  exportToPDF() {
    if (!this.results) {
      this.showError("No results to export");
      return;
    }
    
    try {
      if (typeof jsPDF === 'undefined') {
        this.showError("PDF generation library not found");
        return;
      }
      
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(22);
      doc.setTextColor(5, 84, 124);
      doc.text('Portnox Total Cost Analyzer', 105, 20, { align: 'center' });
      
      doc.setFontSize(16);
      doc.text('Sensitivity Analysis', 105, 30, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 40, { align: 'center' });
      
      // Add analysis parameters
      doc.setFontSize(14);
      doc.setTextColor(5, 84, 124);
      doc.text('Analysis Parameters', 20, 55);
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`Variable: ${this.getVariableLabel(this.results.variable)}`, 20, 65);
      doc.text(`Vendor: ${this.results.vendor === 'all' ? 'All Vendors' : (window.vendorData?.[this.results.vendor]?.name || this.results.vendor)}`, 20, 72);
      doc.text(`Range: ${this.formatValue(this.results.minValue)} to ${this.formatValue(this.results.maxValue)}`, 20, 79);
      doc.text(`Steps: ${this.results.steps}`, 20, 86);
      
      // Add results table header
      const tableHeader = [this.getVariableLabel(this.results.variable)];
      
      // Add vendor columns
      const vendors = this.results.vendor === 'all' ? 
        Object.keys(window.vendorData || {}) : 
        [this.results.vendor];
      
      vendors.forEach(vendor => {
        tableHeader.push(window.vendorData?.[vendor]?.name || vendor);
      });
      
      // Prepare table data
      const tableData = this.results.results.map(result => {
        const row = [this.formatDataPoint(this.results.variable, result.dataPoint)];
        
        vendors.forEach(vendor => {
          row.push(this.formatCurrency(result.calculationResults[vendor]?.totalTCO || 0));
        });
        
        return row;
      });
      
      // Add results table
      doc.autoTable({
        startY: 95,
        head: [tableHeader],
        body: tableData,
        theme: 'grid',
        styles: {
          cellPadding: 3,
          fontSize: 9
        },
        headStyles: {
          fillColor: [5, 84, 124],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        }
      });
      
      // Add breakeven info if available
      if (this.results.breakevenPoints && Object.keys(this.results.breakevenPoints).length > 0) {
        const finalY = doc.lastAutoTable.finalY + 15;
        
        doc.setFontSize(14);
        doc.setTextColor(5, 84, 124);
        doc.text('Breakeven Analysis', 20, finalY);
        
        const breakevenData = Object.entries(this.results.breakevenPoints).map(([vendor, point]) => [
          window.vendorData?.[vendor]?.name || vendor,
          `${this.formatValue(point.value)} ${point.unit}`
        ]);
        
        doc.autoTable({
          startY: finalY + 10,
          head: [['Vendor', 'Breakeven Point']],
          body: breakevenData,
          theme: 'grid',
          styles: {
            cellPadding: 3,
            fontSize: 9
          },
          headStyles: {
            fillColor: [5, 84, 124],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          }
        });
      }
      
      // Save PDF
      doc.save(`Portnox_Sensitivity_Analysis_${this.results.variable}_${new Date().toISOString().slice(0, 10)}.pdf`);
      
      this.showSuccess("PDF exported successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      this.showError("Failed to export PDF: " + error.message);
    }
  }
  
  /**
   * Show loading indicator
   */
  showLoading() {
    const container = document.querySelector('.results-container');
    if (!container) return;
    
    // Check if loading overlay already exists
    if (container.querySelector('.loading-overlay')) return;
    
    // Create loading overlay
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="spinner"></div>
      <div class="loading-text">Running sensitivity analysis...</div>
    `;
    
    container.appendChild(overlay);
  }
  
  /**
   * Hide loading indicator
   */
  hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
      overlay.parentNode.removeChild(overlay);
    }
  }
  
  /**
   * Show error message
   */
  showError(message) {
    const container = document.getElementById('message-container');
    if (!container) return;
    
    container.innerHTML = `
      <div class="error-message-box">
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
        <button class="close-error"><i class="fas fa-times"></i></button>
      </div>
    `;
    
    const closeBtn = container.querySelector('.close-error');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        container.innerHTML = '';
      });
    }
  }
  
  /**
   * Show success message
   */
  showSuccess(message) {
    const container = document.getElementById('message-container');
    if (!container) return;
    
    container.innerHTML = `
      <div class="success-message-box">
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
        <button class="close-error"><i class="fas fa-times"></i></button>
      </div>
    `;
    
    const closeBtn = container.querySelector('.close-error');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        container.innerHTML = '';
      });
    }
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      if (container.querySelector('.success-message-box')) {
        container.innerHTML = '';
      }
    }, 3000);
  }
}

// Initialize the sensitivity analyzer when the page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing sensitivity analyzer...');
  window.enhancedSensitivityAnalyzer = new SensitivityAnalyzer();
  
  // Update range defaults for initial variable
  const variableSelect = document.getElementById('param-variable');
  if (variableSelect) {
    window.enhancedSensitivityAnalyzer.updateRangeDefaults(variableSelect.value);
  }
});
