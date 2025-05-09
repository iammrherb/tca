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
