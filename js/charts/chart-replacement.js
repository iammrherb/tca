/**
 * Chart Replacement
 * Completely replaces the problematic chart initialization with a simplified version
 */
(function() {
  console.log('Installing Chart Replacement System');
  
  // Store original Chart constructor
  const OriginalChart = window.Chart;
  
  // Override Chart constructor to intercept chart creation
  window.Chart = function(ctx, config) {
    // Log chart creation
    const canvasId = ctx.canvas ? ctx.canvas.id : (ctx.id || 'unknown-canvas');
    console.log(`Creating chart for canvas: ${canvasId}`);
    
    try {
      // Destroy existing chart instance if any
      destroyChartOnCanvas(canvasId);
      
      // Create new instance
      const instance = new OriginalChart(ctx, config);
      
      // Register the chart in our registry
      registerChart(canvasId, instance);
      
      return instance;
    } catch (error) {
      console.error(`Error creating chart for ${canvasId}:`, error);
      
      // Try again with a clean canvas
      try {
        // Reset canvas
        resetCanvas(canvasId);
        
        // Create new instance
        const instance = new OriginalChart(ctx, config);
        
        // Register the chart
        registerChart(canvasId, instance);
        
        return instance;
      } catch (retryError) {
        console.error(`Retry failed for ${canvasId}:`, retryError);
        throw retryError;
      }
    }
  };
  
  // Copy static properties and methods
  Object.keys(OriginalChart).forEach(key => {
    window.Chart[key] = OriginalChart[key];
  });
  
  // Create chart registry
  window.chartRegistry = {};
  
  // Register a chart
  function registerChart(canvasId, chartInstance) {
    // Store in registry
    window.chartRegistry[canvasId] = chartInstance;
    
    console.log(`Registered chart for canvas: ${canvasId}`);
    return chartInstance;
  }
  
  // Destroy chart on canvas
  function destroyChartOnCanvas(canvasId) {
    // Check in registry
    if (window.chartRegistry[canvasId]) {
      try {
        window.chartRegistry[canvasId].destroy();
        delete window.chartRegistry[canvasId];
        console.log(`Destroyed chart from registry: ${canvasId}`);
        return true;
      } catch (error) {
        console.warn(`Error destroying chart from registry: ${canvasId}`, error);
      }
    }
    
    // Try other methods to find and destroy charts
    const canvas = document.getElementById(canvasId);
    if (!canvas) return false;
    
    // Check for Chart.js instance on canvas
    try {
      // Chart.js v3.x
      if (typeof OriginalChart.getChart === 'function') {
        const chart = OriginalChart.getChart(canvas);
        if (chart) {
          chart.destroy();
          console.log(`Destroyed chart using getChart: ${canvasId}`);
          return true;
        }
      }
      
      // Chart.js v2.x
      if (canvas.__chartjs__ && canvas.__chartjs__.chart) {
        canvas.__chartjs__.chart.destroy();
        console.log(`Destroyed chart using __chartjs__: ${canvasId}`);
        return true;
      }
    } catch (error) {
      console.warn(`Error finding and destroying chart on canvas: ${canvasId}`, error);
    }
    
    return false;
  }
  
  // Reset canvas
  function resetCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    try {
      // Get dimensions
      const width = canvas.width;
      const height = canvas.height;
      
      // Clear canvas
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, width, height);
      
      // Reset size to force redraw
      canvas.width = 1;
      canvas.height = 1;
      canvas.width = width;
      canvas.height = height;
      
      console.log(`Reset canvas: ${canvasId}`);
    } catch (error) {
      console.warn(`Error resetting canvas: ${canvasId}`, error);
    }
  }
  
  // Simple chart creation functions for basic charts
  window.SimpleCharts = {
    // Colors
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
      success: '#10b981',
      info: '#3b82f6',
      warning: '#f59e0b',
      danger: '#ef4444',
      
      // Vendor colors
      cisco: '#049fd9',
      aruba: '#ff7a00',
      forescout: '#005da8',
      fortinac: '#ee3124',
      nps: '#00a4ef',
      securew2: '#8bc53f',
      portnox: '#2bd25b'
    },
    
    // Get vendor color
    getVendorColor: function(vendorId) {
      return this.colors[vendorId] || this.colors.primary;
    },
    
    // Create bar chart
    createBarChart: function(canvasId, data) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return null;
      
      const config = {
        type: 'bar',
        data: {
          labels: data.labels || [],
          datasets: data.datasets || [{
            label: data.title || 'Data',
            data: data.values || [],
            backgroundColor: data.colors || [this.colors.primary],
            borderColor: data.borderColors || [this.colors.primary],
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
      
      return new Chart(canvas, config);
    },
    
    // Create line chart
    createLineChart: function(canvasId, data) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return null;
      
      const config = {
        type: 'line',
        data: {
          labels: data.labels || [],
          datasets: data.datasets || [{
            label: data.title || 'Data',
            data: data.values || [],
            borderColor: data.color || this.colors.primary,
            backgroundColor: data.backgroundColor || 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: data.fill !== undefined ? data.fill : true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      };
      
      return new Chart(canvas, config);
    },
    
    // Create doughnut chart
    createDoughnutChart: function(canvasId, data) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return null;
      
      const config = {
        type: 'doughnut',
        data: {
          labels: data.labels || [],
          datasets: [{
            data: data.values || [],
            backgroundColor: data.colors || Object.values(this.colors),
            borderColor: data.borderColor || 'white',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%'
        }
      };
      
      return new Chart(canvas, config);
    },
    
    // Create radar chart
    createRadarChart: function(canvasId, data) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return null;
      
      const config = {
        type: 'radar',
        data: {
          labels: data.labels || [],
          datasets: data.datasets || [{
            label: data.title || 'Data',
            data: data.values || [],
            backgroundColor: data.backgroundColor || 'rgba(59, 130, 246, 0.2)',
            borderColor: data.borderColor || this.colors.primary,
            borderWidth: 2,
            pointBackgroundColor: data.pointBackgroundColor || this.colors.primary
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      };
      
      return new Chart(canvas, config);
    },
    
    // Create simple TCO comparison
    createTCOComparisonChart: function(canvasId, data) {
      return this.createBarChart(canvasId, {
        labels: data.labels || ['Current Solution', 'Portnox Cloud'],
        values: data.values || [300000, 150000],
        colors: [
          this.getVendorColor(data.vendorId), 
          this.colors.portnox
        ],
        title: 'Total Cost of Ownership'
      });
    },
    
    // Create simple cumulative cost chart
    createCumulativeCostChart: function(canvasId, data) {
      return this.createLineChart(canvasId, {
        labels: data.labels || ['Initial', 'Year 1', 'Year 2', 'Year 3'],
        datasets: [
          {
            label: data.currentVendorName || 'Current Solution',
            data: data.currentValues || [100000, 200000, 300000, 400000],
            borderColor: this.getVendorColor(data.vendorId),
            backgroundColor: `rgba(${this.hexToRgb(this.getVendorColor(data.vendorId))}, 0.1)`,
            fill: true
          },
          {
            label: 'Portnox Cloud',
            data: data.portnoxValues || [45000, 90000, 135000, 180000],
            borderColor: this.colors.portnox,
            backgroundColor: `rgba(${this.hexToRgb(this.colors.portnox)}, 0.1)`,
            fill: true
          }
        ]
      });
    },
    
    // Create cost breakdown chart
    createCostBreakdownChart: function(canvasId, data) {
      return this.createDoughnutChart(canvasId, {
        labels: data.labels || ['Hardware', 'Software', 'Implementation', 'Licensing', 'Maintenance', 'Support', 'Personnel'],
        values: data.values || [50000, 75000, 45000, 35000, 15000, 20000, 85000]
      });
    },
    
    // Create feature comparison chart
    createFeatureComparisonChart: function(canvasId, data) {
      return this.createRadarChart(canvasId, {
        labels: data.labels || [
          'Scalability',
          'Ease of Use',
          'Deployment Speed',
          'Cost Efficiency',
          'Security Features',
          'Compliance',
          'Cloud Integration'
        ],
        datasets: [
          {
            label: data.currentVendorName || 'Current Solution',
            data: data.currentValues || [70, 60, 50, 40, 80, 75, 55],
            backgroundColor: `rgba(${this.hexToRgb(this.getVendorColor(data.vendorId))}, 0.2)`,
            borderColor: this.getVendorColor(data.vendorId)
          },
          {
            label: 'Portnox Cloud',
            data: data.portnoxValues || [90, 85, 95, 90, 85, 90, 95],
            backgroundColor: `rgba(${this.hexToRgb(this.colors.portnox)}, 0.2)`,
            borderColor: this.colors.portnox
          }
        ]
      });
    },
    
    // Create implementation comparison chart
    createImplementationComparisonChart: function(canvasId, data) {
      return this.createBarChart(canvasId, {
        labels: data.labels || ['Planning', 'Installation', 'Configuration', 'Testing', 'Deployment', 'Training'],
        datasets: [
          {
            label: data.currentVendorName || 'Current Solution (days)',
            data: data.currentValues || [15, 10, 25, 20, 20, 10],
            backgroundColor: this.getVendorColor(data.vendorId)
          },
          {
            label: 'Portnox Cloud (days)',
            data: data.portnoxValues || [5, 2, 8, 7, 5, 3],
            backgroundColor: this.colors.portnox
          }
        ]
      });
    },
    
    // Create ROI chart
    createROIChart: function(canvasId, data) {
      return this.createLineChart(canvasId, {
        labels: data.labels || ['Initial', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
        datasets: [
          {
            label: data.currentVendorName || 'Current Solution ROI',
            data: data.currentValues || [-170000, -120000, -70000, -20000, 30000, 80000],
            borderColor: this.getVendorColor(data.vendorId),
            backgroundColor: `rgba(${this.hexToRgb(this.getVendorColor(data.vendorId))}, 0.1)`
          },
          {
            label: 'Portnox Cloud ROI',
            data: data.portnoxValues || [-45000, 10000, 65000, 120000, 175000, 230000],
            borderColor: this.colors.portnox,
            backgroundColor: `rgba(${this.hexToRgb(this.colors.portnox)}, 0.1)`
          }
        ]
      });
    },
    
    // Helper: Convert hex to rgb
    hexToRgb: function(hex) {
      // Default fallback
      if (!hex) return '59, 130, 246';
      
      // Remove # if present
      hex = hex.replace(/^#/, '');
      
      // Parse hex
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      
      return `${r}, ${g}, ${b}`;
    }
  };
  
  // Replace chart creation handlers
  function setupChartReplacements() {
    console.log('Setting up chart replacements');
    
    try {
      // Replace ModernCharts with SimpleCharts if available
      if (window.ModernCharts) {
        console.log('Replacing ModernCharts with SimpleCharts');
        
        // Replace chart creation methods
        if (window.ModernCharts.charts) {
          window.ModernCharts.charts.tcoComparison = function(elementId, data) {
            return window.SimpleCharts.createTCOComparisonChart(elementId, {
              ...data,
              vendorId: data.currentVendor
            });
          };
          
          window.ModernCharts.charts.cumulativeCost = function(elementId, data) {
            return window.SimpleCharts.createCumulativeCostChart(elementId, {
              ...data,
              vendorId: data.currentVendor
            });
          };
          
          window.ModernCharts.charts.costBreakdown = function(elementId, data) {
            return window.SimpleCharts.createCostBreakdownChart(elementId, data);
          };
          
          window.ModernCharts.charts.featureComparison = function(elementId, data) {
            return window.SimpleCharts.createFeatureComparisonChart(elementId, {
              ...data,
              vendorId: data.currentVendor
            });
          };
          
          window.ModernCharts.charts.implementationComparison = function(elementId, data) {
            return window.SimpleCharts.createImplementationComparisonChart(elementId, {
              ...data,
              vendorId: data.currentVendor
            });
          };
          
          window.ModernCharts.charts.roi = function(elementId, data) {
            return window.SimpleCharts.createROIChart(elementId, {
              ...data,
              vendorId: data.currentVendor
            });
          };
        }
        
        console.log('ModernCharts replacement complete');
      }
    } catch (error) {
      console.error('Error setting up chart replacements:', error);
    }
  }
  
  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', setupChartReplacements);
  } else {
    setupChartReplacements();
  }
  
  console.log('Chart Replacement System installed');
})();
