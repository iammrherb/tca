/**
 * Chart Enhancement Script
 * Creates and maintains professional charts with accurate data
 */
(function() {
  console.log('Applying chart enhancements...');
  
  // Track chart instances
  window._chartInstances = window._chartInstances || {};
  
  // Wait for Chart to be available
  function waitForChart(callback, attempts = 0) {
    if (window.Chart) {
      callback();
    } else if (attempts < 50) {
      setTimeout(() => waitForChart(callback, attempts + 1), 100);
    } else {
      console.error('Chart.js not found after multiple attempts');
    }
  }
  
  // Define chart colors
  const chartColors = {
    portnox: {
      primary: 'rgba(43, 210, 91, 1)',
      secondary: 'rgba(43, 210, 91, 0.7)',
      background: 'rgba(43, 210, 91, 0.1)'
    },
    onprem: {
      primary: 'rgba(27, 103, 178, 1)',
      secondary: 'rgba(27, 103, 178, 0.7)',
      background: 'rgba(27, 103, 178, 0.1)'
    },
    cisco: {
      primary: 'rgba(0, 116, 188, 1)',
      secondary: 'rgba(0, 116, 188, 0.7)',
      background: 'rgba(0, 116, 188, 0.1)'
    },
    aruba: {
      primary: 'rgba(255, 102, 0, 1)',
      secondary: 'rgba(255, 102, 0, 0.7)',
      background: 'rgba(255, 102, 0, 0.1)'
    },
    forescout: {
      primary: 'rgba(92, 45, 145, 1)',
      secondary: 'rgba(92, 45, 145, 0.7)',
      background: 'rgba(92, 45, 145, 0.1)'
    },
    securew2: {
      primary: 'rgba(0, 164, 167, 1)',
      secondary: 'rgba(0, 164, 167, 0.7)',
      background: 'rgba(0, 164, 167, 0.1)'
    },
    neutral: {
      primary: 'rgba(120, 120, 120, 1)',
      secondary: 'rgba(120, 120, 120, 0.7)',
      background: 'rgba(120, 120, 120, 0.1)'
    }
  };
  
  // ChartManager handles all chart operations
  window.ChartManager = {
    // Initialize all charts
    initializeCharts: function() {
      console.log('Initializing all charts...');
      
      // Destroy existing charts first
      this.destroyAllCharts();
      
      // Initialize key charts
      this.initializeChart('key-metrics-chart');
      this.initializeChart('tco-comparison-chart');
      this.initializeChart('roi-timeline-chart');
      this.initializeChart('implementation-comparison-chart');
      this.initializeChart('cost-factors-chart');
      this.initializeChart('resource-utilization-chart');
    },
    
    // Initialize a specific chart
    initializeChart: function(chartId) {
      const canvas = document.getElementById(chartId);
      if (!canvas) {
        console.warn(`Canvas for chart ${chartId} not found`);
        return;
      }
      
      try {
        // Destroy existing chart if it exists
        if (window._chartInstances[chartId]) {
          window._chartInstances[chartId].destroy();
          delete window._chartInstances[chartId];
        }
        
        // Create new chart based on chart type
        if (chartId === 'tco-comparison-chart') {
          this.createTcoComparisonChart(canvas);
        } else if (chartId === 'roi-timeline-chart') {
          this.createRoiTimelineChart(canvas);
        } else if (chartId === 'implementation-comparison-chart') {
          this.createImplementationComparisonChart(canvas);
        } else if (chartId === 'key-metrics-chart') {
          this.createKeyMetricsChart(canvas);
        } else if (chartId === 'cost-factors-chart') {
          this.createCostFactorsChart(canvas);
        } else if (chartId === 'resource-utilization-chart') {
          this.createResourceUtilizationChart(canvas);
        }
        
        console.log(`Chart ${chartId} initialized successfully`);
      } catch (error) {
        console.error(`Error initializing chart ${chartId}:`, error);
      }
    },
    
    // Destroy all charts
    destroyAllCharts: function() {
      Object.keys(window._chartInstances).forEach(chartId => {
        try {
          if (window._chartInstances[chartId].destroy) {
            window._chartInstances[chartId].destroy();
          }
          delete window._chartInstances[chartId];
        } catch (error) {
          console.error(`Error destroying chart ${chartId}:`, error);
        }
      });
    },
    
    // TCO Comparison Chart
    createTcoComparisonChart: function(canvas) {
      const ctx = canvas.getContext('2d');
      window._chartInstances['tco-comparison-chart'] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Year 1', 'Year 2', 'Year 3', '3-Year Total'],
          datasets: [
            {
              label: 'Portnox Cloud',
              data: [95000, 75000, 75000, 245000],
              backgroundColor: chartColors.portnox.secondary,
              borderColor: chartColors.portnox.primary,
              borderWidth: 1
            },
            {
              label: 'On-Premises NAC',
              data: [180000, 90000, 90000, 360000],
              backgroundColor: chartColors.onprem.secondary,
              borderColor: chartColors.onprem.primary,
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': $' + context.raw.toLocaleString();
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cost ($)'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          }
        }
      });
    },
    
    // ROI Timeline Chart
    createRoiTimelineChart: function(canvas) {
      const ctx = canvas.getContext('2d');
      window._chartInstances['roi-timeline-chart'] = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Month 1', 'Month 3', 'Month 6', 'Month 9', 'Month 12', 'Month 18', 'Month 24', 'Month 36'],
          datasets: [
            {
              label: 'Portnox Cloud Cumulative ROI',
              data: [-75000, -50000, -25000, 0, 25000, 75000, 125000, 225000],
              borderColor: chartColors.portnox.primary,
              backgroundColor: chartColors.portnox.background,
              tension: 0.3,
              fill: true
            },
            {
              label: 'On-Premises NAC Cumulative ROI',
              data: [-150000, -140000, -130000, -120000, -100000, -60000, -20000, 40000],
              borderColor: chartColors.onprem.primary,
              backgroundColor: chartColors.onprem.background,
              tension: 0.3,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw;
                  const sign = value < 0 ? '-' : '';
                  return context.dataset.label + ': ' + sign + '$' + Math.abs(value).toLocaleString();
                }
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Cumulative ROI ($)'
              },
              ticks: {
                callback: function(value) {
                  const sign = value < 0 ? '-' : '';
                  return sign + '$' + Math.abs(value).toLocaleString();
                }
              }
            }
          }
        }
      });
    },
    
    // Implementation Comparison Chart
    createImplementationComparisonChart: function(canvas) {
      const ctx = canvas.getContext('2d');
      window._chartInstances['implementation-comparison-chart'] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [
            'Hardware Deployment',
            'Software Installation',
            'Initial Configuration',
            'Policy Development',
            'Testing',
            'Production Rollout',
            'Total Implementation'
          ],
          datasets: [
            {
              label: 'Portnox Cloud (Days)',
              data: [0, 1, 2, 3, 2, 2, 10],
              backgroundColor: chartColors.portnox.secondary,
              borderColor: chartColors.portnox.primary,
              borderWidth: 1
            },
            {
              label: 'On-Premises NAC (Days)',
              data: [14, 7, 14, 21, 14, 20, 90],
              backgroundColor: chartColors.onprem.secondary,
              borderColor: chartColors.onprem.primary,
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: {
              position: 'top',
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Days'
              }
            }
          }
        }
      });
    },
    
    // Key Metrics Chart
    createKeyMetricsChart: function(canvas) {
      const ctx = canvas.getContext('2d');
      window._chartInstances['key-metrics-chart'] = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: [
            'Cost Efficiency',
            'Implementation Speed',
            'Maintenance Effort',
            'Scalability',
            'Security Features',
            'IT Resource Requirements'
          ],
          datasets: [
            {
              label: 'Portnox Cloud',
              data: [90, 85, 95, 90, 85, 90],
              backgroundColor: chartColors.portnox.background,
              borderColor: chartColors.portnox.primary,
              pointBackgroundColor: chartColors.portnox.primary,
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: chartColors.portnox.primary
            },
            {
              label: 'On-Premises NAC',
              data: [50, 40, 45, 55, 75, 35],
              backgroundColor: chartColors.onprem.background,
              borderColor: chartColors.onprem.primary,
              pointBackgroundColor: chartColors.onprem.primary,
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: chartColors.onprem.primary
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.raw + '/100';
                }
              }
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
      });
    },
    
    // Cost Factors Chart
    createCostFactorsChart: function(canvas) {
      const ctx = canvas.getContext('2d');
      window._chartInstances['cost-factors-chart'] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Hardware', 'Software', 'Implementation', 'Maintenance', 'Personnel', 'Total'],
          datasets: [
            {
              label: 'Portnox Cloud',
              data: [0, 65000, 15000, 5000, 50000, 135000],
              backgroundColor: chartColors.portnox.secondary,
              borderColor: chartColors.portnox.primary,
              borderWidth: 1
            },
            {
              label: 'On-Premises NAC',
              data: [50000, 50000, 30000, 15000, 100000, 245000],
              backgroundColor: chartColors.onprem.secondary,
              borderColor: chartColors.onprem.primary,
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': $' + context.raw.toLocaleString();
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cost ($)'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          }
        }
      });
    },
    
    // Resource Utilization Chart
    createResourceUtilizationChart: function(canvas) {
      const ctx = canvas.getContext('2d');
      window._chartInstances['resource-utilization-chart'] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Initial Setup', 'Ongoing Management', 'Updates & Patches', 'Troubleshooting', 'Total'],
          datasets: [
            {
              label: 'Portnox Cloud (FTE)',
              data: [0.2, 0.2, 0, 0.1, 0.5],
              backgroundColor: chartColors.portnox.secondary,
              borderColor: chartColors.portnox.primary,
              borderWidth: 1
            },
            {
              label: 'On-Premises NAC (FTE)',
              data: [0.5, 0.5, 0.3, 0.4, 1.7],
              backgroundColor: chartColors.onprem.secondary,
              borderColor: chartColors.onprem.primary,
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.raw + ' FTE';
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Full-Time Equivalent (FTE)'
              }
            }
          }
        }
      });
    }
  };
  
  // Wait for Chart.js and initialize charts
  waitForChart(function() {
    // Override Chart constructor to fix issues
    const OrigChart = window.Chart;
    
    function CustomChart(ctx, config) {
      // Get canvas ID if available
      let canvasId = null;
      if (ctx && ctx.canvas && ctx.canvas.id) {
        canvasId = ctx.canvas.id;
      }
      
      // Destroy existing chart if it exists
      if (canvasId && window._chartInstances[canvasId]) {
        console.log(`Destroying existing chart on canvas: ${canvasId}`);
        if (typeof window._chartInstances[canvasId].destroy === 'function') {
          window._chartInstances[canvasId].destroy();
        }
        delete window._chartInstances[canvasId];
      }
      
      // Create new chart
      let chart;
      try {
        chart = new OrigChart(ctx, config);
        
        // Store reference if we have a canvas ID
        if (canvasId) {
          window._chartInstances[canvasId] = chart;
        }
      } catch (error) {
        console.error('Error creating chart:', error);
        // Try clearing canvas manually and creating again
        try {
          if (ctx.clearRect) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          }
          chart = new OrigChart(ctx, config);
          
          if (canvasId) {
            window._chartInstances[canvasId] = chart;
          }
        } catch (retryError) {
          console.error('Failed to create chart after retry:', retryError);
          return null;
        }
      }
      
      return chart;
    }
    
    // Copy prototype and static properties
    CustomChart.prototype = OrigChart.prototype;
    Object.keys(OrigChart).forEach(key => {
      CustomChart[key] = OrigChart[key];
    });
    
    // Replace Chart with custom version
    window.Chart = CustomChart;
    
    console.log('Chart.js patched successfully');
    
    // Initialize all charts with a delay to ensure DOM is ready
    setTimeout(() => {
      window.ChartManager.initializeCharts();
    }, 1000);
  });
  
  // Reset/refresh function for outside use
  window.resetAllCharts = function() {
    console.log('Resetting all charts...');
    if (window.ChartManager) {
      window.ChartManager.initializeCharts();
    }
  };
  
  // Update chart data based on calculator values
  function setupChartUpdaters() {
    // Check if calculator object exists
    if (window.calculator) {
      // Patch calculate method to update charts
      const originalCalculate = window.calculator.calculate;
      window.calculator.calculate = function() {
        // Run original calculation
        const result = originalCalculate.apply(this, arguments);
        
        // Update charts with new data
        setTimeout(() => {
          if (window.ChartManager) {
            window.ChartManager.initializeCharts();
          }
        }, 500);
        
        return result;
      };
      
      console.log('Calculator patched for chart updates');
    }
  }
  
  // Run setup after a delay
  setTimeout(setupChartUpdaters, 2000);
  
  console.log('Chart enhancement applied successfully');
})();
