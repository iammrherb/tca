/**
 * Enhanced TCO Charts
 * Provides improved chart visualizations for TCO analysis
 */
(function() {
  console.log('Initializing Enhanced TCO Charts...');
  
  // Chart configuration
  const chartConfig = {
    colors: {
      portnox: {
        primary: '#2BD25B',
        secondary: 'rgba(43, 210, 91, 0.1)',
        highlight: 'rgba(43, 210, 91, 0.4)'
      },
      onPrem: {
        primary: '#1B67B2',
        secondary: 'rgba(27, 103, 178, 0.1)',
        highlight: 'rgba(27, 103, 178, 0.4)'
      },
      savings: {
        primary: '#7E57C2',
        secondary: 'rgba(126, 87, 194, 0.1)',
        highlight: 'rgba(126, 87, 194, 0.4)'
      }
    },
    
    // Format options for currency values
    currencyFormat: {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    },
    
    // Format options for percentage values
    percentFormat: {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }
  };
  
  // Enhanced TCO comparison chart
  function createEnhancedTCOComparisonChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    
    // Destroy existing chart if it exists
    if (canvas.chart) {
      canvas.chart.destroy();
    }
    
    // Format data
    const formattedData = formatTCOComparisonData(data);
    
    // Create chart
    const ctx = canvas.getContext('2d');
    canvas.chart = new Chart(ctx, {
      type: 'bar',
      data: formattedData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Total Cost (USD)'
            },
            ticks: {
              callback: function(value) {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                  notation: 'compact',
                  compactDisplay: 'short'
                }).format(value);
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Solution'
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw;
                return `${context.dataset.label}: ${new Intl.NumberFormat('en-US', chartConfig.currencyFormat).format(value)}`;
              }
            }
          },
          datalabels: {
            color: '#303030',
            anchor: 'end',
            align: 'top',
            formatter: function(value) {
              return new Intl.NumberFormat('en-US', chartConfig.currencyFormat).format(value);
            },
            font: {
              weight: 'bold'
            }
          }
        }
      }
    });
    
    return canvas.chart;
  }
  
  // Format data for TCO comparison chart
  function formatTCOComparisonData(data) {
    // Default data if none provided
    if (!data) {
      data = {
        vendors: ['On-Premises NAC', 'Portnox Cloud'],
        costs: [320000, 220000],
        categories: {
          hardware: [40000, 0],
          software: [100000, 150000],
          implementation: [50000, 30000],
          maintenance: [60000, 20000],
          personnel: [70000, 20000]
        }
      };
    }
    
    // Calculate total costs if not provided
    if (!data.costs && data.categories) {
      data.costs = [];
      
      for (let i = 0; i < data.vendors.length; i++) {
        let total = 0;
        
        Object.values(data.categories).forEach(categoryValues => {
          total += categoryValues[i] || 0;
        });
        
        data.costs.push(total);
      }
    }
    
    // Format chart data
    if (data.categories) {
      // Stacked bar chart with cost categories
      const datasets = [];
      const categoryColors = {
        hardware: { backgroundColor: '#FF9F40', hoverBackgroundColor: '#FF8C1A' },
        software: { backgroundColor: '#4BC0C0', hoverBackgroundColor: '#36A2A2' },
        licensing: { backgroundColor: '#4BC0C0', hoverBackgroundColor: '#36A2A2' },
        implementation: { backgroundColor: '#FF6384', hoverBackgroundColor: '#FF3357' },
        maintenance: { backgroundColor: '#9966FF', hoverBackgroundColor: '#8040FF' },
        personnel: { backgroundColor: '#36A2EB', hoverBackgroundColor: '#1A8AE2' },
        training: { backgroundColor: '#FFCD56', hoverBackgroundColor: '#FFBF28' }
      };
      
      // Map category names to display names
      const categoryDisplayNames = {
        hardware: 'Hardware',
        software: 'Software',
        licensing: 'Licensing',
        implementation: 'Implementation',
        maintenance: 'Maintenance',
        personnel: 'Personnel',
        training: 'Training'
      };
      
      // Create datasets for each category
      Object.entries(data.categories).forEach(([category, values]) => {
        const colors = categoryColors[category] || {
          backgroundColor: '#CCCCCC',
          hoverBackgroundColor: '#AAAAAA'
        };
        
        datasets.push({
          label: categoryDisplayNames[category] || category,
          data: values,
          backgroundColor: colors.backgroundColor,
          hoverBackgroundColor: colors.hoverBackgroundColor
        });
      });
      
      return {
        labels: data.vendors,
        datasets: datasets
      };
    } else {
      // Simple bar chart with total costs
      return {
        labels: data.vendors,
        datasets: [{
          label: 'Total Cost of Ownership',
          data: data.costs,
          backgroundColor: [
            chartConfig.colors.onPrem.primary,
            chartConfig.colors.portnox.primary
          ],
          borderColor: [
            chartConfig.colors.onPrem.primary,
            chartConfig.colors.portnox.primary
          ],
          borderWidth: 1
        }]
      };
    }
  }
  
  // Enhanced Cumulative Cost chart
  function createEnhancedCumulativeCostChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    
    // Destroy existing chart if it exists
    if (canvas.chart) {
      canvas.chart.destroy();
    }
    
    // Format data
    const formattedData = formatCumulativeCostData(data);
    
    // Create chart
    const ctx = canvas.getContext('2d');
    canvas.chart = new Chart(ctx, {
      type: 'line',
      data: formattedData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cumulative Cost (USD)'
            },
            ticks: {
              callback: function(value) {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                  notation: 'compact',
                  compactDisplay: 'short'
                }).format(value);
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Year'
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw;
                return `${context.dataset.label}: ${new Intl.NumberFormat('en-US', chartConfig.currencyFormat).format(value)}`;
              }
            }
          }
        },
        elements: {
          line: {
            tension: 0.3
          },
          point: {
            radius: 4,
            hoverRadius: 6
          }
        }
      }
    });
    
    return canvas.chart;
  }
  
  // Format data for cumulative cost chart
  function formatCumulativeCostData(data) {
    // Default data if none provided
    if (!data) {
      data = {
        years: [0, 1, 2, 3],
        onPrem: [100000, 200000, 300000, 400000],
        portnox: [80000, 150000, 220000, 290000]
      };
    }
    
    // Calculate savings if not provided
    if (!data.savings && data.onPrem && data.portnox) {
      data.savings = [];
      
      for (let i = 0; i < data.years.length; i++) {
        data.savings.push(data.onPrem[i] - data.portnox[i]);
      }
    }
    
    // Format chart data
    return {
      labels: data.years,
      datasets: [
        {
          label: 'On-Premises NAC',
          data: data.onPrem,
          borderColor: chartConfig.colors.onPrem.primary,
          backgroundColor: chartConfig.colors.onPrem.secondary,
          fill: true
        },
        {
          label: 'Portnox Cloud',
          data: data.portnox,
          borderColor: chartConfig.colors.portnox.primary,
          backgroundColor: chartConfig.colors.portnox.secondary,
          fill: true
        },
        {
          label: 'Cumulative Savings',
          data: data.savings,
          borderColor: chartConfig.colors.savings.primary,
          backgroundColor: chartConfig.colors.savings.secondary,
          borderDash: [5, 5],
          fill: false
        }
      ]
    };
  }
  
  // Enhanced ROI Timeline chart
  function createEnhancedROITimelineChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    
    // Destroy existing chart if it exists
    if (canvas.chart) {
      canvas.chart.destroy();
    }
    
    // Format data
    const formattedData = formatROITimelineData(data);
    
    // Create chart
    const ctx = canvas.getContext('2d');
    canvas.chart = new Chart(ctx, {
      type: 'bar',
      data: formattedData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Return on Investment (%)'
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
              text: 'Year'
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw;
                return `ROI: ${value}%`;
              }
            }
          },
          annotation: {
            annotations: {
              thresholdLine: {
                type: 'line',
                yMin: 100,
                yMax: 100,
                borderColor: '#FF6384',
                borderWidth: 2,
                borderDash: [5, 5],
                label: {
                  content: 'Break-even (100% ROI)',
                  position: 'start',
                  backgroundColor: 'rgba(255, 99, 132, 0.8)',
                  color: 'white',
                  enabled: true
                }
              }
            }
          }
        }
      }
    });
    
    return canvas.chart;
  }
  
  // Format data for ROI timeline chart
  function formatROITimelineData(data) {
    // Default data if none provided
    if (!data) {
      data = {
        years: [1, 2, 3],
        roi: [60, 140, 220]
      };
    }
    
    // Format chart data
    return {
      labels: data.years,
      datasets: [
        {
          label: 'Return on Investment',
          data: data.roi,
          backgroundColor: function(context) {
            const value = context.dataset.data[context.dataIndex];
            return value >= 100 ? chartConfig.colors.portnox.primary : '#FF9F40';
          }
        }
      ]
    };
  }
  
  // Enhanced Cost Breakdown chart
  function createEnhancedCostBreakdownChart(canvasId, data, vendor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    
    // Destroy existing chart if it exists
    if (canvas.chart) {
      canvas.chart.destroy();
    }
    
    // Format data
    const formattedData = formatCostBreakdownData(data, vendor);
    
    // Create chart
    const ctx = canvas.getContext('2d');
    canvas.chart = new Chart(ctx, {
      type: 'pie',
      data: formattedData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw;
                const total = context.chart.getDatasetMeta(0).total;
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${new Intl.NumberFormat('en-US', chartConfig.currencyFormat).format(value)} (${percentage}%)`;
              }
            }
          },
          datalabels: {
            color: '#fff',
            formatter: function(value, context) {
              const total = context.chart.getDatasetMeta(0).total;
              const percentage = Math.round((value / total) * 100);
              return percentage > 5 ? `${percentage}%` : '';
            },
            font: {
              weight: 'bold'
            }
          }
        }
      }
    });
    
    return canvas.chart;
  }
  
  // Format data for cost breakdown chart
  function formatCostBreakdownData(data, vendor) {
    // Default data if none provided
    const isPortnox = vendor === 'portnox';
    
    if (!data) {
      if (isPortnox) {
        data = {
          categories: ['Licensing', 'Implementation', 'Maintenance', 'Personnel'],
          values: [150000, 30000, 20000, 20000]
        };
      } else {
        data = {
          categories: ['Hardware', 'Licensing', 'Implementation', 'Maintenance', 'Personnel'],
          values: [40000, 100000, 50000, 60000, 70000]
        };
      }
    }
    
    // Color schemes
    const backgroundColors = isPortnox ? 
      ['#2BD25B', '#1B67B2', '#36A2EB', '#FFCD56', '#FF6384', '#9966FF', '#FF9F40'] :
      ['#1B67B2', '#36A2EB', '#4BC0C0', '#FFCD56', '#FF6384', '#9966FF', '#FF9F40'];
    
    // Format chart data
    return {
      labels: data.categories,
      datasets: [
        {
          data: data.values,
          backgroundColor: backgroundColors.slice(0, data.categories.length)
        }
      ]
    };
  }
  
  // Enhanced Implementation Comparison chart
  function createEnhancedImplementationComparisonChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    
    // Destroy existing chart if it exists
    if (canvas.chart) {
      canvas.chart.destroy();
    }
    
    // Format data
    const formattedData = formatImplementationComparisonData(data);
    
    // Create chart
    const ctx = canvas.getContext('2d');
    canvas.chart = new Chart(ctx, {
      type: 'horizontalBar',
      data: formattedData,
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Days'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Implementation Phase'
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.raw} days`;
              }
            }
          },
          datalabels: {
            color: '#303030',
            anchor: 'end',
            align: 'right',
            formatter: function(value) {
              return value + ' days';
            },
            font: {
              weight: 'bold'
            }
          }
        }
      }
    });
    
    return canvas.chart;
  }
  
  // Format data for implementation comparison chart
  function formatImplementationComparisonData(data) {
    // Default data if none provided
    if (!data) {
      data = {
        phases: ['Planning', 'Hardware Deployment', 'Software Installation', 'Configuration', 'Testing', 'User Training', 'Rollout'],
        onPrem: [10, 15, 5, 20, 15, 10, 15],
        portnox: [5, 0, 0, 10, 5, 5, 5]
      };
    }
    
    // Format chart data
    return {
      labels: data.phases,
      datasets: [
        {
          label: 'On-Premises NAC',
          data: data.onPrem,
          backgroundColor: chartConfig.colors.onPrem.primary
        },
        {
          label: 'Portnox Cloud',
          data: data.portnox,
          backgroundColor: chartConfig.colors.portnox.primary
        }
      ]
    };
  }
  
  // Enhanced Feature Comparison chart
  function createEnhancedFeatureComparisonChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    
    // Destroy existing chart if it exists
    if (canvas.chart) {
      canvas.chart.destroy();
    }
    
    // Format data
    const formattedData = formatFeatureComparisonData(data);
    
    // Create chart
    const ctx = canvas.getContext('2d');
    canvas.chart = new Chart(ctx, {
      type: 'radar',
      data: formattedData,
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
              stepSize: 1
            }
          }
        },
        elements: {
          line: {
            borderWidth: 2
          }
        },
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.raw}`;
              }
            }
          }
        }
      }
    });
    
    return canvas.chart;
  }
  
  // Format data for feature comparison chart
  function formatFeatureComparisonData(data) {
    // Default data if none provided
    if (!data) {
      data = {
        features: ['Ease of Use', 'Scalability', 'Maintenance', 'Cloud Integration', 'Security', 'Cost Effectiveness', 'Feature Set'],
        onPrem: [3, 2, 2, 2, 4, 2, 4],
        portnox: [4, 5, 5, 5, 4, 4, 4]
      };
    }
    
    // Format chart data
    return {
      labels: data.features,
      datasets: [
        {
          label: 'On-Premises NAC',
          data: data.onPrem,
          borderColor: chartConfig.colors.onPrem.primary,
          backgroundColor: chartConfig.colors.onPrem.secondary,
          pointBackgroundColor: chartConfig.colors.onPrem.primary
        },
        {
          label: 'Portnox Cloud',
          data: data.portnox,
          borderColor: chartConfig.colors.portnox.primary,
          backgroundColor: chartConfig.colors.portnox.secondary,
          pointBackgroundColor: chartConfig.colors.portnox.primary
        }
      ]
    };
  }
  
  // Enhanced Cost Factors Heatmap
  function createEnhancedCostFactorsHeatmap(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Format data
    const formattedData = formatCostFactorsData(data);
    
    // Create heatmap
    const heatmapHTML = `
      <div class="cost-factors-heatmap">
        <table class="heatmap-table">
          <thead>
            <tr>
              <th>Cost Factor</th>
              <th>On-Premises Impact</th>
              <th>Portnox Cloud Impact</th>
              <th>Cost Advantage</th>
            </tr>
          </thead>
          <tbody>
            ${formattedData.factors.map((factor, index) => `
              <tr>
                <td class="factor-name">${factor}</td>
                <td class="impact-cell ${getImpactClass(formattedData.onPremImpact[index])}">${getImpactLabel(formattedData.onPremImpact[index])}</td>
                <td class="impact-cell ${getImpactClass(formattedData.portnoxImpact[index])}">${getImpactLabel(formattedData.portnoxImpact[index])}</td>
                <td class="advantage-cell ${getAdvantageClass(formattedData.costAdvantage[index])}">${formattedData.costAdvantage[index]}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    
    // Add heatmap to container
    container.innerHTML = heatmapHTML;
    
    // Add CSS for heatmap
    const style = document.createElement('style');
    style.textContent = `
      .cost-factors-heatmap {
        margin: 20px 0;
      }
      
      .heatmap-table {
        width: 100%;
        border-collapse: collapse;
      }
      
      .heatmap-table th, 
      .heatmap-table td {
        padding: 10px;
        border: 1px solid #ddd;
        text-align: left;
      }
      
      .heatmap-table th {
        background-color: #f8f9fa;
        font-weight: 600;
      }
      
      .factor-name {
        font-weight: 500;
      }
      
      .impact-cell, .advantage-cell {
        text-align: center;
      }
      
      .impact-very-high {
        background-color: #FF6384;
        color: white;
      }
      
      .impact-high {
        background-color: #FF9F40;
        color: white;
      }
      
      .impact-medium {
        background-color: #FFCD56;
        color: #303030;
      }
      
      .impact-low {
        background-color: #4BC0C0;
        color: white;
      }
      
      .impact-none {
        background-color: #f8f9fa;
        color: #707070;
      }
      
      .advantage-portnox {
        background-color: #2BD25B;
        color: white;
      }
      
      .advantage-neutral {
        background-color: #f8f9fa;
        color: #707070;
      }
      
      .advantage-on-prem {
        background-color: #1B67B2;
        color: white;
      }
    `;
    
    document.head.appendChild(style);
    
    return container;
  }
  
  // Format data for cost factors heatmap
  function formatCostFactorsData(data) {
    // Default data if none provided
    if (!data) {
      data = {
        factors: ['Hardware Costs', 'Licensing Costs', 'Maintenance Costs', 'Implementation Costs', 'Personnel Costs', 'Deployment Time', 'Multi-Site Management'],
        onPremImpact: ['very-high', 'high', 'high', 'high', 'very-high', 'high', 'very-high'],
        portnoxImpact: ['none', 'high', 'low', 'medium', 'low', 'low', 'low']
      };
    }
    
    // Calculate cost advantage if not provided
    if (!data.costAdvantage) {
      data.costAdvantage = [];
      
      for (let i = 0; i < data.factors.length; i++) {
        const onPremValue = getImpactValue(data.onPremImpact[i]);
        const portnoxValue = getImpactValue(data.portnoxImpact[i]);
        
        if (onPremValue > portnoxValue) {
          data.costAdvantage.push('Portnox');
        } else if (onPremValue < portnoxValue) {
          data.costAdvantage.push('On-Premises');
        } else {
          data.costAdvantage.push('Neutral');
        }
      }
    }
    
    return data;
  }
  
  // Helper functions for heatmap
  function getImpactValue(impact) {
    const values = {
      'none': 0,
      'low': 1,
      'medium': 2,
      'high': 3,
      'very-high': 4
    };
    
    return values[impact] || 0;
  }
  
  function getImpactClass(impact) {
    return `impact-${impact}`;
  }
  
  function getImpactLabel(impact) {
    const labels = {
      'none': 'None',
      'low': 'Low',
      'medium': 'Medium',
      'high': 'High',
      'very-high': 'Very High'
    };
    
    return labels[impact] || impact;
  }
  
  function getAdvantageClass(advantage) {
    if (advantage === 'Portnox') {
      return 'advantage-portnox';
    } else if (advantage === 'On-Premises') {
      return 'advantage-on-prem';
    } else {
      return 'advantage-neutral';
    }
  }
  
  // Enhanced Resource Utilization chart
  function createEnhancedResourceUtilizationChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    
    // Destroy existing chart if it exists
    if (canvas.chart) {
      canvas.chart.destroy();
    }
    
    // Format data
    const formattedData = formatResourceUtilizationData(data);
    
    // Create chart
    const ctx = canvas.getContext('2d');
    canvas.chart = new Chart(ctx, {
      type: 'bar',
      data: formattedData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'FTE Hours per Month'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Activity Type'
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.raw} hours/month`;
              }
            }
          },
          datalabels: {
            color: '#303030',
            anchor: 'end',
            align: 'top',
            formatter: function(value) {
              return value + ' hrs';
            },
            font: {
              weight: 'bold'
            }
          }
        }
      }
    });
    
    return canvas.chart;
  }
  
  // Format data for resource utilization chart
  function formatResourceUtilizationData(data) {
    // Default data if none provided
    if (!data) {
      data = {
        activities: ['Administration', 'Maintenance', 'Troubleshooting', 'Updates', 'Reporting'],
        onPrem: [40, 30, 25, 20, 15],
        portnox: [15, 5, 10, 0, 10]
      };
    }
    
    // Format chart data
    return {
      labels: data.activities,
      datasets: [
        {
          label: 'On-Premises NAC',
          data: data.onPrem,
          backgroundColor: chartConfig.colors.onPrem.primary
        },
        {
          label: 'Portnox Cloud',
          data: data.portnox,
          backgroundColor: chartConfig.colors.portnox.primary
        }
      ]
    };
  }
  
  // Register chart creation functions
  window.EnhancedTCOCharts = {
    createTCOComparisonChart: createEnhancedTCOComparisonChart,
    createCumulativeCostChart: createEnhancedCumulativeCostChart,
    createROITimelineChart: createEnhancedROITimelineChart,
    createCostBreakdownChart: createEnhancedCostBreakdownChart,
    createImplementationComparisonChart: createEnhancedImplementationComparisonChart,
    createFeatureComparisonChart: createEnhancedFeatureComparisonChart,
    createCostFactorsHeatmap: createEnhancedCostFactorsHeatmap,
    createResourceUtilizationChart: createEnhancedResourceUtilizationChart
  };
  
  console.log('Enhanced TCO Charts initialized');
})();
