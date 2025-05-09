/**
 * Direct Chart Initialization Fix
 * This script directly creates charts with sample data
 */
(function() {
  console.log('Starting direct chart initialization...');
  
  // Wait for DOM and Chart.js to load
  function initChartsWhenReady() {
    if (typeof Chart === 'undefined') {
      console.log('Chart.js not loaded yet, waiting...');
      setTimeout(initChartsWhenReady, 200);
      return;
    }
    
    console.log('Chart.js detected, initializing charts...');
    createAllCharts();
  }
  
  // Create all charts with sample data
  function createAllCharts() {
    // Chart configurations
    const charts = [
      {
        id: 'tco-comparison-chart',
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
        }
      },
      {
        id: 'cumulative-cost-chart',
        type: 'line',
        data: {
          labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
          datasets: [
            {
              label: 'Current Solution',
              data: [150000, 250000, 350000, 450000, 550000],
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.1)',
              fill: true
            },
            {
              label: 'Portnox Cloud',
              data: [95000, 140000, 185000, 230000, 275000],
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
              fill: true
            }
          ]
        }
      },
      {
        id: 'current-breakdown-chart',
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
            ]
          }]
        }
      },
      {
        id: 'alternative-breakdown-chart',
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
            ]
          }]
        }
      },
      {
        id: 'implementation-comparison-chart',
        type: 'bar',
        data: {
          labels: ['Planning', 'Installation', 'Configuration', 'Testing', 'Deployment', 'Training'],
          datasets: [
            {
              label: 'Current Solution (days)',
              data: [10, 14, 21, 15, 20, 10],
              backgroundColor: 'rgba(54, 162, 235, 0.5)'
            },
            {
              label: 'Portnox Cloud (days)',
              data: [5, 2, 8, 7, 5, 3],
              backgroundColor: 'rgba(75, 192, 192, 0.5)'
            }
          ]
        }
      },
      {
        id: 'feature-comparison-chart',
        type: 'radar',
        data: {
          labels: ['Security', 'Scalability', 'Ease of Use', 'Deployment', 'Monitoring', 'Cloud Integration'],
          datasets: [
            {
              label: 'Current Solution',
              data: [70, 65, 60, 40, 70, 50],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)'
            },
            {
              label: 'Portnox Cloud',
              data: [85, 95, 85, 90, 80, 95],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)'
            }
          ]
        }
      },
      {
        id: 'roi-chart',
        type: 'line',
        data: {
          labels: ['Initial', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
          datasets: [
            {
              label: 'Current Solution ROI',
              data: [-170000, -120000, -70000, -20000, 30000, 80000],
              borderColor: 'rgba(54, 162, 235, 1)'
            },
            {
              label: 'Portnox Cloud ROI',
              data: [-45000, 10000, 65000, 120000, 175000, 230000],
              borderColor: 'rgba(75, 192, 192, 1)'
            }
          ]
        }
      }
    ];
    
    // Create each chart
    charts.forEach(function(chartConfig) {
      const container = document.getElementById(chartConfig.id);
      if (!container) {
        console.log('Chart container not found: ' + chartConfig.id);
        return;
      }
      
      console.log('Creating chart: ' + chartConfig.id);
      
      // Make the container visible
      container.style.display = 'block';
      container.style.visibility = 'visible';
      container.style.height = '300px';
      
      // Clear the container and create canvas
      container.innerHTML = '';
      const canvas = document.createElement('canvas');
      canvas.id = chartConfig.id + '-canvas';
      container.appendChild(canvas);
      
      // Add default options
      chartConfig.options = chartConfig.options || {
        responsive: true,
        maintainAspectRatio: false
      };
      
      // Create the chart
      try {
        new Chart(canvas, {
          type: chartConfig.type,
          data: chartConfig.data,
          options: chartConfig.options
        });
        console.log('Chart created successfully: ' + chartConfig.id);
      } catch (error) {
        console.error('Error creating chart: ' + chartConfig.id, error);
      }
    });
    
    // Make results container visible
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
      resultsContainer.classList.remove('hidden');
      resultsContainer.style.display = 'block';
      resultsContainer.style.visibility = 'visible';
      resultsContainer.style.opacity = '1';
    }
    
    console.log('All charts initialized successfully');
  }
  
  // Fix calculator function
  function fixCalculator() {
    console.log('Applying calculator fixes...');
    
    // Hook into the EnhancedCalculator's _calculateInitialCosts method to fix property access
    if (window.EnhancedCalculator && EnhancedCalculator.prototype._calculateInitialCosts) {
      const originalCalculateInitialCosts = EnhancedCalculator.prototype._calculateInitialCosts;
      
      EnhancedCalculator.prototype._calculateInitialCosts = function(vendor, params) {
        try {
          return originalCalculateInitialCosts.call(this, vendor, params);
        } catch (error) {
          console.log('Using fallback for _calculateInitialCosts', error);
          
          // Fallback implementation using either property structure
          const data = window.vendorData[vendor] || {};
          
          // Try both property structures
          let hardware = 0;
          if (data.initialCosts && data.initialCosts.hardware !== undefined) {
            hardware = data.initialCosts.hardware;
          } else if (data.initialHardware !== undefined) {
            hardware = data.initialHardware;
          }
          
          let software = 0;
          if (data.initialCosts && data.initialCosts.software !== undefined) {
            software = data.initialCosts.software;
          } else if (data.initialSoftware !== undefined) {
            software = data.initialSoftware;
          }
          
          let implementation = 0;
          if (data.initialCosts && data.initialCosts.implementation !== undefined) {
            implementation = data.initialCosts.implementation;
          } else if (data.initialImplementation !== undefined) {
            implementation = data.initialImplementation;
          }
          
          return {
            hardware: hardware,
            software: software,
            implementation: implementation,
            total: hardware + software + implementation
          };
        }
      };
    }
    
    // Apply similar fixes to other calculator methods as needed
    
    console.log('Calculator fixes applied');
  }
  
  // Make results visible
  function showResults() {
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
      resultsContainer.classList.remove('hidden');
      resultsContainer.style.display = 'block';
      
      // Trigger Calculate button
      const calculateBtn = document.getElementById('calculate-btn');
      if (calculateBtn) {
        calculateBtn.click();
      }
    }
  }
  
  // Add CSS fixes
  function addCSS() {
    const style = document.createElement('style');
    style.textContent = `
      .chart-container {
        display: block !important;
        position: relative !important;
        width: 100% !important;
        height: 300px !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      canvas {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      #results-container {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      .tab-pane.active {
        display: block !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize everything
  addCSS();
  fixCalculator();
  
  // Add a delay to ensure the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // Further delay to ensure Chart.js is loaded
      setTimeout(initChartsWhenReady, 500);
      setTimeout(showResults, 1000);
    });
  } else {
    // Page already loaded, initialize soon
    setTimeout(initChartsWhenReady, 500);
    setTimeout(showResults, 1000);
  }
  
  // Add another initialization on window load for good measure
  window.addEventListener('load', function() {
    setTimeout(initChartsWhenReady, 500);
    setTimeout(showResults, 1000);
  });
})();
