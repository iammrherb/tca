/**
 * Non-Conflict Chart Handler
 * A complete chart initialization system that avoids conflicts
 */
var TotalCostCharts = (function() {
  console.log("Initializing Total Cost Charts");
  
  // Store chart instances
  var chartInstances = {};
  
  // Chart colors
  var colors = {
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
    },
    categories: [
      '#1B67B2', // Blue
      '#65BD44', // Green
      '#F6921E', // Orange
      '#662D91', // Purple
      '#FFC20E', // Yellow
      '#EE3124', // Red
      '#00A4EF'  // Light Blue
    ]
  };
  
  // Check if Chart.js is available
  function isChartJsAvailable() {
    return typeof Chart !== 'undefined';
  }
  
  // Safely destroy a chart if it exists
  function safelyDestroyChart(canvasId) {
    if (chartInstances[canvasId]) {
      try {
        chartInstances[canvasId].destroy();
        console.log("Destroyed existing chart on canvas: " + canvasId);
      } catch (error) {
        console.warn("Error destroying chart: ", error);
      }
      delete chartInstances[canvasId];
    }
    
    // Also check for Chart.js's internal registry if available
    if (typeof Chart !== 'undefined' && Chart.getChart) {
      try {
        var existingChart = Chart.getChart(canvasId);
        if (existingChart) {
          existingChart.destroy();
          console.log("Destroyed Chart.js registered chart on canvas: " + canvasId);
        }
      } catch (error) {
        // Chart.js 3.x might not have getChart method
        console.log("Could not use Chart.getChart method");
      }
    }
  }
  
  // Initialize all charts
  function initAllCharts() {
    if (!isChartJsAvailable()) {
      console.error("Chart.js is not available");
      return;
    }
    
    console.log("Initializing all charts...");
    
    // Initialize each chart type
    initTcoComparisonChart();
    initCumulativeCostChart();
    initCostBreakdownCharts();
    initFeatureComparisonChart();
    initImplementationComparisonChart();
    initRoiChart();
    initSensitivityCharts();
    
    console.log("All charts initialized");
  }
  
  // Initialize TCO comparison chart
  function initTcoComparisonChart() {
    var canvas = document.getElementById('tco-comparison-chart');
    if (!canvas) {
      console.warn("TCO comparison chart canvas not found");
      return null;
    }
    
    // Safely destroy existing chart
    safelyDestroyChart('tco-comparison-chart');
    
    var ctx = canvas.getContext('2d');
    var chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Cisco ISE', 'Portnox Cloud'],
        datasets: [{
          label: 'Total Cost of Ownership',
          data: [420000, 220000],
          backgroundColor: [colors.vendors.cisco, colors.vendors.portnox]
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
    
    // Store chart instance
    chartInstances['tco-comparison-chart'] = chart;
    console.log("TCO comparison chart initialized");
    return chart;
  }
  
  // Initialize cumulative cost chart
  function initCumulativeCostChart() {
    var canvas = document.getElementById('cumulative-cost-chart');
    if (!canvas) {
      console.warn("Cumulative cost chart canvas not found");
      return null;
    }
    
    // Safely destroy existing chart
    safelyDestroyChart('cumulative-cost-chart');
    
    var ctx = canvas.getContext('2d');
    var chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Year 1', 'Year 2', 'Year 3'],
        datasets: [
          {
            label: 'Cisco ISE',
            data: [280000, 350000, 420000],
            borderColor: colors.vendors.cisco,
            backgroundColor: 'rgba(27, 103, 178, 0.1)',
            fill: true
          },
          {
            label: 'Portnox Cloud',
            data: [140000, 180000, 220000],
            borderColor: colors.vendors.portnox,
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
    
    // Store chart instance
    chartInstances['cumulative-cost-chart'] = chart;
    console.log("Cumulative cost chart initialized");
    return chart;
  }
  
  // Initialize cost breakdown charts
  function initCostBreakdownCharts() {
    var currentCanvas = document.getElementById('current-breakdown-chart');
    var portnoxCanvas = document.getElementById('alternative-breakdown-chart');
    
    if (currentCanvas) {
      // Safely destroy existing chart
      safelyDestroyChart('current-breakdown-chart');
      
      var currentCtx = currentCanvas.getContext('2d');
      var currentChart = new Chart(currentCtx, {
        type: 'doughnut',
        data: {
          labels: ['Hardware', 'Software', 'Maintenance', 'Implementation', 'Personnel'],
          datasets: [{
            data: [70000, 120000, 60000, 80000, 70000],
            backgroundColor: colors.categories
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
      
      // Store chart instance
      chartInstances['current-breakdown-chart'] = currentChart;
      console.log("Current breakdown chart initialized");
    }
    
    if (portnoxCanvas) {
      // Safely destroy existing chart
      safelyDestroyChart('alternative-breakdown-chart');
      
      var portnoxCtx = portnoxCanvas.getContext('2d');
      var portnoxChart = new Chart(portnoxCtx, {
        type: 'doughnut',
        data: {
          labels: ['Hardware', 'Software', 'Maintenance', 'Implementation', 'Personnel'],
          datasets: [{
            data: [0, 150000, 20000, 30000, 20000],
            backgroundColor: colors.categories
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
      
      // Store chart instance
      chartInstances['alternative-breakdown-chart'] = portnoxChart;
      console.log("Portnox breakdown chart initialized");
    }
  }
  
  // Initialize feature comparison chart
  function initFeatureComparisonChart() {
    var canvas = document.getElementById('feature-comparison-chart');
    if (!canvas) {
      console.warn("Feature comparison chart canvas not found");
      return null;
    }
    
    // Safely destroy existing chart
    safelyDestroyChart('feature-comparison-chart');
    
    var ctx = canvas.getContext('2d');
    var chart = new Chart(ctx, {
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
            label: 'Cisco ISE',
            data: [9, 9, 7, 8, 5, 7, 5],
            backgroundColor: 'rgba(27, 103, 178, 0.2)',
            borderColor: colors.vendors.cisco,
            pointBackgroundColor: colors.vendors.cisco
          },
          {
            label: 'Portnox Cloud',
            data: [8, 9, 8, 9, 10, 9, 9],
            backgroundColor: 'rgba(101, 189, 68, 0.2)',
            borderColor: colors.vendors.portnox,
            pointBackgroundColor: colors.vendors.portnox
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            borderWidth: 2
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Feature Comparison',
            font: { size: 16 }
          }
        },
        scales: {
          r: {
            angleLines: {
              display: true
            },
            suggestedMin: 0,
            suggestedMax: 10,
            ticks: {
              stepSize: 2
            }
          }
        }
      }
    });
    
    // Store chart instance
    chartInstances['feature-comparison-chart'] = chart;
    console.log("Feature comparison chart initialized");
    return chart;
  }
  
  // Initialize implementation comparison chart
  function initImplementationComparisonChart() {
    var canvas = document.getElementById('implementation-comparison-chart');
    if (!canvas) {
      console.warn("Implementation comparison chart canvas not found");
      return null;
    }
    
    // Safely destroy existing chart
    safelyDestroyChart('implementation-comparison-chart');
    
    var ctx = canvas.getContext('2d');
    var chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Planning', 'Hardware', 'Software', 'Configuration', 'Testing', 'Training', 'Rollout'],
        datasets: [
          {
            label: 'Cisco ISE',
            data: [15, 20, 10, 25, 20, 15, 20],
            backgroundColor: colors.vendors.cisco
          },
          {
            label: 'Portnox Cloud',
            data: [10, 0, 0, 15, 10, 5, 10],
            backgroundColor: colors.vendors.portnox
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
    
    // Store chart instance
    chartInstances['implementation-comparison-chart'] = chart;
    console.log("Implementation comparison chart initialized");
    return chart;
  }
  
  // Initialize ROI chart
  function initRoiChart() {
    var canvas = document.getElementById('roi-chart');
    if (!canvas) {
      console.warn("ROI chart canvas not found");
      return null;
    }
    
    // Safely destroy existing chart
    safelyDestroyChart('roi-chart');
    
    var ctx = canvas.getContext('2d');
    var chart = new Chart(ctx, {
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
    
    // Store chart instance
    chartInstances['roi-chart'] = chart;
    console.log("ROI chart initialized");
    return chart;
  }
  
  // Initialize sensitivity charts
  function initSensitivityCharts() {
    var sensitivityCanvas = document.getElementById('sensitivity-chart');
    var savingsCanvas = document.getElementById('savings-impact-chart');
    
    if (sensitivityCanvas) {
      // Safely destroy existing chart
      safelyDestroyChart('sensitivity-chart');
      
      var sensitivityCtx = sensitivityCanvas.getContext('2d');
      var sensitivityChart = new Chart(sensitivityCtx, {
        type: 'line',
        data: {
          labels: ['500', '1000', '1500', '2000', '2500', '3000', '3500', '4000', '4500', '5000'],
          datasets: [
            {
              label: 'Cisco ISE',
              data: [210000, 280000, 350000, 420000, 490000, 560000, 630000, 700000, 770000, 840000],
              borderColor: colors.vendors.cisco,
              backgroundColor: 'transparent',
              borderWidth: 2,
              tension: 0.1
            },
            {
              label: 'Aruba ClearPass',
              data: [175000, 233000, 291000, 350000, 408000, 466000, 525000, 583000, 641000, 700000],
              borderColor: colors.vendors.aruba,
              backgroundColor: 'transparent',
              borderWidth: 2,
              tension: 0.1
            },
            {
              label: 'Portnox Cloud',
              data: [110000, 140000, 170000, 200000, 230000, 260000, 290000, 320000, 350000, 380000],
              borderColor: colors.vendors.portnox,
              backgroundColor: 'transparent',
              borderWidth: 3,
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'TCO Sensitivity to Device Count',
              font: { size: 16 }
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
                text: 'Device Count'
              }
            }
          }
        }
      });
      
      // Store chart instance
      chartInstances['sensitivity-chart'] = sensitivityChart;
      console.log("Sensitivity chart initialized");
    }
    
    if (savingsCanvas) {
      // Safely destroy existing chart
      safelyDestroyChart('savings-impact-chart');
      
      var savingsCtx = savingsCanvas.getContext('2d');
      var savingsChart = new Chart(savingsCtx, {
        type: 'line',
        data: {
          labels: ['500', '1000', '1500', '2000', '2500', '3000', '3500', '4000', '4500', '5000'],
          datasets: [{
            label: 'Average Savings with Portnox Cloud',
            data: [45, 48, 51, 53, 55, 56, 57, 58, 59, 60],
            borderColor: colors.vendors.portnox,
            backgroundColor: 'rgba(101, 189, 68, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Impact of Device Count on Cost Savings',
              font: { size: 16 }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return 'Savings: ' + context.raw + '%';
                }
              }
            }
          },
          scales: {
            y: {
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
                text: 'Device Count'
              }
            }
          }
        }
      });
      
      // Store chart instance
      chartInstances['savings-impact-chart'] = savingsChart;
      console.log("Savings impact chart initialized");
    }
  }
  
  // Update charts based on vendor
  function updateChartsForVendor(vendor) {
    console.log("Updating charts for vendor: " + vendor);
    
    // Vendor names
    var vendorNames = {
      cisco: 'Cisco ISE',
      aruba: 'Aruba ClearPass',
      forescout: 'Forescout',
      fortinac: 'FortiNAC',
      nps: 'Microsoft NPS',
      securew2: 'SecureW2',
      portnox: 'Portnox Cloud',
      noNac: 'No NAC'
    };
    
    // Mock data for TCO comparison
    var tcoData = {
      cisco: { costs: [420000, 220000] },
      aruba: { costs: [380000, 220000] },
      forescout: { costs: [400000, 220000] },
      fortinac: { costs: [350000, 220000] },
      nps: { costs: [240000, 220000] },
      securew2: { costs: [290000, 220000] },
      noNac: { costs: [160000, 220000] }
    };
    
    // Mock data for cumulative costs
    var cumulativeData = {
      cisco: { current: [280000, 350000, 420000], portnox: [140000, 180000, 220000] },
      aruba: { current: [250000, 315000, 380000], portnox: [140000, 180000, 220000] },
      forescout: { current: [270000, 335000, 400000], portnox: [140000, 180000, 220000] },
      fortinac: { current: [230000, 290000, 350000], portnox: [140000, 180000, 220000] },
      nps: { current: [160000, 200000, 240000], portnox: [140000, 180000, 220000] },
      securew2: { current: [190000, 240000, 290000], portnox: [140000, 180000, 220000] },
      noNac: { current: [80000, 120000, 160000], portnox: [140000, 180000, 220000] }
    };
    
    // Mock data for cost breakdown
    var breakdownData = {
      cisco: { current: [70000, 120000, 60000, 80000, 70000], portnox: [0, 150000, 20000, 30000, 20000] },
      aruba: { current: [60000, 120000, 50000, 70000, 70000], portnox: [0, 150000, 20000, 30000, 20000] },
      forescout: { current: [80000, 110000, 60000, 70000, 70000], portnox: [0, 150000, 20000, 30000, 20000] },
      fortinac: { current: [50000, 110000, 50000, 60000, 80000], portnox: [0, 150000, 20000, 30000, 20000] },
      nps: { current: [20000, 30000, 40000, 70000, 80000], portnox: [0, 150000, 20000, 30000, 20000] },
      securew2: { current: [10000, 130000, 40000, 50000, 60000], portnox: [0, 150000, 20000, 30000, 20000] },
      noNac: { current: [0, 0, 0, 0, 160000], portnox: [0, 150000, 20000, 30000, 20000] }
    };
    
    // Mock data for feature comparison
    var featureData = {
      cisco: [9, 9, 7, 8, 5, 7, 5],
      aruba: [8, 8, 8, 7, 6, 7, 6],
      forescout: [9, 8, 6, 7, 5, 6, 5],
      fortinac: [7, 7, 7, 6, 6, 6, 6],
      nps: [5, 6, 4, 5, 3, 4, 3],
      securew2: [7, 7, 8, 8, 8, 7, 8],
      noNac: [1, 1, 1, 1, 1, 1, 1]
    };
    
    // Mock data for implementation comparison
    var implementationData = {
      cisco: { current: [15, 20, 10, 25, 20, 15, 20], portnox: [10, 0, 0, 15, 10, 5, 10] },
      aruba: { current: [12, 15, 10, 20, 15, 10, 15], portnox: [10, 0, 0, 15, 10, 5, 10] },
      forescout: { current: [15, 20, 10, 20, 20, 15, 20], portnox: [10, 0, 0, 15, 10, 5, 10] },
      fortinac: { current: [12, 15, 10, 15, 15, 10, 15], portnox: [10, 0, 0, 15, 10, 5, 10] },
      nps: { current: [8, 10, 5, 15, 15, 10, 15], portnox: [10, 0, 0, 15, 10, 5, 10] },
      securew2: { current: [8, 0, 5, 15, 10, 10, 10], portnox: [10, 0, 0, 15, 10, 5, 10] },
      noNac: { current: [0, 0, 0, 0, 0, 0, 0], portnox: [10, 0, 0, 15, 10, 5, 10] }
    };
    
    // Mock data for ROI
    var roiData = {
      cisco: { annual: [80000, 90000, 110000], cumulative: [80000, 170000, 280000] },
      aruba: { annual: [70000, 80000, 90000], cumulative: [70000, 150000, 240000] },
      forescout: { annual: [75000, 85000, 95000], cumulative: [75000, 160000, 255000] },
      fortinac: { annual: [60000, 70000, 80000], cumulative: [60000, 130000, 210000] },
      nps: { annual: [20000, 20000, 20000], cumulative: [20000, 40000, 60000] },
      securew2: { annual: [30000, 35000, 40000], cumulative: [30000, 65000, 105000] },
      noNac: { annual: [-15000, 10000, 20000], cumulative: [-15000, -5000, 15000] }
    };
    
    // Update TCO comparison chart
    if (chartInstances['tco-comparison-chart'] && tcoData[vendor]) {
      var tcoChart = chartInstances['tco-comparison-chart'];
      
      tcoChart.data.labels = [vendorNames[vendor], 'Portnox Cloud'];
      tcoChart.data.datasets[0].data = tcoData[vendor].costs;
      tcoChart.data.datasets[0].backgroundColor = [colors.vendors[vendor], colors.vendors.portnox];
      
      tcoChart.update();
      console.log("Updated TCO comparison chart");
    }
    
    // Update cumulative cost chart
    if (chartInstances['cumulative-cost-chart'] && cumulativeData[vendor]) {
      var cumulativeChart = chartInstances['cumulative-cost-chart'];
      
      cumulativeChart.data.datasets[0].label = vendorNames[vendor];
      cumulativeChart.data.datasets[0].data = cumulativeData[vendor].current;
      cumulativeChart.data.datasets[0].borderColor = colors.vendors[vendor];
      cumulativeChart.data.datasets[0].backgroundColor = 'rgba(' + hexToRgb(colors.vendors[vendor]) + ', 0.1)';
      
      cumulativeChart.data.datasets[1].data = cumulativeData[vendor].portnox;
      
      cumulativeChart.update();
      console.log("Updated cumulative cost chart");
    }
    
    // Update cost breakdown charts
    if (chartInstances['current-breakdown-chart'] && chartInstances['alternative-breakdown-chart'] && breakdownData[vendor]) {
      var currentChart = chartInstances['current-breakdown-chart'];
      var portnoxChart = chartInstances['alternative-breakdown-chart'];
      
      currentChart.data.datasets[0].data = breakdownData[vendor].current;
      currentChart.options.plugins.title.text = vendorNames[vendor] + ' Breakdown';
      currentChart.update();
      
      portnoxChart.data.datasets[0].data = breakdownData[vendor].portnox;
      portnoxChart.update();
      
      console.log("Updated cost breakdown charts");
    }
    
    // Update feature comparison chart
    if (chartInstances['feature-comparison-chart'] && featureData[vendor]) {
      var featureChart = chartInstances['feature-comparison-chart'];
      
      featureChart.data.datasets[0].label = vendorNames[vendor];
      featureChart.data.datasets[0].data = featureData[vendor];
      featureChart.data.datasets[0].borderColor = colors.vendors[vendor];
      featureChart.data.datasets[0].backgroundColor = 'rgba(' + hexToRgb(colors.vendors[vendor]) + ', 0.2)';
      featureChart.data.datasets[0].pointBackgroundColor = colors.vendors[vendor];
      
      featureChart.update();
      console.log("Updated feature comparison chart");
    }
    
    // Update implementation comparison chart
    if (chartInstances['implementation-comparison-chart'] && implementationData[vendor]) {
      var implementationChart = chartInstances['implementation-comparison-chart'];
      
      implementationChart.data.datasets[0].label = vendorNames[vendor];
      implementationChart.data.datasets[0].data = implementationData[vendor].current;
      implementationChart.data.datasets[0].backgroundColor = colors.vendors[vendor];
      
      implementationChart.data.datasets[1].data = implementationData[vendor].portnox;
      
      implementationChart.update();
      console.log("Updated implementation comparison chart");
    }
    
    // Update ROI chart
    if (chartInstances['roi-chart'] && roiData[vendor]) {
      var roiChart = chartInstances['roi-chart'];
      
      roiChart.data.datasets[0].data = roiData[vendor].annual;
      roiChart.data.datasets[1].data = roiData[vendor].cumulative;
      
      roiChart.update();
      console.log("Updated ROI chart");
    }
  }
  
  // Helper function to convert hex to rgb
  function hexToRgb(hex) {
    // Remove the hash character if present
    hex = hex.replace(/^#/, '');
    
    // Parse the hex value
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    
    return r + ',' + g + ',' + b;
  }
  
  // Initialize when DOM is ready
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        initAllCharts();
      });
    } else {
      initAllCharts();
    }
  }
  
  // Public API
  return {
    init: init,
    updateChartsForVendor: updateChartsForVendor,
    colors: colors
  };
})();

// Initialize charts
TotalCostCharts.init();
