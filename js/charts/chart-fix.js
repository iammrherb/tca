/**
 * Chart Fix - Ensures proper chart rendering
 */
(function() {
  console.log('Installing chart fix...');
  
  // Fix chart initialization issues
  function fixCharts() {
    if (!window.Chart) {
      console.warn('Chart.js not loaded yet, waiting...');
      setTimeout(fixCharts, 500);
      return;
    }
    
    console.log('Chart.js detected, initializing charts...');
    
    // Store chart instances
    window.chartInstances = window.chartInstances || {};
    
    // Chart configuration defaults
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 15,
            padding: 15
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: 10,
          cornerRadius: 4
        }
      }
    };
    
    // Color schemes
    const colorSchemes = {
      vendors: [
        'rgba(27, 103, 178, 0.7)',
        'rgba(43, 210, 91, 0.7)',
        'rgba(181, 67, 105, 0.7)',
        'rgba(199, 127, 26, 0.7)',
        'rgba(91, 63, 176, 0.7)',
        'rgba(33, 150, 243, 0.7)',
        'rgba(255, 167, 38, 0.7)'
      ],
      breakdown: [
        'rgba(27, 103, 178, 0.7)',
        'rgba(59, 130, 198, 0.7)',
        'rgba(91, 158, 219, 0.7)',
        'rgba(123, 185, 239, 0.7)',
        'rgba(166, 206, 245, 0.7)'
      ],
      features: [
        'rgba(27, 103, 178, 0.7)',
        'rgba(43, 210, 91, 0.7)'
      ]
    };
    
    // Chart default data
    const defaultData = {
      'tco-comparison-chart': {
        type: 'bar',
        data: {
          labels: ['Current Solution', 'Portnox Cloud'],
          datasets: [{
            label: 'Total Cost of Ownership',
            data: [100000, 60000],
            backgroundColor: colorSchemes.vendors.slice(0, 2)
          }]
        }
      },
      'cumulative-cost-chart': {
        type: 'line',
        data: {
          labels: ['Year 1', 'Year 2', 'Year 3'],
          datasets: [{
            label: 'Current Solution',
            data: [100000, 150000, 200000],
            borderColor: colorSchemes.vendors[0],
            backgroundColor: 'rgba(27, 103, 178, 0.1)',
            fill: true
          }, {
            label: 'Portnox Cloud',
            data: [60000, 90000, 120000],
            borderColor: colorSchemes.vendors[1],
            backgroundColor: 'rgba(43, 210, 91, 0.1)',
            fill: true
          }]
        }
      },
      'current-breakdown-chart': {
        type: 'doughnut',
        data: {
          labels: ['Hardware', 'Software', 'Implementation', 'Maintenance', 'Personnel'],
          datasets: [{
            data: [30000, 20000, 15000, 15000, 20000],
            backgroundColor: colorSchemes.breakdown
          }]
        }
      },
      'alternative-breakdown-chart': {
        type: 'doughnut',
        data: {
          labels: ['Hardware', 'Software', 'Implementation', 'Maintenance', 'Personnel'],
          datasets: [{
            data: [5000, 25000, 10000, 10000, 10000],
            backgroundColor: colorSchemes.breakdown
          }]
        }
      },
      'implementation-comparison-chart': {
        type: 'bar',
        data: {
          labels: ['Assessment', 'Planning', 'Deployment', 'Testing', 'Training'],
          datasets: [{
            label: 'Current Solution (days)',
            data: [10, 15, 20, 10, 5],
            backgroundColor: colorSchemes.vendors[0]
          }, {
            label: 'Portnox Cloud (days)',
            data: [5, 8, 10, 5, 2],
            backgroundColor: colorSchemes.vendors[1]
          }]
        }
      },
      'feature-comparison-chart': {
        type: 'radar',
        data: {
          labels: ['Scalability', 'Ease of Use', 'Deployment Speed', 'Cost Efficiency', 'Security Features', 'Compliance'],
          datasets: [{
            label: 'Current Solution',
            data: [70, 60, 50, 40, 80, 75],
            borderColor: colorSchemes.vendors[0],
            backgroundColor: 'rgba(27, 103, 178, 0.2)'
          }, {
            label: 'Portnox Cloud',
            data: [90, 85, 95, 90, 85, 90],
            borderColor: colorSchemes.vendors[1],
            backgroundColor: 'rgba(43, 210, 91, 0.2)'
          }]
        }
      },
      'roi-chart': {
        type: 'bar',
        data: {
          labels: ['Year 1', 'Year 2', 'Year 3'],
          datasets: [{
            label: 'ROI (%)',
            data: [20, 35, 50],
            backgroundColor: colorSchemes.vendors[1]
          }]
        }
      }
    };
    
    // Initialize all charts
    function initializeCharts() {
      Object.keys(defaultData).forEach(chartId => {
        const canvas = document.getElementById(chartId);
        if (!canvas) {
          console.warn(`Canvas element not found for chart: ${chartId}`);
          return;
        }
        
        // Destroy existing chart if it exists
        if (window.chartInstances[chartId]) {
          window.chartInstances[chartId].destroy();
          console.log(`Destroyed existing chart: ${chartId}`);
        }
        
        // Create new chart
        try {
          console.log(`Creating chart: ${chartId}`);
          const ctx = canvas.getContext('2d');
          const chartConfig = defaultData[chartId];
          chartConfig.options = { ...defaultOptions };
          
          window.chartInstances[chartId] = new Chart(ctx, chartConfig);
          console.log(`Chart created successfully: ${chartId}`);
        } catch (error) {
          console.error(`Error creating chart ${chartId}:`, error);
        }
      });
      
      console.log('All charts initialized successfully');
    }
    
    // Initialize charts
    initializeCharts();
    
    // Make the initialization function globally available
    window.reinitializeCharts = initializeCharts;
  }
  
  // Start chart fixing
  fixCharts();
  
  console.log('Chart fix installed successfully');
})();
