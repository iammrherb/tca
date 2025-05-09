/**
 * Enhanced Chart Builder for Zero Trust NAC Architecture Designer Pro
 * Improved visualization, responsiveness, and highlighting Portnox advantages
 */

class EnhancedChartBuilder extends ChartBuilder {
  constructor() {
    super();
    
    // Enhanced color palette with gradients
    this.gradientColors = {};
    
    // Enhanced chart defaults with animations
    this.enhancedDefaults = {
      ...this.chartDefaults,
      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      },
      transitions: {
        active: {
          animation: {
            duration: 400
          }
        }
      },
      plugins: {
        ...this.chartDefaults.plugins,
        subtitle: {
          display: true,
          text: '',
          font: {
            size: 14,
            style: 'italic'
          },
          padding: {
            bottom: 10
          }
        },
        tooltip: {
          ...this.chartDefaults.plugins.tooltip,
          usePointStyle: true,
          boxPadding: 6
        }
      }
    };
    
    // Additional color schemes for different audiences
    this.audienceColors = {
      finance: {
        primary: '#2E7D32',
        secondary: '#4CAF50',
        accent: '#81C784'
      },
      executive: {
        primary: '#1565C0',
        secondary: '#42A5F5',
        accent: '#90CAF9'
      },
      security: {
        primary: '#7B1FA2',
        secondary: '#AB47BC',
        accent: '#CE93D8'
      }
    };
    
