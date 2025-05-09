/**
 * Integrated Sensitivity Analysis
 * Performs sensitivity analysis on TCO calculator parameters
 */
class IntegratedSensitivityAnalyzer {
  constructor() {
    this.charts = {};
    
    // Parameter descriptions
    this.parameterDescriptions = {
      deviceCount: 'Analyze how changes in the total number of devices affect TCO and relative savings.',
      legacyPercentage: 'Evaluate the impact of different legacy device percentages on overall TCO.',
      locationCount: 'Examine how deployment across multiple locations affects total costs.',
      yearsToProject: 'Compare cost projections over different time horizons.',
      hardwareCost: 'Analyze sensitivity to hardware cost variations.',
      licensingCost: 'Evaluate how licensing cost changes impact overall TCO.',
      maintenanceCost: 'Examine the effect of maintenance cost fluctuations.',
      implementationCost: 'Measure the impact of implementation cost variations.',
      fteCost: 'Assess how personnel costs affect the total TCO.',
      downtimeCost: 'Calculate the impact of different downtime costs on overall risk.',
    };
    
    // Parameter units
    this.parameterUnits = {
      deviceCount: 'devices',
      legacyPercentage: '%',
      locationCount: 'locations',
      yearsToProject: 'years',
      hardwareCost: 'x',
      licensingCost: 'x',
      maintenanceCost: 'x',
      implementationCost: 'x',
      fteCost: 'x',
      downtimeCost: '$/hour',
    };
    
    // Parameter default ranges
    this.parameterRanges = {
      deviceCount: { min: 100, max: 5000, steps: 10 },
      legacyPercentage: { min: 0, max: 100, steps: 10 },
      locationCount: { min: 1, max: 50, steps: 10 },
      yearsToProject: { min: 1, max: 5, steps: 5 },
      hardwareCost: { min: 0.5, max: 2.0, steps: 10 },
      licensingCost: { min: 0.5, max: 2.0, steps: 10 },
      maintenanceCost: { min: 0.5, max: 2.0, steps: 10 },
      implementationCost: { min: 0.5, max: 2.0, steps: 10 },
      fteCost: { min: 0.5, max: 2.0, steps: 10 },
      downtimeCost: { min: 0, max: 10000, steps: 10 },
    };
    
    // Chart colors
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
    
    // Chart defaults
    this.chartDefaults = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 15,
            usePointStyle: true
          }
        },
        tooltip: {
          enabled: true,
          padding: 10,
          bodySpacing: 5,
          callbacks: {}
        }
      }
    };
    
    console.log('Integrated Sensitivity Analyzer initialized');
  }
  
  // Initialize charts
  initCharts() {
    this.initSensitivityChart();
    this.initSavingsImpactChart();
  }
  
  // Initialize sensitivity analysis chart
  initSensitivityChart() {
    const ctx = document.getElementById('sensitivity-chart');
    if (!ctx) {
      console.warn('Sensitivity chart canvas element not found');
      return;
    }
    
    try {
      const ctxCanvas = ctx.getContext('2d');
      if (!ctxCanvas) {
        console.warn('Could not get 2D context for sensitivity chart');
        return;
      }
      
      this.charts.sensitivity = new Chart(ctxCanvas, {
        type: 'line',
        data: {
          labels: [],
          datasets: []
        },
        options: {
          ...this.chartDefaults,
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Total Cost ($)'
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
                text: 'Parameter Value'
              }
            }
          },
          plugins: {
            ...this.chartDefaults.plugins,
            tooltip: {
              ...this.chartDefaults.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y;
                  return label + ': $' + value.toLocaleString();
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
  initSavingsImpactChart() {
    const ctx = document.getElementById('savings-impact-chart');
    if (!ctx) {
      console.warn('Savings impact chart canvas element not found');
      return;
    }
    
    try {
      const ctxCanvas = ctx.getContext('2d');
      if (!ctxCanvas) {
        console.warn('Could not get 2D context for savings impact chart');
        return;
      }
      
      this.charts.savingsImpact = new Chart(ctxCanvas, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Savings Percentage',
            data: [],
            borderColor: this.chartColors.portnox,
            backgroundColor: this.chartColors.portnox + '20',
            fill: true,
            tension: 0.3,
            borderWidth: 2
          }]
        },
        options: {
          ...this.chartDefaults,
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax: 100,
              title: {
                display: true,
                text: 'Savings (%)'
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
                text: 'Parameter Value'
              }
            }
          },
          plugins: {
            ...this.chartDefaults.plugins,
            tooltip: {
              ...this.chartDefaults.plugins.tooltip,
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
  
  // Run sensitivity analysis
  runSensitivityAnalysis(parameter, parameterValues, selectedVendor) {
    try {
      console.log('Running sensitivity analysis for parameter:', parameter);
      console.log('Parameter values:', parameterValues);
      console.log('Selected vendor:', selectedVendor);
      
      // Get calculator instance
      const calculator = window.calculator;
      if (!calculator) {
        console.error('Calculator not found');
        return null;
      }
      
      // Get current calculation input
      const baseInput = { ...calculator.getCalculationInput() };
      
      // Results containers
      const results = {
        parameter,
        parameterValues,
        vendorResults: []
      };
      
      // Determine which vendors to analyze
      let vendors = ['portnox'];
      if (selectedVendor === 'all') {
        // Add all vendors except portnox
        vendors = [...vendors, ...Object.keys(window.vendorData || {})];
        vendors = [...new Set(vendors)]; // Remove duplicates
      } else if (selectedVendor !== 'portnox') {
        vendors.push(selectedVendor);
      }
      
      // Run analysis for each vendor
      vendors.forEach(vendor => {
        const vendorTCO = [];
        
        // Calculate TCO for each parameter value
        parameterValues.forEach(value => {
          // Create modified input with the current parameter value
          const modifiedInput = { ...baseInput };
          
          switch (parameter) {
            case 'deviceCount':
              modifiedInput.deviceCount = value;
              break;
            case 'legacyPercentage':
              modifiedInput.legacyPercentage = value;
              break;
            case 'locationCount':
              modifiedInput.locationCount = value;
              modifiedInput.multipleLocations = value > 1;
              break;
            case 'yearsToProject':
              modifiedInput.yearsToProject = value;
              break;
            case 'hardwareCost':
              modifiedInput.hardwareCostMultiplier = value;
              break;
            case 'licensingCost':
              modifiedInput.licensingCostMultiplier = value;
              break;
            case 'maintenanceCost':
              modifiedInput.maintenanceCostMultiplier = value;
              break;
            case 'implementationCost':
              modifiedInput.implementationCostMultiplier = value;
              break;
            case 'fteCost':
              modifiedInput.fteCostMultiplier = value;
              break;
            case 'downtimeCost':
              modifiedInput.downtimeCost = value;
              break;
          }
          
          // Calculate TCO for the current vendor with modified parameters
          const vendorResults = calculator.calculateVendorTCO(vendor, modifiedInput);
          
          // Add TCO to results
          vendorTCO.push(vendorResults.totalCost);
        });
        
        // Add vendor results to the results object
        results.vendorResults.push({
          name: window.vendorData && window.vendorData[vendor] ? window.vendorData[vendor].name : vendor,
          values: vendorTCO,
          vendor
        });
      });
      
      // Calculate savings percentages if we have portnox and at least one other vendor
      if (results.vendorResults.length > 1) {
        const portnoxResults = results.vendorResults.find(result => result.vendor === 'portnox');
        const compareResults = results.vendorResults.find(result => result.vendor === selectedVendor) || 
                              results.vendorResults.find(result => result.vendor !== 'portnox');
        
        if (portnoxResults && compareResults) {
          const savingsPercentages = [];
          
          compareResults.values.forEach((value, index) => {
            const portnoxValue = portnoxResults.values[index];
            const savings = value - portnoxValue;
            const savingsPercentage = (savings / value) * 100;
            savingsPercentages.push(savingsPercentage);
          });
          
          results.savingsPercentages = savingsPercentages;
        }
      }
      
      // Calculate breakeven points
      const breakevens = this.calculateBreakevens(parameter, parameterValues, results.vendorResults);
      results.breakevens = breakevens;
      
      return results;
    } catch (error) {
      console.error('Error running sensitivity analysis:', error);
      return null;
    }
  }
  
  // Calculate breakeven points between vendors
  calculateBreakevens(parameter, parameterValues, vendorResults) {
    const breakevens = [];
    
    // Find portnox results
    const portnoxResults = vendorResults.find(result => result.vendor === 'portnox');
    if (!portnoxResults) return breakevens;
    
    // Check breakeven points for each vendor against portnox
    vendorResults.forEach(vendorResult => {
      if (vendorResult.vendor === 'portnox') return;
      
      // Find where the lines cross (TCO becomes equal)
      let breakevenValue = null;
      let breakevenIndex = -1;
      
      for (let i = 0; i < parameterValues.length - 1; i++) {
        const portnoxValue1 = portnoxResults.values[i];
        const portnoxValue2 = portnoxResults.values[i + 1];
        const vendorValue1 = vendorResult.values[i];
        const vendorValue2 = vendorResult.values[i + 1];
        
        // Check if the lines cross between these points
        if ((portnoxValue1 > vendorValue1 && portnoxValue2 < vendorValue2) ||
            (portnoxValue1 < vendorValue1 && portnoxValue2 > vendorValue2)) {
          
          // Calculate the intersection point using linear interpolation
          const t = (vendorValue1 - portnoxValue1) / ((portnoxValue2 - portnoxValue1) - (vendorValue2 - vendorValue1));
          const paramValue = parameterValues[i] + t * (parameterValues[i + 1] - parameterValues[i]);
          
          breakevenValue = paramValue;
          breakevenIndex = i;
          
          // Add to breakevens
          breakevens.push({
            vendor: vendorResult.vendor,
            vendorName: vendorResult.name,
            breakevenValue,
            breakevenIndex,
            parameterValue: paramValue
          });
        }
      }
    });
    
    return breakevens;
  }
  
  // Update sensitivity chart with results
  updateSensitivityChart(results) {
    if (!this.charts.sensitivity) {
      console.warn('Sensitivity chart not initialized');
      return;
    }
    
    try {
      // Update chart data
      this.charts.sensitivity.data.labels = results.parameterValues;
      
      // Create datasets
      const datasets = results.vendorResults.map(result => {
        const color = this.chartColors[result.vendor] || this.chartColors.neutral;
        
        return {
          label: result.name,
          data: result.values,
          borderColor: color,
          backgroundColor: color + '10',
          tension: 0.3,
          fill: false,
          borderWidth: result.vendor === 'portnox' ? 3 : 2,
          pointRadius: result.vendor === 'portnox' ? 4 : 3,
          pointHoverRadius: result.vendor === 'portnox' ? 7 : 5
        };
      });
      
      this.charts.sensitivity.data.datasets = datasets;
      
      // Update X-axis title
      const parameter = results.parameter;
      const unit = this.parameterUnits[parameter] || '';
      const xTitle = 'Parameter: ' + parameter + (unit ? ' (' + unit + ')' : '');
      
      this.charts.sensitivity.options.scales.x.title.text = xTitle;
      
      // Update chart
      this.charts.sensitivity.update();
      
      console.log('Sensitivity chart updated');
    } catch (error) {
      console.error('Error updating sensitivity chart:', error);
    }
  }
  
  // Update savings impact chart with results
  updateSavingsImpactChart(results) {
    if (!this.charts.savingsImpact) {
      console.warn('Savings impact chart not initialized');
      return;
    }
    
    if (!results.savingsPercentages) {
      console.warn('No savings percentages available');
      return;
    }
    
    try {
      // Update chart data
      this.charts.savingsImpact.data.labels = results.parameterValues;
      this.charts.savingsImpact.data.datasets[0].data = results.savingsPercentages;
      
      // Update X-axis title
      const parameter = results.parameter;
      const unit = this.parameterUnits[parameter] || '';
      const xTitle = 'Parameter: ' + parameter + (unit ? ' (' + unit + ')' : '');
      
      this.charts.savingsImpact.options.scales.x.title.text = xTitle;
      
      // Update chart
      this.charts.savingsImpact.update();
      
      console.log('Savings impact chart updated');
    } catch (error) {
      console.error('Error updating savings impact chart:', error);
    }
  }
  
  // Generate breakeven analysis content
  generateBreakevenContent(results) {
    if (!results.breakevens || results.breakevens.length === 0) {
      return '<p>No breakeven points found in the analyzed range.</p>';
    }
    
    const parameter = results.parameter;
    const unit = this.parameterUnits[parameter] || '';
    
    let html = '<div class="breakeven-grid">';
    
    results.breakevens.forEach(breakeven => {
      const value = breakeven.parameterValue.toFixed(2);
      
      html += `
        <div class="breakeven-item">
          <div class="breakeven-vendor">${breakeven.vendorName} vs Portnox</div>
          <div class="breakeven-value">${value} ${unit}</div>
          <div class="breakeven-description">
            Portnox becomes more cost-effective than ${breakeven.vendorName} above this ${parameter} value.
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    
    return html;
  }
  
  // Generate results table
  generateResultsTable(results) {
    if (!results.vendorResults || results.vendorResults.length === 0) {
      return '<p>No results available.</p>';
    }
    
    const parameter = results.parameter;
    const unit = this.parameterUnits[parameter] || '';
    
    let html = '<table class="data-table sensitivity-table">';
    
    // Generate table header
    html += '<thead><tr>';
    html += `<th>${parameter} (${unit})</th>`;
    
    results.vendorResults.forEach(result => {
      html += `<th>${result.name}</th>`;
    });
    
    if (results.savingsPercentages) {
      html += '<th>Savings %</th>';
    }
    
    html += '</tr></thead>';
    
    // Generate table body
    html += '<tbody>';
    
    results.parameterValues.forEach((value, index) => {
      html += '<tr>';
      html += `<td>${value}</td>`;
      
      results.vendorResults.forEach(result => {
        const tco = result.values[index];
        html += `<td>${window.formatCurrency ? window.formatCurrency(tco) : '$' + tco.toLocaleString()}</td>`;
      });
      
      if (results.savingsPercentages) {
        const savingsPercentage = results.savingsPercentages[index];
        html += `<td>${savingsPercentage.toFixed(1)}%</td>`;
      }
      
      html += '</tr>';
    });
    
    html += '</tbody>';
    html += '</table>';
    
    return html;
  }
  
  // Get parameter description
  getParameterDescription(parameter) {
    return this.parameterDescriptions[parameter] || 'Analyze how changes in this parameter affect TCO.';
  }
  
  // Get default parameter range
  getDefaultParameterRange(parameter) {
    return this.parameterRanges[parameter] || { min: 0, max: 100, steps: 10 };
  }
}

// Initialize and expose
window.sensitivityAnalyzer = new IntegratedSensitivityAnalyzer();

console.log('Enhanced Sensitivity Analyzer initialized');
