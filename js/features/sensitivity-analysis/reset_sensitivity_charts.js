/**
 * Chart reset utility specifically for sensitivity analysis
 */
(function() {
  console.log('Applying sensitivity chart reset utility...');

  // Function to create blank charts if they don't exist
  function ensureChartsExist() {
    // Check sensitivity chart
    const sensChart = document.getElementById('sensitivity-chart');
    if (sensChart && !sensChart._chart) {
      try {
        console.log('Initializing blank sensitivity chart...');
        const ctx = sensChart.getContext('2d');
        sensChart._chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['No Data'],
            datasets: [{
              label: 'Run analysis to see results',
              data: [0],
              borderColor: '#1B67B2',
              backgroundColor: 'rgba(27, 103, 178, 0.1)'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      } catch (error) {
        console.error('Error creating blank sensitivity chart:', error);
      }
    }

    // Check savings impact chart
    const savingsChart = document.getElementById('savings-impact-chart');
    if (savingsChart && !savingsChart._chart) {
      try {
        console.log('Initializing blank savings impact chart...');
        const ctx = savingsChart.getContext('2d');
        savingsChart._chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['No Data'],
            datasets: [{
              label: 'Run analysis to see results',
              data: [0],
              borderColor: '#2BD25B',
              backgroundColor: 'rgba(43, 210, 91, 0.1)'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      } catch (error) {
        console.error('Error creating blank savings impact chart:', error);
      }
    }
  }

  // Wait for DOM to be ready and then ensure charts exist
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(ensureChartsExist, 500);
    });
  } else {
    setTimeout(ensureChartsExist, 500);
  }
})();
