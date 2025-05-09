/**
 * Enhanced Charts Initialization for NAC Architecture Designer Pro
 * Ensures all charts are properly initialized and displayed
 */

// Execute after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing enhanced charts...');
  
  // Wait for all chart libraries to load
  setTimeout(() => {
    // Initialize all charts
    initializeAllCharts();
    
    // Ensure charts are refreshed when tabs are changed
    setupChartRefresh();
  }, 2000);
});

/**
 * Initialize all charts
 */
function initializeAllCharts() {
  // Try different chart initialization approaches
  
  // Approach 1: Use chart builder if available
  if (window.chartBuilder && typeof window.chartBuilder.initCharts === 'function') {
    console.log('Initializing charts via chartBuilder...');
    window.chartBuilder.initCharts();
  }
  
  // Approach 2: Use non-conflict chart handler if available
  if (window.nonConflictChartHandler && typeof window.nonConflictChartHandler.initAllCharts === 'function') {
    console.log('Initializing charts via nonConflictChartHandler...');
    window.nonConflictChartHandler.initAllCharts();
  }
  
  // Approach 3: Use simple chart builder if available
  if (window.simpleChartBuilder && typeof window.simpleChartBuilder.initCharts === 'function') {
    console.log('Initializing charts via simpleChartBuilder...');
    window.simpleChartBuilder.initCharts();
  }
  
  // Approach 4: Direct initialization using Chart.js
  if (window.Chart) {
    console.log('Initializing charts directly via Chart.js...');
    initializeChartsDirectly();
  }
  
  // Try to update charts for current vendor
  updateChartsForCurrentVendor();
}

/**
 * Initialize charts directly using Chart.js
 */
