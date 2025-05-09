/**
 * Enhanced Chart Builder
 * Creates advanced interactive charts for the TCO calculator with modern visualization
 */
class EnhancedChartBuilder {
  constructor() {
    this.charts = {};
    
    // Chart color schemes
    this.chartColors = {
        primary: {
            main: '#05547C',
            light: '#1B8DC0',
            dark: '#033E5B',
            transparent: 'rgba(5, 84, 124, 0.1)'
        },
        accent: {
            main: '#65BD44',
            light: '#8ED070',
            dark: '#4D9132',
            transparent: 'rgba(101, 189, 68, 0.1)'
        },
        vendors: {
            portnox: '#65BD44',
            cisco: '#1B67B2',
            aruba: '#F6921E',
            forescout: '#FFC20E',
            nps: '#00A4EF',
            fortinac: '#EE3124',
            securew2: '#662D91',
            noNac: '#A9A9A9'
        },
        chart: [
            '#05547C', // Primary
            '#65BD44', // Accent
            '#F6921E', // Orange
            '#662D91', // Purple
            '#FFC20E', // Yellow
            '#EE3124', // Red
            '#00A4EF'  // Sky Blue
        ],
        costCategories: {
            hardware: '#F6921E',      // Orange
            licensing: '#05547C',     // Primary Blue
            maintenance: '#662D91',   // Purple
            implementation: '#FFC20E', // Yellow
            staff: '#8ED070'          // Light Green
        }
    };
    
    // Chart defaults
    this.chartDefaults = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        },
        elements: {
            bar: {
                borderWidth: 0,
                borderRadius: 4
            }
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 12,
                    padding: 15,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 13
                },
                padding: 12,
                cornerRadius: 4,
                displayColors: true,
                usePointStyle: true,
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
    };
  }
  
  // Initialize charts
  init() {
    console.log('Initializing Enhanced Chart Builder...');
    
    // Create TCO comparison chart
    this.createTcoComparisonChart();
    
    // Create cumulative cost chart
    this.createCumulativeCostChart();
    
    // Create cost breakdown charts
    this.createCostBreakdownCharts();
    
    // Create feature comparison chart
    this.createFeatureComparisonChart();
    
    // Create ROI chart
    this.createRoiChart();
    
    // Create risk analysis charts
    this.createRiskAnalysisCharts();
    
    console.log('All charts initialized');
  }
  
  // Create TCO comparison chart
  createTcoComparisonChart() {
    const ctx = document.getElementById('tco-comparison-chart');
    if (!ctx) {
      console.warn('TCO Comparison chart canvas element not found');
      return;
    }
    
    try {
      const chartData = {
        labels: ['Current Solution', 'Portnox Cloud'],
        datasets: [{
          label: 'Total Cost of Ownership',
          data: [0, 0],
          backgroundColor: [this.chartColors.primary.main, this.chartColors.accent.main],
          barThickness: 60
        }]
      };
      
      this.charts.tcoComparison = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          ...this.chartDefaults,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          plugins: {
            ...this.chartDefaults.plugins,
            tooltip: {
              ...this.chartDefaults.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  return 'Total Cost: $' + context.raw.toLocaleString();
                },
                afterLabel: function(context) {
                  if (context.dataIndex === 1 && context.dataset.data[0] > context.dataset.data[1]) {
                    const savings = context.dataset.data[0] - context.dataset.data[1];
                    const pct = Math.round((savings / context.dataset.data[0]) * 100);
                    return 'Savings: $' + savings.toLocaleString() + ' (' + pct + '%)';
                  }
                  return null;
                }
              }
            }
          }
        }
      });
      
      console.log('TCO Comparison chart created');
    } catch (error) {
      console.error('Error creating TCO Comparison chart:', error);
    }
  }
  
  // Update TCO comparison chart
  updateTcoComparisonChart(data) {
    if (!this.charts.tcoComparison) {
      console.warn('TCO Comparison chart not initialized');
      return;
    }
    
    this.charts.tcoComparison.data.labels = data.labels;
    this.charts.tcoComparison.data.datasets[0].data = data.values;
    this.charts.tcoComparison.update();
    
    console.log('TCO Comparison chart updated');
  }
  
  // Create cumulative cost chart
  createCumulativeCostChart() {
    const ctx = document.getElementById('cumulative-cost-chart');
    if (!ctx) {
      console.warn('Cumulative Cost chart canvas element not found');
      return;
    }
    
    try {
      const chartData = {
        labels: ['Year 1', 'Year 2', 'Year 3'],
        datasets: [
          {
            label: 'Current Solution',
            data: [0, 0, 0],
            borderColor: this.chartColors.primary.main,
            backgroundColor: this.chartColors.primary.transparent,
            fill: true,
            tension: 0.3
          },
          {
            label: 'Portnox Cloud',
            data: [0, 0, 0],
            borderColor: this.chartColors.accent.main,
            backgroundColor: this.chartColors.accent.transparent,
            fill: true,
            tension: 0.3
          }
        ]
      };
      
      this.charts.cumulativeCost = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          ...this.chartDefaults,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          plugins: {
            ...this.chartDefaults.plugins,
            tooltip: {
              ...this.chartDefaults.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': $' + context.raw.toLocaleString();
                }
              }
            }
          }
        }
      });
      
      console.log('Cumulative Cost chart created');
    } catch (error) {
      console.error('Error creating Cumulative Cost chart:', error);
    }
  }
  
  // Update cumulative cost chart
  updateCumulativeCostChart(data) {
    if (!this.charts.cumulativeCost) {
      console.warn('Cumulative Cost chart not initialized');
      return;
    }
    
    this.charts.cumulativeCost.data.labels = data.years.map(year => `Year ${year}`);
    
    this.charts.cumulativeCost.data.datasets[0].label = data.currentVendorName;
    this.charts.cumulativeCost.data.datasets[0].data = data.currentVendorCosts;
    this.charts.cumulativeCost.data.datasets[1].data = data.portnoxCosts;
    
    this.charts.cumulativeCost.update();
    
    console.log('Cumulative Cost chart updated');
  }
  
  // More chart methods go here...
  
  // Create cost breakdown charts
  createCostBreakdownCharts() {
    // Current breakdown chart
    const currentCtx = document.getElementById('current-breakdown-chart');
    if (currentCtx) {
      this.charts.currentBreakdown = new Chart(currentCtx, {
        type: 'doughnut',
        data: {
          labels: ['Hardware', 'Licensing', 'Maintenance', 'Implementation', 'IT Staff'],
          datasets: [{
            data: [0, 0, 0, 0, 0],
            backgroundColor: Object.values(this.chartColors.costCategories),
            borderWidth: 0
          }]
        },
        options: {
          ...this.chartDefaults,
          cutout: '60%',
          plugins: {
            ...this.chartDefaults.plugins,
            tooltip: {
              ...this.chartDefaults.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw;
                  const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return label + ': $' + value.toLocaleString() + ' (' + percentage + '%)';
                }
              }
            }
          }
        }
      });
    }
    
    // Portnox breakdown chart
    const portnoxCtx = document.getElementById('alternative-breakdown-chart');
    if (portnoxCtx) {
      this.charts.portnoxBreakdown = new Chart(portnoxCtx, {
        type: 'doughnut',
        data: {
          labels: ['Hardware', 'Licensing', 'Maintenance', 'Implementation', 'IT Staff'],
          datasets: [{
            data: [0, 0, 0, 0, 0],
            backgroundColor: Object.values(this.chartColors.costCategories),
            borderWidth: 0
          }]
        },
        options: {
          ...this.chartDefaults,
          cutout: '60%',
          plugins: {
            ...this.chartDefaults.plugins,
            tooltip: {
              ...this.chartDefaults.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw;
                  const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return label + ': $' + value.toLocaleString() + ' (' + percentage + '%)';
                }
              }
            }
          }
        }
      });
    }
    
    console.log('Cost Breakdown charts created');
  }
  
  // Update cost breakdown charts
  updateCostBreakdownCharts(currentVendorCosts, portnoxCosts) {
    // Update current solution breakdown
    if (this.charts.currentBreakdown) {
      this.charts.currentBreakdown.data.datasets[0].data = [
        currentVendorCosts.hardwareCost,
        currentVendorCosts.licensingCost,
        currentVendorCosts.maintenanceCost,
        currentVendorCosts.implementationCost,
        currentVendorCosts.fteCost
      ];
      this.charts.currentBreakdown.update();
    }
    
    // Update Portnox breakdown
    if (this.charts.portnoxBreakdown) {
      this.charts.portnoxBreakdown.data.datasets[0].data = [
        portnoxCosts.hardwareCost,
        portnoxCosts.licensingCost,
        portnoxCosts.maintenanceCost,
        portnoxCosts.implementationCost,
        portnoxCosts.fteCost
      ];
      this.charts.portnoxBreakdown.update();
    }
    
    console.log('Cost Breakdown charts updated');
  }
  
  // Create feature comparison chart
  createFeatureComparisonChart() {
    const ctx = document.getElementById('feature-comparison-chart');
    if (!ctx) return;
    
    try {
      this.charts.featureComparison = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: [
            'Device Visibility',
            'Policy Management',
            'Guest Access',
            'BYOD Support',
            'Cloud Integration',
            'Automated Remediation',
            'Third-Party Integration',
            'Scalability',
            'Ease of Use',
            'Reporting'
          ],
          datasets: [
            {
              label: 'Current Solution',
              data: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
              borderColor: this.chartColors.primary.main,
              backgroundColor: this.chartColors.primary.transparent,
              borderWidth: 2,
              pointBackgroundColor: this.chartColors.primary.main
            },
            {
              label: 'Portnox Cloud',
              data: [8, 9, 8, 9, 10, 9, 9, 9, 9, 8],
              borderColor: this.chartColors.accent.main,
              backgroundColor: this.chartColors.accent.transparent,
              borderWidth: 2,
              pointBackgroundColor: this.chartColors.accent.main
            }
          ]
        },
        options: {
          ...this.chartDefaults,
          scales: {
            r: {
              angleLines: {
                display: true,
                color: 'rgba(0, 0, 0, 0.1)'
              },
              suggestedMin: 0,
              suggestedMax: 10,
              ticks: {
                stepSize: 2,
                callback: function(value) {
                  return value;
                }
              }
            }
          },
          plugins: {
            ...this.chartDefaults.plugins,
            tooltip: {
              ...this.chartDefaults.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.raw + '/10';
                }
              }
            }
          }
        }
      });
      
      console.log('Feature comparison chart created');
    } catch (error) {
      console.error('Error creating Feature comparison chart:', error);
    }
  }
  
  // Update feature comparison chart
  updateFeatureComparisonChart(currentVendor, currentVendorData) {
    if (!this.charts.featureComparison) return;
    
    // Update chart data
    this.charts.featureComparison.data.datasets[0].label = currentVendor;
    this.charts.featureComparison.data.datasets[0].data = currentVendorData;
    
    this.charts.featureComparison.update();
    
    console.log('Feature comparison chart updated');
  }
  
  // Create ROI chart
  createRoiChart() {
    const ctx = document.getElementById('roi-chart');
    if (!ctx) return;
    
    try {
      this.charts.roi = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Year 1', 'Year 2', 'Year 3'],
          datasets: [
            {
              label: 'Cumulative Investment',
              type: 'line',
              data: [0, 0, 0],
              borderColor: this.chartColors.primary.main,
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: this.chartColors.primary.main,
              yAxisID: 'y1'
            },
            {
              label: 'Annual Savings',
              data: [0, 0, 0],
              backgroundColor: this.chartColors.accent.main,
              barThickness: 40,
              yAxisID: 'y'
            },
            {
              label: 'Cumulative Savings',
              type: 'line',
              data: [0, 0, 0],
              borderColor: this.chartColors.costCategories.hardware,
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderDash: [5, 5],
              pointRadius: 4,
              pointBackgroundColor: this.chartColors.costCategories.hardware,
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
                text: 'Annual Savings'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            },
            y1: {
              position: 'right',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cumulative Value'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              },
              grid: {
                display: false
              }
            }
          },
          plugins: {
            ...this.chartDefaults.plugins,
            tooltip: {
              ...this.chartDefaults.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': $' + context.raw.toLocaleString();
                }
              }
            }
          }
        }
      });
      
      console.log('ROI chart created');
    } catch (error) {
      console.error('Error creating ROI chart:', error);
    }
  }
  
  // Update ROI chart
  updateRoiChart(data) {
    if (!this.charts.roi) return;
    
    // Update labels if years are different
    if (data.years && data.years.length > 0) {
      this.charts.roi.data.labels = data.years.map(year => `Year ${year}`);
    }
    
    // Update datasets
    this.charts.roi.data.datasets[0].data = data.investment;
    this.charts.roi.data.datasets[1].data = data.annualSavings;
    this.charts.roi.data.datasets[2].data = data.cumulativeSavings;
    
    this.charts.roi.update();
    
    console.log('ROI chart updated');
  }
  
  // Create risk analysis charts
  createRiskAnalysisCharts() {
    // Breach risk chart
    const breachCtx = document.getElementById('breach-risk-chart');
    if (breachCtx) {
      this.charts.breachRisk = new Chart(breachCtx, {
        type: 'bar',
        data: {
          labels: ['Without NAC', 'With NAC'],
          datasets: [{
            label: 'Expected Breach Costs',
            data: [0, 0],
            backgroundColor: [this.chartColors.costCategories.hardware, this.chartColors.accent.main],
            barThickness: 60
          }]
        },
        options: {
          ...this.chartDefaults,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          plugins: {
            ...this.chartDefaults.plugins,
            tooltip: {
              ...this.chartDefaults.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  return 'Expected Cost: $' + context.raw.toLocaleString();
                },
                afterLabel: function(context) {
                  if (context.dataIndex === 1 && context.dataset.data[0] > context.dataset.data[1]) {
                    const reduction = context.dataset.data[0] - context.dataset.data[1];
                    const pct = Math.round((reduction / context.dataset.data[0]) * 100);
                    return 'Risk Reduction: $' + reduction.toLocaleString() + ' (' + pct + '%)';
                  }
                  return null;
                }
              }
            }
          }
        }
      });
    }
    
    // Risk components chart
    const riskComponentsCtx = document.getElementById('risk-components-chart');
    if (riskComponentsCtx) {
      this.charts.riskComponents = new Chart(riskComponentsCtx, {
        type: 'pie',
        data: {
          labels: ['Breach Risk', 'Compliance Risk', 'Operational Inefficiency', 'IT Staffing'],
          datasets: [{
            data: [0, 0, 0, 0],
            backgroundColor: [
              this.chartColors.costCategories.hardware,
              this.chartColors.primary.main,
              this.chartColors.costCategories.implementation,
              this.chartColors.costCategories.staff
            ],
            borderWidth: 0
          }]
        },
        options: {
          ...this.chartDefaults,
          plugins: {
            ...this.chartDefaults.plugins,
            tooltip: {
              ...this.chartDefaults.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw;
                  const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return label + ': $' + value.toLocaleString() + ' (' + percentage + '%)';
                }
              }
            }
          }
        }
      });
    }
    
    console.log('Risk Analysis charts created');
  }
  
  // Update breach risk chart
  updateBreachRiskChart(data) {
    if (!this.charts.breachRisk) return;
    
    this.charts.breachRisk.data.datasets[0].data = [
      data.withoutNac,
      data.withNac
    ];
    
    this.charts.breachRisk.update();
    
    console.log('Breach Risk chart updated');
  }
  
  // Update risk components chart
  updateRiskComponentsChart(data) {
    if (!this.charts.riskComponents) return;
    
    this.charts.riskComponents.data.datasets[0].data = [
      data.breachRisk,
      data.complianceRisk,
      data.operationalInefficiency,
      data.staffingCosts
    ];
    
    this.charts.riskComponents.update();
    
    console.log('Risk Components chart updated');
  }
}

// Initialize and expose the enhanced chart builder
window.EnhancedChartBuilder = new EnhancedChartBuilder();

console.log('Enhanced Chart Builder initialized and available as window.EnhancedChartBuilder');
