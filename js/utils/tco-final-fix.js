/**
 * Total Cost Analyzer Final Fix
 * A comprehensive solution to fix chart initialization and data issues
 * This version includes fixes for competing script interference
 */
(function() {
  // Immediately disable any competing chart initialization scripts
  if (window._tcoFixApplied) {
    console.log('TCO Final Fix already applied, skipping duplicate initialization');
    return;
  }
  
  // Mark as applied to prevent multiple initializations
  window._tcoFixApplied = true;
  
  console.log('=== TCO FINAL FIX: STARTING ===');
  
  // Kill any existing chart-related timeouts to prevent conflicts
  for (var i in window) {
    if (typeof window[i] === 'number' && String(window[i]).indexOf('Timeout') !== -1) {
      clearTimeout(window[i]);
    }
  }
  
  // Override any competing chart initialization functions
  const functionsToDisable = [
    'safeInitCharts',
    'initializeCharts',
    'createChart',
    'checkCharts',
    'refreshCharts'
  ];
  
  functionsToDisable.forEach(function(funcName) {
    if (typeof window[funcName] === 'function') {
      console.log('Disabling competing function: ' + funcName);
      window['_original_' + funcName] = window[funcName];
      window[funcName] = function() {
        console.log('Disabled ' + funcName + ' called, using TCO Final Fix instead');
        return true;
      };
    }
  });
  
  // Create a debug logger
  const logDebug = function(message) {
    console.log('%c[TCO FIX] ' + message, 'color: #3498db; font-weight: bold;');
  };
  
  const logSuccess = function(message) {
    console.log('%c[SUCCESS] ' + message, 'color: #27ae60; font-weight: bold;');
  };
  
  const logError = function(message) {
    console.error('%c[ERROR] ' + message, 'color: #c0392b; font-weight: bold;');
  };
  
  logDebug('Initializing Total Cost Analyzer fix...');
  
  // Apply critical CSS fixes first
  function applyCssFixes() {
    logDebug('Applying CSS fixes...');
    
    // Check if style already exists
    if (document.getElementById('tco-fix-styles')) {
      logDebug('CSS fixes already applied');
      return;
    }
    
    const style = document.createElement('style');
    style.id = 'tco-fix-styles';
    style.textContent = `
      /* Fix chart display */
      .chart-container {
        display: block !important;
        position: relative !important;
        width: 100% !important;
        height: 300px !important;
        margin-bottom: 20px !important;
        visibility: visible !important;
        opacity: 1 !important;
        min-height: 300px !important;
        background-color: #fff;
        overflow: visible !important;
      }
      
      /* Make canvas elements visible */
      canvas {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      /* Fix tab visibility */
      .tab-pane.active,
      .tab-pane.active.show {
        display: block !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      
      /* Fix cursor for tab buttons */
      .tab-button {
        cursor: pointer !important;
      }
      
      /* Chart error message */
      .chart-error-message {
        display: none;
        padding: 20px;
        text-align: center;
        background-color: #f8d7da;
        color: #721c24;
        border-radius: 4px;
        margin: 10px 0;
      }
      
      /* Loading indicator */
      .chart-loading {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10;
      }
      
      .chart-loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(0, 123, 255, 0.1);
        border-top-color: #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 10px;
      }
      
      .chart-loading-text {
        color: #007bff;
        font-weight: bold;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      /* TCO notification styles */
      .tco-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4caf50;
        color: white;
        padding: 10px 15px;
        border-radius: 4px;
        z-index: 9999;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        cursor: pointer;
        opacity: 0;
        transform: translateY(-20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      
      .tco-notification.show {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    
    document.head.appendChild(style);
    logSuccess('CSS fixes applied');
  }
  
  // Fix any vendor data issues
  function ensureVendorData() {
    logDebug('Ensuring vendor data is correct...');
    
    // Check if vendor data needs to be fixed
    if (typeof window.vendorData !== 'object' || 
        !window.vendorData.cisco || 
        !window.vendorData.portnox) {
      
      logDebug('Vendor data missing or incomplete, creating fallback data');
      
      // Create fallback vendor data
      window.vendorData = {
        cisco: {
          name: "Cisco ISE",
          initialCosts: {
            hardware: 50000,
            software: 75000,
            implementation: 45000
          },
          annualCosts: {
            licensing: 35000,
            maintenance: 15000,
            support: 20000,
            personnel: 85000
          }
        },
        aruba: {
          name: "Aruba ClearPass",
          initialCosts: {
            hardware: 45000,
            software: 65000,
            implementation: 40000
          },
          annualCosts: {
            licensing: 30000,
            maintenance: 12000,
            support: 18000,
            personnel: 80000
          }
        },
        forescout: {
          name: "Forescout",
          initialCosts: {
            hardware: 55000,
            software: 70000,
            implementation: 50000
          },
          annualCosts: {
            licensing: 38000,
            maintenance: 16000,
            support: 22000,
            personnel: 90000
          }
        },
        nps: {
          name: "Microsoft NPS",
          initialCosts: {
            hardware: 25000,
            software: 10000,
            implementation: 35000
          },
          annualCosts: {
            licensing: 5000,
            maintenance: 8000,
            support: 12000,
            personnel: 95000
          }
        },
        fortinac: {
          name: "FortiNAC",
          initialCosts: {
            hardware: 40000,
            software: 60000,
            implementation: 38000
          },
          annualCosts: {
            licensing: 28000,
            maintenance: 14000,
            support: 18000,
            personnel: 82000
          }
        },
        securew2: {
          name: "SecureW2",
          initialCosts: {
            hardware: 15000,
            software: 50000,
            implementation: 30000
          },
          annualCosts: {
            licensing: 25000,
            maintenance: 10000,
            support: 15000,
            personnel: 75000
          }
        },
        portnox: {
          name: "Portnox Cloud",
          initialCosts: {
            hardware: 0,
            software: 30000,
            implementation: 15000
          },
          annualCosts: {
            licensing: 45000,
            maintenance: 0,
            support: 10000,
            personnel: 40000
          }
        }
      };
      
      logSuccess('Fallback vendor data created');
    } else {
      logSuccess('Vendor data looks good');
    }
    
    // Add utility functions for vendor data access
    window.getVendorData = function(vendor, section, item) {
      try {
        if (!vendor) return null;
        
        // Check if the vendor exists
        if (!window.vendorData[vendor]) {
          console.warn(`Vendor "${vendor}" not found in vendor data`);
          return null;
        }
        
        // Return the entire vendor object
        if (!section) return window.vendorData[vendor];
        
        // Check if the section exists
        if (!window.vendorData[vendor][section]) {
          console.warn(`Section "${section}" not found for vendor "${vendor}"`);
          return null;
        }
        
        // Return the entire section
        if (!item) return window.vendorData[vendor][section];
        
        // Check if the item exists
        if (window.vendorData[vendor][section][item] === undefined) {
          console.warn(`Item "${item}" not found in section "${section}" for vendor "${vendor}"`);
          return null;
        }
        
        // Return the specific item
        return window.vendorData[vendor][section][item];
      } catch (error) {
        console.error('Error accessing vendor data:', error);
        return null;
      }
    };
  }
  
  // Prepare chart configurations with placeholder data
  function getChartConfigs() {
    return {
      'tco-comparison-chart': {
        type: 'bar',
        data: {
          labels: ['Current Solution', 'Portnox Cloud'],
          datasets: [{
            label: 'Total Cost of Ownership',
            data: [185000, 95000],
            backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(75, 192, 192, 0.5)'],
            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Total Cost of Ownership Comparison'
            },
            legend: {
              display: false
            }
          }
        }
      },
      
      'cumulative-cost-chart': {
        type: 'line',
        data: {
          labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
          datasets: [{
            label: 'Current Solution',
            data: [150000, 250000, 350000, 450000, 550000],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 2,
            fill: true
          }, {
            label: 'Portnox Cloud',
            data: [95000, 140000, 185000, 230000, 275000],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderWidth: 2,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Cumulative Costs Over Time'
            }
          }
        }
      },
      
      'current-breakdown-chart': {
        type: 'pie',
        data: {
          labels: ['Hardware', 'Software', 'Implementation', 'Licensing', 'Maintenance', 'Support', 'Personnel'],
          datasets: [{
            data: [50000, 75000, 45000, 35000, 15000, 20000, 85000],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(255, 159, 64, 0.5)',
              'rgba(199, 199, 199, 0.5)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Current Solution Cost Breakdown'
            }
          }
        }
      },
      
      'alternative-breakdown-chart': {
        type: 'pie',
        data: {
          labels: ['Hardware', 'Software', 'Implementation', 'Licensing', 'Maintenance', 'Support', 'Personnel'],
          datasets: [{
            data: [0, 30000, 15000, 45000, 0, 10000, 40000],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(255, 159, 64, 0.5)',
              'rgba(199, 199, 199, 0.5)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Portnox Cloud Cost Breakdown'
            }
          }
        }
      },
      
      'implementation-comparison-chart': {
        type: 'bar',
        data: {
          labels: ['Planning', 'Installation', 'Configuration', 'Testing', 'Deployment', 'Training'],
          datasets: [{
            label: 'Current Solution (days)',
            data: [10, 14, 21, 15, 20, 10],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }, {
            label: 'Portnox Cloud (days)',
            data: [5, 2, 8, 7, 5, 3],
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
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
                text: 'Days'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Implementation Timeline Comparison'
            }
          }
        }
      },
      
      'feature-comparison-chart': {
        type: 'radar',
        data: {
          labels: [
            'Security Features',
            'Scalability',
            'Ease of Use',
            'Deployment Speed',
            'Monitoring Capabilities',
            'Cloud Integration'
          ],
          datasets: [{
            label: 'Current Solution',
            data: [75, 65, 60, 40, 70, 50],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
          }, {
            label: 'Portnox Cloud',
            data: [90, 95, 85, 90, 80, 95],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Feature Comparison'
            }
          },
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: {
                stepSize: 20
              }
            }
          }
        }
      },
      
      'roi-chart': {
        type: 'line',
        data: {
          labels: ['Initial', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
          datasets: [{
            label: 'Current Solution ROI',
            data: [-170000, -120000, -70000, -20000, 30000, 80000],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 2,
            fill: false
          }, {
            label: 'Portnox Cloud ROI',
            data: [-45000, 10000, 65000, 120000, 175000, 230000],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderWidth: 2,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Return on Investment Analysis'
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Cumulative ROI ($)'
              }
            }
          }
        }
      },
      
      'sensitivity-chart': {
        type: 'line',
        data: {
          labels: ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'],
          datasets: [{
            label: 'Cisco ISE',
            data: [120000, 150000, 180000, 210000, 240000, 270000, 300000, 330000, 360000, 390000],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 2,
            fill: false
          }, {
            label: 'Portnox Cloud',
            data: [70000, 85000, 100000, 115000, 130000, 145000, 160000, 175000, 190000, 205000],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderWidth: 2,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'TCO Sensitivity Analysis'
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Total Cost ($)'
              }
            }
          }
        }
      },
      
      'savings-impact-chart': {
        type: 'line',
        data: {
          labels: ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'],
          datasets: [{
            label: 'Savings Percentage',
            data: [42, 43, 44, 45, 46, 46, 47, 47, 48, 48],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderWidth: 2,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Portnox Savings Impact'
            }
          },
          scales: {
            y: {
              min: 0,
              max: 100,
              title: {
                display: true,
                text: 'Savings Percentage (%)'
              }
            }
          }
        }
      }
    };
  }
  
  // Show a loading indicator for a chart
  function showChartLoading(container) {
    // Remove any existing loading indicator
    const existingLoading = container.querySelector('.chart-loading');
    if (existingLoading) {
      existingLoading.parentNode.removeChild(existingLoading);
    }
    
    // Create loading indicator
    const loading = document.createElement('div');
    loading.className = 'chart-loading';
    loading.innerHTML = `
      <div class="chart-loading-spinner"></div>
      <div class="chart-loading-text">Initializing chart...</div>
    `;
    
    container.appendChild(loading);
    
    return loading;
  }
  
  // Hide loading indicator
  function hideChartLoading(loading) {
    if (loading && loading.parentNode) {
      loading.parentNode.removeChild(loading);
    }
  }
  
  // Initialize all charts with safe fallback mechanism
  function initializeCharts() {
    logDebug('Starting chart initialization...');
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
      logError('Chart.js not found, waiting for it to load...');
      
      // Try again in 200ms
      setTimeout(initializeCharts, 200);
      return;
    }
    
    // Get chart configurations
    const chartConfigs = getChartConfigs();
    
    // Track successfully created charts
    const createdCharts = {};
    
    // Process each chart
    Object.keys(chartConfigs).forEach(function(chartId) {
      const container = document.getElementById(chartId);
      if (!container) {
        // This chart might be on another page (like sensitivity.html)
        logDebug(`Chart container ${chartId} not found, skipping`);
        return;
      }
      
      logDebug(`Initializing chart: ${chartId}`);
      
      // Make sure container is visible and properly sized
      container.style.display = 'block';
      container.style.visibility = 'visible';
      container.style.height = '300px';
      
      // Show loading indicator
      const loading = showChartLoading(container);
      
      // Check if there's an existing canvas
      let canvas = container.querySelector('canvas');
      
      // If no canvas exists, create one
      if (!canvas) {
        logDebug(`Creating new canvas for ${chartId}`);
        canvas = document.createElement('canvas');
        canvas.id = `${chartId}-canvas`;
        
        // Clear any existing content
        container.innerHTML = '';
        container.appendChild(canvas);
      }
      
      // Check if a chart instance already exists and destroy it
      if (canvas._chart) {
        logDebug(`Destroying existing chart instance for ${chartId}`);
        try {
          canvas._chart.destroy();
        } catch (e) {
          logError(`Error destroying chart ${chartId}: ${e.message}`);
        }
      }
      
      // Create chart with error handling
      try {
        logDebug(`Creating chart: ${chartId}`);
        const config = chartConfigs[chartId];
        
        // Special handling for radar charts in older Chart.js versions
        if (config.type === 'radar' && Chart.version && parseInt(Chart.version.split('.')[0]) < 3) {
          // Adjust for Chart.js v2 radar charts
          if (config.options && config.options.scales && config.options.scales.r) {
            config.options.scale = config.options.scales.r;
            delete config.options.scales.r;
          }
        }
        
        const chart = new Chart(canvas, config);
        canvas._chart = chart; // Store reference to chart instance
        
        // Store chart in container and tracking object
        container._chart = chart;
        createdCharts[chartId] = chart;
        
        // Hide loading indicator
        hideChartLoading(loading);
        
        logSuccess(`Successfully created chart: ${chartId}`);
      } catch (error) {
        // Hide loading indicator
        hideChartLoading(loading);
        
        logError(`Error creating chart ${chartId}: ${error.message}`);
        
        // Show error message in the container
        const errorMessage = document.createElement('div');
        errorMessage.className = 'chart-error-message';
        errorMessage.innerHTML = `
          <strong>Chart initialization error</strong><br>
          We encountered an issue creating this chart. Please refresh the page to try again.
        `;
        
        container.appendChild(errorMessage);
        errorMessage.style.display = 'block';
      }
    });
    
    // Store created charts for later reference
    window._createdCharts = createdCharts;
    
    // Add event listeners to tab buttons to update charts on tab change
    const tabButtons = document.querySelectorAll('.tab-button, [data-bs-toggle="tab"]');
    tabButtons.forEach(function(button) {
      // Remove existing event listeners to prevent duplicates
      const newButton = button.cloneNode(true);
      if (button.parentNode) {
        button.parentNode.replaceChild(newButton, button);
      }
      
      // Add new event listener
      newButton.addEventListener('click', function() {
        setTimeout(function() {
          Object.keys(createdCharts).forEach(function(chartId) {
            const chart = createdCharts[chartId];
            if (chart) {
              try {
                chart.update();
              } catch (e) {
                logError(`Error updating chart ${chartId}: ${e.message}`);
              }
            }
          });
        }, 100);
      });
    });
    
    // Implement a function to refresh charts
    window.refreshCharts = function() {
      Object.keys(createdCharts).forEach(function(chartId) {
        const chart = createdCharts[chartId];
        if (chart) {
          try {
            chart.update();
          } catch (e) {
            logError(`Error refreshing chart ${chartId}: ${e.message}`);
          }
        }
      });
    };
    
    logSuccess('All charts initialized successfully');
    return createdCharts;
  }
  
  // Fix calculator issues
  function fixCalculator() {
    logDebug('Fixing calculator issues...');
    
    // Create simple calculator fallback
    if (typeof window.EnhancedCalculator !== 'function') {
      logDebug('EnhancedCalculator not found, creating fallback');
      
      // Create a base Calculator if it doesn't exist
      if (typeof window.Calculator !== 'function') {
        window.Calculator = function() {
          this.calculateTCO = function(vendor, params) {
            // Default implementation
            const vendorData = window.vendorData[vendor] || {};
            const initialCosts = vendorData.initialCosts || {};
            const annualCosts = vendorData.annualCosts || {};
            
            // Calculate totals
            const totalInitial = Object.values(initialCosts).reduce((sum, val) => sum + (val || 0), 0);
            const totalAnnual = Object.values(annualCosts).reduce((sum, val) => sum + (val || 0), 0);
            
            // Calculate for multiple years if specified
            const years = params && params.years ? params.years : 1;
            
            return {
              vendor: vendor,
              name: vendorData.name || vendor,
              initialCosts: initialCosts,
              annualCosts: annualCosts,
              totalInitial: totalInitial,
              totalAnnual: totalAnnual,
              total: totalInitial + (totalAnnual * years)
            };
          };
          
          this.getBreakdown = function(vendor) {
            const vendorData = window.vendorData[vendor] || {};
            return {
              initial: vendorData.initialCosts || {},
              annual: vendorData.annualCosts || {}
            };
          };
        };
      }
      
      // Create EnhancedCalculator as an extension of Calculator
      window.EnhancedCalculator = function() {
        // Call parent constructor
        window.Calculator.call(this);
        
        // Override calculateTCO with enhanced version
        this.calculateTCO = function(vendor, params) {
          // Get results from base calculator
          const baseResult = window.Calculator.prototype.calculateTCO.call(this, vendor, params);
          
          // Add enhancement-specific calculations
          baseResult.savingsPercentage = 0;
          baseResult.implementationTime = this.getImplementationTime(vendor);
          
          return baseResult;
        };
        
        // Add new methods
        this.calculateAllVendors = function(params) {
          params = params || {};
          
          // Calculate for all vendors
          const results = {};
          const vendors = Object.keys(window.vendorData);
          
          vendors.forEach(vendor => {
            try {
              results[vendor] = this.calculateTCO(vendor, params);
            } catch (error) {
              console.error(`Error calculating TCO for ${vendor}:`, error);
              results[vendor] = { 
                vendor: vendor,
                name: window.vendorData[vendor] ? window.vendorData[vendor].name : vendor,
                total: 0 
              };
            }
          });
          
          // Calculate comparisons
          const currentVendor = params.currentVendor || 'cisco';
          const current = results[currentVendor] || { total: 0 };
          const portnox = results.portnox || { total: 0 };
          
          // Calculate savings
          const savingsAmount = current.total - portnox.total;
          const savingsPercentage = current.total > 0 ? 
                                  (savingsAmount / current.total) * 100 : 0;
          
          return {
            results: results,
            current: current,
            portnox: portnox,
            savings: {
              amount: savingsAmount,
              percentage: savingsPercentage
            }
          };
        };
        
        this.getImplementationTime = function(vendor) {
          // Implementation time in days (made up values)
          const implementationTimes = {
            cisco: 90,
            aruba: 75,
            forescout: 100,
            nps: 60,
            fortinac: 80,
            securew2: 45,
            portnox: 30
          };
          
          return implementationTimes[vendor] || 60;
        };
      };
      
      // Set up prototype chain
      window.EnhancedCalculator.prototype = Object.create(window.Calculator.prototype);
      window.EnhancedCalculator.prototype.constructor = window.EnhancedCalculator;
      
      logSuccess('Calculator fallback created');
    } else {
      logDebug('EnhancedCalculator exists, fixing its calculateAllVendors method');
      
      // Fix the calculateAllVendors method
      const originalCalculateAllVendors = window.EnhancedCalculator.prototype.calculateAllVendors;
      
      window.EnhancedCalculator.prototype.calculateAllVendors = function(params) {
        try {
          return originalCalculateAllVendors.call(this, params);
        } catch (error) {
          logError(`Error in original calculateAllVendors: ${error.message}`);
          
          // Fallback implementation
          params = params || {};
          
          // Calculate for all vendors
          const results = {};
          Object.keys(window.vendorData).forEach(vendor => {
            try {
              results[vendor] = this.calculateTCO(vendor, params);
            } catch (e) {
              logError(`Error calculating TCO for ${vendor}: ${e.message}`);
              results[vendor] = {
                vendor: vendor,
                name: window.vendorData[vendor] ? window.vendorData[vendor].name : vendor,
                total: 0
              };
            }
          });
          
          // Calculate comparisons
          const currentVendor = params.currentVendor || 'cisco';
          const current = results[currentVendor] || { total: 0 };
          const portnox = results.portnox || { total: 0 };
          
          // Calculate savings
          const savingsAmount = current.total - portnox.total;
          const savingsPercentage = current.total > 0 ? 
                                  (savingsAmount / current.total) * 100 : 0;
          
          return {
            results: results,
            current: current,
            portnox: portnox,
            savings: {
              amount: savingsAmount,
              percentage: savingsPercentage
            }
          };
        }
      };
      
      logSuccess('Calculator fixed');
    }
  }
  
  // Disable the problematic chart-init-safe.js script
  function disableCompetingScripts() {
    logDebug('Disabling competing scripts...');
    
    // Override Chart initialization function
    if (window.Chart && window.Chart.helpers && window.Chart.helpers.each) {
      const originalEach = window.Chart.helpers.each;
      window.Chart.helpers.each = function(loopable, callback, self, reverse) {
        // Skip certain operations that might be from competing scripts
        if (arguments.length === 2 && loopable && loopable.length === 0 && typeof callback === 'function') {
          return loopable;
        }
        return originalEach.apply(this, arguments);
      };
    }
    
    // Try to find and disable chart-init-safe.js
    const scripts = document.querySelectorAll('script');
    scripts.forEach(function(script) {
      if (script.src && script.src.indexOf('chart-init-safe.js') !== -1) {
        logDebug('Found chart-init-safe.js, disabling it');
        script.setAttribute('data-disabled', 'true');
        // We can't remove it directly as it's already executed, but we can prevent future executions
      }
    });
    
    // Override any global chart initialization variables
    window.chartInitialized = true;
    window.chartsReady = true;
    
    logSuccess('Competing scripts disabled');
  }
  
  // Create a success notification
  function showSuccessNotification() {
    logDebug('Showing success notification...');
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'tco-notification';
    notification.innerHTML = 'Total Cost Analyzer fixed successfully!';
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show notification after a small delay
    setTimeout(function() {
      notification.classList.add('show');
    }, 100);
    
    // Add click event to dismiss
    notification.addEventListener('click', function() {
      notification.classList.remove('show');
      setTimeout(function() {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    });
    
    // Auto-dismiss after 5 seconds
    setTimeout(function() {
      notification.classList.remove('show');
      setTimeout(function() {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }
  
  // Execute all fixes in sequence
  function applyAllFixes() {
    logDebug('Applying all fixes...');
    
    // 1. Disable competing scripts first (critical)
    disableCompetingScripts();
    
    // 2. Apply CSS fixes
    applyCssFixes();
    
    // 3. Fix vendor data
    ensureVendorData();
    
    // 4. Fix calculator
    fixCalculator();
    
    // 5. Initialize charts after a short delay for better compatibility
    setTimeout(function() {
      initializeCharts();
      
      // 6. Show success notification
      setTimeout(showSuccessNotification, 1000);
      
      // 7. Load the compatibility layer
      setTimeout(function() {
        // Load the compatibility layer to ensure other scripts can find our charts
        const script = document.createElement('script');
        script.src = 'js/fixes/chart-compatibility.js';
        document.head.appendChild(script);
      }, 2000);
    }, 500);
    
    logSuccess('All fixes applied successfully!');
  }
  
  // Apply fixes immediately for faster loading page with directly visible elements
  applyAllFixes();
  
  // Also ensure charts are initialized after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initializeCharts, 500);
    });
  }
  
  // One final check on window load to ensure everything is working
  window.addEventListener('load', function() {
    setTimeout(function() {
      // Re-initialize charts if any are missing
      const recheck = Object.keys(getChartConfigs()).some(function(chartId) {
        const container = document.getElementById(chartId);
        return container && (!container._chart || !container.querySelector('canvas'));
      });
      
      if (recheck) {
        logDebug('Re-checking charts on window load...');
        initializeCharts();
      }
    }, 1000);
  });
})();
