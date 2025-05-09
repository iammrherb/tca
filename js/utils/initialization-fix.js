/**
 * Initialization Fix
 * Coordinates the initialization of all components to avoid conflicts
 */
(function() {
  console.log('NAC Architecture Designer Pro - Initialization Fix');
  
  // Components to initialize
  const components = [
    { name: 'ChartRegistryFix', loaded: false },
    { name: 'ModernCharts', loaded: false },
    { name: 'ModernWizardFixed', loaded: false },
    { name: 'DarkModeToggle', loaded: false },
    { name: 'MainApplication', loaded: false }
  ];
  
  // Load script with proper error handling
  function loadScript(url, componentName) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => {
        console.log(`Loaded ${componentName}`);
        resolve();
      };
      script.onerror = () => {
        console.error(`Failed to load ${componentName}`);
        reject(new Error(`Failed to load ${componentName}`));
      };
      document.head.appendChild(script);
    });
  }
  
  // Load component scripts in the correct order
  async function loadComponents() {
    try {
      // First load the chart registry fix
      await loadScript('js/fixes/chart-registry-fix.js', 'Chart Registry Fix');
      components[0].loaded = true;
      
      // Load other components in parallel
      await Promise.all([
        loadScript('js/charts/fixed/modern-charts-fixed.js', 'Modern Charts').then(() => {
          components[1].loaded = true;
        }),
        loadScript('js/components/enhanced/modern-wizard-fixed.js', 'Modern Wizard').then(() => {
          components[2].loaded = true;
        }),
        loadScript('js/components/dark-mode-toggle-fixed.js', 'Dark Mode Toggle').then(() => {
          components[3].loaded = true;
        })
      ]);
      
      // Finally, load the main application
      await loadScript('js/main-fixed.js', 'Main Application');
      components[4].loaded = true;
      
      console.log('All components loaded successfully');
    } catch (error) {
      console.error('Error loading components:', error);
    }
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', loadComponents);
})();
