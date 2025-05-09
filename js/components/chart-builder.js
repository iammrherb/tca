/**
 * Enhanced Chart Builder for creating and updating charts
 * Includes better mobile responsiveness, accessibility, and radar chart for feature comparison
 */

class ChartBuilder {
  constructor() {
    this.charts = {};
    this.chartDefaults = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 15,
            usePointStyle: true,
            pointStyle: 'square'
          }
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          padding: 10,
          bodySpacing: 5,
          titleFont: {
            size: 14
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += window.formatCurrency ? window.formatCurrency(context.parsed.y) : '$' + context.parsed.y.toLocaleString();
              }
              return label;
            }
          }
        }
      }
    };
    
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
    
    this.breakdownColors = [
      '#1B67B2', // Primary blue
      '#4D44AB', // Purple
      '#568C1C', // Green
      '#C77F1A', // Orange
      '#B54369', // Pink
      '#1CA43F', // Darker green
      '#5E5E5E', // Dark gray
      '#8884d8'  // Lavender
    ];
    
    this.isMobile = window.innerWidth < 768;
    
    // Listen for window resize to update mobile state
    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth < 768;
      
      // If mobile state changed, update charts
      if (wasMobile !== this.isMobile) {
        this.updateAllCharts();
      }
    });
  }
  
  updateAllCharts() {
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.update === 'function') {
        chart.update();
      }
    });
  }
  
  initCharts() {
    console.log('Initializing all charts...');
    this.initTCOComparisonChart();
    this.initCumulativeCostChart();
    this.initBreakdownCharts('cisco', 'portnox');
    this.initFeatureComparisonChart();
    this.initImplementationComparisonChart();
    this.initROIChart();
    console.log('All charts initialized');
  }
  
  initTCOComparisonChart() {
    const ctx = document.getElementById('tco-comparison-chart');
    if (!ctx) {
      console.warn('TCO Comparison chart canvas element not found');
      return;
    }
    
    try {
      const ctxCanvas = ctx.getContext('2d');
      if (!ctxCanvas) {
        console.warn('Could not get 2D context for TCO Comparison chart');
        return;
      }
      
      // Define chart configuration
      const chartConfig = {
        type: 'bar',
        data: {
          labels: ['Cisco ISE', 'Aruba ClearPass', 'Forescout', 'Microsoft NPS', 'FortiNAC', 'SecureW2', 'Portnox Cloud'],
          datasets: [
            {
              label: 'Initial Costs',
              data: [0, 0, 0, 0, 0, 0, 0],
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              stack: 'Stack 0'
            },
            {
              label: 'Migration Costs',
              data: [0, 0, 0, 0, 0, 0, 0],
              backgroundColor: 'rgba(255, 159, 64, 0.7)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1,
              stack: 'Stack 0'
            },
            {
              label: 'Ongoing Costs',
              data: [0, 0, 0, 0, 0, 0, 0],
              backgroundColor: 'rgba(75, 192, 192, 0.7)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              stack: 'Stack 0'
            }
          ]
        },
        options: {
          ...this.chartDefaults,
          indexAxis: this.isMobile ? 'y' : 'x', // Horizontal bars on mobile
          scales: {
            x: {
              stacked: true,
              grid: {
                display: false
              },
              ticks: {
                autoSkip: false,
                maxRotation: this.isMobile ? 0 : 45,
                minRotation: 0
              },
              title: {
                display: !this.isMobile,
                text: 'Vendors'
              }
            },
            y: {
              stacked: true,
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              },
              title: {
                display: true,
                text: 'Cost ($)'
              }
            }
          },
          plugins: {
            ...this.chartDefaults.plugins,
            title: {
              display: true,
              text: 'Total Cost of Ownership Comparison',
              font: {
                size: 16
              },
              padding: {
                top: 10,
                bottom: 20
              }
            },
            datalabels: {
              display: false
            }
          }
        }
      };
      
      // Create the chart
      this.charts.tcoComparison = new Chart(ctxCanvas, chartConfig);
      console.log('TCO Comparison chart initialized');
    } catch (error) {
      console.error('Error initializing TCO Comparison chart:', error);
    }
  }
  
  updateTCOComparisonChart(results) {
    if (!this.charts.tcoComparison || !results) {
      console.warn('TCO Comparison chart or results not available');
      return;
    }
    
    try {
      // Safely get vendors
      const vendors = Object.keys(window.vendorData || {});
      if (!vendors.length) {
        console.warn('No vendor data available');
        return;
      }
      
      const labels = vendors.map(vendor => window.vendorData[vendor].name);
      const initialCostsData = vendors.map(vendor => {
        return results[vendor] ? results[vendor].totalInitialCosts : 0;
      });
      const migrationCostsData = vendors.map(vendor => {
        return results[vendor] ? results[vendor].migrationCost || 0 : 0;
      });
      const ongoingCostsData = vendors.map(vendor => {
        return results[vendor] ? results[vendor].annualCosts * results.yearsToProject : 0;
      });
      
      // Update chart data
      this.charts.tcoComparison.data.labels = labels;
      this.charts.tcoComparison.data.datasets[0].data = initialCostsData;
      this.charts.tcoComparison.data.datasets[1].data = migrationCostsData;
      this.charts.tcoComparison.data.datasets[2].data = ongoingCostsData;
      
      // Update title to include years
      const chartTitle = 'Total Cost of Ownership Comparison (' + results.yearsToProject + ' Years)';
      this.charts.tcoComparison.options.plugins.title.text = chartTitle;
      
      // Update indexAxis based on mobile state
      this.charts.tcoComparison.options.indexAxis = this.isMobile ? 'y' : 'x';
      
      // Update chart
      this.charts.tcoComparison.update();
      console.log('TCO Comparison chart updated');
    } catch (error) {
      console.error('Error updating TCO Comparison chart:', error);
    }
  }
  
  initCumulativeCostChart() {
    const ctx = document.getElementById('cumulative-cost-chart');
    if (!ctx) {
      console.warn('Cumulative Cost chart canvas element not found');
      return;
    }
    
    try {
      const ctxCanvas = ctx.getContext('2d');
      if (!ctxCanvas) {
        console.warn('Could not get 2D context for Cumulative Cost chart');
        return;
      }
      
      // Define chart configuration
      const chartConfig = {
        type: 'line',
        data: {
          labels: ['Initial', 'Year 1', 'Year 2', 'Year 3'],
          datasets: []
        },
        options: {
          ...this.chartDefaults,
          elements: {
            line: {
              tension: 0.1,
              borderWidth: 2
            },
            point: {
              radius: 3,
              hoverRadius: 6
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              title: {
                display: !this.isMobile,
                text: 'Timeline'
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              },
              title: {
                display: true,
                text: 'Cumulative Cost ($)'
              }
            }
          },
          plugins: {
            ...this.chartDefaults.plugins,
            title: {
              display: true,
              text: 'Cumulative Costs Over Time',
              font: {
                size: 16
              },
              padding: {
                top: 10,
                bottom: 20
              }
            }
          }
        }
      };
      
      // Create the chart
      this.charts.cumulativeCost = new Chart(ctxCanvas, chartConfig);
      console.log('Cumulative Cost chart initialized');
    } catch (error) {
      console.error('Error initializing Cumulative Cost chart:', error);
    }
  }
  
  updateCumulativeCostChart(results) {
    if (!this.charts.cumulativeCost || !results) {
      console.warn('Cumulative Cost chart or results not available');
      return;
    }
    
    try {
      // Safely get vendors
      const vendors = Object.keys(window.vendorData || {});
      if (!vendors.length) {
        console.warn('No vendor data available');
        return;
      }
      
      const yearsToProject = results.yearsToProject || 3;
      const currentVendor = window.uiController ? window.uiController.activeVendor : null;
      
      // Generate labels
      const labels = ['Initial'];
      for (let i = 1; i <= yearsToProject; i++) {
        labels.push('Year ' + i);
      }
      
      // Create datasets for each vendor
      const datasets = [];
      
      vendors.forEach(vendor => {
        if (!results[vendor]) return;
        
        const vendorColor = this.chartColors[vendor] || this.chartColors.neutral;
        const isCurrentVendor = vendor === currentVendor;
        const isPortnox = vendor === 'portnox';
        const data = [];
        
        // Initial costs
        const initialCost = results[vendor].totalInitialCosts + (results[vendor].migrationCost || 0);
        data.push(initialCost);
        
        // Cumulative costs for each year
        for (let i = 1; i <= yearsToProject; i++) {
          data.push(initialCost + (results[vendor].annualCosts * i));
        }
        
        datasets.push({
          label: window.vendorData[vendor].name,
          data: data,
          backgroundColor: vendorColor,
          borderColor: vendorColor,
          borderWidth: (isCurrentVendor || isPortnox) ? 3 : 2,
          pointRadius: (isCurrentVendor || isPortnox) ? 4 : 3,
          pointHoverRadius: 7,
          tension: 0.1,
          // Dashed line for anything except current vendor and Portnox
          borderDash: (!isCurrentVendor && !isPortnox) ? [5, 5] : []
        });
      });
      
      // Update chart data
      this.charts.cumulativeCost.data.labels = labels;
      this.charts.cumulativeCost.data.datasets = datasets;
      
      // Update chart
      this.charts.cumulativeCost.update();
      console.log('Cumulative Cost chart updated');
    } catch (error) {
      console.error('Error updating Cumulative Cost chart:', error);
    }
  }
  
  initBreakdownCharts(currentVendor, altVendor) {
    const currentCtx = document.getElementById('current-breakdown-chart');
    const altCtx = document.getElementById('alternative-breakdown-chart');
    
    if (!currentCtx || !altCtx) {
      console.warn('Breakdown chart canvas elements not found');
      return;
    }
    
    try {
      const currentCtxCanvas = currentCtx.getContext('2d');
      const altCtxCanvas = altCtx.getContext('2d');
      
      if (!currentCtxCanvas || !altCtxCanvas) {
        console.warn('Could not get 2D context for breakdown charts');
        return;
      }
      
      // Common pie chart options
      const pieOptions = {
        ...this.chartDefaults,
        cutout: '35%', // Make it a doughnut chart for better visibility
        plugins: {
          ...this.chartDefaults.plugins,
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                return label + ': $' + value.toLocaleString() + ' (' + percentage + '%)';
              }
            }
          },
          datalabels: {
            display: context => {
              // Only show labels for segments that are at least 5% of the total
              const data = context.dataset.data;
              const total = data.reduce((a, b) => a + b, 0);
              return context.dataIndex >= 0 && (data[context.dataIndex] / total) >= 0.05;
            },
            formatter: (value, context) => {
              const data = context.dataset.data;
              const total = data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : '0';
              return percentage + '%';
            },
            color: '#fff',
            font: {
              weight: 'bold'
            }
          }
        }
      };
      
      // Labels common to both charts
      const labels = [
        'Hardware', 
        'Network Redesign', 
        'Implementation', 
        'Training', 
        'Maintenance', 
        'Licensing', 
        'Personnel', 
        'Downtime'
      ];
      
      // Create placeholder charts, to be updated with actual data
      this.charts.currentBreakdown = new Chart(currentCtxCanvas, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: [0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: this.breakdownColors,
            borderWidth: 1,
            borderColor: '#ffffff'
          }]
        },
        options: {
          ...pieOptions,
          plugins: {
            ...pieOptions.plugins,
            title: {
              display: true,
              text: window.vendorData && window.vendorData[currentVendor] ? 
                window.vendorData[currentVendor].name : 'Current Solution',
              font: {
                size: 16
              },
              padding: {
                top: 10,
                bottom: 20
              }
            }
          }
        }
      });
      
      this.charts.altBreakdown = new Chart(altCtxCanvas, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: [0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: this.breakdownColors,
            borderWidth: 1,
            borderColor: '#ffffff'
          }]
        },
        options: {
          ...pieOptions,
          plugins: {
            ...pieOptions.plugins,
            title: {
              display: true,
              text: window.vendorData && window.vendorData[altVendor] ? 
                window.vendorData[altVendor].name : 'Alternative Solution',
              font: {
                size: 16
              },
              padding: {
                top: 10,
                bottom: 20
              }
            }
          }
        }
      });
      
      console.log('Breakdown charts initialized');
    } catch (error) {
      console.error('Error initializing breakdown charts:', error);
    }
  }
  
  updateBreakdownCharts(currentVendor, altVendor) {
    if (!this.charts.currentBreakdown || !this.charts.altBreakdown) {
      console.warn('Breakdown charts not available');
      return;
    }
    
    try {
      const results = window.calculator && window.calculator.results ? 
        window.calculator.results : null;
      
      if (!results) {
        console.warn('No calculation results available');
        return;
      }
      
      const createBreakdownData = (vendor) => {
        // Check if vendor exists in results
        const vendorResults = results[vendor];
        if (!vendorResults || !vendorResults.costBreakdown) {
          console.warn('No cost breakdown data found for vendor: ' + vendor);
          return [0, 0, 0, 0, 0, 0, 0, 0];
        }
        
        // Create breakdown data from costBreakdown object
        return [
          vendorResults.costBreakdown.hardware || 0,
          vendorResults.costBreakdown.networkRedesign || 0,
          vendorResults.costBreakdown.implementation || 0,
          vendorResults.costBreakdown.training || 0,
          vendorResults.costBreakdown.maintenance || 0,
          vendorResults.costBreakdown.licensing || 0,
          vendorResults.costBreakdown.personnel || 0,
          vendorResults.costBreakdown.downtime || 0
        ];
      };
      
      // Update chart titles
      if (window.vendorData) {
        this.charts.currentBreakdown.options.plugins.title.text = 
          window.vendorData[currentVendor] ? window.vendorData[currentVendor].name : 'Current Solution';
        
        this.charts.altBreakdown.options.plugins.title.text = 
          window.vendorData[altVendor] ? window.vendorData[altVendor].name : 'Alternative Solution';
      }
      
      // Update charts
      this.charts.currentBreakdown.data.datasets[0].data = createBreakdownData(currentVendor);
      this.charts.currentBreakdown.update();
      
      this.charts.altBreakdown.data.datasets[0].data = createBreakdownData(altVendor);
      this.charts.altBreakdown.update();
      
      console.log('Breakdown charts updated');
    } catch (error) {
      console.error('Error updating breakdown charts:', error);
    }
  }
  
  initFeatureComparisonChart() {
    const ctx = document.getElementById('feature-comparison-chart');
    if (!ctx) {
      console.warn('Feature comparison chart canvas element not found');
      return;
    }
    
    try {
      const ctxCanvas = ctx.getContext('2d');
      if (!ctxCanvas) {
        console.warn('Could not get 2D context for feature comparison chart');
        return;
      }
      
      // Define feature scores for each vendor (1-5 scale)
      const featureScores = {
        cisco: {
          'Security': 4.5, 
          'Ease of Deployment': 2.5, 
          'Scalability': 4.0, 
          'Cost Efficiency': 2.0, 
          'Visibility': 4.0, 
          'Integration': 4.5
        },
        aruba: {
          'Security': 4.0, 
          'Ease of Deployment': 3.0, 
          'Scalability': 4.0, 
          'Cost Efficiency': 2.5, 
          'Visibility': 4.0, 
          'Integration': 4.0
        },
        forescout: {
          'Security': 4.0, 
          'Ease of Deployment': 2.5, 
          'Scalability': 3.5, 
          'Cost Efficiency': 2.0, 
          'Visibility': 5.0, 
          'Integration': 3.5
        },
        nps: {
          'Security': 3.0, 
          'Ease of Deployment': 3.5, 
          'Scalability': 2.5, 
          'Cost Efficiency': 4.5, 
          'Visibility': 2.0, 
          'Integration': 2.5
        },
        fortinac: {
          'Security': 4.2, 
          'Ease of Deployment': 3.0, 
          'Scalability': 3.8, 
          'Cost Efficiency': 2.5, 
          'Visibility': 4.0, 
          'Integration': 4.3
        },
        securew2: {
          'Security': 4.0, 
          'Ease of Deployment': 4.5, 
          'Scalability': 3.5, 
          'Cost Efficiency': 3.5, 
          'Visibility': 3.0, 
          'Integration': 3.2
        },
        portnox: {
          'Security': 4.2, 
          'Ease of Deployment': 4.8, 
          'Scalability': 4.0, 
          'Cost Efficiency': 4.5, 
          'Visibility': 4.0, 
          'Integration': 4.0
        }
      };
      
      // Get feature names
      const features = Object.keys(featureScores.cisco);
      
      // Initialize datasets
      const datasets = [];
      
      // Only include current vendor and Portnox initially
      const currentVendor = window.uiController ? window.uiController.activeVendor : 'cisco';
      
      // Add current vendor dataset
      if (featureScores[currentVendor]) {
        datasets.push({
          label: window.vendorData && window.vendorData[currentVendor] ? 
            window.vendorData[currentVendor].name : 'Current Vendor',
          data: features.map(f => featureScores[currentVendor][f]),
          backgroundColor: this.chartColors[currentVendor] + '40',
          borderColor: this.chartColors[currentVendor],
          borderWidth: 2,
          pointBackgroundColor: this.chartColors[currentVendor],
          pointRadius: 4
        });
      }
      
      // Add Portnox dataset
      datasets.push({
        label: 'Portnox Cloud',
        data: features.map(f => featureScores.portnox[f]),
        backgroundColor: this.chartColors.portnox + '40',
        borderColor: this.chartColors.portnox,
        borderWidth: 2,
        pointBackgroundColor: this.chartColors.portnox,
        pointRadius: 4
      });
      
      // Create chart
      this.charts.featureComparison = new Chart(ctxCanvas, {
        type: 'radar',
        data: {
          labels: features,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: {
                display: true
              },
              suggestedMin: 0,
              suggestedMax: 5,
              ticks: {
                stepSize: 1,
                callback: function(value) {
                  return value === 0 ? '' : value;
                }
              }
            }
          },
          plugins: {
            legend: {
              position: 'bottom'
            },
            title: {
              display: true,
              text: 'Feature Comparison',
              font: {
                size: 16
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.raw + '/5';
                }
              }
            }
          }
        }
      });
      
      console.log('Feature comparison chart initialized');
    } catch (error) {
      console.error('Error initializing feature comparison chart:', error);
    }
  }
  
  updateFeatureComparisonChart(currentVendor) {
    if (!this.charts.featureComparison) {
      console.warn('Feature comparison chart not available');
      return;
    }
    
    try {
      // Define feature scores for each vendor (1-5 scale)
      const featureScores = {
        cisco: {
          'Security': 4.5, 
          'Ease of Deployment': 2.5, 
          'Scalability': 4.0, 
          'Cost Efficiency': 2.0, 
          'Visibility': 4.0, 
          'Integration': 4.5
        },
        aruba: {
          'Security': 4.0, 
          'Ease of Deployment': 3.0, 
          'Scalability': 4.0, 
          'Cost Efficiency': 2.5, 
          'Visibility': 4.0, 
          'Integration': 4.0
        },
        forescout: {
          'Security': 4.0, 
          'Ease of Deployment': 2.5, 
          'Scalability': 3.5, 
          'Cost Efficiency': 2.0, 
          'Visibility': 5.0, 
          'Integration': 3.5
        },
        nps: {
          'Security': 3.0, 
          'Ease of Deployment': 3.5, 
          'Scalability': 2.5, 
          'Cost Efficiency': 4.5, 
          'Visibility': 2.0, 
          'Integration': 2.5
        },
        fortinac: {
          'Security': 4.2, 
          'Ease of Deployment': 3.0, 
          'Scalability': 3.8, 
          'Cost Efficiency': 2.5, 
          'Visibility': 4.0, 
          'Integration': 4.3
        },
        securew2: {
          'Security': 4.0, 
          'Ease of Deployment': 4.5, 
          'Scalability': 3.5, 
          'Cost Efficiency': 3.5, 
          'Visibility': 3.0, 
          'Integration': 3.2
        },
        portnox: {
          'Security': 4.2, 
          'Ease of Deployment': 4.8, 
          'Scalability': 4.0, 
          'Cost Efficiency': 4.5, 
          'Visibility': 4.0, 
          'Integration': 4.0
        }
      };
      
      const features = Object.keys(featureScores.cisco);
      
      // Create dataset for current vendor
      const datasets = [];
      
      if (featureScores[currentVendor]) {
        datasets.push({
          label: window.vendorData && window.vendorData[currentVendor] ? 
            window.vendorData[currentVendor].name : 'Current Vendor',
          data: features.map(f => featureScores[currentVendor][f]),
          backgroundColor: this.chartColors[currentVendor] + '40',
          borderColor: this.chartColors[currentVendor],
          borderWidth: 2,
          pointBackgroundColor: this.chartColors[currentVendor],
          pointRadius: 4
        });
      }
      
      // Add Portnox dataset
      datasets.push({
        label: 'Portnox Cloud',
        data: features.map(f => featureScores.portnox[f]),
        backgroundColor: this.chartColors.portnox + '40',
        borderColor: this.chartColors.portnox,
        borderWidth: 2,
        pointBackgroundColor: this.chartColors.portnox,
        pointRadius: 4
      });
      
      // Update chart
      this.charts.featureComparison.data.datasets = datasets;
      this.charts.featureComparison.update();
      
      console.log('Feature comparison chart updated');
    } catch (error) {
      console.error('Error updating feature comparison chart:', error);
    }
  }
  
  // New implementation comparison chart
  initImplementationComparisonChart() {
    const ctx = document.getElementById('implementation-comparison-chart');
    if (!ctx) {
      console.warn('Implementation comparison chart canvas element not found');
      return;
    }
    
    try {
      const ctxCanvas = ctx.getContext('2d');
      if (!ctxCanvas) {
        console.warn('Could not get 2D context for implementation comparison chart');
        return;
      }
      
      // Get all vendors
      const vendors = window.vendorData ? Object.keys(window.vendorData) : [];
      
      // Get implementation times in days (using medium size as default)
      const implementationTimes = vendors.map(vendor => {
        if (!window.vendorData[vendor] || !window.vendorData[vendor].medium || !window.vendorData[vendor].medium.implementationTimeline) {
          return 0;
        }
        
        const timeline = window.vendorData[vendor].medium.implementationTimeline;
        return Object.values(timeline).reduce((a, b) => a + b, 0);
      });
      
      // Prepare background colors
      const backgroundColors = vendors.map(vendor => this.chartColors[vendor] || this.chartColors.neutral);
      
      // Create chart
      this.charts.implementationComparison = new Chart(ctxCanvas, {
        type: 'bar',
        data: {
          labels: vendors.map(vendor => window.vendorData[vendor].name),
          datasets: [{
            label: 'Implementation Time (Days)',
            data: implementationTimes,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors,
            borderWidth: 1
          }]
        },
        options: {
          ...this.chartDefaults,
          indexAxis: this.isMobile ? 'y' : 'x',
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
            ...this.chartDefaults.plugins,
            title: {
              display: true,
              text: 'Implementation Time Comparison',
              font: {
                size: 16
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.raw + ' days';
                }
              }
            }
          }
        }
      });
      
      console.log('Implementation comparison chart initialized');
    } catch (error) {
      console.error('Error initializing implementation comparison chart:', error);
    }
  }
  
  updateImplementationComparisonChart(results) {
    if (!this.charts.implementationComparison) {
      console.warn('Implementation comparison chart not available');
      return;
    }
    
    try {
      const currentVendor = window.uiController ? window.uiController.activeVendor : null;
      
      // If we have actual implementation results, use those
      if (results && results.implementationResults) {
        const vendors = Object.keys(results.implementationResults);
        
        const implementationTimes = vendors.map(vendor => {
          return results.implementationResults[vendor] || 0;
        });
        
        const backgroundColors = vendors.map(vendor => {
          const baseColor = this.chartColors[vendor] || this.chartColors.neutral;
          return vendor === currentVendor ? baseColor : baseColor + '80';
        });
        
        this.charts.implementationComparison.data.labels = vendors.map(vendor => 
          window.vendorData && window.vendorData[vendor] ? window.vendorData[vendor].name : vendor);
        this.charts.implementationComparison.data.datasets[0].data = implementationTimes;
        this.charts.implementationComparison.data.datasets[0].backgroundColor = backgroundColors;
        this.charts.implementationComparison.data.datasets[0].borderColor = backgroundColors;
      } else {
        // Use default implementation times from vendor data
        const vendors = window.vendorData ? Object.keys(window.vendorData) : [];
        
        const orgSize = document.getElementById('organization-size') ? 
          document.getElementById('organization-size').value : 'medium';
        
        // Get implementation times in days
        const implementationTimes = vendors.map(vendor => {
          if (!window.vendorData[vendor] || !window.vendorData[vendor][orgSize] || !window.vendorData[vendor][orgSize].implementationTimeline) {
            return 0;
          }
          
          const timeline = window.vendorData[vendor][orgSize].implementationTimeline;
          return Object.values(timeline).reduce((a, b) => a + b, 0);
        });
        
        // Prepare background colors
        const backgroundColors = vendors.map(vendor => {
          const baseColor = this.chartColors[vendor] || this.chartColors.neutral;
          return vendor === currentVendor ? baseColor : baseColor + '80';
        });
        
        this.charts.implementationComparison.data.labels = vendors.map(vendor => window.vendorData[vendor].name);
        this.charts.implementationComparison.data.datasets[0].data = implementationTimes;
        this.charts.implementationComparison.data.datasets[0].backgroundColor = backgroundColors;
        this.charts.implementationComparison.data.datasets[0].borderColor = backgroundColors;
      }
      
      // Update indexAxis based on mobile state
      this.charts.implementationComparison.options.indexAxis = this.isMobile ? 'y' : 'x';
      
      // Update chart
      this.charts.implementationComparison.update();
      
      console.log('Implementation comparison chart updated');
    } catch (error) {
      console.error('Error updating implementation comparison chart:', error);
    }
  }
  
  initROIChart() {
    const ctx = document.getElementById('roi-chart');
    if (!ctx) {
      console.warn('ROI chart canvas element not found');
      return;
    }
    
    try {
      const ctxCanvas = ctx.getContext('2d');
      if (!ctxCanvas) {
        console.warn('Could not get 2D context for ROI chart');
        return;
      }
      
      // Initialize with empty data
      this.charts.roi = new Chart(ctxCanvas, {
        type: 'line',
        data: {
          labels: ['Initial', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
          datasets: [
            {
              label: 'Status Quo Costs',
              data: [],
              borderColor: this.chartColors.neutral,
              backgroundColor: this.chartColors.neutral + '20',
              borderWidth: 2,
              fill: true
            },
            {
              label: 'Portnox Costs',
              data: [],
              borderColor: this.chartColors.portnox,
              backgroundColor: this.chartColors.portnox + '20',
              borderWidth: 2,
              fill: true
            },
            {
              label: 'Cumulative Savings',
              data: [],
              borderColor: '#28a745',
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderDash: [5, 5],
              fill: false,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          ...this.chartDefaults,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cumulative Cost ($)'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            },
            y1: {
              beginAtZero: true,
              position: 'right',
              grid: {
                drawOnChartArea: false
              },
              title: {
                display: true,
                text: 'Cumulative Savings ($)'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            ...this.chartDefaults.plugins,
            title: {
              display: true,
              text: 'Return on Investment Analysis',
              font: {
                size: 16
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += '$' + context.parsed.y.toLocaleString();
                  }
                  return label;
                }
              }
            }
          }
        }
      });
      
      console.log('ROI chart initialized');
    } catch (error) {
      console.error('Error initializing ROI chart:', error);
    }
  }
  
  updateROIChart(results) {
    if (!this.charts.roi || !results) {
      console.warn('ROI chart or results not available');
      return;
    }
    
    try {
      const currentVendor = window.uiController ? window.uiController.activeVendor : null;
      
      if (!currentVendor || !results[currentVendor] || !results['portnox']) {
        console.warn('Missing data for ROI chart');
        return;
      }
      
      // Project for 5 years
      const years = 5;
      
      // Calculate cumulative costs for current vendor and Portnox
      const currentVendorData = [];
      const portnoxData = [];
      const savingsData = [];
      
      // Calculate breakeven point
      const currentInitialCost = results[currentVendor].totalInitialCosts;
      const portnoxInitialCost = results['portnox'].totalInitialCosts + (results['portnox'].migrationCost || 0);
      const currentAnnualCost = results[currentVendor].annualCosts;
      const portnoxAnnualCost = results['portnox'].annualCosts;
      
      // Initial costs
      currentVendorData.push(currentInitialCost);
      portnoxData.push(portnoxInitialCost);
      savingsData.push(0);
      
      // Project costs and savings
      let cumulativeSavings = currentInitialCost - portnoxInitialCost;
      
      for (let i = 1; i <= years; i++) {
        const currentTotal = currentInitialCost + (currentAnnualCost * i);
        const portnoxTotal = portnoxInitialCost + (portnoxAnnualCost * i);
        
        cumulativeSavings += (currentAnnualCost - portnoxAnnualCost);
        
        currentVendorData.push(currentTotal);
        portnoxData.push(portnoxTotal);
        savingsData.push(cumulativeSavings);
      }
      
      // Update chart data
      this.charts.roi.data.datasets[0].data = currentVendorData;
      this.charts.roi.data.datasets[0].label = window.vendorData && window.vendorData[currentVendor] ? 
        window.vendorData[currentVendor].name + ' Costs' : 'Current Costs';
      this.charts.roi.data.datasets[0].borderColor = this.chartColors[currentVendor] || this.chartColors.neutral;
      this.charts.roi.data.datasets[0].backgroundColor = (this.chartColors[currentVendor] || this.chartColors.neutral) + '20';
      
      this.charts.roi.data.datasets[1].data = portnoxData;
      this.charts.roi.data.datasets[2].data = savingsData;
      
      // Calculate breakeven point if savings exist
      if (cumulativeSavings > 0) {
        const yearlySavings = currentAnnualCost - portnoxAnnualCost;
        const initialDiff = portnoxInitialCost - currentInitialCost;
        
        // Only calculate if there are annual savings
        if (yearlySavings > 0) {
          const breakEvenYears = initialDiff > 0 ? initialDiff / yearlySavings : 0;
          
          // Update chart title with breakeven point if relevant
          if (breakEvenYears > 0) {
            const breakEvenText = breakEvenYears < 1 ? 
              Math.round(breakEvenYears * 12) + ' months' : 
              breakEvenYears.toFixed(1) + ' years';
            
            this.charts.roi.options.plugins.title.text = 'Return on Investment Analysis (Breakeven: ' + breakEvenText + ')';
          } else {
            this.charts.roi.options.plugins.title.text = 'Return on Investment Analysis (Immediate Savings)';
          }
        } else {
          this.charts.roi.options.plugins.title.text = 'Return on Investment Analysis';
        }
      } else {
        this.charts.roi.options.plugins.title.text = 'Return on Investment Analysis';
      }
      
      // Update chart
      this.charts.roi.update();
      
      console.log('ROI chart updated');
    } catch (error) {
      console.error('Error updating ROI chart:', error);
    }
  }
}

// Initialize chartBuilder singleton on window
window.chartBuilder = new ChartBuilder();

console.log('Chart Builder initialized and available as window.chartBuilder');
