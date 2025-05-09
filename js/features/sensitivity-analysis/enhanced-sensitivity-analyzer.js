/**
 * Enhanced Sensitivity Analyzer
 * Provides more advanced sensitivity analysis and visualization
 */
class EnhancedSensitivityAnalyzer {
  constructor() {
    this.results = null;
    this.analyzing = false;
    this.charts = {};
    this.scenarios = [];
    
    // Reference to calculator
    this.calculator = window.calculator;
    
    // Chart colors from chart builder
    this.chartColors = window.chartBuilder ? window.chartBuilder.chartColors : {
      cisco: '#049fd9',      // Cisco blue
      aruba: '#ff8300',      // Aruba orange
      forescout: '#005daa',  // Forescout blue
      nps: '#00a4ef',        // Microsoft blue
      fortinac: '#ee3124',   // FortiNAC red
      securew2: '#8bc53f',   // SecureW2 green
      portnox: '#2bd25b',    // Portnox green
      neutral: '#888888'     // Neutral gray
    };
    
    this.initEventListeners();
  }
  
  initEventListeners() {
    // Run button click handler
    const sensitivityBtn = document.getElementById('sensitivity-btn');
    if (sensitivityBtn) {
      sensitivityBtn.addEventListener('click', () => {
        this.analyze();
      });
    }
    
    // Variable selector change handler
    const variableSelect = document.getElementById('param-variable');
    if (variableSelect) {
      variableSelect.addEventListener('change', () => {
        this.updateRangeDefaults(variableSelect.value);
      });
    }
    
    // Add scenario button click handler
    const addScenarioBtn = document.getElementById('add-scenario-btn');
    if (addScenarioBtn) {
      addScenarioBtn.addEventListener('click', () => {
        this.addCurrentScenario();
      });
    }
    
    // Clear scenarios button click handler
    const clearScenariosBtn = document.getElementById('clear-scenarios-btn');
    if (clearScenariosBtn) {
      clearScenariosBtn.addEventListener('click', () => {
        this.clearScenarios();
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
  
  updateRangeDefaults(variable) {
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
      const vendors = Object.keys(window.vendorData).filter(v => v !== 'portnox');
      
      vendors.forEach(vendor => {
        const breakevenFound = this.findBreakevenPoint(vendor, analysisResults);
        if (breakevenFound) {
          breakevenPoints[vendor] = breakevenFound;
        }
      });
    }
    
    return breakevenPoints;
  }
  
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
  
  saveOriginalValues() {
    return {
      deviceCount: document.getElementById('device-count')?.value,
      legacyPercentage: document.getElementById('legacy-percentage')?.value,
      locationCount: document.getElementById('location-count')?.value,
      yearsToProject: document.getElementById('years-to-project')?.value,
      
      // Custom cost multipliers if available
      customHardwareCost: document.getElementById('custom-hardware-cost')?.value,
      customLicensingCost: document.getElementById('custom-licensing-cost')?.value,
      customMaintenanceCost: document.getElementById('custom-maintenance-cost')?.value,
      customImplementationCost: document.getElementById('custom-implementation-cost')?.value,
      trainingCostMultiplier: document.getElementById('training-cost-multiplier')?.value,
      
      // FTE salaries if available
      networkAdminSalary: document.getElementById('network-admin-salary')?.value,
      securityAdminSalary: document.getElementById('security-admin-salary')?.value,
      systemAdminSalary: document.getElementById('system-admin-salary')?.value,
      helpdeskSalary: document.getElementById('helpdesk-salary')?.value,
      
      // Downtime cost if available
      downtimeCost: document.getElementById('downtime-cost')?.value
    };
  }
  
  restoreOriginalValues(originalValues) {
    // Restore main parameters
    if (originalValues.deviceCount) {
      document.getElementById('device-count').value = originalValues.deviceCount;
    }
    
    if (originalValues.legacyPercentage) {
      document.getElementById('legacy-percentage').value = originalValues.legacyPercentage;
    }
    
    if (originalValues.locationCount) {
      document.getElementById('location-count').value = originalValues.locationCount;
    }
    
    if (originalValues.yearsToProject) {
      document.getElementById('years-to-project').value = originalValues.yearsToProject;
    }
    
    // Restore custom cost multipliers if they exist
    if (originalValues.customHardwareCost && document.getElementById('custom-hardware-cost')) {
      document.getElementById('custom-hardware-cost').value = originalValues.customHardwareCost;
    }
    
    if (originalValues.customLicensingCost && document.getElementById('custom-licensing-cost')) {
      document.getElementById('custom-licensing-cost').value = originalValues.customLicensingCost;
    }
    
    if (originalValues.customMaintenanceCost && document.getElementById('custom-maintenance-cost')) {
      document.getElementById('custom-maintenance-cost').value = originalValues.customMaintenanceCost;
    }
    
    if (originalValues.customImplementationCost && document.getElementById('custom-implementation-cost')) {
      document.getElementById('custom-implementation-cost').value = originalValues.customImplementationCost;
    }
    
    if (originalValues.trainingCostMultiplier && document.getElementById('training-cost-multiplier')) {
      document.getElementById('training-cost-multiplier').value = originalValues.trainingCostMultiplier;
    }
    
    // Restore FTE salaries if they exist
    if (originalValues.networkAdminSalary && document.getElementById('network-admin-salary')) {
      document.getElementById('network-admin-salary').value = originalValues.networkAdminSalary;
    }
    
    if (originalValues.securityAdminSalary && document.getElementById('security-admin-salary')) {
      document.getElementById('security-admin-salary').value = originalValues.securityAdminSalary;
    }
    
    if (originalValues.systemAdminSalary && document.getElementById('system-admin-salary')) {
      document.getElementById('system-admin-salary').value = originalValues.systemAdminSalary;
    }
    
    if (originalValues.helpdeskSalary && document.getElementById('helpdesk-salary')) {
      document.getElementById('helpdesk-salary').value = originalValues.helpdeskSalary;
    }
    
    // Restore downtime cost if it exists
    if (originalValues.downtimeCost && document.getElementById('downtime-cost')) {
      document.getElementById('downtime-cost').value = originalValues.downtimeCost;
    #!/bin/bash

# Continue creating enhanced sensitivity analyzer
cat >> js/components/enhanced-sensitivity-analyzer.js << 'EOL'
    }
  }
  
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
      case 'hardwareCost':
        if (document.getElementById('custom-hardware-cost')) {
          document.getElementById('custom-hardware-cost').value = value.toFixed(2);
        }
        break;
      case 'licensingCost':
        if (document.getElementById('custom-licensing-cost')) {
          document.getElementById('custom-licensing-cost').value = value.toFixed(2);
        }
        break;
      case 'maintenanceCost':
        if (document.getElementById('custom-maintenance-cost')) {
          document.getElementById('custom-maintenance-cost').value = value.toFixed(2);
        }
        break;
      case 'implementationCost':
        if (document.getElementById('custom-implementation-cost')) {
          document.getElementById('custom-implementation-cost').value = value.toFixed(2);
        }
        break;
      case 'fteCost':
        // FTE cost is adjusted as a multiplier to all FTE salaries
        if (document.getElementById('network-admin-salary')) {
          const baseSalary = 120000;
          document.getElementById('network-admin-salary').value = Math.round(baseSalary * value);
        }
        if (document.getElementById('security-admin-salary')) {
          const baseSalary = 135000;
          document.getElementById('security-admin-salary').value = Math.round(baseSalary * value);
        }
        if (document.getElementById('system-admin-salary')) {
          const baseSalary = 110000;
          document.getElementById('system-admin-salary').value = Math.round(baseSalary * value);
        }
        if (document.getElementById('helpdesk-salary')) {
          const baseSalary = 75000;
          document.getElementById('helpdesk-salary').value = Math.round(baseSalary * value);
        }
        break;
      case 'downtimeCost':
        if (document.getElementById('downtime-cost')) {
          document.getElementById('downtime-cost').value = Math.round(value);
        }
        break;
      default:
        console.warn(`Unknown variable: ${variable}`);
    }
  }
  
  runCalculation() {
    if (!this.calculator) {
      console.error("Calculator not available");
      return null;
    }
    
    try {
      // Get values from form
      const deviceCount = parseInt(document.getElementById('device-count').value) || 1000;
      const orgSize = document.getElementById('organization-size').value;
      const yearsToProject = parseInt(document.getElementById('years-to-project').value) || 3;
      const currentVendor = window.uiController ? window.uiController.activeVendor : 'cisco';
      
      // Calculate TCO for all vendors directly, without updating UI
      const tcoResults = {};
      
      Object.keys(window.vendorData).forEach(vendor => {
        const result = this.calculator.calculateVendorTCO(vendor, currentVendor, orgSize, deviceCount, yearsToProject);
        tcoResults[vendor] = result;
      });
      
      // Add metadata to results
      tcoResults.yearsToProject = yearsToProject;
      tcoResults.deviceCount = deviceCount;
      tcoResults.orgSize = orgSize;
      
      return tcoResults;
    } catch (error) {
      console.error("Error in calculation:", error);
      return null;
    }
  }
  
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
    
    // Show breakeven analysis if available
    if (this.results.breakevenPoints && Object.keys(this.results.breakevenPoints).length > 0) {
      this.updateBreakevenAnalysis();
    }
    
    // Show success message
    this.showSuccess("Sensitivity analysis completed successfully");
  }
  
