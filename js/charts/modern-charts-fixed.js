/**
 * Modern Charts - Fixed Implementation
 * Provides modern chart visualizations while ensuring compatibility
 * with the existing Chart.js infrastructure
 */
(function() {
  console.log('Initializing Modern Charts (Fixed Version)');
  
  // Chart colors
  const chartColors = {
    // Primary palette
    primary: '#3b82f6',
    primaryLight: '#93c5fd',
    primaryDark: '#1d4ed8',
    
    // Secondary palette
    secondary: '#10b981',
    secondaryLight: '#6ee7b7',
    secondaryDark: '#047857',
    
    // Accent colors
    accent: '#8b5cf6',
    warning: '#f59e0b',
    danger: '#ef4444',
    success: '#10b981',
    info: '#3b82f6',
    
    // Vendor colors
    cisco: '#049fd9',
    aruba: '#ff7a00',
    forescout: '#005da8',
    fortinac: '#ee3124',
    nps: '#00a4ef',
    securew2: '#8bc53f',
    portnox: '#2bd25b',
    
    // Greyscale
    grey100: '#f3f4f6',
    grey200: '#e5e7eb',
    grey300: '#d1d5db',
    grey400: '#9ca3af',
    grey500: '#6b7280',
    grey600: '#4b5563',
    grey700: '#374151',
    grey800: '#1f2937',
    grey900: '#111827'
  };
  
  // Dark mode colors
  const darkModeColors = {
    text: '#f9fafb',
    textSecondary: '#e5e7eb',
    background: '#111827',
    backgroundSecondary: '#1f2937',
    border: '#374151',
    grid: 'rgba(75, 85, 99, 0.3)'
  };
  
  // Light mode colors
  const lightModeColors = {
    text: '#111827',
    textSecondary: '#4b5563',
    background: '#ffffff',
    backgroundSecondary: '#f9fafb',
    border: '#e5e7eb',
    grid: 'rgba(229, 231, 235, 0.6)'
  };
  
  // Current theme colors
  let themeColors = lightModeColors;
  
  // Helper to convert hex to rgba
  function hexToRgba(hex, alpha) {
    if (!hex) return 'rgba(0, 0, 0, 0.1)';
    
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  // Chart default configuration
  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          padding: 20,
          color: themeColors.text
        }
      },
      tooltip: {
        backgroundColor: hexToRgba(themeColors.background, 0.8),
        titleColor: themeColors.text,
        bodyColor: themeColors.textSecondary,
        borderColor: themeColors.border,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 4,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: themeColors.textSecondary
        }
      },
      y: {
        grid: {
          color: themeColors.grid,
          drawBorder: false
        },
        ticks: {
          color: themeColors.textSecondary
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };
  
  // Update chart styles for theme
  function updateChartStyles(isDark) {
    // Update theme colors
    themeColors = isDark ? darkModeColors : lightModeColors;
    
    // Update chart defaults
    if (window.Chart && window.Chart.defaults) {
      window.Chart.defaults.color = themeColors.textSecondary;
      
      if (window.Chart.defaults.plugins && window.Chart.defaults.plugins.tooltip) {
        window.Chart.defaults.plugins.tooltip.backgroundColor = hexToRgba(themeColors.background, 0.8);
        window.Chart.defaults.plugins.tooltip.titleColor = themeColors.text;
        window.Chart.defaults.plugins.tooltip.bodyColor = themeColors.textSecondary;
        window.Chart.defaults.plugins.tooltip.borderColor = themeColors.border;
      }
      
      // Update existing charts if ChartRegistryManager is available
      if (window.ChartRegistryManager) {
        try {
          window.ChartRegistryManager.updateAll('theme', isDark ? 'dark' : 'light');
        } catch (error) {
          console.warn('Error updating charts for theme:', error);
        }
      }
    }
  }

  // Modern Charts API
  window.ModernCharts = {
    // Colors for use in charts
    colors: chartColors,
    
    // Chart creation functions
    charts: {
      // TCO Comparison Chart
      tcoComparison: function(elementId, data) {
        const canvas = document.getElementById(elementId);
        if (!canvas) return null;
        
        // Prepare data
        const chartData = {
          labels: data.labels || ['Current Solution', 'Portnox Cloud'],
          datasets: [{
            label: 'Total Cost of Ownership',
            data: data.values || [300000, 150000],
            backgroundColor: [
              this.getVendorColor(data.currentVendor),
              chartColors.portnox
            ],
            borderColor: [
              this.getVendorColor(data.currentVendor, 0.8),
              hexToRgba(chartColors.portnox, 0.8)
            ],
            borderWidth: 1,
            borderRadius: 4,
            barThickness: 50
          }]
        };
        
        const config = {
          type: 'bar',
          data: chartData,
          options: {
            ...chartDefaults,
            plugins: {
              ...chartDefaults.plugins,
              tooltip: {
                ...chartDefaults.plugins.tooltip,
                callbacks: {
                  label: function(context) {
                    return `$${context.raw.toLocaleString()}`;
                  }
                }
              }
            },
            scales: {
              ...chartDefaults.scales,
              y: {
                ...chartDefaults.scales.y,
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            }
          }
        };
        
        return window.ChartFactory.create(canvas, config);
      },
      
      // Cumulative Cost Chart
      cumulativeCost: function(elementId, data) {
        const canvas = document.getElementById(elementId);
        if (!canvas) return null;
        
        // Prepare data
        const labels = data.labels || ['Initial', 'Year 1', 'Year 2', 'Year 3'];
        const currentValues = data.currentValues || [100000, 200000, 300000, 400000];
        const portnoxValues = data.portnoxValues || [45000, 90000, 135000, 180000];
        
        const chartData = {
          labels: labels,
          datasets: [
            {
              label: data.currentVendorName || 'Current Solution',
              data: currentValues,
              borderColor: this.getVendorColor(data.currentVendor),
              backgroundColor: hexToRgba(this.getVendorColor(data.currentVendor), 0.1),
              fill: true,
              tension: 0.4,
              borderWidth: 2,
              pointBackgroundColor: this.getVendorColor(data.currentVendor),
              pointRadius: 4,
              pointHoverRadius: 6
            },
            {
              label: 'Portnox Cloud',
              data: portnoxValues,
              borderColor: chartColors.portnox,
              backgroundColor: hexToRgba(chartColors.portnox, 0.1),
              fill: true,
              tension: 0.4,
              borderWidth: 2,
              pointBackgroundColor: chartColors.portnox,
              pointRadius: 4,
              pointHoverRadius: 6
            }
          ]
        };
        
        const config = {
          type: 'line',
          data: chartData,
          options: {
            ...chartDefaults,
            plugins: {
              ...chartDefaults.plugins,
              tooltip: {
                ...chartDefaults.plugins.tooltip,
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                  }
                }
              }
            },
            scales: {
              ...chartDefaults.scales,
              y: {
                ...chartDefaults.scales.y,
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            }
          }
        };
        
        return window.ChartFactory.create(canvas, config);
      },
      
      // Cost Breakdown Chart
      costBreakdown: function(elementId, data) {
        const canvas = document.getElementById(elementId);
        if (!canvas) return null;
        
        // Prepare data
        const labels = data.labels || ['Hardware', 'Software', 'Implementation', 'Licensing', 'Maintenance', 'Support', 'Personnel'];
        const values = data.values || [50000, 75000, 45000, 35000, 15000, 20000, 85000];
        
        // Generate colors based on isPortnox
        const isPortnox = data.isPortnox || false;
        const baseColor = isPortnox ? chartColors.portnox : chartColors.primary;
        
        // Generate gradient colors
        const colors = [];
        const colorCount = labels.length;
        
        for (let i = 0; i < colorCount; i++) {
          // Mix the base color with varying amounts of white/secondary
          if (isPortnox) {
            // For Portnox, use a green-based palette
            colors.push(this.mixColors(baseColor, chartColors.secondaryLight, i / (colorCount - 1)));
          } else {
            // For other vendors, use a blue-based palette
            colors.push(this.mixColors(baseColor, chartColors.primaryLight, i / (colorCount - 1)));
          }
        }
        
        const chartData = {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: colors,
            borderColor: themeColors.background,
            borderWidth: 2,
            hoverOffset: 15
          }]
        };
        
        const config = {
          type: 'doughnut',
          data: chartData,
          options: {
            ...chartDefaults,
            cutout: '60%',
            plugins: {
              ...chartDefaults.plugins,
              legend: {
                ...chartDefaults.plugins.legend,
                position: 'right',
                labels: {
                  ...chartDefaults.plugins.legend.labels,
                  padding: 15,
                  font: {
                    size: 12
                  }
                }
              },
              tooltip: {
                ...chartDefaults.plugins.tooltip,
                callbacks: {
                  label: function(context) {
                    const value = context.raw;
                    const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
                  }
                }
              }
            }
          }
        };
        
        return window.ChartFactory.create(canvas, config);
      },
      
      // Feature Comparison Chart
      featureComparison: function(elementId, data) {
        const canvas = document.getElementById(elementId);
        if (!canvas) return null;
        
        // Prepare data
        const labels = data.labels || [
          'Scalability',
          'Ease of Use',
          'Deployment Speed',
          'Cost Efficiency',
          'Security Features',
          'Compliance',
          'Cloud Integration'
        ];
        
        const currentVendor = data.currentVendor || 'cisco';
        const currentValues = data.currentValues || [70, 60, 50, 40, 80, 75, 55];
        const portnoxValues = data.portnoxValues || [90, 85, 95, 90, 85, 90, 95];
        
        const chartData = {
          labels: labels,
          datasets: [
            {
              label: data.currentVendorName || 'Current Solution',
              data: currentValues,
              backgroundColor: hexToRgba(this.getVendorColor(currentVendor), 0.2),
              borderColor: this.getVendorColor(currentVendor),
              borderWidth: 2,
              pointBackgroundColor: this.getVendorColor(currentVendor),
              pointBorderColor: themeColors.background,
              pointHoverBackgroundColor: themeColors.background,
              pointHoverBorderColor: this.getVendorColor(currentVendor),
              pointRadius: 4,
              pointHoverRadius: 6
            },
            {
              label: 'Portnox Cloud',
              data: portnoxValues,
              backgroundColor: hexToRgba(chartColors.portnox, 0.2),
              borderColor: chartColors.portnox,
              borderWidth: 2,
              pointBackgroundColor: chartColors.portnox,
              pointBorderColor: themeColors.background,
              pointHoverBackgroundColor: themeColors.background,
              pointHoverBorderColor: chartColors.portnox,
              pointRadius: 4,
              pointHoverRadius: 6
            }
          ]
        };
        
        const config = {
          type: 'radar',
          data: chartData,
          options: {
            ...chartDefaults,
            scales: {
              r: {
                angleLines: {
                  display: true,
                  color: themeColors.grid
                },
                grid: {
                  color: themeColors.grid
                },
                pointLabels: {
                  font: {
                    size: 12
                  },
                  color: themeColors.text
                },
                suggestedMin: 0,
                suggestedMax: 100,
                ticks: {
                  stepSize: 20,
                  backdropColor: 'transparent',
                  color: themeColors.textSecondary
                }
              }
            }
          }
        };
        
        return window.ChartFactory.create(canvas, config);
      },
      
      // Implementation Comparison Chart
      implementationComparison: function(elementId, data) {
        const canvas = document.getElementById(elementId);
        if (!canvas) return null;
        
        // Prepare data
        const labels = data.labels || ['Planning', 'Installation', 'Configuration', 'Testing', 'Deployment', 'Training'];
        const currentValues = data.currentValues || [10, 14, 21, 15, 20, 10];
        const portnoxValues = data.portnoxValues || [5, 2, 8, 7, 5, 3];
        
        const chartData = {
          labels: labels,
          datasets: [
            {
              label: data.currentVendorName || 'Current Solution (days)',
              data: currentValues,
              backgroundColor: this.getVendorColor(data.currentVendor),
              borderRadius: 4,
              barPercentage: 0.6,
              categoryPercentage: 0.7
            },
            {
              label: 'Portnox Cloud (days)',
              data: portnoxValues,
              backgroundColor: chartColors.portnox,
              borderRadius: 4,
              barPercentage: 0.6,
              categoryPercentage: 0.7
            }
          ]
        };
        
        const config = {
          type: 'bar',
          data: chartData,
          options: {
            ...chartDefaults,
            scales: {
              ...chartDefaults.scales,
              y: {
                ...chartDefaults.scales.y,
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Days',
                  color: themeColors.text,
                  font: {
                    size: 12,
                    weight: 'bold'
                  }
                }
              }
            }
          }
        };
        
        return window.ChartFactory.create(canvas, config);
      },
      
      // ROI Chart
      roi: function(elementId, data) {
        const canvas = document.getElementById(elementId);
        if (!canvas) return null;
        
        // Prepare data
        const labels = data.labels || ['Initial', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
        const currentValues = data.currentValues || [-170000, -120000, -70000, -20000, 30000, 80000];
        const portnoxValues = data.portnoxValues || [-45000, 10000, 65000, 120000, 175000, 230000];
        
        const chartData = {
          labels: labels,
          datasets: [
            {
              label: data.currentVendorName || 'Current Solution ROI',
              data: currentValues,
              borderColor: this.getVendorColor(data.currentVendor),
              backgroundColor: hexToRgba(this.getVendorColor(data.currentVendor), 0.1),
              fill: 'origin',
              tension: 0.4,
              borderWidth: 2,
              pointBackgroundColor: this.getVendorColor(data.currentVendor),
              pointRadius: 4,
              pointHoverRadius: 6
            },
            {
              label: 'Portnox Cloud ROI',
              data: portnoxValues,
              borderColor: chartColors.portnox,
              backgroundColor: hexToRgba(chartColors.portnox, 0.1),
              fill: 'origin',
              tension: 0.4,
              borderWidth: 2,
              pointBackgroundColor: chartColors.portnox,
              pointRadius: 4,
              pointHoverRadius: 6
            }
          ]
        };
        
        const config = {
          type: 'line',
          data: chartData,
          options: {
            ...chartDefaults,
            plugins: {
              ...chartDefaults.plugins,
              tooltip: {
                ...chartDefaults.plugins.tooltip,
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                  }
                }
              }
            },
            scales: {
              ...chartDefaults.scales,
              y: {
                ...chartDefaults.scales.y,
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            }
          }
        };
        
        return window.ChartFactory.create(canvas, config);
      }
    },
    
    // Helper methods
    getVendorColor: function(vendorId, alpha = 1) {
      const vendorColor = chartColors[vendorId] || chartColors.primary;
      return alpha < 1 ? hexToRgba(vendorColor, alpha) : vendorColor;
    },
    
    mixColors: function(color1, color2, ratio) {
      // Extract RGB components
      const r1 = parseInt(color1.slice(1, 3), 16);
      const g1 = parseInt(color1.slice(3, 5), 16);
      const b1 = parseInt(color1.slice(5, 7), 16);
      
      const r2 = parseInt(color2.slice(1, 3), 16);
      const g2 = parseInt(color2.slice(3, 5), 16);
      const b2 = parseInt(color2.slice(5, 7), 16);
      
      // Mix colors
      const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
      const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
      const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
      
      // Convert back to hex
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    
    // Update dark mode for charts
    updateDarkMode: function(isDark) {
      updateChartStyles(isDark);
    }
  };
  
  // Listen for dark mode changes
  document.addEventListener('DOMContentLoaded', function() {
    // Check for system preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check for stored preference
    const storedPreference = localStorage.getItem('darkMode');
    
    if (storedPreference === 'true' || (storedPreference === null && prefersDarkMode)) {
      updateChartStyles(true);
    } else {
      updateChartStyles(false);
    }
  });
  
  console.log('Modern Charts (Fixed Version) initialized');
})();
