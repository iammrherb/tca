/**
 * Enhanced Chart Fix for TCO Analyzer
 * Specifically focuses on fixing and enhancing key charts
 */
(function() {
  console.log('Applying Enhanced Chart Fix...');
  
  // Track chart instances and creation
  window._chartInstances = window._chartInstances || {};
  
  // Wait for Chart.js to be available
  function waitForChart(callback, attempts = 0) {
    if (window.Chart) {
      callback();
    } else if (attempts < 50) {
      setTimeout(() => waitForChart(callback, attempts + 1), 100);
    } else {
      console.error('Chart.js not found after multiple attempts');
    }
  }
  
  // Create a standalone chart manager
  window.ChartEnhancer = {
    // Create/initialize specific charts that weren't loading
    initMissingCharts: function() {
      console.log('Initializing missing charts...');
      
      // Key charts that need to be created
      const criticalCharts = [
        { id: 'roi-timeline-chart', title: 'ROI Timeline', type: 'line' },
        { id: 'cost-factors-chart', title: 'Cost Factors Impact Analysis', type: 'bar' },
        { id: 'cost-analysis-chart', title: 'Cost Analysis Over Time', type: 'line' },
        { id: 'resource-utilization-chart', title: 'IT Resource Utilization', type: 'bar' },
        { id: 'implementation-complexity-chart', title: 'Implementation Complexity', type: 'radar' }
      ];
      
      // Create canvas elements if they don't exist
      criticalCharts.forEach(chart => {
        if (!document.getElementById(chart.id)) {
          console.log(`Creating missing chart canvas: ${chart.id}`);
          this.createChartCanvas(chart.id, chart.title);
        }
      });
      
      // Initialize charts
      setTimeout(() => {
        criticalCharts.forEach(chart => {
          this.initializeChart(chart.id, chart.type, chart.title);
        });
      }, 500);
    },
    
    // Create canvas for chart if it doesn't exist
    createChartCanvas: function(id, title) {
      const resultsGrid = document.querySelector('.results-grid');
      if (!resultsGrid) return;
      
      const card = document.createElement('div');
      card.className = 'result-card';
      card.innerHTML = `
        <h3>${title}</h3>
        <div class="chart-container">
          <canvas id="${id}"></canvas>
        </div>
      `;
      
      resultsGrid.appendChild(card);
    },
    
    // Initialize a specific chart with placeholder data
    initializeChart: function(id, type, title) {
      const canvas = document.getElementById(id);
      if (!canvas) return;
      
      // Create placeholder data based on chart type
      let data;
      let options;
      
      if (type === 'bar') {
        data = {
          labels: ['Portnox Cloud', 'Cisco ISE', 'Aruba ClearPass', 'Forescout'],
          datasets: [{
            label: title,
            data: [25, 75, 65, 80],
            backgroundColor: [
              'rgba(43, 210, 91, 0.7)',
              'rgba(27, 103, 178, 0.7)',
              'rgba(27, 103, 178, 0.7)',
              'rgba(27, 103, 178, 0.7)'
            ],
            borderColor: [
              'rgba(43, 210, 91, 1)',
              'rgba(27, 103, 178, 1)',
              'rgba(27, 103, 178, 1)',
              'rgba(27, 103, 178, 1)'
            ],
            borderWidth: 1
          }]
        };
        
        options = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        };
      } else if (type === 'line') {
        data = {
          labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
          datasets: [
            {
              label: 'Portnox Cloud',
              data: [40000, 75000, 105000, 138000, 170000],
              borderColor: 'rgba(43, 210, 91, 1)',
              backgroundColor: 'rgba(43, 210, 91, 0.1)',
              tension: 0.3,
              fill: true
            },
            {
              label: 'On-Premises NAC',
              data: [85000, 155000, 225000, 290000, 350000],
              borderColor: 'rgba(27, 103, 178, 1)',
              backgroundColor: 'rgba(27, 103, 178, 0.1)',
              tension: 0.3,
              fill: true
            }
          ]
        };
        
        options = {
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
        };
      } else if (type === 'radar') {
        data = {
          labels: [
            'Implementation Time',
            'Admin Complexity',
            'User Training',
            'Hardware Setup',
            'Policy Configuration',
            'Maintenance'
          ],
          datasets: [
            {
              label: 'Portnox Cloud',
              data: [20, 25, 30, 5, 40, 10],
              fill: true,
              backgroundColor: 'rgba(43, 210, 91, 0.2)',
              borderColor: 'rgba(43, 210, 91, 1)',
              pointBackgroundColor: 'rgba(43, 210, 91, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(43, 210, 91, 1)'
            },
            {
              label: 'On-Premises NAC',
              data: [80, 70, 60, 90, 75, 85],
              fill: true,
              backgroundColor: 'rgba(27, 103, 178, 0.2)',
              borderColor: 'rgba(27, 103, 178, 1)',
              pointBackgroundColor: 'rgba(27, 103, 178, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(27, 103, 178, 1)'
            }
          ]
        };
        
        options = {
          responsive: true,
          maintainAspectRatio: false,
          elements: {
            line: {
              borderWidth: 2
            }
          },
          scale: {
            ticks: {
              beginAtZero: true,
              max: 100,
              min: 0
            }
          }
        };
      }
      
      // Create chart if it doesn't exist
      if (window.Chart && !window._chartInstances[id]) {
        try {
          console.log(`Creating chart: ${id}`);
          const chart = new window.Chart(canvas.getContext('2d'), {
            type: type,
            data: data,
            options: options
          });
          
          window._chartInstances[id] = chart;
        } catch (error) {
          console.error(`Error creating chart ${id}:`, error);
        }
      }
    },
    
    // Update the chart with actual data when available
    updateChart: function(id, newData, newOptions) {
      if (window._chartInstances[id]) {
        try {
          const chart = window._chartInstances[id];
          
          if (newData) {
            if (newData.labels) chart.data.labels = newData.labels;
            if (newData.datasets) chart.data.datasets = newData.datasets;
          }
          
          if (newOptions) {
            chart.options = { ...chart.options, ...newOptions };
          }
          
          chart.update();
        } catch (error) {
          console.error(`Error updating chart ${id}:`, error);
        }
      }
    },
    
    // Reset all charts and reinitialize
    resetAllCharts: function() {
      // Destroy existing charts
      for (const id in window._chartInstances) {
        if (window._chartInstances[id] && window._chartInstances[id].destroy) {
          window._chartInstances[id].destroy();
          delete window._chartInstances[id];
        }
      }
      
      // Reinitialize charts
      if (window.chartBuilder && typeof window.chartBuilder.initCharts === 'function') {
        try {
          window.chartBuilder.initCharts();
        } catch (error) {
          console.error('Error when reinitializing charts:', error);
          // Try to initialize missing charts
          this.initMissingCharts();
        }
      } else {
        this.initMissingCharts();
      }
    }
  };
  
  // Wait for Chart.js and initialize
  waitForChart(function() {
    // Store original Chart constructor
    const OrigChart = window.Chart;
    
    // Override Chart constructor
    function CustomChart(ctx, config) {
      // Get canvas ID
      let canvasId = null;
      if (ctx && ctx.canvas && ctx.canvas.id) {
        canvasId = ctx.canvas.id;
      }
      
      // If we have a canvas ID, check if a chart already exists for it
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
    
    console.log('Chart.js fix applied successfully');
    
    // Create our missing charts
    setTimeout(() => {
      window.ChartEnhancer.initMissingCharts();
    }, 1000);
  });
  
  // Override reset function if it exists
  if (window.resetAllCharts) {
    const originalReset = window.resetAllCharts;
    window.resetAllCharts = function() {
      originalReset();
      setTimeout(() => {
        window.ChartEnhancer.initMissingCharts();
      }, 500);
    };
  } else {
    window.resetAllCharts = function() {
      window.ChartEnhancer.resetAllCharts();
    };
  }
  
  console.log('Enhanced Chart Fix applied successfully');
})();