function initializeChartsDirectly() {
  // List of common chart IDs
  const chartIds = [
    'tco-comparison-chart',
    'cumulative-cost-chart',
    'current-breakdown-chart',
    'alternative-breakdown-chart',
    'feature-comparison-chart',
    'implementation-comparison-chart',
    'roi-chart',
    'sensitivity-chart',
    'savings-impact-chart',
    'industry-comparison-chart',
    'compliance-framework-chart',
    'fte-requirements-chart',
    'enhanced-sensitivity-chart'
  ];
  
  // Initialize each chart if canvas exists
  chartIds.forEach(chartId => {
    const canvas = document.getElementById(chartId);
    
    if (canvas && !getChartInstance(canvas)) {
      console.log(`Initializing chart: ${chartId}`);
      
      // Create a basic chart configuration based on chart type
      let config = {};
      
      if (chartId.includes('comparison')) {
        config = {
          type: 'bar',
          data: {
            labels: ['Cisco ISE', 'Aruba ClearPass', 'Forescout', 'Portnox Cloud'],
            datasets: [{
              label: 'Total Cost of Ownership',
              data: [300000, 280000, 290000, 150000],
              backgroundColor: [
                'rgba(0, 133, 202, 0.7)',
                'rgba(255, 122, 0, 0.7)',
                'rgba(0, 79, 159, 0.7)',
                'rgba(43, 210, 91, 0.7)'
              ],
              borderColor: [
                'rgba(0, 133, 202, 1)',
                'rgba(255, 122, 0, 1)',
                'rgba(0, 79, 159, 1)',
                'rgba(43, 210, 91, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Cost ($)'
                }
              }
            }
          }
        };
      } else if (chartId.includes('breakdown')) {
        config = {
          type: 'pie',
          data: {
            labels: ['Hardware', 'Software', 'Implementation', 'Support', 'Maintenance'],
            datasets: [{
              data: [35000, 75000, 25000, 15000, 50000],
              backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        };
      } else if (chartId === 'feature-comparison-chart') {
        config = {
          type: 'radar',
          data: {
            labels: [
              'Cloud-Native Architecture',
              'Zero-Trust Implementation',
              'Ease of Deployment',
              'Operational Efficiency',
              'Compliance Coverage',
              'Cost Efficiency'
            ],
            datasets: [
              {
                label: 'Current Vendor',
                data: [3, 4, 2, 3, 4, 2],
                backgroundColor: 'rgba(0, 133, 202, 0.2)',
                borderColor: 'rgba(0, 133, 202, 1)',
                pointBackgroundColor: 'rgba(0, 133, 202, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(0, 133, 202, 1)'
              },
              {
                label: 'Portnox Cloud',
                data: [5, 5, 5, 5, 4, 5],
                backgroundColor: 'rgba(43, 210, 91, 0.2)',
                borderColor: 'rgba(43, 210, 91, 1)',
                pointBackgroundColor: 'rgba(43, 210, 91, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(43, 210, 91, 1)'
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
                ticks: {
                  beginAtZero: true,
                  max: 5,
                  stepSize: 1
                }
              }
            }
          }
        };
      } else if (chartId === 'roi-chart') {
        config = {
          type: 'line',
          data: {
            labels: ['Initial', 'Year 1', 'Year 2', 'Year 3'],
            datasets: [
              {
                label: 'Current Solution',
                data: [100000, 200000, 300000, 400000],
                borderColor: 'rgba(0, 133, 202, 1)',
                backgroundColor: 'rgba(0, 133, 202, 0.1)',
                fill: true
              },
              {
                label: 'Portnox Cloud',
                data: [70000, 120000, 170000, 220000],
                borderColor: 'rgba(43, 210, 91, 1)',
                backgroundColor: 'rgba(43, 210, 91, 0.1)',
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
                title: {
                  display: true,
                  text: 'Cumulative Cost ($)'
                }
              }
            }
          }
        };
      } else {
        // Default to bar chart for other types
        config = {
          type: 'bar',
          data: {
            labels: ['Vendor 1', 'Vendor 2', 'Vendor 3', 'Vendor 4'],
            datasets: [{
              label: 'Sample Data',
              data: [12, 19, 3, 5],
              backgroundColor: 'rgba(43, 210, 91, 0.7)',
              borderColor: 'rgba(43, 210, 91, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        };
      }
      
      // Create and store the chart
      try {
        new Chart(canvas, config);
        console.log(`Successfully initialized chart: ${chartId}`);
      } catch (error) {
        console.warn(`Error initializing chart ${chartId}:`, error);
      }
    } else if (!canvas) {
      console.log(`Canvas not found for chart: ${chartId}`);
    } else {
      console.log(`Chart already exists for: ${chartId}`);
    }
  });
}

/**
 * Get Chart.js instance for a canvas element
 * @param {HTMLElement} canvas - Canvas element
 * @returns {Object|null} Chart instance or null
 */
function getChartInstance(canvas) {
  return Chart.getChart(canvas);
}

/**
 * Update charts for the current vendor
 */
function updateChartsForCurrentVendor() {
  // Try to find current vendor
  const activeVendor = findActiveVendor();
  
  if (activeVendor) {
    console.log(`Updating charts for vendor: ${activeVendor}`);
    
    // Update via non-conflict chart handler
    if (window.nonConflictChartHandler && typeof window.nonConflictChartHandler.updateChartsForVendor === 'function') {
      window.nonConflictChartHandler.updateChartsForVendor(activeVendor);
    }
    
    // Update via chart builder
    if (window.chartBuilder) {
      // Get dummy results for the vendor
      const results = generateDummyResults(activeVendor);
      
      // Update individual charts
      if (typeof window.chartBuilder.updateTCOComparisonChart === 'function') {
        window.chartBuilder.updateTCOComparisonChart(results);
      }
      
      if (typeof window.chartBuilder.updateCumulativeCostChart === 'function') {
        window.chartBuilder.updateCumulativeCostChart(results);
      }
      
      if (typeof window.chartBuilder.updateCostBreakdownCharts === 'function') {
        window.chartBuilder.updateCostBreakdownCharts(results);
      }
      
      if (typeof window.chartBuilder.updateFeatureComparisonChart === 'function') {
        window.chartBuilder.updateFeatureComparisonChart(activeVendor);
      }
      
      if (typeof window.chartBuilder.updateImplementationComparisonChart === 'function') {
        window.chartBuilder.updateImplementationComparisonChart(results);
      }
      
      if (typeof window.chartBuilder.updateROIChart === 'function') {
        window.chartBuilder.updateROIChart(results);
      }
    }
  }
}

/**
 * Find active vendor from UI
 * @returns {string|null} Active vendor key or null if not found
 */
function findActiveVendor() {
  // Check for active vendor in UI
  const activeVendorElement = document.querySelector('.vendor-card.active, .vendor.active, [data-vendor].active');
  
  if (activeVendorElement) {
    return activeVendorElement.getAttribute('data-vendor');
  }
  
  // If not found in UI, check for UI controller
  if (window.uiController && window.uiController.activeVendor) {
    return window.uiController.activeVendor;
  }
  
  // Default to cisco if nothing found
  return 'cisco';
}

/**
 * Generate dummy results for chart updates
 * @param {string} vendor - Vendor key
 * @returns {Object} Results object
 */
function generateDummyResults(vendor) {
  const baseResults = {
    cisco: {
      totalCost: 300000,
      totalInitialCosts: 100000,
      annualCosts: 75000,
      breakdown: {
        hardware: 50000,
        software: 120000,
        implementation: 30000,
        support: 50000,
        maintenance: 50000
      }
    },
    aruba: {
      totalCost: 280000,
      totalInitialCosts: 90000,
      annualCosts: 70000,
      breakdown: {
        hardware: 45000,
        software: 110000,
        implementation: 35000,
        support: 45000,
        maintenance: 45000
      }
    },
    forescout: {
      totalCost: 290000,
      totalInitialCosts: 95000,
      annualCosts: 72500,
      breakdown: {
        hardware: 47500,
        software: 115000,
        implementation: 32500,
        support: 47500,
        maintenance: 47500
      }
    },
    portnox: {
      totalCost: 150000,
      totalInitialCosts: 30000,
      annualCosts: 40000,
      breakdown: {
        hardware: 0,
        software: 90000,
        implementation: 15000,
        support: 22500,
        maintenance: 22500
      }
    }
  };
  
  // Ensure the vendor exists in our results
  if (!baseResults[vendor]) {
    return baseResults;
  }
  
  // Create a complete results object with the vendor's data and portnox for comparison
  const results = {};
  results[vendor] = baseResults[vendor];
  results['portnox'] = baseResults['portnox'];
  
  return results;
}

/**
 * Set up chart refresh when tabs are changed
 */
function setupChartRefresh() {
  // Find all tab elements
  const tabs = document.querySelectorAll('.tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Add short delay to allow DOM updates
      setTimeout(() => {
        // Refresh charts
        refreshAllCharts();
      }, 500);
    });
  });
}

/**
 * Refresh all charts to ensure they're properly rendered
 */
function refreshAllCharts() {
  console.log('Refreshing all charts...');
  
  // Get all chart instances
  const chartCanvases = document.querySelectorAll('canvas');
  
  chartCanvases.forEach(canvas => {
    const chart = Chart.getChart(canvas);
    if (chart) {
      chart.update();
      console.log(`Refreshed chart: ${canvas.id}`);
    }
  });
}
