/**
 * Enhanced TCO Integration
 * Main integration script for enhanced TCO analyzer features
 */
(function() {
  console.log('Initializing Enhanced TCO Integration...');
  
  // Configuration
  const config = {
    debug: true,
    autoInitialize: true,
    components: {
      costWizard: true,
      sensitivityAnalyzer: true,
      enhancedCharts: true,
      tabOrganization: true,
      complianceFix: true,
      scriptLoader: true,
      costConfiguration: true,
      vendorComparison: true
    }
  };
  
  // Log debug messages
  function logDebug(message) {
    if (config.debug) {
      console.log('[Enhanced TCO] ' + message);
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
    };
    
    document.head.appendChild(script);
  }
  
  // Load a stylesheet
  function loadStylesheet(url, callback) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    
    link.onload = function() {
      logDebug(`Loaded stylesheet: ${url}`);
      if (callback) callback();
    };
    
    link.onerror = function() {
      console.error(`Failed to load stylesheet: ${url}`);
    };
    
    document.head.appendChild(link);
  }
  
  // Apply fixes
  function applyFixes() {
    // Load the script loader first
    if (config.components.scriptLoader) {
      loadScript('js/fixes/ultimate-script-loader.js', function() {
        // Load other fixes using the script loader
        if (window.ScriptLoader) {
          const scripts = [];
          
          if (config.components.complianceFix) {
            scripts.push('js/fixes/ultimate-compliance-fix.js');
          }
          
          if (config.components.costConfiguration) {
            scripts.push('js/fixes/ultimate-cost-configuration.js');
          }
          
          if (config.components.vendorComparison) {
            scripts.push('js/fixes/vendor-comparison.js');
          }
          
          if (config.components.tabOrganization) {
            scripts.push('js/fixes/tab-organization.js');
          }
          
          // Load the master fix last
          scripts.push('js/fixes/ultimate-master-fix.js');
          
          window.ScriptLoader.loadScriptsSequentially(scripts, function() {
            logDebug('All fixes applied successfully');
          });
        } else {
          console.error('Script loader not available');
        }
      });
    }
    
    // Load enhanced styles
    loadStylesheet('css/enhanced/enhanced-styles.css');
  }
  
  // Initialize enhanced components
  function initializeComponents() {
    // Load cost analysis wizard
    if (config.components.costWizard) {
      loadScript('js/wizards/cost-analysis-wizard.js', function() {
        logDebug('Cost Analysis Wizard initialized');
      });
    }
    
    // Load enhanced sensitivity analyzer
    if (config.components.sensitivityAnalyzer) {
      loadScript('js/components/sensitivity/enhanced-analyzer.js', function() {
        logDebug('Enhanced Sensitivity Analyzer initialized');
      });
    }
    
    // Load enhanced charts
    if (config.components.enhancedCharts) {
      loadScript('js/charts/enhanced/tco-charts.js', function() {
        logDebug('Enhanced TCO Charts initialized');
        
        // Replace existing charts with enhanced versions
        if (window.EnhancedTCOCharts && window.calculator) {
          // Wait for calculator to initialize
          setTimeout(function() {
            replaceCharts();
          }, 1000);
        }
      });
    }
  }
  
  // Replace existing charts with enhanced versions
  function replaceCharts() {
    if (!window.EnhancedTCOCharts) return;
    
    // Get calculator data
    const data = getCalculatorData();
    
    // Replace charts
    window.EnhancedTCOCharts.createTCOComparisonChart('tco-comparison-chart', data.tcoComparison);
    window.EnhancedTCOCharts.createCumulativeCostChart('cumulative-cost-chart', data.cumulativeCost);
    window.EnhancedTCOCharts.createROITimelineChart('roi-timeline-chart', data.roiTimeline);
    window.EnhancedTCOCharts.createCostBreakdownChart('current-breakdown-chart', data.currentBreakdown, 'on-prem');
    window.EnhancedTCOCharts.createCostBreakdownChart('alternative-breakdown-chart', data.alternativeBreakdown, 'portnox');
    window.EnhancedTCOCharts.createImplementationComparisonChart('implementation-comparison-chart', data.implementationComparison);
    window.EnhancedTCOCharts.createFeatureComparisonChart('feature-comparison-chart', data.featureComparison);
    window.EnhancedTCOCharts.createCostFactorsHeatmap('cost-factors-heatmap', data.costFactors);
    window.EnhancedTCOCharts.createResourceUtilizationChart('resource-utilization-chart', data.resourceUtilization);
    
    logDebug('Enhanced charts applied successfully');
  }
  
  // Get data from calculator for charts
  function getCalculatorData() {
    // Default data
    const data = {
      tcoComparison: null,
      cumulativeCost: null,
      roiTimeline: null,
      currentBreakdown: null,
      alternativeBreakdown: null,
      implementationComparison: null,
      featureComparison: null,
      costFactors: null,
      resourceUtilization: null
    };
    
    // Try to get actual data from calculator
    if (window.calculator && window.calculator.getData) {
      const calculatorData = window.calculator.getData();
      
      if (calculatorData) {
        // Extract data for each chart
        // The actual implementation depends on the structure of calculator data
        // For now, we'll use null to indicate using default data
      }
    }
    
    return data;
  }
  
  // Patch calculator to use enhanced charts
  function patchCalculator() {
    if (!window.calculator) return;
    
    // Store original updateCharts method
    const originalUpdateCharts = window.calculator.updateCharts;
    
    // Replace with enhanced version
    window.calculator.updateCharts = function() {
      // Call original method
      if (originalUpdateCharts) {
        originalUpdateCharts.call(window.calculator);
      }
      
      // Replace with enhanced charts
      if (window.EnhancedTCOCharts) {
        replaceCharts();
      }
    };
    
    logDebug('Calculator patched to use enhanced charts');
  }
  
  // Initialize everything
  function initialize() {
    logDebug('Initializing enhanced TCO components...');
    
    // Apply fixes
    applyFixes();
    
    // Initialize components
    initializeComponents();
    
    // Patch calculator
    setTimeout(function() {
      patchCalculator();
    }, 1500);
    
    logDebug('Enhanced TCO Integration initialized');
  }
  
  // Auto-initialize if configured
  if (config.autoInitialize) {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialize);
    } else {
      initialize();
    }
  }
  
  // Export the API
  window.EnhancedTCO = {
    initialize: initialize,
    applyFixes: applyFixes,
    initializeComponents: initializeComponents,
    replaceCharts: replaceCharts
  };
})();
