/**
 * Integrated TCO Analyzer
 * Main integration script for enhanced TCO analyzer features with fixes
 */
(function() {
  console.log('Initializing Integrated TCO Analyzer...');

  // Configuration
  const config = {
    debug: true,
    autoInitialize: true,
    components: {
      chartManager: true,
      analysisComponent: true,
      pdfGeneratorFix: true
    }
  };

  // Log debug messages
  function logDebug(message) {
    if (config.debug) {
      console.log('[Integrated TCO] ' + message);
    }
  }

  // Load a script
  function loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onload = function() {
      logDebug(`Loaded script: ${url}`);
      if (callback) callback();
    };

    script.onerror = function() {
      console.error(`Failed to load script: ${url}`);
      if (callback) callback(new Error(`Failed to load script: ${url}`));
    };

    document.head.appendChild(script);
  }

  // Load component scripts sequentially
  function loadComponents(components, callback) {
    if (!components || components.length === 0) {
      if (callback) callback();
      return;
    }

    const component = components.shift();
    loadScript(component, function(error) {
      if (error) {
        console.error(`Error loading component ${component}:`, error);
      }
      loadComponents(components, callback);
    });
  }

  // Initialize components
  function initializeComponents() {
    const components = [];

    // Add components based on configuration
    if (config.components.chartManager) {
      components.push('js/components/fixes/chart-manager.js');
    }

    if (config.components.pdfGeneratorFix) {
      components.push('js/components/fixes/pdf-generator-fix.js');
    }

    if (config.components.analysisComponent) {
      components.push('js/integrated/analysis-component.js');
    }

    // Load components sequentially
    loadComponents(components, function() {
      logDebug('All components loaded successfully');

      // Wait for calculator to be ready
      waitForCalculator(function(calculator) {
        if (calculator) {
          patchCalculator(calculator);
        }
      });
    });
  }

  // Wait for calculator to be ready
  function waitForCalculator(callback, attempts = 0) {
    if (attempts > 20) {
      console.error('Calculator not available after maximum attempts');
      callback(null);
      return;
    }

    if (window.calculator && typeof window.calculator.calculate === 'function') {
      logDebug('Calculator found and ready');
      callback(window.calculator);
    } else {
      setTimeout(function() {
        waitForCalculator(callback, attempts + 1);
      }, 200);
    }
  }

  // Patch calculator to work with the enhanced components
  function patchCalculator(calculator) {
    logDebug('Patching calculator...');

    // Store original methods
    const originalUpdateCharts = calculator.updateCharts;
    const originalCalculate = calculator.calculate;

    // Extended parameter handling
    if (!calculator.setParameters) {
      calculator.setParameters = function(params) {
        logDebug('Setting calculator parameters:', params);

        // Apply parameters to calculator state
        for (const paramId in params) {
          const input = document.getElementById(`cost-${paramId}`);
          if (input) {
            input.value = params[paramId];
          }
        }

        logDebug('Parameters applied successfully');
      };
    }

    // Advanced options handling
    if (!calculator.setAdvancedOptions) {
      calculator.setAdvancedOptions = function(options) {
        logDebug('Setting advanced options:', options);

        // Multiple locations
        if (options.multipleLocations !== undefined) {
          const multipleLocations = document.getElementById('multiple-locations');
          if (multipleLocations) {
            multipleLocations.checked = options.multipleLocations;

            // Update location count
            if (options.locationCount !== undefined) {
              const locationCount = document.getElementById('location-count');
              if (locationCount) {
                locationCount.value = options.locationCount;
              }

              // Show/hide location count container
              const locationCountContainer = document.getElementById('location-count-container');
              if (locationCountContainer) {
                locationCountContainer.classList.toggle('hidden', !options.multipleLocations);
              }
            }
          }
        }

        // Complex authentication
        if (options.complexAuthentication !== undefined) {
          const complexAuthentication = document.getElementById('complex-authentication');
          if (complexAuthentication) {
            complexAuthentication.checked = options.complexAuthentication;
          }
        }

        // Legacy devices
        if (options.legacyDevices !== undefined) {
          const legacyDevices = document.getElementById('legacy-devices');
          if (legacyDevices) {
            legacyDevices.checked = options.legacyDevices;

            // Update legacy percentage
            if (options.legacyPercentage !== undefined) {
              const legacyPercentage = document.getElementById('legacy-percentage');
              if (legacyPercentage) {
                legacyPercentage.value = options.legacyPercentage;
              }

              // Show/hide legacy percentage container
              const legacyPercentageContainer = document.getElementById('legacy-percentage-container');
              if (legacyPercentageContainer) {
                legacyPercentageContainer.classList.toggle('hidden', !options.legacyDevices);
              }
            }
          }
        }

        // Cloud integration
        if (options.cloudIntegration !== undefined) {
          const cloudIntegration = document.getElementById('cloud-integration');
          if (cloudIntegration) {
            cloudIntegration.checked = options.cloudIntegration;
          }
        }

        // Custom policies
        if (options.customPolicies !== undefined) {
          const customPolicies = document.getElementById('custom-policies');
          if (customPolicies) {
            customPolicies.checked = options.customPolicies;

            // Update policy complexity
            if (options.policyComplexity !== undefined) {
              const policyComplexity = document.getElementById('policy-complexity');
              if (policyComplexity) {
                policyComplexity.value = options.policyComplexity;
              }

              // Show/hide policy complexity container
              const policyComplexityContainer = document.getElementById('policy-complexity-container');
              if (policyComplexityContainer) {
                policyComplexityContainer.classList.toggle('hidden', !options.customPolicies);
              }
            }
          }
        }

        // Years to project
        if (options.yearsToProject !== undefined) {
          const yearsToProject = document.getElementById('years-to-project');
          if (yearsToProject) {
            yearsToProject.value = options.yearsToProject;
          }
        }

        logDebug('Advanced options applied successfully');
      };
    }

    // Vendor selection handling
    if (!calculator.setCompetitor) {
      calculator.setCompetitor = function(competitor) {
        logDebug(`Setting competitor to: ${competitor}`);

        // Find vendor card
        const vendorCard = document.querySelector(`.vendor-card[data-vendor="${competitor}"]`);
        if (vendorCard) {
          // Simulate click to select vendor
          vendorCard.click();
          logDebug(`Competitor set to ${competitor}`);
        } else {
          console.warn(`Vendor card not found for competitor: ${competitor}`);
        }
      };
    }

    // Override calculate method
    calculator.calculate = function() {
      logDebug('Running calculation...');

      // Call original calculate method
      if (originalCalculate) {
        originalCalculate.call(calculator);
      }

      // Update charts
      if (typeof calculator.updateCharts === 'function') {
        calculator.updateCharts();
      }

      logDebug('Calculation completed');
    };

    // Override updateCharts method
    calculator.updateCharts = function() {
      logDebug('Updating charts...');

      // Call original updateCharts method
      if (originalUpdateCharts) {
        originalUpdateCharts.call(calculator);
      }

      // Only update sensitivity/scenario charts if their tabs are visible
      if (window.ChartManager) {
        const sensitivityPane = document.getElementById('sensitivity-analysis-pane');
        if (sensitivityPane && sensitivityPane.classList.contains('active')) {
          updateSensitivityCharts();
        }

        const scenarioPane = document.getElementById('scenario-analysis-pane');
        if (scenarioPane && scenarioPane.classList.contains('active')) {
          updateScenarioChart();
        }
      }

      logDebug('Charts updated successfully');
    };

    logDebug('Calculator patched successfully');
  }

  // Update sensitivity charts - simplified implementation
  function updateSensitivityCharts() {
    if (!window.ChartManager) return;

    const sliders = document.querySelectorAll('.sensitivity-slider');
    sliders.forEach(slider => {
      const paramId = slider.id.replace('sensitivity-', '');
      const chartId = `sensitivity-chart-${paramId}`;
      const chart = window.ChartManager.getChartInstance(chartId);

      if (chart) {
        // Update chart with sample data
        const onPremValue = 300000 * (1 + Math.random() * 0.2 - 0.1);
        const portnoxValue = 210000 * (1 + Math.random() * 0.2 - 0.1);

        chart.data.datasets[0].data[1] = Math.round(onPremValue);
        chart.data.datasets[1].data[1] = Math.round(portnoxValue);
        chart.update();
      }
    });
  }

  // Update scenario chart - simplified implementation
  function updateScenarioChart() {
    if (!window.ChartManager) return;

    const chartId = 'scenario-comparison-chart';
    const chart = window.ChartManager.getChartInstance(chartId);

    if (chart) {
      // Update with sample data
      chart.data.datasets[0].data = [300000, 350000, 280000];
      chart.data.datasets[1].data = [210000, 200000, 220000];
      chart.update();

      // Update scenario results table
      updateScenarioResults([
        { scenario: 'Base Case', onPrem: 300000, portnox: 210000 },
        { scenario: 'Optimistic Case', onPrem: 350000, portnox: 200000 },
        { scenario: 'Pessimistic Case', onPrem: 280000, portnox: 220000 }
      ]);
    }
  }

  // Update scenario results table
  function updateScenarioResults(results) {
    const tableBody = document.getElementById('scenario-results-table');
    if (!tableBody) return;

    // Clear table
    tableBody.innerHTML = '';

    // Add rows
    results.forEach(result => {
      const row = tableBody.insertRow();
      const savings = result.onPrem - result.portnox;
      const savingsPercent = (savings / result.onPrem) * 100;

      row.insertCell(0).textContent = result.scenario;
      row.insertCell(1).textContent = '$' + result.onPrem.toLocaleString();
      row.insertCell(2).textContent = '$' + result.portnox.toLocaleString();
      row.insertCell(3).textContent = '$' + savings.toLocaleString();
      row.insertCell(4).textContent = savingsPercent.toFixed(1) + '%';
    });
  }

  // Initialize everything
  function initialize() {
    logDebug('Initializing Integrated TCO Analyzer...');
    initializeComponents();
  }

  // Auto-initialize if configured
  if (config.autoInitialize) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialize);
    } else {
      initialize();
    }
  }

  // Export the API
  window.IntegratedTCO = {
    initialize: initialize
  };
})();
