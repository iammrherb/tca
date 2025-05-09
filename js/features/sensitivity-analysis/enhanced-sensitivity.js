/**
 * Enhanced Sensitivity Analysis Component
 * Provides more configurable options and improved visualizations
 */
class EnhancedSensitivityAnalyzer {
  constructor() {
    this.results = null;
    this.analyzing = false;
    this.charts = {};
    this.scenarios = [];
    
    // Reference to calculator
    this.calculator = window.calculator;
    
    // Chart colors
    this.chartColors = window.chartBuilder ? window.chartBuilder.chartColors : {
      cisco: '#049fd9',
      aruba: '#ff8300',
      forescout: '#005daa',
      nps: '#00a4ef',
      fortinac: '#ee3124',
      securew2: '#8bc53f',
      portnox: '#2bd25b',
      neutral: '#888888'
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
/**
 * Fix for the syntax error in enhanced-sensitivity.js at line 275
 * This corrects the incomplete implementation of calculateBreakevenPoints method
 */

// Original method with syntax error:
/*
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
*/

// Complete and corrected implementation:
class EnhancedSensitivityAnalyzerFix {
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
}

// Function to apply the fix when page loads
function applyEnhancedSensitivityFix() {
  if (window.enhancedSensitivityAnalyzer) {
    const fix = new EnhancedSensitivityAnalyzerFix();
    
    // Replace the broken method with our fixed implementation
    window.enhancedSensitivityAnalyzer.calculateBreakevenPoints = 
      fix.calculateBreakevenPoints.bind(window.enhancedSensitivityAnalyzer);
    
    // Add the missing getVariableUnit method if it doesn't exist
    if (!window.enhancedSensitivityAnalyzer.getVariableUnit) {
      window.enhancedSensitivityAnalyzer.getVariableUnit = 
        fix.getVariableUnit.bind(window.enhancedSensitivityAnalyzer);
    }
    
    console.log('Enhanced sensitivity analyzer fixed successfully');
  } else {
    console.warn('Enhanced sensitivity analyzer not found, fix not applied');
  }
}

// Apply the fix when document is ready
document.addEventListener('DOMContentLoaded', applyEnhancedSensitivityFix);