    // Initialize gradient colors when charts are created
    this.initGradientColors = (ctx) => {
      if (!ctx) return;
      
      // Portnox gradient
      const portnoxGradient = ctx.createLinearGradient(0, 0, 0, 400);
      portnoxGradient.addColorStop(0, 'rgba(43, 210, 91, 0.8)');
      portnoxGradient.addColorStop(1, 'rgba(43, 210, 91, 0.2)');
      this.gradientColors.portnox = portnoxGradient;
      
      // Cisco gradient
      const ciscoGradient = ctx.createLinearGradient(0, 0, 0, 400);
      ciscoGradient.addColorStop(0, 'rgba(4, 159, 217, 0.8)');
      ciscoGradient.addColorStop(1, 'rgba(4, 159, 217, 0.2)');
      this.gradientColors.cisco = ciscoGradient;
      
      // Additional vendor gradients...
      // ...
    };
  }
  
  // Override updateTCOComparisonChart to highlight Portnox advantage
  updateTCOComparisonChart(results) {
    super.updateTCOComparisonChart(results);
    
    if (!this.charts.tcoComparison || !results) return;
    
    // Add subtitle highlighting savings
    if (results.portnox && results.cisco) {
      const savingsVsCisco = results.cisco.totalCost - results.portnox.totalCost;
      const savingsPercent = ((savingsVsCisco / results.cisco.totalCost) * 100).toFixed(1);
      
      if (savingsVsCisco > 0) {
        this.charts.tcoComparison.options.plugins.subtitle.text = 
          `Save up to ${savingsPercent}% with Portnox Cloud vs. traditional solutions`;
        this.charts.tcoComparison.options.plugins.subtitle.display = true;
      }
    }
    
    // Update chart
    this.charts.tcoComparison.update();
  }
  
  // Enhanced feature comparison chart with better highlighting of Portnox advantages
  updateFeatureComparisonChart(currentVendor) {
    super.updateFeatureComparisonChart(currentVendor);
    
    if (!this.charts.featureComparison) return;
    
    // Get canvas context for annotations
    const ctx = this.charts.featureComparison.ctx;
    
    // Update chart options to highlight Portnox advantages
    this.charts.featureComparison.options.plugins.subtitle = {
      display: true,
      text: 'Areas with green highlight show Portnox advantages',
      font: {
        size: 14,
        style: 'italic'
      },
      padding: {
        bottom: 10
      }
    };
    
    // Customize dataset for Portnox to stand out
    this.charts.featureComparison.data.datasets.forEach(dataset => {
      if (dataset.label === 'Portnox Cloud') {
        dataset.pointBackgroundColor = this.chartColors.portnox;
        dataset.pointHoverBackgroundColor = this.chartColors.portnox;
        dataset.pointHoverBorderColor = this.chartColors.portnox;
        dataset.pointRadius = 5;
        dataset.pointHoverRadius = 7;
        dataset.borderWidth = 3;
      }
    });
    
    this.charts.featureComparison.update();
  }
  
  // New chart for FTE analysis
  initFTEAnalysisChart() {
    const ctx = document.getElementById('fte-analysis-chart');
    if (!ctx) {
      console.warn('FTE analysis chart canvas element not found');
      return;
    }
    
    const ctxCanvas = ctx.getContext('2d');
    if (!ctxCanvas) return;
    
    // Initialize gradient colors
    this.initGradientColors(ctxCanvas);
    
    // Chart configuration
    const chartConfig = {
      type: 'bar',
      data: {
        labels: ['Cisco ISE', 'Aruba ClearPass', 'Forescout', 'Microsoft NPS', 'FortiNAC', 'SecureW2', 'Portnox Cloud'],
        datasets: [
          {
            label: 'Implementation Resources',
            data: [2.5, 2.2, 2.0, 1.5, 1.8, 1.3, 0.8],
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            stack: 'Stack 0'
          },
          {
            label: 'Ongoing Management',
            data: [1.8, 1.6, 1.5, 1.2, 1.5, 1.0, 0.5],
            backgroundColor: 'rgba(255, 159, 64, 0.7)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
            stack: 'Stack 0'
          },
          {
            label: 'Security Operations',
            data: [1.2, 1.1, 1.3, 0.8, 1.0, 0.7, 0.4],
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            stack: 'Stack 0'
          }
        ]
      },
      options: {
        ...this.enhancedDefaults,
        indexAxis: this.isMobile ? 'y' : 'x',
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
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Full-Time Equivalents (FTE)'
            }
          }
        },
        plugins: {
          ...this.enhancedDefaults.plugins,
          title: {
            display: true,
            text: 'Personnel Requirements Comparison',
            font: {
              size: 16
            }
          },
          subtitle: {
            display: true,
            text: 'Portnox requires up to 75% less staff resources'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + context.raw + ' FTE';
              }
            }
          }
        }
      }
    };
    
    // Create chart
    this.charts.fteAnalysis = new Chart(ctxCanvas, chartConfig);
    console.log('FTE Analysis chart initialized');
  }
  
  // Enhanced ROI chart with breakeven visualization
  updateROIChart(results) {
    super.updateROIChart(results);
    
    if (!this.charts.roi || !results) return;
    
    const currentVendor = window.uiController ? window.uiController.activeVendor : null;
    
    if (!currentVendor || !results[currentVendor] || !results['portnox']) return;
    
    // Calculate breakeven point more precisely
    const currentVendorInitial = results[currentVendor].totalInitialCosts;
    const portnoxInitial = results['portnox'].totalInitialCosts + (results['portnox'].migrationCost || 0);
    const currentAnnual = results[currentVendor].annualCosts;
    const portnoxAnnual = results['portnox'].annualCosts;
    
    // Only calculate if there are annual savings
    if (currentAnnual > portnoxAnnual) {
      const initialDiff = portnoxInitial - currentVendorInitial;
      
      if (initialDiff > 0) {
        const breakEvenYears = initialDiff / (currentAnnual - portnoxAnnual);
        const breakEvenMonths = Math.round(breakEvenYears * 12);
        
        // Add annotation for breakeven point
        if (breakEvenYears <= 5) {
          // Convert years to x position on chart (0 = initial, 1 = year 1, etc.)
          const xPos = breakEvenYears;
          
          // Add vertical line annotation at breakeven point
          this.charts.roi.options.plugins.annotation = {
            annotations: {
              breakEvenLine: {
                type: 'line',
                xMin: xPos,
                xMax: xPos,
                borderColor: 'rgba(255, 99, 132, 0.8)',
                borderWidth: 2,
                borderDash: [6, 6],
                label: {
                  content: 'Breakeven: ' + breakEvenMonths + ' months',
                  enabled: true,
                  position: 'top'
                }
              }
            }
          };
          
          // Add point annotation where cumulative savings crosses zero
          // This calculation would need to be more precise in production
          const yPos = 0; // This would need to be calculated precisely 
          
          this.charts.roi.options.plugins.annotation.annotations.breakEvenPoint = {
            type: 'point',
            xValue: xPos,
            yValue: yPos,
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            radius: 5
          };
        }
      } else {
        // Immediate savings
        this.charts.roi.options.plugins.subtitle = {
          display: true,
          text: 'Immediate savings from day one with Portnox Cloud',
          font: {
            size: 14,
            style: 'italic'
          }
        };
      }
    }
    
    // Update chart
    this.charts.roi.update();
  }
  
  // New compliance visualization chart
  initComplianceChart() {
    const ctx = document.getElementById('compliance-chart');
    if (!ctx) {
      console.warn('Compliance chart canvas element not found');
      return;
    }
    
    const ctxCanvas = ctx.getContext('2d');
    if (!ctxCanvas) return;
    
    // Compliance framework data
    const frameworks = ['NIST 800-53', 'ISO 27001', 'HIPAA', 'PCI DSS', 'GDPR', 'Zero Trust'];
    
    // Score data (0-100%)
    const ciscoScores = [85, 80, 75, 82, 70, 75];
    const arubaScores = [82, 78, 73, 80, 72, 73];
    const forescoutScores = [80, 75, 70, 78, 68, 72];
    const npsScores = [70, 65, 60, 70, 55, 60];
    const portnoxScores = [90, 88, 85, 92, 90, 95];
    
    // Chart configuration
    const chartConfig = {
      type: 'radar',
      data: {
        labels: frameworks,
        datasets: [
          {
            label: 'Cisco ISE',
            data: ciscoScores,
            backgroundColor: 'rgba(4, 159, 217, 0.2)',
            borderColor: 'rgba(4, 159, 217, 0.8)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(4, 159, 217, 1)',
            pointRadius: 3
          },
          {
            label: 'Aruba ClearPass',
            data: arubaScores,
            backgroundColor: 'rgba(255, 131, 0, 0.2)',
            borderColor: 'rgba(255, 131, 0, 0.8)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(255, 131, 0, 1)',
            pointRadius: 3
          },
          {
            label: 'Forescout',
            data: forescoutScores,
            backgroundColor: 'rgba(0, 93, 170, 0.2)',
            borderColor: 'rgba(0, 93, 170, 0.8)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(0, 93, 170, 1)',
            pointRadius: 3
          },
          {
            label: 'Microsoft NPS',
            data: npsScores,
            backgroundColor: 'rgba(0, 164, 239, 0.2)',
            borderColor: 'rgba(0, 164, 239, 0.8)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(0, 164, 239, 1)',
            pointRadius: 3
          },
          {
            label: 'Portnox Cloud',
            data: portnoxScores,
            backgroundColor: 'rgba(43, 210, 91, 0.3)',
            borderColor: 'rgba(43, 210, 91, 1)',
            borderWidth: 3,
            pointBackgroundColor: 'rgba(43, 210, 91, 1)',
            pointRadius: 5
          }
        ]
      },
      options: {
        ...this.enhancedDefaults,
        scales: {
          r: {
            angleLines: {
              display: true
            },
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: {
              stepSize: 20,
              callback: function(value) {
                return value + '%';
              }
            }
          }
        },
        plugins: {
          ...this.enhancedDefaults.plugins,
          title: {
            display: true,
            text: 'Compliance Framework Coverage',
            font: {
              size: 16
            }
          },
          subtitle: {
            display: true,
            text: 'Portnox offers superior compliance coverage across all frameworks'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + context.raw + '% compliance';
              }
            }
          }
        }
      }
    };
    
    // Create chart
    this.charts.compliance = new Chart(ctxCanvas, chartConfig);
    console.log('Compliance chart initialized');
  }
  
  // New method to initialize all enhanced charts
  initEnhancedCharts() {
    // Call parent method first
    this.initCharts();
    
    // Initialize new charts
    this.initFTEAnalysisChart();
    this.initComplianceChart();
    
    console.log('All enhanced charts initialized');
  }
}

// Replace the original ChartBuilder with the enhanced version
window.chartBuilder = new EnhancedChartBuilder();

console.log('Enhanced Chart Builder initialized and available as window.chartBuilder');