  updateSensitivityChart() {
    const ctx = document.getElementById('sensitivity-chart');
    if (!ctx) {
      console.warn('Sensitivity chart canvas element not found');
      return;
    }
    
    // Prepare chart data
    const labels = this.results.dataPoints.map(dp => this.formatDataPoint(this.results.variable, dp));
    
    const datasets = [];
    const vendors = this.results.vendor === 'all' ? 
      Object.keys(window.vendorData) : 
      [this.results.vendor, 'portnox']; // Always include Portnox for comparison
    
    // Ensure Portnox is included and deduplicate vendors array
    if (!vendors.includes('portnox')) {
      vendors.push('portnox');
    }
    const uniqueVendors = [...new Set(vendors)];
    
    uniqueVendors.forEach(vendor => {
      const vendorName = window.vendorData[vendor]?.name || vendor;
      const vendorColor = this.chartColors[vendor] || this.chartColors.neutral;
      
      const data = this.results.results.map(result => {
        return result.calculationResults[vendor]?.totalTCO || 0;
      });
      
      datasets.push({
        label: vendorName,
        data: data,
        backgroundColor: vendorColor + '20',
        borderColor: vendorColor,
        borderWidth: 2,
        fill: false,
        tension: 0.1
      });
    });
    
    // Create or update chart
    if (this.charts.sensitivity) {
      this.charts.sensitivity.data.labels = labels;
      this.charts.sensitivity.data.datasets = datasets;
      this.charts.sensitivity.update();
    } else {
      this.charts.sensitivity = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: datasets
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
                text: this.getVariableLabel(this.results.variable)
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: `TCO Sensitivity to ${this.getVariableLabel(this.results.variable)}`,
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
            },
            annotation: {
              annotations: this.getBreakevenAnnotations()
            }
          }
        }
      });
    }
  }
  
  getBreakevenAnnotations() {
    // If breakeven analysis is not enabled or no points found, return empty object
    if (!this.results.breakevenPoints || Object.keys(this.results.breakevenPoints).length === 0) {
      return {};
    }
    
    const annotations = {};
    
    // Add a vertical line annotation for each breakeven point
    Object.entries(this.results.breakevenPoints).forEach(([vendor, data], index) => {
      const value = data.value;
      
      // Find the closest index to the breakeven value
      const dataPoints = this.results.dataPoints;
      const closestPointIndex = dataPoints.reduce((closest, point, index) => {
        return Math.abs(point - value) < Math.abs(dataPoints[closest] - value) ? index : closest;
      }, 0);
      
      // Create annotation
      annotations[`breakeven-${vendor}`] = {
        type: 'line',
        xMin: closestPointIndex,
        xMax: closestPointIndex,
        borderColor: 'rgba(255, 0, 0, 0.5)',
        borderWidth: 2,
        label: {
          enabled: true,
          content: `Breakeven: ${this.formatDataPoint(this.results.variable, value)}`,
          position: 'top'
        }
      };
    });
    
    return annotations;
  }
  
  updateSavingsImpactChart() {
    const ctx = document.getElementById('savings-impact-chart');
    if (!ctx) {
      console.warn('Savings impact chart canvas element not found');
      return;
    }
    
    // Only relevant when the vendor is not Portnox
    if (this.results.vendor === 'portnox') {
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
      
      const vendorName = window.vendorData[vendor]?.name || vendor;
      const vendorColor = this.chartColors[vendor] || this.chartColors.neutral;
      
      const data = this.results.results.map(result => {
        const vendorTCO = result.calculationResults[vendor]?.totalTCO || 0;
        const portnoxTCO = result.calculationResults['portnox']?.totalTCO || 0;
        return vendorTCO > 0 && portnoxTCO > 0 ? 
          ((vendorTCO - portnoxTCO) / vendorTCO) * 100 : 0;
      });
      
      datasets.push({
        label: `Savings vs. ${vendorName}`,
        data: data,
        backgroundColor: vendorColor + '20',
        borderColor: vendorColor,
        borderWidth: 2,
        fill: false,
        tension: 0.1
      });
    });
    
    // Create or update chart
    if (this.charts.savingsImpact) {
      this.charts.savingsImpact.data.labels = labels;
      this.charts.savingsImpact.data.datasets = datasets;
      this.charts.savingsImpact.update();
    } else {
      this.charts.savingsImpact = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: datasets
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
                text: this.getVariableLabel(this.results.variable)
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: `Portnox Savings Impact by ${this.getVariableLabel(this.results.variable)}`,
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
    }
  }
  
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
      Object.keys(window.vendorData) : 
      [this.results.vendor, 'portnox']; // Always include Portnox for comparison
    
    // Ensure Portnox is included and deduplicate vendors array
    if (!vendors.includes('portnox')) {
      vendors.push('portnox');
    }
    const uniqueVendors = [...new Set(vendors)];
    
    uniqueVendors.forEach(vendor => {
      const vendorName = window.vendorData[vendor]?.name || vendor;
      tableHeader.innerHTML += `<th scope="col">${vendorName}</th>`;
      
      // Add savings column if comparing to other vendors
      if (vendor !== 'portnox') {
        tableHeader.innerHTML += `<th scope="col">Savings vs. ${vendorName}</th>`;
      }
    });
    
    // Add data rows
    this.results.results.forEach(result => {
      const row = document.createElement('tr');
      
      // Add data point column
      row.innerHTML = `<td>${this.formatDataPoint(this.results.variable, result.dataPoint)}</td>`;
      
      // Add vendor TCO columns
      uniqueVendors.forEach(vendor => {
        const tco = result.calculationResults[vendor]?.totalTCO || 0;
        row.innerHTML += `<td>${window.formatCurrency(tco)}</td>`;
        
        // Add savings column if comparing to other vendors
        if (vendor !== 'portnox') {
          const vendorTCO = result.calculationResults[vendor]?.totalTCO || 0;
          const portnoxTCO = result.calculationResults['portnox']?.totalTCO || 0;
          
          const savingsAmount = vendorTCO - portnoxTCO;
          const savingsPercentage = vendorTCO > 0 ? (savingsAmount / vendorTCO) * 100 : 0;
          
          // Add a cell with absolute and percentage savings
          row.innerHTML += `<td>${window.formatCurrency(savingsAmount)} (${savingsPercentage.toFixed(1)}%)</td>`;
        }
      });
      
      // Add breakeven marker if applicable
      if (this.results.breakevenPoints && Object.keys(this.results.breakevenPoints).length > 0) {
        Object.entries(this.results.breakevenPoints).forEach(([vendor, data]) => {
          const value = data.value;
          
          // Check if this row is closest to the breakeven point
          if (Math.abs(result.dataPoint - value) < (this.results.dataPoints[1] - this.results.dataPoints[0])) {
            row.classList.add('breakeven-row');
          }
        });
      }
      
      tableBody.appendChild(row);
    });
  }
  
  updateBreakevenAnalysis() {
    // Check if container exists
    const container = document.getElementById('breakeven-analysis');
    if (!container) {
      // Create container if needed
      const resultsSection = document.querySelector('.results-container');
      if (!resultsSection) return;
      
      const breakEvenDiv = document.createElement('div');
      breakEvenDiv.id = 'breakeven-analysis';
      breakEvenDiv.className = 'result-card';
      breakEvenDiv.innerHTML = `
        <h3>Breakeven Analysis</h3>
        <div class="breakeven-grid"></div>
      `;
      
      resultsSection.appendChild(breakEvenDiv);
    }
    
    // Get breakeven grid
    const grid = document.querySelector('#breakeven-analysis .breakeven-grid');
    if (!grid) return;
    
    // Clear grid
    grid.innerHTML = '';
    
    // Populate grid with breakeven points
    Object.entries(this.results.breakevenPoints).forEach(([vendor, data]) => {
      const vendorName = window.vendorData[vendor]?.name || vendor;
      const value = data.value;
      const unit = data.unit;
      
      const itemDiv = document.createElement('div');
      itemDiv.className = 'breakeven-item';
      
      itemDiv.innerHTML = `
        <div class="breakeven-vendor">${vendorName}</div>
        <div class="breakeven-value">${value.toFixed(1)} ${unit}</div>
        <div class="breakeven-explanation">
          At ${this.formatDataPoint(this.results.variable, value)}, ${vendorName} and Portnox Cloud have equal TCO.
          ${value < this.results.dataPoints[Math.floor(this.results.dataPoints.length / 2)] ? 
            `Below this value, ${vendorName} is more cost-effective.` :
            `Above this value, Portnox Cloud is more cost-effective.`}
        </div>
      `;
      
      grid.appendChild(itemDiv);
    });
    
    // Add explanatory note
    const noteDiv = document.createElement('div');
    noteDiv.className = 'breakeven-note';
    noteDiv.innerHTML = `
      <p>Breakeven analysis identifies the point at which two solutions have equal total cost of ownership. 
      It helps determine the threshold at which one solution becomes more cost-effective than the other.</p>
    `;
    
    grid.appendChild(noteDiv);
  }
  
  formatDataPoint(variable, value) {
    switch (variable) {
      case 'deviceCount':
        return window.formatNumber(value) + ' devices';
      case 'legacyPercentage':
        return value + '%';
      case 'locationCount':
        return window.formatNumber(value) + ' locations';
      case 'yearsToProject':
        return value + ' years';
      case 'hardwareCost':
      case 'licensingCost':
      case 'maintenanceCost':
      case 'implementationCost':
      case 'fteCost':
        return value.toFixed(1) + 'x';
      case 'downtimeCost':
        return window.formatCurrency(value) + '/hour';
      default:
        return value.toString();
    }
  }
  
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
      case 'implementationCost':
        return 'Implementation Cost Multiplier';
      case 'fteCost':
        return 'Personnel Cost Multiplier';
      case 'downtimeCost':
        return 'Downtime Cost';
      default:
        return variable;
    }
  }
  
  addCurrentScenario() {
    if (!this.results) {
      this.showError("No analysis results to save");
      return;
    }
    
    const scenarioName = prompt("Enter a name for this scenario:", `${this.getVariableLabel(this.results.variable)} Analysis`);
    if (!scenarioName) return;
    
    const scenario = {
      name: scenarioName,
      data: JSON.parse(JSON.stringify(this.results)),
      timestamp: new Date().toISOString()
    };
    
    this.scenarios.push(scenario);
    this.showSuccess(`Scenario "${scenarioName}" saved`);
    
    this.updateScenariosList();
  }
  
  clearScenarios() {
    if (confirm("Are you sure you want to clear all saved scenarios?")) {
      this.scenarios = [];
      this.showSuccess("All scenarios cleared");
      this.updateScenariosList();
    }
  }
  
  updateScenariosList() {
    const container = document.getElementById('scenarios-list');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    if (this.scenarios.length === 0) {
      container.innerHTML = '<p>No saved scenarios</p>';
      return;
    }
    
    // Create list of scenarios
    this.scenarios.forEach((scenario, index) => {
      const item = document.createElement('div');
      item.className = 'scenario-item';
      
      item.innerHTML = `
        <div class="scenario-header">
          <div class="scenario-name">${scenario.name}</div>
          <div class="scenario-actions">
            <button class="btn-view" data-index="${index}" title="View"><i class="fas fa-eye"></i></button>
            <button class="btn-delete" data-index="${index}" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <div class="scenario-details">
          ${this.getVariableLabel(scenario.data.variable)}: ${scenario.data.minValue} to ${scenario.data.maxValue}
        </div>
      `;
      
      // Add breakeven info if available
      if (scenario.data.breakevenPoints && Object.keys(scenario.data.breakevenPoints).length > 0) {
        const breakeven = Object.entries(scenario.data.breakevenPoints)[0];
        const vendorName = window.vendorData[breakeven[0]]?.name || breakeven[0];
        const value = breakeven[1].value;
        
        item.innerHTML += `
          <div class="scenario-breakeven">
            <div class="breakeven-info">Breakeven: ${this.formatDataPoint(scenario.data.variable, value)}</div>
          </div>
        `;
      }
      
      container.appendChild(item);
      
      // Add event listeners
      const viewBtn = item.querySelector('.btn-view');
      const deleteBtn = item.querySelector('.btn-delete');
      
      if (viewBtn) {
        viewBtn.addEventListener('click', () => {
          this.loadScenario(index);
        });
      }
      
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          this.deleteScenario(index);
        });
      }
    });
  }
  
  loadScenario(index) {
    const scenario = this.scenarios[index];
    if (!scenario) return;
    
    this.results = scenario.data;
    this.updateUI();
    this.showSuccess(`Loaded scenario "${scenario.name}"`);
  }
  
  deleteScenario(index) {
    const scenario = this.scenarios[index];
    if (!scenario) return;
    
    if (confirm(`Are you sure you want to delete the scenario "${scenario.name}"?`)) {
      this.scenarios.splice(index, 1);
      this.updateScenariosList();
      this.showSuccess(`Deleted scenario "${scenario.name}"`);
    }
  }
  
  exportToCSV() {
    if (!this.results) {
      this.showError("No analysis results to export");
      return;
    }
    
    try {
      // Create CSV content
      let csv = [];
      
      // Add header
      csv.push(['NAC Solution Sensitivity Analysis']);
      csv.push([`Generated on ${new Date().toLocaleDateString()}`]);
      csv.push([]);
      
      // Add analysis parameters
      csv.push(['Analysis Parameters']);
      csv.push(['Variable', this.getVariableLabel(this.results.variable)]);
      csv.push(['Range', `${this.results.minValue} to ${this.results.maxValue}`]);
      csv.push(['Steps', this.results.steps]);
      csv.push(['Vendor(s)', this.results.vendor === 'all' ? 'All Vendors' : window.vendorData[this.results.vendor]?.name || this.results.vendor]);
      csv.push([]);
      
      // Add breakeven points if available
      if (this.results.breakevenPoints && Object.keys(this.results.breakevenPoints).length > 0) {
        csv.push(['Breakeven Points']);
        
        Object.entries(this.results.breakevenPoints).forEach(([vendor, data]) => {
          const vendorName = window.vendorData[vendor]?.name || vendor;
          csv.push([vendorName, `${data.value.toFixed(2)} ${data.unit}`]);
        });
        
        csv.push([]);
      }
      
      // Add data table
      csv.push(['Sensitivity Analysis Results']);
      
      // Add table header row
      const headerRow = [this.getVariableLabel(this.results.variable)];
      
      const vendors = this.results.vendor === 'all' ? 
        Object.keys(window.vendorData) : 
        [this.results.vendor, 'portnox']; // Always include Portnox for comparison
      
      // Ensure Portnox is included and deduplicate vendors array
      if (!vendors.includes('portnox')) {
        vendors.push('portnox');
      }
      const uniqueVendors = [...new Set(vendors)];
      
      uniqueVendors.forEach(vendor => {
        const vendorName = window.vendorData[vendor]?.name || vendor;
        headerRow.push(vendorName);
        
        // Add savings column if comparing to other vendors
        if (vendor !== 'portnox') {
          headerRow.push(`Savings vs. ${vendorName}`);
          headerRow.push(`Savings % vs. ${vendorName}`);
        }
      });
      
      csv.push(headerRow);
      
      // Add data rows
      this.results.results.forEach(result => {
        const row = [this.formatDataPoint(this.results.variable, result.dataPoint)];
        
        uniqueVendors.forEach(vendor => {
          const tco = result.calculationResults[vendor]?.totalTCO || 0;
          row.push(tco);
          
          // Add savings if comparing to other vendors
          if (vendor !== 'portnox') {
            const vendorTCO = result.calculationResults[vendor]?.totalTCO || 0;
            const portnoxTCO = result.calculationResults['portnox']?.totalTCO || 0;
            
            const savingsAmount = vendorTCO - portnoxTCO;
            const savingsPercentage = vendorTCO > 0 ? (savingsAmount / vendorTCO) * 100 : 0;
            
            row.push(savingsAmount);
            row.push(savingsPercentage.toFixed(2) + '%');
          }
        });
        
        csv.push(row);
      });
      
      // Convert to CSV string
      const csvContent = csv.map(row => row.join(',')).join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `NAC_Sensitivity_Analysis_${this.results.variable}_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.showSuccess("Analysis exported to CSV");
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      this.showError("Error exporting to CSV: " + error.message);
    }
  }
  
  exportToPDF() {
    if (!this.results) {
      this.showError("No analysis results to export");
      return;
    }
    
    try {
      // Use jsPDF if available
      if (typeof jsPDF !== 'undefined') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(16);
        doc.setTextColor(5, 84, 124);
        doc.text('NAC Solution Sensitivity Analysis', 105, 15, { align: 'center' });
        
        // Add subtitle
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`${this.getVariableLabel(this.results.variable)} Analysis`, 105, 25, { align: 'center' });
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 32, { align: 'center' });
        
        // Add analysis parameters
        doc.setFontSize(14);
        doc.setTextColor(5, 84, 124);
        doc.text('Analysis Parameters', 20, 45);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Variable: ${this.getVariableLabel(this.results.variable)}`, 20, 55);
        doc.text(`Range: ${this.results.minValue} to ${this.results.maxValue}`, 20, 63);
        doc.text(`Steps: ${this.results.steps}`, 20, 71);
        doc.text(`Vendor(s): ${this.results.vendor === 'all' ? 'All Vendors' : window.vendorData[this.results.vendor]?.name || this.results.vendor}`, 20, 79);
        
        // Add breakeven points if available
        if (this.results.breakevenPoints && Object.keys(this.results.breakevenPoints).length > 0) {
          doc.setFontSize(14);
          doc.setTextColor(5, 84, 124);
          doc.text('Breakeven Analysis', 20, 95);
          
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          
          let yPos = 105;
          Object.entries(this.results.breakevenPoints).forEach(([vendor, data]) => {
            const vendorName = window.vendorData[vendor]?.name || vendor;
            doc.text(`${vendorName}: ${data.value.toFixed(2)} ${data.unit}`, 20, yPos);
            yPos += 8;
            
            doc.text(`At this value, ${vendorName} and Portnox Cloud have equal TCO.`, 30, yPos);
            yPos += 8;
          });
        }
        
        // Add chart placeholder (in a real implementation, you'd capture and embed the chart image)
        doc.setFontSize(14);
        doc.setTextColor(5, 84, 124);
        doc.text('Sensitivity Chart', 20, 130);
        
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(20, 140, 170, 60, 3, 3, 'FD');
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Sensitivity Analysis Chart', 105, 170, { align: 'center' });
        
        // Add data table (first page worth of data)
        doc.setFontSize(14);
        doc.setTextColor(5, 84, 124);
        doc.text('Data Table', 20, 220);
        
        // Create simplified data table
        const tableData = [];
        
        // Add header row
        const headerRow = [this.getVariableLabel(this.results.variable)];
        
        const vendors = this.results.vendor === 'all' ?
          Object.keys(window.vendorData).slice(0, 3) : // Limit to first 3 vendors for PDF
          [this.results.vendor, 'portnox']; // Always include Portnox for comparison
        
        vendors.forEach(vendor => {
          const vendorName = window.vendorData[vendor]?.name || vendor;
          headerRow.push(vendorName);
        });
        
        tableData.push(headerRow);
        
        // Add data rows (first 5 only for PDF)
        this.results.results.slice(0, 5).forEach(result => {
          const row = [this.formatDataPoint(this.results.variable, result.dataPoint)];
          
          vendors.forEach(vendor => {
            const tco = result.calculationResults[vendor]?.totalTCO || 0;
            row.push('$' + tco.toLocaleString());
          });
          
          tableData.push(row);
        });
        
        // Add note if data is truncated
        if (this.results.results.length > 5 || Object.keys(window.vendorData).length > 3) {
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text('Note: Table shows partial data only. Please see CSV export for complete results.', 20, 260);
        }
        
        // Save PDF
        doc.save(`NAC_Sensitivity_Analysis_${this.results.variable}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
        
        this.showSuccess("Analysis exported to PDF");
      } else {
        this.showError("PDF generation library not available");
      }
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      this.showError("Error exporting to PDF: " + error.message);
    }
  }
  
  showLoading() {
    if (window.loadingManager) {
      window.loadingManager.showGlobal('Running sensitivity analysis...');
    } else {
      const resultsContainer = document.querySelector('.results-container');
      if (!resultsContainer) return;
      
      // Check if loading overlay already exists
      let loadingOverlay = resultsContainer.querySelector('.loading-overlay');
      if (loadingOverlay) return;
      
      // Create loading overlay
      loadingOverlay = document.createElement('div');
      loadingOverlay.className = 'loading-overlay';
      loadingOverlay.innerHTML = `
        <div class="spinner"></div>
        <div class="loading-text">Running sensitivity analysis...</div>
      `;
      
      resultsContainer.appendChild(loadingOverlay);
    }
  }
  
  hideLoading() {
    if (window.loadingManager) {
      window.loadingManager.hideGlobal();
    } else {
      const loadingOverlay = document.querySelector('.loading-overlay');
      if (loadingOverlay) {
        loadingOverlay.parentNode.removeChild(loadingOverlay);
      }
    }
  }
  
  showError(message) {
    if (window.notificationManager) {
      window.notificationManager.error(message);
    } else {
      const messageContainer = document.getElementById('message-container');
      if (!messageContainer) return;
      
      messageContainer.innerHTML = `
        <div class="error-message-box">
          <i class="fas fa-exclamation-circle"></i>
          <span>${message}</span>
          <button class="close-error"><i class="fas fa-times"></i></button>
        </div>
      `;
      
      // Add close button functionality
      const closeBtn = messageContainer.querySelector('.close-error');
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          messageContainer.innerHTML = '';
        });
      }
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        if (messageContainer.querySelector('.error-message-box')) {
          messageContainer.innerHTML = '';
        }
      }, 5000);
    }
  }
  
  showSuccess(message) {
    if (window.notificationManager) {
      window.notificationManager.success(message);
    } else {
      const messageContainer = document.getElementById('message-container');
      if (!messageContainer) return;
      
      messageContainer.innerHTML = `
        <div class="success-message-box">
          <i class="fas fa-check-circle"></i>
          <span>${message}</span>
          <button class="close-error"><i class="fas fa-times"></i></button>
        </div>
      `;
      
      // Add close button functionality
      const closeBtn = messageContainer.querySelector('.close-error');
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          messageContainer.innerHTML = '';
        });
      }
      
      // Auto-hide after 3 seconds
      setTimeout(() => {
        if (messageContainer.querySelector('.success-message-box')) {
          messageContainer.innerHTML = '';
        }
      }, 3000);
    }
  }
}

// Make the enhanced sensitivity analyzer globally available
window.enhancedSensitivityAnalyzer = new EnhancedSensitivityAnalyzer();
