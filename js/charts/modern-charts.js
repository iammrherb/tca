/**
 * Modern Charts Implementation for NAC Architecture Designer Pro
 * This file provides enhanced chart visualizations with animations and modern styling
 */

const ModernCharts = (function() {
  // Configuration
  const config = {
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
      danger: '#ef4444',
      warning: '#f59e0b',
      info: '#6b7280',
      light: '#f3f4f6',
      dark: '#1f2937',
      cisco: '#1BA0D7',
      aruba: '#A3CE39',
      forescout: '#FF6821',
      fortinac: '#EE3124',
      microsoft: '#7FBA00',
      securew2: '#FDB715',
      portnox: '#2BD25B'
    },
    fonts: {
      base: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      heading: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    },
    darkMode: {
      backgroundColor: '#1e293b',
      textColor: '#f1f5f9',
      gridColor: '#334155'
    }
  };

  // Chart.js Global Configuration
  function setupChartJS() {
    if (typeof Chart !== 'undefined') {
      Chart.defaults.font.family = config.fonts.base;
      Chart.defaults.font.size = 12;
      Chart.defaults.animation.duration = 1000;
      Chart.defaults.animation.easing = 'easeOutQuart';
      Chart.defaults.elements.bar.borderRadius = 4;
      Chart.defaults.elements.point.radius = 4;
      Chart.defaults.elements.point.hoverRadius = 6;
      Chart.defaults.elements.line.tension = 0.3;
      
      // Custom Plugin for Gradient Backgrounds
      const gradientPlugin = {
        id: 'gradientFill',
        beforeDatasetsDraw(chart, _, options) {
          const { ctx, chartArea: { top, bottom, left, width, height } } = chart;
          
          if (chart.config.type === 'bar' || chart.config.type === 'line') {
            chart.data.datasets.forEach((dataset, i) => {
              if (dataset.useGradient) {
                const gradient = ctx.createLinearGradient(0, top, 0, bottom);
                gradient.addColorStop(0, dataset.backgroundColor);
                gradient.addColorStop(1, chart.options.plugins.gradientFill?.endColor || 'rgba(255, 255, 255, 0.1)');
                dataset.backgroundColor = gradient;
              }
            });
          }
        }
      };
      
      Chart.register(gradientPlugin);
    }
  }
  
  // Initialize chart styles based on dark mode
  function updateChartStyles(isDarkMode) {
    if (typeof Chart !== 'undefined') {
      Chart.defaults.color = isDarkMode ? config.darkMode.textColor : config.colors.dark;
      Chart.defaults.scale.grid.color = isDarkMode ? config.darkMode.gridColor : '#e5e7eb';
      
      // Update all existing charts
      Chart.instances.forEach(chart => {
        chart.options.scales.x.grid.color = isDarkMode ? config.darkMode.gridColor : '#e5e7eb';
        chart.options.scales.y.grid.color = isDarkMode ? config.darkMode.gridColor : '#e5e7eb';
        chart.update();
      });
    }
  }
  
  // TCO Comparison Chart
  function createTCOComparisonChart(ctx, data, options = {}) {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Default configuration for TCO comparison
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        delay: (context) => context.dataIndex * 100
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: isDarkMode ? config.darkMode.backgroundColor : 'white',
          titleColor: isDarkMode ? config.darkMode.textColor : config.colors.dark,
          bodyColor: isDarkMode ? config.darkMode.textColor : config.colors.dark,
          borderColor: isDarkMode ? config.darkMode.gridColor : '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 8,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: (context) => {
              return ` ${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              return '$' + value.toLocaleString();
            }
          }
        }
      }
    };
    
    const chartOptions = { ...defaultOptions, ...options };
    
    return new Chart(ctx, {
      type: 'bar',
      data: data,
      options: chartOptions
    });
  }
  
  // Cumulative Cost Chart
  function createCumulativeCostChart(ctx, data, options = {}) {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        delay: (context) => context.dataIndex * 100
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: isDarkMode ? config.darkMode.backgroundColor : 'white',
          titleColor: isDarkMode ? config.darkMode.textColor : config.colors.dark,
          bodyColor: isDarkMode ? config.darkMode.textColor : config.colors.dark,
          borderColor: isDarkMode ? config.darkMode.gridColor : '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 8,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: (context) => {
              return ` ${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              return '$' + value.toLocaleString();
            }
          }
        }
      }
    };
    
    const chartOptions = { ...defaultOptions, ...options };
    
    return new Chart(ctx, {
      type: 'line',
      data: data,
      options: chartOptions
    });
  }
  
  // Cost Breakdown Chart
  function createCostBreakdownChart(ctx, data, options = {}) {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: isDarkMode ? config.darkMode.backgroundColor : 'white',
          titleColor: isDarkMode ? config.darkMode.textColor : config.colors.dark,
          bodyColor: isDarkMode ? config.darkMode.textColor : config.colors.dark,
          borderColor: isDarkMode ? config.darkMode.gridColor : '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 8,
          boxPadding: 6,
          callbacks: {
            label: (context) => {
              const value = context.raw;
              const total = context.chart.data.datasets[0].data.reduce((sum, val) => sum + val, 0);
              const percentage = Math.round((value / total) * 100);
              return ` ${context.label}: $${value.toLocaleString()} (${percentage}%)`;
            }
          }
        }
      }
    };
    
    const chartOptions = { ...defaultOptions, ...options };
    
    return new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: chartOptions
    });
  }
  
  // Feature Comparison Chart (Radar)
  function createFeatureComparisonChart(ctx, data, options = {}) {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        line: {
          borderWidth: 2
        },
        point: {
          radius: 3,
          hoverRadius: 5
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: isDarkMode ? config.darkMode.backgroundColor : 'white',
          titleColor: isDarkMode ? config.darkMode.textColor : config.colors.dark,
          bodyColor: isDarkMode ? config.darkMode.textColor : config.colors.dark,
          borderColor: isDarkMode ? config.darkMode.gridColor : '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 8,
          boxPadding: 6,
          usePointStyle: true
        }
      },
      scales: {
        r: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 2,
            showLabelBackdrop: false,
            font: {
              size: 10
            }
          },
          pointLabels: {
            font: {
              size: 12
            }
          },
          grid: {
            color: isDarkMode ? config.darkMode.gridColor : '#e5e7eb'
          },
          angleLines: {
            color: isDarkMode ? config.darkMode.gridColor : '#e5e7eb'
          }
        }
      }
    };
    
    const chartOptions = { ...defaultOptions, ...options };
    
    return new Chart(ctx, {
      type: 'radar',
      data: data,
      options: chartOptions
    });
  }
  
  // Implementation Comparison Chart
  function createImplementationComparisonChart(ctx, data, options = {}) {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      animation: {
        delay: (context) => context.dataIndex * 100
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: isDarkMode ? config.darkMode.backgroundColor : 'white',
          titleColor: isDarkMode ? config.darkMode.textColor : config.colors.dark,
          bodyColor: isDarkMode ? config.darkMode.textColor : config.colors.dark,
          borderColor: isDarkMode ? config.darkMode.gridColor : '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 8,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: (context) => {
              return ` ${context.dataset.label}: ${context.parsed.x} days`;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              return value + ' days';
            }
          }
        },
        y: {
          grid: {
            display: false
          }
        }
      }
    };
    
    const chartOptions = { ...defaultOptions, ...options };
    
    return new Chart(ctx, {
      type: 'bar',
      data: data,
      options: chartOptions
    });
  }
  
  // ROI Chart
  function createROIChart(ctx, data, options = {}) {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        delay: (context) => context.dataIndex * 100
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: isDarkMode ? config.darkMode.backgroundColor : 'white',
          titleColor: isDarkMode ? config.darkMode.textColor : config.colors.dark,
          bodyColor: isDarkMode ? config.darkMode.textColor : config.colors.dark,
          borderColor: isDarkMode ? config.darkMode.gridColor : '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 8,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: (context) => {
              return ` ${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              return '$' + value.toLocaleString();
            }
          }
        }
      }
    };
    
    const chartOptions = { ...defaultOptions, ...options };
    
    return new Chart(ctx, {
      type: 'line',
      data: data,
      options: chartOptions
    });
  }
  
  // Risk Analysis Chart
  function createRiskAnalysisChart(ctx, data, options = {}) {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: isDarkMode ? config.darkMode.backgroundColor : 'white',
          titleColor: isDarkMode ? config.darkMode.textColor : config.colors.dark,
          bodyColor: isDarkMode ? config.darkMode.textColor : config.colors.dark,
          borderColor: isDarkMode ? config.darkMode.gridColor : '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 8,
          boxPadding: 6,
          callbacks: {
            label: (context) => {
              const value = context.raw;
              const total = context.chart.data.datasets[0].data.reduce((sum, val) => sum + val, 0);
              const percentage = Math.round((value / total) * 100);
              return ` ${context.label}: $${value.toLocaleString()} (${percentage}%)`;
            }
          }
        }
      }
    };
    
    const chartOptions = { ...defaultOptions, ...options };
    
    return new Chart(ctx, {
      type: 'polarArea',
      data: data,
      options: chartOptions
    });
  }
  
  // Sensitivity Analysis Chart
  function createSensitivityChart(ctx, data, options = {}) {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        delay: (context) => context.dataIndex * 50
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: isDarkMode ? config.darkMode.backgroundColor : 'white',
          titleColor: isDarkMode ? config.darkMode.textColor : config.colors.dark,
          bodyColor: isDarkMode ? config.darkMode.textColor : config.colors.dark,
          borderColor: isDarkMode ? config.darkMode.gridColor : '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 8,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: (context) => {
              return ` ${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: isDarkMode ? config.darkMode.gridColor : '#e5e7eb'
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              return '$' + value.toLocaleString();
            }
          },
          grid: {
            color: isDarkMode ? config.darkMode.gridColor : '#e5e7eb'
          }
        }
      }
    };
    
    const chartOptions = { ...defaultOptions, ...options };
    
    return new Chart(ctx, {
      type: 'line',
      data: data,
      options: chartOptions
    });
  }
  
  // Risk Heatmap Chart using D3.js
  function createRiskHeatmap(selector, data, options = {}) {
    if (typeof d3 === 'undefined') {
      console.error('D3.js is required for the risk heatmap');
      return;
    }
    
    const container = d3.select(selector);
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Clear any existing content
    container.html('');
    
    const width = container.node().getBoundingClientRect().width;
    const height = 400;
    
    const defaultOptions = {
      margin: { top: 30, right: 30, bottom: 30, left: 30 },
      colorRange: ['#10b981', '#f59e0b', '#ef4444'],
      textColor: isDarkMode ? config.darkMode.textColor : config.colors.dark,
      backgroundColor: isDarkMode ? config.darkMode.backgroundColor : 'white'
    };
    
    const chartOptions = { ...defaultOptions, ...options };
    
    const colorScale = d3.scaleSequential()
      .domain([0, data.length - 1])
      .interpolator(d3.interpolate(chartOptions.colorRange[0], chartOptions.colorRange[2]));
    
    const svg = container.append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${chartOptions.margin.left},${chartOptions.margin.top})`);
    
    const xScale = d3.scaleBand()
      .domain(['Low', 'Medium', 'High', 'Critical'])
      .range([0, width - chartOptions.margin.left - chartOptions.margin.right])
      .padding(0.05);
    
    const yScale = d3.scaleBand()
      .domain(['Unlikely', 'Possible', 'Likely', 'Very Likely', 'Almost Certain'])
      .range([height - chartOptions.margin.top - chartOptions.margin.bottom, 0])
      .padding(0.05);
    
    // Create x-axis
    svg.append('g')
      .style('font-size', '12px')
      .style('color', chartOptions.textColor)
      .attr('transform', `translate(0,${height - chartOptions.margin.top - chartOptions.margin.bottom})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .select('.domain').remove();
    
    // Create y-axis
    svg.append('g')
      .style('font-size', '12px')
      .style('color', chartOptions.textColor)
      .call(d3.axisLeft(yScale).tickSize(0))
      .select('.domain').remove();
    
    // Create the heatmap cells
    svg.selectAll()
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.impact))
      .attr('y', d => yScale(d.likelihood))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .style('fill', (d, i) => colorScale(i))
      .style('stroke', 'white')
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 50)
      .style('opacity', 1);
    
    // Add text labels
    svg.selectAll()
      .data(data)
      .enter()
      .append('text')
      .attr('x', d => xScale(d.impact) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.likelihood) + yScale.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', 'white')
      .style('opacity', 0)
      .text(d => d.score)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 50 + 500)
      .style('opacity', 1);
    
    // Add title
    svg.append('text')
      .attr('x', (width - chartOptions.margin.left - chartOptions.margin.right) / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', chartOptions.textColor)
      .text('Risk Assessment Heatmap');
  }
  
  // Create a Compliance Matrix Chart
  function createComplianceMatrix(selector, data, options = {}) {
    const container = document.querySelector(selector);
    
    if (!container) {
      console.error('Container not found');
      return;
    }
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Clear any existing content
    container.innerHTML = '';
    
    const defaultOptions = {
      headerColors: {
        background: isDarkMode ? '#1e293b' : '#f3f4f6',
        text: isDarkMode ? '#f1f5f9' : '#1f2937'
      },
      cellColors: {
        background: isDarkMode ? '#0f172a' : 'white',
        text: isDarkMode ? '#f1f5f9' : '#1f2937'
      },
      statusColors: {
        full: '#10b981',
        partial: '#f59e0b',
        none: '#ef4444'
      }
    };
    
    const chartOptions = { ...defaultOptions, ...options };
    
    const matrix = document.createElement('div');
    matrix.className = 'compliance-matrix';
    container.appendChild(matrix);
    
    // Create headers
    const headerRow = document.createElement('div');
    headerRow.className = 'compliance-matrix-row';
    headerRow.style.display = 'grid';
    headerRow.style.gridTemplateColumns = `200px repeat(${data.vendors.length}, 1fr)`;
    matrix.appendChild(headerRow);
    
    // Framework header
    const frameworkHeader = document.createElement('div');
    frameworkHeader.className = 'compliance-matrix-cell compliance-matrix-header';
    frameworkHeader.textContent = 'Framework';
    frameworkHeader.style.backgroundColor = chartOptions.headerColors.background;
    frameworkHeader.style.color = chartOptions.headerColors.text;
    headerRow.appendChild(frameworkHeader);
    
    // Vendor headers
    data.vendors.forEach(vendor => {
      const vendorHeader = document.createElement('div');
      vendorHeader.className = 'compliance-matrix-cell compliance-matrix-header';
      vendorHeader.textContent = vendor.name;
      vendorHeader.style.backgroundColor = chartOptions.headerColors.background;
      vendorHeader.style.color = chartOptions.headerColors.text;
      headerRow.appendChild(vendorHeader);
    });
    
    // Create rows for each framework
    data.frameworks.forEach((framework, index) => {
      const frameworkRow = document.createElement('div');
      frameworkRow.className = 'compliance-matrix-row stagger-item fade-in';
      frameworkRow.style.display = 'grid';
      frameworkRow.style.gridTemplateColumns = `200px repeat(${data.vendors.length}, 1fr)`;
      frameworkRow.style.animationDelay = `${index * 100}ms`;
      matrix.appendChild(frameworkRow);
      
      // Framework name
      const frameworkName = document.createElement('div');
      frameworkName.className = 'compliance-matrix-cell';
      frameworkName.textContent = framework.name;
      frameworkName.style.backgroundColor = chartOptions.cellColors.background;
      frameworkName.style.color = chartOptions.cellColors.text;
      frameworkName.style.fontWeight = '500';
      frameworkRow.appendChild(frameworkName);
      
      // Vendor compliance statuses
      data.vendors.forEach(vendor => {
        const compliance = framework.compliance[vendor.id];
        const complianceCell = document.createElement('div');
        complianceCell.className = 'compliance-matrix-cell';
        complianceCell.style.backgroundColor = chartOptions.cellColors.background;
        complianceCell.style.justifyContent = 'center';
        frameworkRow.appendChild(complianceCell);
        
        // Create status indicator
        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'compliance-status';
        
        if (compliance === 'full') {
          statusIndicator.classList.add('compliance-full');
          statusIndicator.style.backgroundColor = chartOptions.statusColors.full;
          statusIndicator.innerHTML = '<i class="fas fa-check"></i>';
        } else if (compliance === 'partial') {
          statusIndicator.classList.add('compliance-partial');
          statusIndicator.style.backgroundColor = chartOptions.statusColors.partial;
          statusIndicator.innerHTML = '<i class="fas fa-adjust"></i>';
        } else {
          statusIndicator.classList.add('compliance-none');
          statusIndicator.style.backgroundColor = chartOptions.statusColors.none;
          statusIndicator.innerHTML = '<i class="fas fa-times"></i>';
        }
        
        complianceCell.appendChild(statusIndicator);
      });
    });
  }
  
  // Create Migration Timeline
  function createMigrationTimeline(selector, data, options = {}) {
    const container = document.querySelector(selector);
    
    if (!container) {
      console.error('Container not found');
      return;
    }
    
    // Clear any existing content
    container.innerHTML = '';
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    const defaultOptions = {
      textColor: isDarkMode ? '#f1f5f9' : '#1f2937',
      secondaryTextColor: isDarkMode ? '#94a3b8' : '#6b7280',
      vendorColors: {
        cisco: config.colors.cisco,
        aruba: config.colors.aruba,
        forescout: config.colors.forescout,
        fortinac: config.colors.fortinac,
        microsoft: config.colors.microsoft,
        securew2: config.colors.securew2,
        portnox: config.colors.portnox
      }
    };
    
    const chartOptions = { ...defaultOptions, ...options };
    
    const timeline = document.createElement('div');
    timeline.className = 'migration-timeline-container';
    container.appendChild(timeline);
    
    // Create timeline items
    data.phases.forEach((phase, index) => {
      const timelineItem = document.createElement('div');
      timelineItem.className = 'migration-timeline-item stagger-item slide-in-up';
      timelineItem.style.animationDelay = `${index * 200}ms`;
      timeline.appendChild(timelineItem);
      
      // Phase marker
      const marker = document.createElement('div');
      marker.className = 'migration-timeline-marker';
      marker.textContent = index + 1;
      timelineItem.appendChild(marker);
      
      // Phase content
      const content = document.createElement('div');
      content.className = 'migration-timeline-content';
      timelineItem.appendChild(content);
      
      // Phase header
      const header = document.createElement('div');
      header.className = 'migration-timeline-header';
      content.appendChild(header);
      
      // Phase title
      const title = document.createElement('div');
      title.className = 'migration-timeline-title';
      title.textContent = phase.name;
      title.style.color = chartOptions.textColor;
      header.appendChild(title);
      
      // Phase body
      const body = document.createElement('div');
      body.className = 'migration-timeline-body';
      body.textContent = phase.description;
      body.style.color = chartOptions.secondaryTextColor;
      content.appendChild(body);
      
      // Vendor comparison
      const comparison = document.createElement('div');
      comparison.className = 'migration-timeline-comparison';
      content.appendChild(comparison);
      
      // Competitor timeline
      const competitorTimeline = document.createElement('div');
      competitorTimeline.className = 'migration-vendor-timeline';
      comparison.appendChild(competitorTimeline);
      
      const competitorHeader = document.createElement('div');
      competitorHeader.className = 'migration-vendor-header';
      competitorTimeline.appendChild(competitorHeader);
      
      // Competitor logo (placeholder)
      const competitorLogo = document.createElement('div');
      competitorLogo.className = 'migration-vendor-logo';
      competitorLogo.style.backgroundColor = chartOptions.vendorColors[data.competitor.id];
      competitorLogo.style.width = '16px';
      competitorLogo.style.height = '16px';
      competitorLogo.style.borderRadius = '50%';
      competitorHeader.appendChild(competitorLogo);
      
      // Competitor name
      const competitorName = document.createElement('div');
      competitorName.className = 'migration-vendor-name';
      competitorName.textContent = data.competitor.name;
      competitorName.style.color = chartOptions.textColor;
      competitorHeader.appendChild(competitorName);
      
      // Competitor duration bar
      const competitorBar = document.createElement('div');
      competitorBar.className = 'migration-duration-bar';
      competitorTimeline.appendChild(competitorBar);
      
      const competitorDuration = document.createElement('div');
      competitorDuration.className = 'migration-duration-value';
      competitorDuration.style.width = '100%';
      competitorDuration.style.backgroundColor = chartOptions.vendorColors[data.competitor.id];
      competitorDuration.textContent = `${phase.competitorDuration} ${phase.competitorDuration === 1 ? 'day' : 'days'}`;
      competitorBar.appendChild(competitorDuration);
      
      // Portnox timeline
      const portnoxTimeline = document.createElement('div');
      portnoxTimeline.className = 'migration-vendor-timeline';
      comparison.appendChild(portnoxTimeline);
      
      const portnoxHeader = document.createElement('div');
      portnoxHeader.className = 'migration-vendor-header';
      portnoxTimeline.appendChild(portnoxHeader);
      
      // Portnox logo (placeholder)
      const portnoxLogo = document.createElement('div');
      portnoxLogo.className = 'migration-vendor-logo';
      portnoxLogo.style.backgroundColor = chartOptions.vendorColors.portnox;
      portnoxLogo.style.width = '16px';
      portnoxLogo.style.height = '16px';
      portnoxLogo.style.borderRadius = '50%';
      portnoxHeader.appendChild(portnoxLogo);
      
      // Portnox name
      const portnoxName = document.createElement('div');
      portnoxName.className = 'migration-vendor-name';
      portnoxName.textContent = 'Portnox Cloud';
      portnoxName.style.color = chartOptions.textColor;
      portnoxHeader.appendChild(portnoxName);
      
      // Portnox duration bar
      const portnoxBar = document.createElement('div');
      portnoxBar.className = 'migration-duration-bar';
      portnoxTimeline.appendChild(portnoxBar);
      
      // Calculate percentage based on the ratio
      const percentage = (phase.portnoxDuration / phase.competitorDuration) * 100;
      
      const portnoxDuration = document.createElement('div');
      portnoxDuration.className = 'migration-duration-value migration-duration-portnox';
      portnoxDuration.style.width = `${percentage}%`;
      portnoxDuration.style.backgroundColor = chartOptions.vendorColors.portnox;
      portnoxDuration.textContent = `${phase.portnoxDuration} ${phase.portnoxDuration === 1 ? 'day' : 'days'}`;
      portnoxBar.appendChild(portnoxDuration);
    });
  }
  
  // Public API
  return {
    setup: function() {
      setupChartJS();
    },
    updateDarkMode: function(isDarkMode) {
      updateChartStyles(isDarkMode);
    },
    charts: {
      tcoComparison: createTCOComparisonChart,
      cumulativeCost: createCumulativeCostChart,
      costBreakdown: createCostBreakdownChart,
      featureComparison: createFeatureComparisonChart,
      implementationComparison: createImplementationComparisonChart,
      roi: createROIChart,
      riskAnalysis: createRiskAnalysisChart,
      sensitivity: createSensitivityChart,
      riskHeatmap: createRiskHeatmap,
      complianceMatrix: createComplianceMatrix,
      migrationTimeline: createMigrationTimeline
    },
    colors: config.colors
  };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  ModernCharts.setup();
  
  // Listen for dark mode changes
  document.addEventListener('darkModeChanged', function(e) {
    ModernCharts.updateDarkMode(e.detail.isDarkMode);
  });
});
